<template>
  <v-form
    ref="form"
    lazy-validation
    @submit.prevent="onSubmit"
  >
    <v-textarea
      outlined
      name="input-7-4"
      clearable
      clear-icon="mdi-close-circle"
      label="输入评论"
      :rules="rules.commentText"
      :rows="2"
      :hide-details="true"
      v-model="commentText"
    >
    </v-textarea>
    <div class="text-right mt-2">
      <v-btn color="success" class="mr-0" type="submit" small >评论</v-btn>
    </div>
  </v-form>
</template>

<script>
import { pushComment } from '@/api/comment'
export default {
  name: 'LvCommentsForm',
  data() {
    return {
      commentText: '',
      isLoading: false,
      autosize: {
        minRows: 2,
        maxRows: 6
      },
      rules: {
        commentText: [
          value => !!value || '请输入回复'
        ]
      }
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  methods: {
    async onSubmit() {
      const validate = this.$refs.form.validate()
      if (!validate) {
        return false
      }
      this.isLoading = true
      try {
        const postData = {}
        postData['content'] = this.commentText
        postData['topicId'] = this.slug
        postData['parentId'] = '0'
        const res = await pushComment(postData)
        if (res.code === 200) {
          // this.commentText = ''
          this.$refs.form.reset()
          this.$emit('loadComments', this.slug)
          this.$message.success('留言成功')
        } else {
          this.$message.warning(res.message)
        }
      } catch (e) {
        // this.$buefy.toast.open({
        //   message: `Cannot comment this story. ${e}`,
        //   type: 'is-danger'
        // })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
