<template>
  <v-bottom-navigation
    fixed
    :input-value="true"
    color="primary"
    class="align-center"
  >
    <v-btn to="/dashboard">
      <span>首页</span>
      <v-icon>fa fa-home</v-icon>
    </v-btn>
    <v-btn to="/BBS">
      <span>学习论坛</span>
      <v-icon>fa fa-user-o</v-icon>
    </v-btn>
    <v-btn to="/onlineLearn/OnlineLearn">
      <span>在线学习</span>
      <v-icon>fa fa-users</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  name: 'Tabbar',
  data() {
    return {
      value: 0
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
