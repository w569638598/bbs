<template>
  <v-form
    ref="form"
    class="mt-2"
    lazy-validation
    @submit.prevent="onSubmit"
  >
    <v-textarea
      outlined
      name="input-7-4"
      clearable
      clear-icon="mdi-close-circle"
      :label="`回复${comment.sysUser.realname}`"
      :rows="2"
      :rules="rules.commentText"
      :hide-details="true"
      v-model="commentText"
    >
    </v-textarea>
    <div class="text-right mt-2">
      <v-btn color="success" class="mr-0" type="submit" small >回复</v-btn>
    </div>
  </v-form>
</template>

<script>
import { pushComment } from '@/api/comment'
import { mapGetters } from 'vuex'
export default {
  name: 'Reply',
  props: {
    comment: {
      type: Object,
      required: true
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      commentText: '',
      isLoading: false,
      autosize: {
        minRows: 1,
        maxRows: 6
      },
      rules: {
        commentText: [
          value => !!value || '请输入回复'
        ]
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    async onSubmit() {
      const validate = this.$refs.form.validate()
      if (!validate) {
        return false
      }
      this.isLoading = true
      try {
        const postData = {}
        postData['content'] = this.commentText
        postData['topicId'] = this.comment.topicId
        postData['parentId'] = this.parentId
        postData['toUserId'] = this.comment.userId
        const res = await pushComment(postData)
        if (res.code === 200) {
          this.$refs.form.reset()
          this.$emit('loadComments', this.comment.topicId)
          this.$message.success('回复成功')
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
<style scoped>
</style>
