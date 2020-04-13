<template>
  <div class="bind-wrap">
    <backbar bgColor="transparent"
             rightIconColor='#fff'
             rightIcon='share'
             :shartOption="shartOption"
             leftColor='#fff'></backbar>
    <div class="mescroll subWrap pf inp-wrap"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class="top-img">
            <img :src="require('~/assets/img/activity/newkezhuce/icon12@2x.png')"
                 alt="">
          </div>
          <div class='center'>
            <div class="input">
              <input type="tel"
                     placeholder="请输入手机号"
                     @blur="inputBlur"
                     v-model="mobile">
            </div>
            <div class="code">
              <input type="tel"
                     placeholder="请输入验证码"
                     @blur="inputBlur"
                     v-model="code">
              <div class="codebtn"
                   @click="getcode"
                   v-if="!codeInp">
                <span>获取验证码</span>
              </div>
              <div class="codebtn"
                   v-if="codeInp">
                <span>{{down}}s</span>
              </div>
            </div>
            <div @click="sure"
                 class="btnWrap f18 cf tac">
              <!-- <van-button type="danger" size="large" style="background-color:#D45949">登录</van-button> -->
              马上领取
            </div>
          </div>
          <div class="top-img">
            <img :src="require('~/assets/img/activity/newkezhuce/icon3@2x.png')"
                 alt="">
          </div>
          <van-divider :style="{ color: '#fff', borderColor: '#fff', padding: '0 10px' }">
            使用说明
          </van-divider>
          <div class='guize'>
            <p>
              1、新人活动时间：2019年9.20-2019.10.31，优惠券有效期为2019年9.20-2019.10.31
            </p>
            <p>
              2、活动期间，新用户(无历史付款成功的用户)可登陆此页面领取优惠券，优惠券每日限量1000张，领完即止。
            </p>
            <p>
              3、新人100元优惠券仅限购买活动专区内商品使用，专区外其他商品不适用，结算时选择 新人100元优惠券，即可使用。
            </p>
            <p>
              4、一个新用户仅能领取一张优惠券，购买本专区商品仅限使用一张优惠券。
            </p>
            <p>
              5、优惠券一经使用不予退回。
            </p>
            <p> 6、如使用优惠券支付，产生退款的订单。金额按比例分摊，退款金额不超过支付金额。
            </p>
            <p> 7、特别约定:同一收货地址、同一收货人、同一手机号下单满足以上任条件，视为同一用户， 同一用户重复领券下单视为恶意刷单。平台有权拒绝发货，退回实际付款并封停用户账户，用户在本页面领取优惠券视为认同此约定。</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model="showWindow"
               :get-container="getContainer">
      <div class='my-container'>
        <img :src="require('~/assets/img/activity/newkezhuce/exit@2x.png')"
             alt=""
             @click="exit"
             class='exit'>
        <p class='number'>领取成功!</p>
        <div class='window-img'>
          <img :src="require('~/assets/img/activity/newkezhuce/quan1@2x.png')"
               alt="">
          <img :src="require('~/assets/img/activity/newkezhuce/quan@2x.png')"
               alt=""
               @click="jump"
               class='jump'>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import { mobileReg } from '~/utils/validate'
