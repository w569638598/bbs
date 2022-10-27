<template>
  <v-card
    :loading="loading"
    class="mx-auto pa-4 mt-0"
    max-width="500"
  >
    <v-card-title>用户登录</v-card-title>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="submitForm"
    >
      <v-text-field
        prepend-icon="fa fa-user-circle"
        label="账号"
        :rules="rules.username"
        v-model="ruleForm.username"
      >
      </v-text-field>
      <v-text-field
        label="密码"
        prepend-icon="fa fa-lock"
        type="password"
        :rules="rules.password"
        v-model="ruleForm.password"
      ></v-text-field>
      <v-text-field
        prepend-icon="fa fa-envelope"
        label="验证码"
        :rules="rules.inputCode"
        v-model="ruleForm.inputCode"
      >
        <img slot="append" v-if="requestCodeSuccess" style="margin-top: 2px;" :src="randCodeImage" @click="handleChangeCheckCode"/>
        <img slot="append" v-else style="margin-top: 2px;" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>
      </v-text-field>
      <div class="d-flex justify-space-between align-center">
        <v-checkbox v-model="ruleForm.rememberMe" label="记住密码"/>
        <!-- <v-checkbox v-model="ruleForm.rememberMe" label="忘记密码"/> -->
        <v-btn
          text
          color="primary"
          @click="handleForgetPassword"
        >
          忘记密码
        </v-btn>
      </div>
      <div class="d-flex justify-center">
        <v-btn color="success" type="submit" class="mr-4" small>登录</v-btn>
        <v-btn color="error" class="mr-4" small>重置</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import { getAction } from '@/api/manage'
import Vue from 'vue'
export default {
  name: 'Login',
  data() {
    return {
      redirect: undefined,
      loading: false,
      ruleForm: {
        username: '',
        password: '',
        rememberMe: true,
        inputCode: ''
      },
      rules: {
        username: [
          value => !!value || '请输入账号'
        ],
        password: [
          value => !!value || '请输入密码'
        ],
        inputCode: [
          value => !!value || '请输入验证码'
        ]
      },
      currdatetime: '',
      randCodeImage: '',
      requestCodeSuccess: false,
      rememberPsw: false
    }
  },
  methods: {
    submitForm() {
      const validate = this.$refs.form.validate()
      if (validate) {
        this.loading = true
        this.ruleForm.checkKey = this.currdatetime
        if (this.ruleForm.rememberMe) {
          Vue.ls.set('USER_PSW', JSON.stringify({
            password: this.ruleForm.password,
            rememberMe: this.ruleForm.rememberMe,
            username: this.ruleForm.username
          }), 7 * 24 * 60 * 60 * 1000)
        } else {
          Vue.ls.set('USER_PSW', JSON.stringify({
            rememberMe: false
          }), 7 * 24 * 60 * 60 * 1000)
        }
        this.ruleForm.groupCompany = "0"
        this.$store.dispatch('user/login', this.ruleForm)
          .then(res => {
            if (res.success) {
              this.$message.success('登录成功')
              this.$router.push({ path: this.redirect || '/' })
            } else {
              this.$message.error(res.message)
              // this.handleChangeCheckCode()
            }
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.handleChangeCheckCode()
            this.loading = false
          })
      } else {
        return false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleChangeCheckCode() {
      this.currdatetime = new Date().getTime()
      getAction(`/sys/randomImage/${this.currdatetime}`).then(res => {
        if (res.success) {
          this.randCodeImage = res.result
          this.requestCodeSuccess = true
        } else {
          this.$message.error(res.message)
          this.requestCodeSuccess = false
        }
      }).catch(() => {
        this.requestCodeSuccess = false
      })
    },
    handleForgetPassword() {
      this.$router.push('/forgetPassword')
    }
  },
  created() {
    this.currdatetime = new Date().getTime()
    this.handleChangeCheckCode()
    const psw = Vue.ls.get('USER_PSW')
    if (psw) {
      this.ruleForm = JSON.parse(psw)
    }
  }
}
</script>

<style scoped>
</style>
