<template>
  <v-speed-dial
    fixed
    v-model="fab"
    :bottom="true"
    :right="true"
    :open-on-hover="false"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        small
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>fa fa-plus</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-if="$route.path === '/dashboard' || $route.path ===  '/BBS'"
      fab
      dark
      small
      color="green"
      :to="{path:'/post/create/questions'}"
    >
      提问
    </v-btn>
    <v-btn
      v-if="$route.path === '/dashboard' || $route.path ===  '/BBS'"
      fab
      dark
      small
      color="indigo"
      :to="{path:'/post/create/share',query:{title:'想法'}}"
    >
      想法
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="green"
      :to="{path:'/post/create/answer',query:{title:'直通杨老师'}}"
      v-if="$route.path === '/Answer'"
    >
      提问
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="green"
      :to="{path:'/post/create/notes',query:{title:'咨询札记'}}"
      v-if="$route.path === '/Notes'"
    >
      发表
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'SpeedDial',
  data() {
    return {
      fab: false
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang='less' scoped>
</style>
