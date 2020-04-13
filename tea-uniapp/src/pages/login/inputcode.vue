<template>
  <div class="inp-wrap">
    <div class="code-wrap">
      <p class="code-tilte">请输入验证码</p>
      <p class="code-text">{{down}}秒内短信会到达手机{{mobile}}</p>
      <ul class="code pr"
          @click="showKeyboard = true">
        <li class=" num">{{value.substring(0,1)}}</li>
        <li class=" num">{{value.substring(1,2)}}</li>
        <li class=" num">{{value.substring(2,3)}}</li>
        <li class=" num">{{value.substring(3,4)}}</li>
        <input type="number" class="input pa" v-model="value" focus :cursor="9999999">
      </ul>
    </div>
  </div>
</template>

<script>
import { getCheckCode,collCheckCode } from '@/api/login'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      value: '',
      mobile: '',
      checkCode: '',
      smsId: '',
      down:60
    }
  },
  onLoad(option){
    console.log(option.phone);
    this.mobile = option.phone
    // this.mobile = '18211176678'
    if (this.mobile) {
      this.getCodefun()
    }
  },
  methods: {
    getCodefun () {
      const option = {
        mobile: this.mobile
      }
      getCheckCode(option).then(res => {
        if (res.code === 10000) {
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
        }
      })
    },
    // 提交验证码
    collCode () {
      const option = {
        mobile: this.mobile,
        checkCode: this.value,
        smsId: this.resData.smsId
      }
      collCheckCode(option).then(res => {
        if (res.code === 10000) {
          clearInterval(this.timer)
          uni.hideLoading()
          this.value = ''
          const data = res.data
          let userInfo = res.userInfo
          userInfo.token = res.data.token
          this.saveLogin(userInfo)
          uni.navigateBack({
            delta: 2
          })
        }
      })
    },
    ...mapActions(['saveLogin'])
  },
  watch: {
    value (val) {
      if (val.length >= 4) {
        uni.showLoading()
        this.collCode()
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.inp-wrap {
  background-color: #fff;
  .code-wrap {
    position: absolute;
    top: 16%;
    left: 0;
    right: 0;
    .code-tilte {
      font-size: 24px;
      text-align: center;
    }
    .code-text {
      margin: 20px 0 50px 0;
      font-size: 14px;
      text-align: center;
    }
    .code {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 50px;
      display: flex;
      justify-content: space-between;
      .num {
        width: 50px;
        height: 50px;
        float: left;
        font-size: 40px;
        line-height: 50px;
        text-align: center;
        border: 1upx solid #e8e8e8;
      }
      .input{
        left: -9999;
        bottom: 0;
        right: 0;
        top: 0;
        height: 100%;
        background: transparent;
        -webkit-text-fill-color: transparent;
        caret-color: transparent;
        color: transparent;
        opacity: 0;
        width: 200%;
        outline: none;
      }
    }
  }
}
</style>
