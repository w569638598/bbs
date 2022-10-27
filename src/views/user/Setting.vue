<template>
  <v-card
    :loading="loading"
    class="mx-auto mt-0 pa-4"
  >
    <v-card-title>个人设置</v-card-title>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="submitForm"
    >
      <div class="d-flex align-center">
        <div style="width:calc(100% - 150px);">
          <v-text-field
            prepend-icon="fa fa-user-circle"
            label="账号"
            v-model="user.username"
            disabled
          >
          </v-text-field>
          <v-text-field
            prepend-icon="fa fa-user-circle"
            label="昵称"
            :rules="rules.realname"
            v-model="user.realname"            
          >
          </v-text-field>
        </div>
        <v-avatar-uploader
          class="ma-auto"
          label="头像"         
          :url="url"
          :request="request"
          :avatar="{size:100}"
        />
      </div>
      <v-text-field
        prepend-icon="fa fa-envelope-o"
        label="邮箱"
        v-model="user.email"
      >
      </v-text-field>
      <v-text-field
        prepend-icon="fa fa-phone"
        label="手机号"
        v-model="user.mobile"
      >
      </v-text-field>
      <v-textarea
        outlined
        label="简介"
        prepend-icon="fa fa-file-text-o"
        v-model="user.bio"
      >
      </v-textarea>
      <div class="d-flex justify-center">
        <v-btn color="success" type="submit" class="mr-4" small>提交</v-btn>
        <v-btn color="error" class="mr-4" small>重置</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import { getInfo, update } from '@/api/user'
import { uploadAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import VAvatarUploader from 'vuetify-avatar-uploader'
export default {
  name: 'Setting',
  components: {
    VAvatarUploader
  },
  data() {
    return {
      loading: false,
      user: {
        id: '',
        username: '',
        alias: '',
        bio: '',
        email: '',
        mobile: '',
        avatar: ''
      },
      baseURL: '',
      avatarUrl: '',
      rules: {
        realname: [
          value => !!value || '请输入昵称'
        ]
      }
    }
  },
  created() {
    this.fetchInfo()
    this.baseURL = window._CONFIG['domianURL']
  },
  computed: {
    ...mapGetters(['token', 'username']),
    url () {
      return this.baseURL +'/sys/common/static/'+ this.avatarUrl 
    }
  },
  methods: {
    request (form, config) {
      form.append('biz', 'temp')
      return uploadAction(form).then(res => {
        if (res.success) {
          this.avatarUrl = res.message
        } else {
          this.$message.success('上传失败')
        }
      })
    },
    fetchInfo() {
      getInfo({ username: this.username }).then(res => {
        const { data } = res
        this.user = data
        this.avatarUrl = this.user.avatar
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitForm(formName) {
      this.user.avatar = this.avatarUrl
      update(this.user).then(res => {
        this.$message.success('信息修改成功')
        this.fetchInfo()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onFileInfo(e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.ma-auto{
  border: solid 2px #ccc;
  border-radius: 100%;
  overflow: hidden;
}
</style>
