<template>
  <div class="inp-wrap">
    <backbar bgColor="transparent"
             leftColor="#333"></backbar>
    <div class="code-wrap">
      <p class="code-tilte">请输入验证码</p>
      <p class="code-text">60秒内短信会到达手机{{resData.mobile}}</p>
      <ul class="code"
          @click="showKeyboard = true">
        <li class="border num">{{value.substring(0,1)}}</li>
        <li class="border num">{{value.substring(1,2)}}</li>
        <li class="border num">{{value.substring(2,3)}}</li>
        <li class="border num">{{value.substring(3,4)}}</li>
      </ul>
    </div>
    <van-number-keyboard :show="showKeyboard"
                         @input="onInput"
                         @delete="onDelete"
                         @blur="showKeyboard = false" />
    <div class="loading"
         v-if="loadshow">
      <van-loading size="40px"
                   color="white" />
    </div>
  </div>
</template>

<script>
import { collCheckCode } from '~/api/login'
// import { saveLocalStorage } from 'common/js/localStorage'
import { mapActions } from 'vuex'
import { getStore } from '~/utils/tool'
import backbar from '~/components/backbar'
// import { setStore, getStore } from "~/utils/localStorage"
export default {
  data () {
    return {
      value: '',
      showKeyboard: true,
      mobile: '',
      loadshow: false,
      checkCode: '',
      smsId: ''
    }
  },
  props: ['resData'],
  methods: {
    onInput (key) {
      this.value = (this.value + key).slice(0, 4)
    },
    onDelete () {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    handleClickBack () {
      this.$emit('close')
    },
    // 提交验证码
    collCode () {
      const option = {
        mobile: this.resData.mobile,
        checkCode: this.resData.checkCode,
        smsId: this.resData.smsId
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
            mobileFlag: true
          })
          const redirectURL = getStore('__redirectUrl__') || '/self'
          this.$router.push(redirectURL)
        } else {
          this.$toast(res.message)
        }
      })
    },
    ...mapActions(['saveLogin'])
  },
  watch: {
    value (val) {
      if (val.length >= 4) {
        if (val === this.resData.checkCode) {
          this.loadshow = true
          this.collCode()
        } else {
          this.$toast('请输入正确的验证码')
        }
      }
    }
  },
  components: {
    backbar
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';
.inp-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 15;
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
      }
      .border:before {
        border-color: #999;
      }
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -20%);
    background: #999;
    border-radius: 0.5px;
    padding: 15px;
  }
}
</style>
