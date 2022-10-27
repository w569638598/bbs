<template>
  <v-card class="mt-0">
    <v-card-title class="d-block text-h3">
       <span><i class="fa fa fa-book mr-2"></i>主题 / 更新主题</span>
    </v-card-title>
    <v-card-text>
    <v-form
      ref="ruleForm"
      lazy-validation
      @submit.prevent="handleUpdate"
    >
      <v-text-field
        placeholder="输入帖子标题"
        :rules="rules.title"
        v-model="topic.title"
      >
      </v-text-field>
      <!--Markdown-->
      <VEditor ref="VEditor" />
      <v-autocomplete
        v-model="topic.tags"
        :items="['精益', '生活', '其他']"
        :rules="rules.tags"
        deletable-chips
        chips
        small-chips
        multiple
        placeholder="请选择标签"
        :disabled="state"
        class="mt-2"
      ></v-autocomplete>
      <div class="d-flex justify-center">
        <v-btn color="success" type="submit" class="mr-4" small>更新</v-btn>
        <v-btn color="error" @click="reset" class="mr-4" small>重置</v-btn>
      </div>
    </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { getTopic, update } from '@/api/post'
import { mapGetters } from 'vuex'
import VEditor from '@/components/VEditor/VEditor'
export default {
  name: 'Edit',
  components: { VEditor },
  data() {
    return {
      topic: {},
      state: undefined,
      tags: [],
      rules: {
        title: [
          value => !!value || '请输入帖子内容',
          v => (v && v.length <= 25) || '长度在 1 到 25 个字符'
        ],
        tags: [
          v => (v && v.length > 0) || '请选择标签'
        ]
      }
    }
  },
  created() {
    this.fetchTopic()
    this.state = this.$route.params.id;
  },
  methods: {
        reset(){
      this.$refs.VEditor.reset()
    },
    ...mapGetters(['userInfo']),
    fetchTopic() {
      getTopic({
        id: this.$route.params.id,
        username: this.userInfo().username ? this.userInfo().username : ''
      }).then((res) => {
        this.topic = res.data.topic
        this.topic.tags = res.data.tags.map(tag => tag.name)
        this.$refs.VEditor.setValue(this.topic.content)
      })
    },
    handleUpdate() {
      const validate = this.$refs.ruleForm.validate()
      if (validate) {
        this.topic.content = this.$refs.VEditor.getValue()
        if (
          this.topic.length === 1 ||
          this.topic == null ||
          this.topic === ''
        ) {
          this.$message.error('话题内容不可为空')
          return false
        }
        if (this.topic.tags == null || this.topic.tags.length === 0) {
          this.$message.error('标签不可以为空')
          return false
        }
        // return
        update(this.topic).then((response) => {
          if (response.code === 200) {
            this.isDestroyRouteCache = true
            const { data } = response
            this.$router.push({
              name: 'post-detail',
              params: { id: data.id }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      }
      // this.topic.content = this.$refs.VEditor.getValue()
      // update(this.topic).then((response) => {
      //   const { data } = response
      //   // setTimeout(() => {
      //   this.$router.push({
      //     name: 'post-detail',
      //     params: { id: data.id }
      //   })
      //   // }, 800)
      // })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.contentEditor.setValue('')
      this.tags = ''
    }
  }
}
</script>

<style>
.vditor-reset pre > code {
  font-size: 100%;
}
</style>
