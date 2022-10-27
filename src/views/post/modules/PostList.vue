<template>
  <v-card
    color="basil"
    flat
    class="mt-2"
  >
    <v-list v-if="articleList.length>0" subheader>
      <template v-for="(file,index) in articleList">
        <v-list-item link :key="index" @click.stop="handleTo(file)">
          <v-list-item-avatar class="grey lighten-2">
            <v-img :src="`${baseURL}${file.avatar}`"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="text-left">
            <v-list-item-title v-text="file.title"></v-list-item-title>
            <v-list-item-subtitle>
              <div class="leva-left">
                <router-link class="leva-item" :to="{ path: `/member/home/${file.username}` }">
                  {{ file.createByUser && file.createByUser.realname }}
                </router-link>
                <span class="mr-1">
                  发布于：{{moment(file.createTime).format('YYYY/MM/DD')}}
                </span>
                <v-chip
                  class="mr-2 px-2"
                  v-for="(tag, index) in file.tags"
                  :key="index"
                  color="teal"
                  x-small
                  label
                  text-color="white"
                >
                  <router-link style="color:#fff" :to="{ name: 'tag', params: { name: tag.name }}" >
                    {{ "#" + tag.name }}
                  </router-link>
                </v-chip>
                <!-- <span
                  v-for="(tag, index) in file.tags"
                  :key="index"
                  class="d-none d-sm-inline mr-1 blue-grey lighten-5 pa-1"
                >
                  <router-link :to="{ name: 'tag', params: { name: tag.name }}" >
                    {{ "#" + tag.name }}
                  </router-link>
                </span> -->
                <span >浏览:{{ file.viewNum }}</span>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action @click.stop="favorites">
            <v-btn icon>
              <v-icon color="#000">fa fa-star-o</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <JEmpty v-else />
    <v-pagination
      v-model="page.current"
      :length="page.pages"
      :total-visible="7"
    />
  </v-card>
</template>
<script>
import moment from 'moment'
import { getList } from '@/api/post'
import JEmpty from '@/components/common/JEmpty'
export default {
  name: 'PostList',
  components: {
    JEmpty
  },
  props: {
    pageSize: {
      type: Number,
      default: 5
    },
    tab: {
      type: [String, Number],
      default: 'latest'
    },
    query: {
      type: Object,
      default: () => {}
    },
    changeTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      articleList: [],
      page: {
        current: 1,
        size: 5,
        total: 0,
        pages: 1,
        tab: ''
      },
      baseURL: '',
      isCreated: false
    }
  },
  watch: {
    'page.current': {
      handler: function(val, oldVal) {
        this.isCreated && this.init()
      },
      deep: true,
      immediate: true
    },
    changeTab() {
      // this.init()
    }
  },
  methods: {
    moment,
    favorites() {

    },
    init() {
      const params = {
        pageNo: this.page.current,
        size: this.page.size
      }
      const data = Object.assign({}, params, this.query)
      getList(data).then((response) => {
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
  created() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    this.page.size = this.pageSize
    this.init()
    this.isCreated = true
  }
}
</script>
<style  scoped>
.v-application a{
  text-decoration:none;
  color: #000;
}
</style>
