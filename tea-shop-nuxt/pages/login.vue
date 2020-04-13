<template>
  <div class="bind-wrap">
    <backbar></backbar>
    <div class="logo-wrap">
      <div class="logo"></div>
      <!-- <div class="text">为了您的账户安全，请绑定手机</div> -->
    </div>
    <div class="inp-wrap">
      <div class="input">
        <input type="tel"
               placeholder="请输入手机号"
               @blur="inputBlur"
               v-model="mobile">
      </div>
      <div class="line border-top"></div>
      <div class="code">
        <input type="tel"
               placeholder="请输入验证码"
               @blur="inputBlur"
               v-model="code">
        <div class="codebtn"
             @click="getcode"
             v-if="!codeInp">
          <span>发送验证码</span>
        </div>
        <div class="codebtn"
             v-if="codeInp">
          <span>{{down}}s</span>
        </div>
      </div>
      <div class="line border-top"></div>
      <div @click="sure"
           class="btnWrap f18 cf tac">
        <!-- <van-button type="danger" size="large" style="background-color:#D45949">登录</van-button> -->
        <span>登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import { mobileReg } from '~/utils/validate'
import { getCheckCode, collCheckCode } from '~/api/login'
import { mapGetters, mapActions } from 'vuex'
import { getStore } from '~/utils/tool'
export default {
  components: {
    backbar
  },
  data () {
    return {
      mobile: '',
      code: '',
      down: 60,
      codeInp: false,
      timer: null,
      resData: {},
      loadshow: false
    }
  },
  methods: {
    ...mapActions(['saveLogin']),
    inputBlur () {
      window.scrollTo(0, 0)
    },
    getcode () {
      if (mobileReg.test(this.mobile)) {
        this.getCodefun()
      } else {
        this.$toast('请输入正确的手机号')
      }
    },
    getCodefun () {
      const option = {
        mobile: this.mobile
      }
      this.$axios.$post(getCheckCode, option).then(res => {
        if (res.code === 10000) {
          this.$toast('获取验证码成功')
          this.resData = res.data
          this.codeInp = true
          this.timer = setInterval(() => {
            this.down--
            if (this.down <= 0) {
              this.down = 60
              this.codeInp = false
              clearInterval(this.timer)
            }
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      })
    },
    sure () {
      if (this.resData.checkCode !== this.code) {
        this.$toast('请输入正确的验证码')
        return
      }
      const option = {
        mobile: this.mobile,
        checkCode: this.resData.checkCode,
        smsId: this.resData.smsId,
        shopId: this.$route.query.shopId ? this.$route.query.shopId : ''
      }
      this.$axios.$post(collCheckCode, option).then(res => {
        if (res.code === 10000) {
          this.loadshow = false
          this.value = ''
          const data = res.data
          this.saveLogin({
            userId: data.userId,
            token: data.token,
            isLogin: true,
            mobileFlag: data.mobileFlag
          })
          const redirectURL = getStore('__redirectUrl__') || '/self'
          this.$router.push(redirectURL)
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
    code (val, old) {
      if (val.length > 4) {
        this.code = old
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.bind-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 15;
  background-color: #fff;
  .logo-wrap {
    position: relative;
    width: 100%;
    padding-bottom: 70%;
    .logo {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -20%);
      @include bg-image('common/logo');
      width: 60px;
      height: 60px;
      background-size: cover;
      padding: 1px;
    }
    .text {
      position: absolute;
      left: 0;
      right: 0;
      top: 78%;
      text-align: center;
    }
  }
  .inp-wrap {
    width: 100%;
    .input {
      width: 68%;
      margin: 15px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20px;
      input {
        width: 100%;
        background: none;
        border: 0px;
      }
      input::placeholder {
        color: #666;
        font-size: 15px;
      }
    }
    .code {
      width: 68%;
      margin: 15px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20px;
      input {
        width: 60%;
        background: none;
        border: 0px;
      }
      input::placeholder {
        color: #666;
        font-size: 15px;
      }
      .codebtn {
        font-size: 13px;
        width: 40%;
        padding: 7px;
        box-sizing: border-box;
        text-align: center;
      }
      .border:before {
        border-color: #999;
      }
    }
  }
  .line {
    width: 68%;
    height: 2px;
    margin: 0 auto;
  }
  .border-top:before {
    border-color: #999;
  }
  .btnWrap {
    width: 270px;
    height: 44px;
    margin: 0 auto;
    margin-top: 40px;
    font-size: 18px;
    line-height: 44px;
    background: linear-gradient(
      -45deg,
      rgba(245, 109, 104, 1) 0%,
      rgba(240, 125, 110, 1) 100%
    );
    border-radius: 22px;

    /deep/ .van-button--danger {
      border: none;
      border-radius: 0;
    }
  }
}
</style>
