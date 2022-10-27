<template>
    <v-row class="text-center">
      <v-col sm="12" md="9" >
        <v-card
          color="basil"
          flat
          class="mt-0"
        >
          <v-card-title class="pa-3" style="border-bottom: 1px solid #e8e8e8;">
            <v-icon class="mr-2">fa fa-book</v-icon>直通杨老师
          </v-card-title>
          <PostList :pageSize="pageSize" :query="query" />
        </v-card>
      </v-col>
      <v-col sm="12" md="3" class="hidden-sm-and-down">
        <v-card class="ma-0" :elevation="2">
          <v-card-title style="border-bottom: 1px solid #e8e8e8;">💐 提问</v-card-title>
          <v-card-actions v-if="token != null && token !== ''" style="padding:24px;" class="flex justify-center">
            <v-btn :to="{path:'/post/create/answer',query:{title:'直通杨老师'}}" color="#167df0" outlined>✍ 提问 </v-btn>
          </v-card-actions>
          <v-card-actions v-else class="py-24 text-center" style="padding:24px;">
            <v-spacer></v-spacer>
            <v-btn color="#7957d5" :to="{path:'/register'}" outlined>注册</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#f14668" :to="{path:'/login'}" outlined>登录</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
</template>
<script>
import PostList from '@/views/post/modules/PostList'
import { mapGetters } from 'vuex'
export default {
  name: 'Answer',
  components: {
    PostList
  },
  props: {
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      activeName: 'latest',
      articleList: [],
      baseURL: '',
      query: {
        type: 'answer'
      }
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.baseURL = window._CONFIG['domianURL']
  },
  methods: {
    seach(value) {
      if (value === null || value === '' || value === undefined) {
        this.$message.info('请输入关键字搜索！')
        return false
      }
      this.$router.push({ path: '/search/' + value })
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
