<template>
    <v-card class="mt-0 text-center">
      <v-card-title class="text-center d-block text-h3">
        <p>👨‍💻 关于作者</p>
      </v-card-title>
      <v-card-text >
        <p>
          <router-link :to="{ path: `/member/home/${user.username}` }">
            <span class="username">{{ user.realname }}</span>
            <span class="is-size-7 has-text-grey">{{ '@' + user.username }}</span>
          </router-link>
        </p>
        <div class="d-flex justify-space-around">
          <div>
            <code>{{ user.articleNum }}</code>
            <p>文章</p>
          </div>
          <div>
            <code>{{ user.fansNum }}</code>
            <p>粉丝</p>
          </div>
        </div>
        <div>
          <v-btn
            v-if="hasFollow"
            block
            small
            color="success"
            @click="handleUnFollow(user.id)"
          >
            已关注
          </v-btn>
          <v-btn
            v-else-if="!hasFollow && username !== user.username"
            block
            small
            color="primary"
           @click="handleFollow(user.id)"
          >
            关注
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
</template>

<script>
import { follow, hasFollow, unFollow } from '@/api/follow'
import { mapGetters } from 'vuex'
export default {
  name: 'Author',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      hasFollow: false
    }
  },
  mounted() {
    this.fetchInfo()
  },
  computed: {
    ...mapGetters([
      'token',
      'username'
    ])
  },
  methods: {
    fetchInfo() {
      if (this.token != null && this.token !== '') {
        if (this.user.id) {
          hasFollow(this.user.id).then(value => {
            const { data } = value
            this.hasFollow = data.hasFollow
          })
        } else {
          this.hasFollow = {}
        }
      }
    },
    handleFollow: function(id) {
      if (this.token != null && this.token !== '') {
        follow(id).then(res => {
          if (res.code === 200) {
            this.hasFollow = !this.hasFollow
            this.user.followerCount = parseInt(this.user.followerCount) + 1
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.success('请先登录')
      }
    },
    handleUnFollow: function(id) {
      unFollow(id).then(response => {
        const { message } = response
        this.$message.success(message)
        this.hasFollow = !this.hasFollow
        this.user.followerCount = parseInt(this.user.followerCount) - 1
      })
    }
  }
}
</script>

<style scoped>
.username{
  font-size: 14px;
}
</style>
