<template>
  <v-card class="mt-0">
    <v-tabs
      align-with-title
      color="#167df0"
      show-arrows
      v-model="tab"
      @change="handleTab"
    >
      <v-tab key="latest">最新主题</v-tab>
      <v-tab key="hot">热门主题</v-tab>
      <v-tab key="questions">提问</v-tab>
      <v-tab key="share">想法</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="latest">
        <PostList :pageSize="pageSize" :query="query" />
      </v-tab-item>
      <v-tab-item key="hot">
        <PostList :pageSize="pageSize" :query="query" />
      </v-tab-item>
      <v-tab-item key="questions">
        <PostList :pageSize="pageSize" :query="query" />
      </v-tab-item>
      <v-tab-item key="share">
        <PostList :pageSize="pageSize" :query="query" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import PostList from './modules/PostList'
export default {
  name: 'TopicList',
  components: {
    PostList
  },
  props: {
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      articleList: [],
      baseURL: '',
      tab: 0,
      tabs: ['latest', 'hot', 'questions', 'share'],
      query: {},
      changeTab: 0
    }
  },
  created() {
    this.handleTab()
    this.baseURL = window._CONFIG['domianURL']
  },
  methods: {
    seach(value) {
      if (value === null || value === '' || value === undefined) {
        this.$message.info('请输入关键字搜索！')
        return false
      }
      this.$router.push({ path: '/search/' + value })
    },
    handleTab() {
      if (this.tab === 2 || this.tab === 3) {
        this.query.type = this.tabs[this.tab]
      } else {
        this.query.type = 'questions,share'
        this.query.tab = this.tabs[this.tab]
      }
      // this.changeTab++
      // this.query = {
      //   isNotAnswer: '1'
      // }
      // if (this.tab === 2 || this.tab === 3 || this.tab === 'answer') {
      //   this.query.type = this.tabs[this.tab]
      // } else {
      //   this.query.tab = this.tabs[this.tab]
      // }
    }
  },
  mounted() {
    this.$bus.$on('seach', (value) => {
      this.seach(value)
    })
  },
  beforeDestroy() {
    this.$bus.$off('seach')
  }
}
</script>

<style scoped>
figure{
  margin: 0px;
}
a{
  color: #1d1d1d;
  text-decoration: none;
}
a:hover {
  color: #f60;
  text-decoration: none !important;
}
.avatar{
  width: 100%;
  height: 100%;
}
</style>
