<template>
  <div class="columns mt-6">
    <div class="column mt-6">
      <div class="mt-6">
        <!-- <p class="content">页面开发中</p> -->
        <p class="content subtitle mt-6">
          页面开发中 {{ times }} 秒后，将返回首页!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '404',
  data() {
    return {
      times: 5
    }
  },
  created() {
    this.goHome()
  },
  methods: {
    goHome: function() {
      this.timer = setInterval(() => {
        this.times--
        if (this.times === 0) {
          clearInterval(this.timer)
          this.$router.push({ path: '/' })
        }
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
</style>
