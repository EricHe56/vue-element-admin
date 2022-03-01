<template>
  <div class="login-container">
    <el-row style="text-align: center; vertical-align: middle;">
      <div class="title-container" style="display: inline-block;">
        <h3 class="title" style="float:left;padding-top:30px;"><img src="images/logo.png" style="height: 28px;vertical-align: middle;float:left;margin-right:10px;">Login Form</h3>
      </div>
    </el-row>

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入手机号码"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          style="width:75%;"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        <!-- <el-button size="mini" type="primary" style="margin-top:6px" :disabled="sent>0" @click="smsSend">发送{{ sent>0?sent:'' }}</el-button> -->
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import { sendSms } from '@/api/user'
// import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length !== 11) {
        callback(new Error('请输入11位手机号码'))
      } else if (isNaN(value)) {
        callback(new Error('请输入11位手机号码'))
      } else {
        callback()
      }
      // if (!validUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      //   callback()
      // }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入6位数字验证码'))
      } else if (isNaN(value)) {
        callback(new Error('请输入6位数字验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        auth_code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: '',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      sent: 0,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // this.redirect = route.query && route.query.redirect
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.handleLogin()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    smsSend() {
      var that = this
      this.loginForm.password = '000000'
      this.$refs.loginForm.validate(valid => {
        this.loginForm.password = ''
        if (!valid) { return }
        sendSms({ mobile: this.loginForm.username })
          .then(responseData => {
            if (responseData.code === 0) {
              that.sent = 60
              that.$message({
                message: '发送成功！',
                type: 'success'
              })
              setTimeout(that.updateSent, 1000)
            }
          })
          .catch(e => {
            that.$message({
              message: 'Error: ' + e.message,
              type: 'error'
            })
          })
      })
    },
    updateSent() {
      this.sent--
      setTimeout(this.updateSent, 1000)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      var loginApi = ''
      if (window.location.hostname !== 'toss.jsyby.com' && window.location.hostname !== 'oss.jsyby.com') {
        // eslint-disable-next-line no-undef
        if (typeof vars.auth_code !== 'undefined') {
          // eslint-disable-next-line no-undef
          this.loginForm.auth_code = vars.auth_code
          loginApi = 'user/login'
        } else {
          return
        }
      } else {
        loginApi = 'user/cookie_login'
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          this.$store.dispatch(loginApi, this.loginForm).then(() => {
            this.$store.dispatch('settings/getSettings', { type: 'language' }).then(() => {
              // this.$router.push({ path: '/' })
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#2672ED;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#23252a;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
