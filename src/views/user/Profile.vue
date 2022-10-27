<template>
  <v-row class="text-center mt-0">
    <v-col sm="12" md="9">
      <!--用户发布的话题-->
      <v-card class="mt-0">
        <v-card-title class="pa-4" style="border-bottom: 1px solid #e8e8e8;">
          话题
        </v-card-title>
        <div v-if="topics.length===0">
          暂无话题
        </div>
        <div v-else class="topicUser-info">
          <v-list subheader>
            <template v-for="(file, index) in topics" class="media">
              <v-list-item link :key="index" >
                <v-list-item-content class="text-left" @click="handleDetail(file)">
                  <v-list-item-title v-text="file.title" ></v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="leva-left">
                      <router-link class="leva-item" :to="{ path: `/member/${file.username}/home` }">
                        {{ file.createByUser && file.createByUser.realname }}
                      </router-link>
                      <span class="mr-1">
                        发布于：{{moment(file.createTime).format('YYYY/MM/DD')}}
                      </span>
                      <span
                        v-for="(tag, index) in file.tags"
                        :key="index"
                        class="d-none d-sm-inline mr-1"
                      >
                        <router-link :to="{ name: 'tag', params: { name: tag.name } }">
                          {{ "#" + tag.name }}
                        </router-link>
                      </span>
                      <span >浏览:{{ file.viewNum }}</span>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-card-actions>
                  <v-btn x-small outlined link color="primary" v-if="token && userInfo().id === topicUser.id" @click=" handleEdit(file)">编辑</v-btn>
                  <v-btn x-small outlined link color="error" v-if="token && userInfo().id === topicUser.id"  @click="handleDelete(file.id)">删除</v-btn>
                </v-card-actions>
              </v-list-item>
            </template>
            <v-pagination
              v-model="page.current"
              :length="page.pages"
              :total-visible="7"
            />
          </v-list>
        </div>
      </v-card>
    </v-col>
    <v-col sm="12" md="3">
      <v-card class="mt-0">
        <v-card-title class="flex-column" style="border-bottom: 1px solid #e8e8e8;">
          <v-avatar size="56">
            <v-img :size="64" class="avatar" :src="`${baseURL}/sys/common/static/${topicUser.avatar}`" />
          </v-avatar>
          <p class="mt-3">{{ topicUser.alias || topicUser.username }}</p>
        </v-card-title>
        <v-card-actions>
          <div class="text-left">
            <p class="content">积分：<code>{{ topicUser.score }}</code></p>
            <p class="content">入驻：{{ moment(topicUser.createTime).format("YYYY/MM/DD HH:MM:ss") }}</p>
            <p class="content">简介：{{ topicUser.bio }}</p>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
            确定删除吗?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" small text @click="handleDel">
            确认
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" small text @click="dialog = false">
            取消
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { getInfoByName } from '@/api/user'
import { mapGetters } from 'vuex'
import { deleteTopic } from '@/api/post'
import moment from 'moment'
export default {
  name: 'Profile',
  data() {
    return {
      topicUser: {},
      topics: {},
      page: {
        current: 1,
        size: 10,
        pages: 0
      },
      baseURL: '',
      dialog: false,
      delId: ''
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  watch: {
    'page.current': {
      handler: function(val, oldVal) {
        this.fetchUserById()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.baseURL = window._CONFIG['domianURL']
  },
  methods: {
    moment,
    ...mapGetters(['userInfo']),
    fetchUserById() {
      getInfoByName(this.$route.params.username, this.page.current, this.page.size).then((res) => {
        const { data } = res
        this.topicUser = data.user
        this.page.pages = data.topics.pages
        this.page.current = data.topics.pages < data.topics.current ? 1 : data.topics.current
        this.page.size = data.topics.size
        this.topics = data.topics.records
      })
    },
    handleDel() {
      deleteTopic(this.delId).then(value => {
        const { code, message } = value
        if (code === 200) {
          this.fetchUserById()
          this.dialog = false
        }
      })
    },
    handleDelete(id) {
      this.delId = id
      this.dialog = true
    },
    handleDetail(file) {
      this.$router.push({ name: 'post-detail', params: { id: file.id }})
    },
    handleEdit(file) {
      this.$router.push({ name: 'topic-edit', params: { id: file.id }})
    }
  }
}
</script>

<style scoped>

</style>