import { getCheckCode, collCheckCode } from '~/api/login'
import { mapGetters, mapActions } from 'vuex'
import { URL } from '~/config/constant.js'
// import { getStore } from '~/utils/tool'
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
      loadshow: false,
      showWindow: false,
      shartOption: {
        type: 'url',
        data: {
          title: '你有100元现金红包，点击领取！', // 分享标题
          desc: '在这买茶太便宜啦！买什么都能省100元，我买了，你也来试试吧。', // 分享描述
          link: `${URL}/activity/newkezhuce`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/4/9df1b166-f0cc-4af3-8d9e-a82886cbad9b.jpg'
        }
      }
    }
  },
  methods: {
    getContainer () {
      return document.querySelector('.bind-wrap')
    },
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
        specialType: 42,
        shopId: this.$route.query.shopId
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
          if (res.data.cpsFlag) {
            this.showWindow = true
          } else {
            this.$toast('您已经是老用户了')
          }

          // const redirectURL = getStore('__redirectUrl__') || '/self'
          // this.$router.push('/activity/newkepro')
        } else {
          this.$toast(res.message)
        }
      })
    },
    exit () {
      this.showWindow = false
    },
    jump () {
      this.$router.push({
        path: '/activity/welfare',
        query: {
          shopId: this.$route.query.shopId
        }
      })
    }
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
  background: url('~assets/img/activity/newkezhuce/bg@2x.png') repeat;
  background-size: 100% auto;
  .top-img {
    img {
      width: 100%;
    }
  }
  .inp-wrap {
    width: 100%;
    font-size: 0;
    .center {
      @include bg-image-size('activity/newkezhuce/icon2');
      background-size: 100% 100%;
      margin: 0;
      .input {
        width: 270px;
        height: 43px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        font-size: 15px;
        border-radius: 2px;
        margin-bottom: 5px;
        input {
          width: 100%;
          background: none;
          border: 0px;
          height: 43px;
          padding-left: 10px;
        }
        input::placeholder {
          color: #999999;
          font-size: 15px;
        }
      }
      .code {
        width: 270px;
        margin: 0 auto;
        display: flex;
        height: 43px;
        justify-content: center;
        align-items: center;
        background: #fff;
        font-size: 15px;
        border-radius: 2px;
        input {
          width: 60%;
          background: none;
          border: 0px;
          padding-left: 10px;
        }
        input::placeholder {
          color: #999999;
          font-size: 15px;
        }
        .codebtn {
          font-size: 13px;
          box-sizing: border-box;
          text-align: center;
          width: 100px;
          height: 43px;
          background: rgba(255, 184, 30, 1);
          border-radius: 0px 2px 2px 0px;
          line-height: 43px;
          color: #fff;
        }
        .border:before {
          border-color: #999;
        }
      }
    }
    .guize {
      margin: 0 10px;
      border-top: none;
      padding: 0 10px;
      padding-top: 20px;
      margin-top: -27.5px;
      position: relative;
      padding-bottom: 10px;
      margin-bottom: 40px;
      &::after {
        content: '';
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #fff;
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);
        -webkit-transform-origin: top left;
        border-top: none;
      }
      p {
        font-size: 13px;
        color: #fff;
        line-height: 18px;
        margin-bottom: 10px;
        // opacity: 0.8;
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
    margin: 0 auto;
    width: 270px;
    height: 43px;
    margin-top: 23px;
    background: linear-gradient(
      0deg,
      rgba(255, 150, 0, 1),
      rgba(255, 197, 42, 1)
    );
    line-height: 43px;
    text-align: center;
    box-shadow: 0px 4px 5px 0px rgba(169, 6, 5, 1);
    border-radius: 2px;
    font-size: 17px;
    /deep/ .van-button--danger {
      border: none;
      border-radius: 0;
    }
  }
  .van-popup {
    background: transparent;
    width: 300px;
    position: relative;
    height: 366px;
  }
  .exit {
    position: absolute;
    bottom: -66px;
    right: 0;
    left: 0;
    margin: auto;
    width: 39px;
  }
  .my-container {
    background: #b21500;
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 8px;
    .number {
      position: absolute;
      top: 36px;
      left: 0;
      right: 0;
      margin: auto;
      text-align: center;
      height: 29px;
      font-size: 30px;
      font-weight: 500;
      color: rgba(255, 246, 237, 1);
    }
    .window-img {
      width: 240px;
      margin: auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 91px;
      img {
        width: 100%;
      }
      .jump {
        margin-top: 19px;
      }
    }
  }
}
</style>
