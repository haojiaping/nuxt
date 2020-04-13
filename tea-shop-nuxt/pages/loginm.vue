<template>
    <div class="login-wrap">
      <backbar bgColor="transparent" leftColor="#fff"></backbar>
      <div class="logo-wrap">
        <div class="logo"></div>
      </div>
      <div class="inp-wrap">
        <div class="input">
          <input type="tel" placeholder="请输入手机号" @blur="inputBlur" v-model="mobile">
        </div>
        <div class="line border-top"></div>
        <div class="btn-wrap mauto" @click="testMobile">
          <van-button type="danger" size="large" style="background-color:#D45949">发送验证码</van-button>
        </div>
        <div class="text">未注册臻茶手机号,登录时即将自动注册</div>
      </div>
      <div class="loading" v-if="loadshow">
        <van-loading size="40px" color="white"/>
      </div>
      <InputCode :resData="resData" v-if="inputCheckCode" @close="closeInput"></InputCode>
    </div>
</template>

<script>
import { mobileReg } from '~/utils/validate'
import InputCode from '~/components/login/InputCode'
import { getCheckCode } from '~/api/login'
import backbar from '~/components/backbar'
export default {
  data () {
    return {
      mobile: '',
      resData: {},
      loadshow: false,
      inputCheckCode: false
    }
  },
  mounted () {
    this.mobile = ''
    this.inputCheckCode = false
  },
  methods: {
    inputBlur () {
      window.scrollTo(0, 0)
    },
    testMobile() {
      if (mobileReg.test(this.mobile)) {
        this.getCode()
      } else {
        this.$toast('请输入正确的手机号')
      }
    },
    getCode() {
      this.loadshow = true
      const option = {
        mobile: this.mobile
      }
      this.$axios.$post(getCheckCode, option).then(res => {
        this.loadshow = false
        this.$toast('获取验证码成功')
        this.resData = res.data
        this.resData.mobile = this.mobile
        this.inputCheckCode = true
      }).catch(() => {
        this.loadshow = false
      })
    },
    closeInput() {
      this.inputCheckCode = false
    }
  },
  components: {
    InputCode,
    backbar
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';
.login-wrap {
  @include bg-image("login/indexbg");
  height: 100%;
  .logo-wrap {
    position: relative;
    width: 100%;
    padding-bottom: 70%;
    .logo {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -20%);
      @include bg-image("common/logo");
      width: 60px;
      height: 60px;
      background-size: cover;
      padding: 1px;
    }
  }
  .inp-wrap {
    width: 100%;
    .input {
      width: 270px;
      margin: 10px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        width: 100%;
        background: none;
        border: 0px;
        color: #fff;
        font-size: 20px;
        line-height: 20px;
      }
      input::placeholder {
        color: #fff;
        font-size: 16px;
        line-height: 20px;
      }
    }
    .btn-wrap{
      width: 270px;
      height: 44px;
      margin-top:20px;
      /deep/ .van-button--danger{
        border:none;
        border-radius: 0;
      }
    }
  }
  .line {
    width: 270px;
    height: 1px;
    margin: 0 auto;
  }
  .text {
    width: 80%;
    margin: 20px auto;
    text-align: center;
    font-size: 15px;
    color: #fff;
  }
  .otherlogin {
    position: absolute;
    bottom: 0.6rem;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    line-height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconwx {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-size: cover;
      background-repeat: no-repeat;
      margin-right: 5px;
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -20%);
    background: #999;
    border-radius: 5px;
    padding: 30px;
  }
}
</style>
