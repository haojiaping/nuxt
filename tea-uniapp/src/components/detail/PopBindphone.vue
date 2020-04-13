<template>
    <!-- 弹出绑定手机 -->
  <div class="detail-layer" @click="handleClickToggle" v-show="isShow">
    <transition name="toggle">
      <div class="content" @click.stop v-show="isShow">
        <div class="text c3 f15" v-if="!getCode">为方便查询物流，请您绑定手机</div>
        <div class="text c3 f15" v-else-if="getCode">验证码已发送至{{phone|formatPhone}}</div>
        <div class="phone" v-if="!getCode">
          <span class="lable c9 f15">手机号码</span>
          <span>{{value.substring(0,3)}}</span>
          <span>{{value.substring(3,7)}}</span>
          <span class="num">{{value.substring(7,11)}}</span>
        </div>
        <div class="phone"  v-else-if="getCode">
          <span style="padding-left:10px;" class="fw600 f15 num">{{value}}</span>
          <span class="lableright c9 van-hairline--left" v-if="time>0">{{time}}秒后可重新获取</span>
          <span class="lableright c9 van-hairline--left" v-else style="color:#D45949;" @click="getCodefun">获取验证码</span>
        </div>
        <div class="tips c9 f14" v-if="!getCode">验证号码后才能继续购买</div>
        <div class="tips c9 f14" v-if="getCode">客服电话400-839-8090</div>
        <div class="btn" @click="getCodenum" v-if="!getCode">下一步</div>
        <div class="btn" @click="sure" v-else-if="getCode">确认</div>
        <!-- 键盘 -->
        <div class="keyWrap">
          <van-number-keyboard
            :show="true"
            :transition="false"
            @input="onInput"
            @delete="onDelete"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mobileReg } from '@/utils/validate'
import { getCheckCode, bindphone } from '@/api/login'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PopBindphone',
  data () {
    return {
      isShow: false,
      phone: '',
      value: '',
      getCode: false,
      resData: {},
      time: 60,
      timer: null
    }
  },
  mounted () {
    this.getCode = false
    this.value = ''
    this.phone = ''
  },
  methods: {
    ...mapActions(['saveLogin']),
    toggle() {
      this.isShow = !this.isShow
    },
    handleClickToggle() {
      this.isShow = false
      this.getCode = false
      this.value = ''
      this.phone = ''
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 11)
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    getCodenum() {
      this.phone = this.value
      if (mobileReg.test(this.phone)) {
        this.value = ''
        this.getCodefun()
      } else {
        this.$toast('请输入正确的手机号')
      }
    },
    getCodefun() {
      const option = {
        mobile: this.phone
      }
      this.$axios.$post(getCheckCode, option).then(res => {
        if (res.code === 10000) {
          this.time = 60
          this.$toast('获取验证码成功')
          this.resData = res.data
          this.getCode = true
          this.timer = setInterval(() => {
            this.time--
            if (this.time <= 0) {
              clearInterval(this.timer)
            }
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      })
    },
    sure() {
      if (this.resData.checkCode !== this.value) {
        this.$toast('请输入正确的验证码')
        return
      }
      const option = {
        userId: this.user.userId,
        mobile: this.phone,
        smsId: this.resData.smsId,
        checkCode: this.value
      }
      console.log(option)
      this.$axios.$post(bindphone, option).then(res => {
        console.log(res)
        if (res.code === 10000) {
          this.$toast('绑定成功')
          this.saveLogin({
            userId: this.user.userId,
            token: this.user.token,
            isLogin: true,
            mobileFlag: true
          })
          clearInterval(this.timer)
          this.$emit('bindOk')
          this.handleClickToggle()
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  filters: {
    formatPhone(val) {
      return `${val.substring(0, 3)}****${val.substring(7, 11)}`
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>

.detail-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 22;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 20px;
    background-color: #fff;
    &.toggle-enter-active, &.toggle-leave-active {
      transition: all 0.5s;
    }
    &.toggle-enter, &.toggle-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    .text {
      padding: 15px 0;
      font-weight: 400;
    }
    .phone {
      box-sizing: border-box;
      width:325px;
      height:44px;
      line-height:44px;
      background:rgba(242,242,242,1);
      border-radius:5px;
      font-size: 15px;
      .lable {
        padding: 0 10px;
      }
      .lableright{
        float: right;
        margin: 10px;
        padding-left: 10px;
        line-height: normal;
        &.van-hairline--left:after{
          border-color:#ccc;
        }
      }
      .num {
        padding-right: 2px;
        border-right: 2px solid #EA6F5F;
      }
    }
    .tips {
      padding: 10px 0;
      text-align: right;
      font-size: 12px;
    }
    .btn {
      color: #fff;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      margin-bottom: 10px;
      width:325px;
      height:44px;
      background:linear-gradient(90deg,rgba(245,109,104,1) 0%,rgba(240,125,110,1) 100%);
      border-radius:22px;
    }
    .keyWrap {
      height: 250px;
    }
    .keyWrap /deep/ .van-key {
      height: 60px;
      line-height: 60px;
      font-size: 24px;
    }
    .keyWrap /deep/ .van-key--delete {
      font-size: 16px;
    }
  }
}
</style>
