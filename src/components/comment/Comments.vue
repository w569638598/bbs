<template>
  <v-card class="mt-0">
    <v-card-text>
      <div v-if="!token" class="text-center">
        <!-- <h4>登录后才能回答</h4> -->
        <v-btn type="is-success" v-if="hasPower" outlined @click="handleLogin">登录后回答</v-btn>
      </div>
      <div v-if="comments.length" class="comment-item">
        <v-list
          subheader
        >
          <lv-comments-item
            class="comments-item"
            v-for="comment in comments"
            :key="`comment-${comment.id}`"
            :comment="comment"
            :slug="slug"
            :hasCommentPower="hasBmsComment"
            @loadComments="fetchComments"
            @reply="handleReply"
          >
          </lv-comments-item>
        </v-list>
        <v-pagination
          v-model="page.current"
          :length="page.pages"
          :total-visible="7"
        />
      </div>
      <!-- <AEmpty description="暂无回答" v-else/> -->
      <lv-comments-form :slug="slug" v-if="token && hasBmsComment" @loadComments="fetchComments"/>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCommentsList } from '@/api/comment'
import LvCommentsForm from './CommentsForm'
import LvCommentsItem from './CommentsItem'
import { getAction } from '@/api/manage'
export default {
  name: 'Comments',
  components: {
    LvCommentsForm,
    LvCommentsItem
  },
  data() {
    return {
      comments: [],
      commentId: '',
      hasPower: false,
      page: {
        current: 1,
        size: 5,
        total: 0,
        pages: 1
      },
      reply: 'reply',
      isCreated: false
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    },
    user: {
      type: Object,
      default: () => {}
    },
    topic: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    isCreater() {
      return this.userInfo().username === this.user.username
    },
    hasBmsComment() { // 直通杨老师 创建人和设置特定用户可以回复
      return this.isCreater || this.hasPower
    }
  },
  watch: {
    'topic': {
      handler: function(newVal, oldVal) {
        if (newVal.type !== 'answer') {
          this.hasPower = true
        } else if (this.token) {
          this.getCheckUser()
        }
      },
      deep: true
    },
    'page.current': {
      handler: function(val, oldVal) {
        this.isCreated && this.fetchComments()
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    await this.fetchComments()
    this.isCreated = true
    if (this.topic.type !== 'answer') {
      this.hasPower = true
    } else if (this.token) {
      this.getCheckUser()
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    async fetchComments() { // 初始化
      getCommentsList({
        topicid: this.slug,
        username: this.userInfo().username,
        pageNo: this.page.current,
        size: this.page.size
      }).then(response => {
        if (response.success) {
          // const { data } = response
          this.comments = response.result.records
          // this.page.current = response.result.current
          this.page.current = response.result.pages < response.result.current ? 1 : response.result.current
          this.page.total = response.result.total
          this.page.size = response.result.size
          this.page.pages = response.result.pages
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath }})
    },
    handleReply(id, type) {
      console.log(type)
      this.reply = type
      this.commentId = this.commentId === id ? '' : id
    },
    getCheckUser() {
      getAction('/community/bmsAccessYangUser/checkUser').then(res => {
        if (res.success) {
          this.hasPower = !!Number(res.result)
        }
      })
    }
  }
}
</script>
<style>
.comment-item .ant-comment-inner{
  padding: 8px 0;
}
</style>
<style scoped>
.comments-item{
  margin-bottom: 5px;
}
</style>
