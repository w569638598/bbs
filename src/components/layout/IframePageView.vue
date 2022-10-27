<template>
  <iframe :id="id" :src="url" frameborder="0" width="100%" height="800px" scrolling="auto"></iframe>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'IframePageContent',
  data() {
    return {
      url: '',
      id: ''
    }
  },
  created() {
    this.goUrl()
  },
  updated() {
    this.goUrl()
  },
  watch: {
    $route(to, from) {
      this.goUrl()
    }
  },
  methods: {
    goUrl() {
      const url = this.$route.meta.url
      const id = this.$route.path
      this.id = id
      if (url !== null && url !== undefined) {
        // -----------------------------------------------------------------------------------------
        // url支持通过 ${token}方式传递当前登录TOKEN
        const tokenStr = '${token}'
        if (url.indexOf(tokenStr) !== -1) {
          const token = Vue.ls.get(ACCESS_TOKEN)
          this.url = url.replace(tokenStr, token)
        } else {
          this.url = url
        }
        // -----------------------------------------------------------------------------------------

        /* update_begin author:wuxianquan date:20190908 for:判断打开方式，新窗口打开时this.$route.meta.internalOrExternal==true */
        if (this.$route.meta.internalOrExternal !== undefined && this.$route.meta.internalOrExternal === true) {
          window.open(this.url)
        }
        /* update_end author:wuxianquan date:20190908 for:判断打开方式，新窗口打开时this.$route.meta.internalOrExternal==true */
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (to.meta.internalOrExternal !== undefined && to.meta.internalOrExternal === true) {
      next(vm => {
        vm.$router.push(from.fullPath)
      })
    } else {
      next()
    }
  }
}
</script>

<style>
</style>
