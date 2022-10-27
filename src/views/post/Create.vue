<template>
  <v-card class="mt-0">
    <v-card-title class="d-block text-h3">
       <span><i class="fa fa fa-book mr-2"></i>{{title}}</span>
    </v-card-title>
    <v-card-text>
    <v-form
      ref="ruleForm"
      lazy-validation
      @submit.prevent="submitForm"
    >
      <v-text-field
        placeholder="输入标题"
        :rules="rules.title"
        v-model="ruleForm.title"
      >
      </v-text-field>
      <!--Markdown-->
      <VEditor ref="VEditor" />
      <v-autocomplete
        v-model="ruleForm.tags"
        :items="['精益', '生活', '其他']"
        :rules="rules.tags"
        deletable-chips
        chips
        small-chips
        multiple
        placeholder="请选择标签"
        class="mt-2"
      ></v-autocomplete>
      <div class="d-flex justify-center">
        <v-btn color="success" type="submit" class="mr-4" small>立即创建</v-btn>
        <v-btn color="error" class="mr-4" @click="reset" small>重置</v-btn>
      </div>
    </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { post } from '@/api/post'
import { mapGetters } from 'vuex'
import VEditor from '@/components/VEditor/VEditor'
export default {
  name: 'Create',
  components: {
    VEditor
  },
  data() {
    return {
      ruleForm: {
        title: '', // 标题
        tags: [], // 标签
        content: '' // 内容
      },
      rules: {
        title: [
          value => !!value || '请输入帖子内容',
          v => (v && v.length <= 25) || '长度在 1 到 25 个字符'
        ],
        tags: [
          v => (v && v.length > 0) || '请选择标签'
        ]
      },
      title: '发表'
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    this.title = this.$route.query.title || '发表'
  },
  methods: {
    reset() {
      this.$refs.VEditor.reset()
    },
    ...mapGetters(['userInfo']),
    submitForm(formName) {
      const validate = this.$refs.ruleForm.validate()
      if (validate) {
        const content = this.$refs.VEditor.getValue()
        if (
          content.length === 1 ||
            content == null ||
            content === ''
        ) {
          this.$message.error('内容不可为空')
          return false
        }
        if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
          this.$message.error('标签不可以为空')
          return false
        }
        this.ruleForm.content = content
        this.ruleForm.type = this.$route.params.type
        post(this.ruleForm).then((response) => {
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.VEditor.setValue('')
      this.ruleForm.tags = []
    }
  }
}
</script>

<style>

</style>
