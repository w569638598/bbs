<template>
  <!-- <v-container> -->
    <v-row class="text-center">
      <v-col sm="12" md="9" >
        <Post :pageSize="10" />
      </v-col>
      <v-col sm="12" md="3" class="hidden-sm-and-down">
        <LoginWelcome />
      </v-col>
    </v-row>
  <!-- </v-container> -->
</template>

<script>
import Post from '@/views/post/Index'
import LoginWelcome from '@/views/card/LoginWelcome'
export default {
  name: 'BBS',
  components: {
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
