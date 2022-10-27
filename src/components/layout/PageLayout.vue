<template>
  <div>
    <v-app-bar
      class="align-center page-layout"
      dense
      app
      color="#fff"
      height="60"
      shrink-on-scroll
    >
      <v-btn
        fab
        outlined
        color="primary"
        class="mr-3"
        elevation="1"
        @click="$router.back()"
        x-small
      >
        <v-icon>fa fa-arrow-left</v-icon>
      </v-btn>
      <v-btn text @click="() => this.$router.push('/dashboard')" class="hidden-sm-and-down text-h4 font-weight-bold" color="#167df0">{{$route.meta.title}}</v-btn>
      <v-spacer />
      <v-btn
        fab
        outlined
        color="primary"
        elevation="1"
        x-small
        @click="() => this.$router.push('/dashboard')"
      >
        <v-icon color="primary">fa fa-home</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main id="scrolling-techniques-7">
      <v-container style="margin-bottom:50px;">
        <v-row justify="center">
          <v-col
            cols="12"
            sm="8"
          >
          <keep-alive :include="whiteList">
            <router-view :key="$route.fullPath" />
          </keep-alive>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'PageLayout',
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
<style>
.page-layout .v-toolbar__content {
  align-items: center !important;
}
.v-toolbar--prominent{
  z-index: 10 !important;
}
</style>
