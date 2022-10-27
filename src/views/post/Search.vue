<template>
  <v-card
    color="basil"
    flat
    class="mt-2"
  >
    <v-card-title class="pa-3" style="border-bottom: 1px solid #e8e8e8;">
      检索到 <code class="red--text">{{ articleList.length }}</code>
      条关于 
      <code class="blue--text">{{ query.keyword }}</code> 的记录
    </v-card-title>
    <v-list subheader>
    <template v-for="(file,index) in articleList">
      <v-list-item link :key="index">
        <v-list-item-avatar>
          <v-img :src="`${baseURL}${file.avatar}`"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="text-left" @click="handleTo(file)">
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
        <v-list-item-action>
          <v-btn icon link>
            <v-icon color="#000">fa fa-star-o</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    </v-list>
    <v-pagination
      v-model="page.current"
      :length="page.pages"
      :total-visible="7"
    />
  </v-card>
</template>

<script>
import moment from 'moment'
import { searchByKeyword } from '@/api/search'
export default {
  name: 'Search',
  data() {
    return {
      articleList: [],
      page: {
        current: 1,
        size: 5,
        total: 0,
        pages: 1
      },
      baseURL: '',
      isCreated: false,
      query: {
        keyword: this.$route.params.key
      }
    }
  },
  watch: {
    'page.current': {
      handler: function(val, oldVal) {
        this.isCreated && this.init()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    seach(value) {
      if (value === null || value === '' || value === undefined) {
        this.$message.info('请输入关键字搜索！')
        return false
      }
      this.$router.push({ path: '/search/' + value })
    },
    moment,
    init() {
      const params = {
        pageNum: this.page.current,
        pageSize: this.page.size
      }
      const data = Object.assign({}, params, this.query)
      searchByKeyword(data).then((response) => {
        if (response.code === 200) {
          const { data } = response
          this.page.current = data.current
          this.page.total = data.total
          this.page.size = data.size
          this.page.pages = data.pages
          this.articleList = data.records
        }
      })
    },
    handleTo(file) {
      this.$router.push({ name: 'post-detail', params: { id: file.id }})
    }
  },
  mounted() {
    this.$bus.$on('seach', (value) => {
      this.seach(value)
    })
  },
  created() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    this.init()
    this.isCreated = true
  },
  beforeDestroy() {
    this.$bus.$off('seach')
  }
}
</script>
<style>
.basil .v-card__title{
  line-height: 1.5;
}
</style>
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
