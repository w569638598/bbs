<template>
  <v-row>
    <v-col cols="12" sm="12" md="9">
      <!--主题-->
      <v-card class="mt-0">
        <v-card-title class="text-center d-block text-h3">
          <p>{{topic.title}}</p>
        </v-card-title>
        <v-card-subtitle class="text-center text-caption">
          <span>{{ moment(topic.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
          <v-divider vertical inset />
          <span>发布者：{{ topicUser.realname }}</span>
          <v-divider vertical inset />
          <span>查看：{{ topic.viewNum }}</span>
        </v-card-subtitle>
        <v-card-text>
          <!--Markdown-->
          <div id="preview" />
        </v-card-text>
        <!--标签-->
        <v-card-actions class="d-flex justify-space-between detail-bottom">
          <div>
            <div v-if="token && userInfo().id === topicUser.id">
              <v-chip class="mr-2" :to="{name:'topic-edit',params: {id:topic.id}}" small>编辑</v-chip>
              <a class="level-item">
                <v-chip small @click="() => handleDelete(topic.id)">删除</v-chip>
              </a>
            </div>
          </div>
          <div key="comment-basic-like" class="comment-basic-like mr-4" @click="like" >
            <v-icon v-if="action === 'liked'">fa fa-thumbs-up</v-icon>
            <v-icon v-else>fa fa-thumbs-o-up</v-icon>
            <span style="padding-left: '8px';cursor: 'auto'">
              {{ topic.thumbUpNumber }}
            </span>
          </div>
        </v-card-actions>
      </v-card>
      <Comments v-if="flag" :user="topicUser" :topic="topic" :slug="topic.id" />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <!-- 作者 -->
      <Author  class="d-none d-sm-block" v-if="flag" :user="topicUser"/>
    </v-col>
  </v-row>
</template>

<script>
import { deleteTopic, getTopic } from '@/api/post'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Author from '@/views/post/Author'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import Comments from '@/components/comment/Comments'
import { postThumbsUp } from '@/api/post'
export default {
  name: 'Detail',
  components: {
    Author,
    Comments
  },
  computed: {
    ...mapGetters([
      'token', 'user'
    ])
  },
  data() {
    return {
      flag: false,
      topic: {
        content: '',
        id: this.$route.params.id
      },
      tags: [],
      topicUser: {},
      action: null
    }
  },
  mounted() {
    this.fetchTopic()
  },
  methods: {
    moment,
    ...mapGetters(['userInfo']),
    renderMarkdown(md) {
      Vditor.preview(document.getElementById('preview'), md, {
        hljs: { style: 'github' }, theme: { path: '/dist/css/content-theme' }, cdn: ''
      })
    },
    // 初始化
    async fetchTopic() {
      getTopic({
        id: this.$route.params.id,
        username: this.userInfo().username ? this.userInfo().username : ''
      }).then(response => {
        if (response.code === 200) {
          const { data } = response
          document.title = data.topic.title
          this.topic = data.topic
          this.tags = data.tags
          this.topicUser = data.user || {}
          this.topicUser.articleNum = data.articleNum
          this.topicUser.fansNum = data.fansNum
          // this.comments = data.comments
          this.renderMarkdown(this.topic.content)
          this.flag = true
        } else {
          this.$message.error('内容已被删除！')
        }
      })
    },
    handleDelete(id) {
      deleteTopic(id).then(value => {
        const { code, message } = value
        if (code === 200) {
          this.$message.success('删除成功')
          this.$router.push({ path: '/' })
        }
      })
    },
    like() {
      postThumbsUp({ id: this.topic.id }).then(res => {
        if (res.code === 200) {
          this.topic.thumbUpNumber = res.data.thumbUpNumber
        }
      })
    }
  }
}
</script>

<style>

</style>
