<template>
  <div>
    <v-row class="text-center wrap">
      <v-col>
        <Panel class="d-none d-sm-flex" />
        <Post />
      </v-col>
      <v-col sm="12" md="3" class="hidden-sm-and-down right">
        <LoginWelcome />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Panel from '@/views/panel/Panel'
import Post from '@/views/post/Index'
import LoginWelcome from '@/views/card/LoginWelcome'
export default {
  name: 'dashboard',
  components: {
    Panel,
    LoginWelcome,
    Post
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
