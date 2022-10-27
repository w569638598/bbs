<template>
  <v-card
    color="basil"
    flat
    class="mt-2"
  >
    <v-card-title class="pa-3" style="border-bottom: 1px solid #e8e8e8;">
      🔍 检索到 <code class="red--text">{{ topics.length }}</code> 篇有关
     <code class="blue--text">{{ this.$route.params.name }}</code>
      的话题
    </v-card-title>
    <v-list subheader>
      <template v-for="(item,index) in topics">
        <v-list-item link :key="index">
          <v-list-item-avatar>
            <v-img :src="`${baseURL}${item.avatar}`"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="text-left" @click="handleTo(item)">
            <v-list-item-title v-text="item.title" ></v-list-item-title>
            <v-list-item-subtitle>
              <div class="leva-left">
                <router-link class="leva-item" :to="{ path: `/member/${item.username}/home` }">
                  {{ item.createByUser && item.createByUser.realname }}
                </router-link>
                <span class="mr-1">
                  发布于：{{moment(item.createTime).format('YYYY/MM/DD')}}
                </span>
                <span >浏览:{{ item.viewNum }}</span>
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
  </v-card>
</template>

<script>
import { getTopicsByTag } from '@/api/tag'
import moment from 'moment'
export default {
  name: 'Tag',
  data() {
    return {
      topics: [],
      tags: [],
      paramMap: {
        name: this.$route.params.name,
        current: 1,
        size: 5,
        total: 0,
        pages: 1
      },
      baseURL: ''
    }
  },
  created() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    this.fetchList()
  },
  methods: {
    moment,
    fetchList: function() {
      getTopicsByTag(this.paramMap).then(response => {
        this.topics = response.data.topics.records
        this.tags = response.data.hotTags.records
      })
    }
  }
}
</script>
<style>
.basil .v-card__title{
  line-height: 1.5;
}
</style>
<style scoped>
#tag {
  min-height: 500px;
}
</style>
