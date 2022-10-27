<template>
  <v-card class="mt-0 mx-auto" max-width="500">
    <v-card-title class="pa-4" style="border-bottom: 1px solid #e8e8e8;">
      修改密码
    </v-card-title>
    <v-card-text>
    <validation-observer
      ref="observer"
      v-slot="{  }"
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
          </v-col>
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
    </v-card-text>
  </v-card>
</template>

<script>
import { putAction } from '@/api/manage'
import { extend } from 'vee-validate'
import { mapGetters } from 'vuex'
export default {
  name: 'ResetPassword',
  data() {
    return {
      loading: false,
      ruleForm: {
        oldpassword: '',
        password: '',
        confirmpassword: ''
      },
      url: 'sys/user/updatePassword'
    }
  },
  mounted() {
    extend('validatePass', {
      validate: this.validatePass,
      message: '两次输入密码不一致'
    })
  },
  methods: {
    ...mapGetters(['userInfo']),
    submitForm() {
      this.$refs.observer.validate().then(validate => {
        if (validate) {
          this.loading = true
          const params = Object.assign({ username: this.userInfo().username }, this.ruleForm)
          putAction(this.url, params).then((res) => {
            this.loading = false
            if (res.success) {
              this.$message.success(res.message)
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
