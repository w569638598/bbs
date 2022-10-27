<template>
  <v-stepper class="mt-0 mx-auto" v-model="e1" max-width="500">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">
        验证邮箱
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">
        重置密码
      </v-stepper-step>
      <v-divider></v-divider>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <validation-observer ref="observer1" v-slot="{  }">
          <v-form ref="form" lazy-validation @submit.prevent="submitEmailForm">
            <v-container>
              <v-row>
                <!-- <v-col cols="12" class="pa-0">
                  <validation-provider
                    v-slot="{ errors }"
                    name="账号"
                    rules="required"
                  >
                    <v-text-field
                      label="账号"
                      prepend-icon="fa fa-user-circle"
                      :error-messages="errors"
                      v-model="emailForm.oldpassword"
                    />
                  </validation-provider>
                </v-col> -->
                <v-col cols="12" class="pa-0">
                  <validation-provider
                    v-slot="{ errors }"
                    name="邮箱"
                    rules="required|email"
                  >
                    <v-text-field
                      label="邮箱"
                      prepend-icon="fa fa-envelope-o"
                      :error-messages="errors"
                      v-model="emailForm.email"
                    />
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
                      v-model="emailForm.inputCode"
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
                <v-btn color="success" type="submit" class="mr-4" small>验证邮箱</v-btn>
              </div>
            </v-container>
          </v-form>
        </validation-observer>
      </v-stepper-content>

      <v-stepper-content step="2">
        <validation-observer
          ref="observer"
          v-slot="{  }"
        >
          <v-form ref="form" lazy-validation @submit.prevent="submitForm">
            <v-container>
              <v-row>
                <!-- <v-col cols="12" class="pa-0">
                  <validation-provider
                    v-slot="{ errors }"
                    name="旧密码"
                    rules="required|max:20|min:6"
                  >
                    <v-text-field
                      label="旧密码"
                      prepend-icon="fa fa-lock"
                      type="password"
                      :error-messages="errors"
                      v-model="ruleForm.oldpassword"
                    />
                  </validation-provider>
                </v-col> -->
                <v-col cols="12" class="pa-0">
                  <validation-provider
                    v-slot="{ errors }"
                    name="新密码"
                    rules="required|max:20|min:6"
                  >
                    <v-text-field
                      label="新密码"
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
                    name="确认新密码"
                    rules="required|validatePass"
                  >
                    <v-text-field
                      label="确认新密码"
                      prepend-icon="fa fa-lock"
                      type="password"
                      :error-messages="errors"
                      v-model="ruleForm.confirmpassword"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
              <div class="d-flex justify-center">
                <v-btn color="success" type="submit" class="mr-4" small>确认修改</v-btn>
              </div>
            </v-container>
          </v-form>
        </validation-observer>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { putAction, postAction } from '@/api/manage'
import { extend } from 'vee-validate'
import { toMail } from '@/api/auth/auth'
export default {
  name: 'ForgetPassword',
  data() {
    return {
      loading: false,
      emailForm: {
        username: '',
        email: '',
        inputCode: ''
      },
      ruleForm: {
        oldpassword: '',
        password: '',
        confirmpassword: ''
      },
      url: 'sys/user/updatePassword',
      e1: 1,
      state: {
        time: 90,
        smsSendBtn: false
      },
      isSuccess: false,
      checkKey: '',
      username: ''
    }
  },
  mounted() {
    extend('validatePass', {
      validate: this.validatePass,
      message: '两次输入密码不一致'
    })
  },
  methods: {
    submitEmailForm() {
      this.e1 = 2
      this.$refs.observer1.validate().then(validate => {
        if (validate) {
          postAction('/sys/checkCode', {
            email: this.emailForm.email,
            code: this.emailForm.inputCode,
            checkKey: this.checkKey
          }).then(res => {
            if (res.success) {
              this.e1 = 2
            }
            this.loading = true
          })
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const that = this
      if (!this.emailForm.email) {
        return this.$message.error('请输入邮箱')
      }
      this.state.smsSendBtn = true
      this.isSuccess = false
      this.checkKey = new Date().getTime()
      toMail({
        checkKey: this.checkKey,
        email: this.emailForm.email
      }).then(res => {
        if (res.success) {
          // this.cmsFailed(res.message)
          this.$message.success('验证码已发至您的邮箱')
          this.isSuccess = true
          const interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
        }
      }).catch(err => {
        // clearInterval(interval)
        that.state.time = 60
        that.state.smsSendBtn = false
        this.requestFailed(err)
      })
    },
    submitForm() {
      this.$refs.observer.validate().then(validate => {
        if (validate) {
          this.loading = true
          const params = Object.assign({
            email: this.emailForm.email,
            code: this.emailForm.inputCode,
            checkKey: this.checkKey }, this.ruleForm)
          putAction('/sys/resetPassword', params).then((res) => {
            this.loading = false
            if (res.success) {
              this.$message.success(res.message)
              this.$router.push('/login')
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    validatePass(value) {
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
    }
  }
}
</script>

<style scoped>
</style>
