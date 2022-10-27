<template>
  <v-main id="scrolling-techniques-7">
    <v-container style="margin-bottom:50px;">
      <v-row justify="center">
        <v-col
          cols="12"
          sm="18"
          md="10"
          lg='12'
          xl='8'
        >
        <!-- <v-main> -->
        <keep-alive :include="whiteList">
          <router-view :key="$route.fullPath" />
        </keep-alive>
        <!-- </v-main> -->
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import router from '@/router'
export default {
  name: 'DashboardCoreView',
  data() {
    return {
      whiteList: []
    }
  },
  methods: {
    getWhiteList(list) { // 根据路由配置 获取需要缓存的组件
      list.forEach(item => {
        if (item.meta && item.meta.keepAlive) {
          this.whiteList.push(item.meta.component || item.name)
        }
        if (item.children && item.children.length) {
          this.getWhiteList(item.children)
        }
      })
    }
  },
  mounted() {
    this.getWhiteList(router.options.routes)
  }
}
</script>
