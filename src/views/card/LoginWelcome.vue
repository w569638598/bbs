<template>
  <v-card height="" class="ma-0" :elevation="2">
    <v-card-title style="border-bottom: 1px solid #e8e8e8;">发帖</v-card-title>
    <v-card-actions v-if="token != null && token !== ''" style="padding:24px;" class="py-24 text-center">
      <v-spacer></v-spacer>
      <v-btn :to="{path:'/post/create/questions'}" color="#167df0" outlined>✍ 提问 </v-btn>
      <v-spacer></v-spacer>
      <v-btn :to="{path:'/post/create/share',query:{title:'想法'}}" color="#f14668" outlined>✍ 想法</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card-actions v-else class="py-24 text-center" style="padding:24px;">
      <v-spacer></v-spacer>
      <v-btn color="#7957d5" :to="{path:'/register'}" outlined>注册</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="#f14668" :to="{path:'/login'}" outlined>登录</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginWelcome',
  computed: {
    ...mapGetters([
      'token'
    ])
  }
}
</script>

<style scoped>
@media(max-width: 1440px){
  .text-center a{
    margin: 6px 0;
    width: 80%;
  }
  .text-center{
    display: block;
  }
}
</style>
