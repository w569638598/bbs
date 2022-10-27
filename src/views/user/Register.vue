<template>
  <v-card class="mt-0 mx-auto" max-width="500">
    <v-card-title class="pa-4" style="border-bottom: 1px solid #e8e8e8;">
      新用户注册
    </v-card-title>
    <v-card-text>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
      <v-form
        ref="form"
        lazy-validation
        @submit.prevent="submitForm"
      >
      <v-container>
        <v-row>
          <v-col cols="12" class="pa-0">
            <validation-provider
              v-slot="{ errors }"
              name="账号"
              rules="required|validateUsername"
            >
              <v-text-field
                prepend-icon="fa fa-user-circle"
                label="账号"
                :error-messages="errors"
                v-model="ruleForm.username"
              >
              </v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="12" class="pa-0">
            <validation-provider
              v-slot="{ errors }"
              name="密码"
              rules="required|max:20|min:6"
            >
              <v-text-field
                label="密码"
                prepend-icon="fa fa-lock"
                type="password"
                :error-messages="errors"
                v-model="ruleForm.password"
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" class="pa-0">
            <validation-provider
              v-slot="{ errors }"
              name="确认密码"
              rules="required|validatePass"
            >
              <v-text-field
                label="确认密码"
                prepend-icon="fa fa-lock"
                type="password"
                :error-messages="errors"
                v-model="ruleForm.confirmpassword"
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="12" class="pa-0">
            <validation-provider
              v-slot="{ errors }"
              name="姓名"
              rules="required"
            >
            <v-text-field
              prepend-icon="fa fa-user-circle"
              label="姓名"
              :error-messages="errors"
              v-model="ruleForm.realname"
            >
            </v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="12" class="pa-0">
            <validation-provider
              v-slot="{ errors }"
              name="邮箱"
              rules="required|email"
            >
              <v-text-field
                prepend-icon="fa fa-envelope-o"
                label="邮箱"
                :error-messages="errors"
                v-model="ruleForm.email"
              >
              </v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="8" class="pa-0">
            <validation-provider
              v-slot="{ errors }"
              name="验证码"
              rules="required"
            >
            <v-text-field
              prepend-icon="fa fa-envelope"
              label="验证码"
              :error-messages="errors"
              v-model="ruleForm.inputCode"
            >
            </v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="4" class="pa-0" align-self="center">
            <v-btn
              class="getCaptcha ml-2"
              small
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              >
              {{state.smsSendBtn && isSuccess?`${state.time}s后重试`:'获取验证码' }}
              </v-btn>
          </v-col>
        </v-row>
        <div class="d-flex justify-center">
          <v-btn color="success" type="submit" class="mr-4" small>注册</v-btn>
          <v-btn color="error" class="mr-4" small>重置</v-btn>
        </div>

      </v-container>
      </v-form>
    </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
import { toMail } from '@/api/auth/auth'
import { duplicateCheck, addUser } from '@/api/api'
import { extend } from 'vee-validate'

export default {
  name: 'Register',
  data() {
    return {
      loading: false,
      ruleForm: {
        username: '',
        password: '',
        confirmpassword: '',
        email: '',
        realname: '',
        captcha: ''
      },
      state: {
        time: 90,
        smsSendBtn: false
      },
      isSuccess: false,
      rules: {
        email: [
          value => !!value || '请输入邮箱地址',
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        realname: [
          value => !!value || '请输入姓名'
        ]
      }
    }
  },
  mounted() {
    extend('validateUsername', {
      validate: this.validateUsername,
      message: '账号被占用'
    })
    extend('validatePass', {
      validate: this.validatePass,
      message: '两次输入密码不一致'
    })
  },
  methods: {
    submitForm() {
      this.$refs.observer.validate().then(validate => {
        if (validate) {
          this.loading = true
          this.ruleForm.checkKey = this.checkKey
          addUser(this.ruleForm).then(res => {
            this.loading = false
            if (res.success) {
              this.$message.success('账号注册成功')
              this.$router.push({ path: this.redirect || '/login' })
            } else {
              this.$message.error(res.message)
            }
          })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async validateUsername(value) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId
      }
      const res = await duplicateCheck(params)
      if (res.success) {
        return { valid: true }
      } else {
        return {
          valid: false
        }
      }
    },
    validatePass(value) {
      console.log(value)
      if (value === '') {
        return {
          valid: false
        }
      } else if (value !== this.ruleForm.password) {
        return {
          valid: false
        }
      } else {
        return { valid: true }
      }
    },
    getCaptcha(e) {
      e.preventDefault()
      const that = this
      if (!this.ruleForm.email) {
        return this.$message.error('请输入邮箱')
      }
      this.state.smsSendBtn = true
      this.isSuccess = false
      // const interval = window.setInterval(() => {
      //   if (that.state.time-- <= 0) {
      //     that.state.time = 60
      //     that.state.smsSendBtn = false
      //     window.clearInterval(interval)
      //   }
      // }, 1000)
      this.checkKey = new Date().getTime()
      toMail({
        checkKey: this.checkKey,
        email: this.ruleForm.email
      }).then(res => {
        if (!res.success) {
          this.$message.success('验证码已发至您的邮箱')
          this.isSuccess = true
          const interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        // clearInterval(interval)
        that.state.time = 60
        that.state.smsSendBtn = false
        this.requestFailed(err)
      })
    }
  }
}
</script>

<style scoped>
</style>
