<template>
  <section id="cdk">
    <backbar title="兑换"
             @setHeight="setHeight" />
    <div class="cdkWrpa"
         ref="cdkWrpa">
      <div class="head">

      </div>
      <div class="inp">
        <van-field v-model="cdk"
                   placeholder="请输入兑换码" />
      </div>
      <div class="btn fw500 f18 tac cf"
           @click="beforeSubmit"
           :class="{'active':btnActive}">立即兑换</div>
      <div class="rule pr">
        <p>1.输入您的兑换码，点击“立即兑换”使用；</p>
        <p>2.每个兑换码仅可使用一次；</p>
        <p>3.实物兑换码，同一手机、同一ip、同一收货地址仅可以兑换一份；</p>
        <p>4.使用中遇到问题，请联系在线客服，或致电客服400-839-8090。</p>

        <div class="title pa">规则: </div>
      </div>
    </div>
    <van-popup v-model="show"
               get-container="#cdk">
      <div class="pop pr"
           v-if="datas&&datas">
        <p class="tac f30 fw500"
           style="color:#E90011;">兑换成功！</p>
        <p class="tac f18 fw400 text"
           style="color:#2E2E2E;"
           v-if="datas.type===0">恭喜您获得一张优惠券</p>
        <p class="tac f18 fw400 text"
           style="color:#2E2E2E;"
           v-if="datas.type===2">恭喜您获得{{datas.product.productName}}{{datas.product.productTitle}}</p>
        <img v-if="datas.type===0"
             :src="require('~/assets/img/activity/cdk/coupons@2x.png')"
             alt=""
             width="100%"
             style="max-height:118px;">
        <img v-if="datas.type===2"
             :src="datas.product.productImage"
             alt=""
             width="100%"
             style="max-height:118px;object-fit: contain;">
        <div class="popbtn"
             :class="datas.type===0?'use':'get'"
             @click="jump"></div>
        <div class="close pa"
             @click="show=false"></div>
      </div>
    </van-popup>
  </section>
</template>

<script>
import backbar from '~/components/backbar'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { mapGetters, mapActions } from 'vuex'
import { getcdk } from '@/api/activity'
import { setStore } from '~/utils/tool'
import { wxreURL, wxreFunPay } from '~/config/constant'
export default {
  data () {
    return {
      cdk: '',
      show: false,
      datas: {},
      btnActive: false
    }
  },
  mounted () {
    this.cdk = sessionStorage.getItem('cdk')
  },
  watch: {

  },
  methods: {

    setHeight (res) {
      this.$refs.cdkWrpa.style.paddingTop = `${(res + 44) / 37.5}rem`
    },
    submit (userId) {
      window.scrollTo(0, 0)
      this.btnActive = true
      sessionStorage.removeItem('cdk')
      this.$axios.$post(getcdk, { userId: userId, keyId: this.cdk }).then(res => {
        if (res.code === 10000) { // type 0 优惠券  2 商品
          this.show = true
          this.datas = res.data
          this.btnActive = false
        }
      }).catch(err => {
        this.btnActive = false
        console.log(err)
      })
    },
    beforeSubmit () {
      window.scrollTo(0, 0)
      if (this.btnActive) {
        return
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              this.submit(userId)
            } else {
              if (this.cdk) sessionStorage.setItem('cdk', this.cdk)
              window.callback(ios => {
                ios.callHandler('goLogin', null, res => {
                  this.$toast('去登录')
                })
              })
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          this.submit(userId)
        } else {
          if (this.cdk) sessionStorage.setItem('cdk', this.cdk)
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.submit(this.user.userId)
        } else {
          if (this.cdk) sessionStorage.setItem('cdk', this.cdk)
          setStore('__redirectUrl__', this.$route.fullPath)
          // 微信中  先保存当前url  然后进行重定向获取code  提交code   获取到用户信息 后会跳转到之前保存的url中
          if (WX) {
            window.location.replace(wxreURL)
          } else {
            this.$router.push('/login')
          }
        }
      }
    },
    jump () { // 0 优惠券  2 商品
      if (this.datas.type === 0) {
        this.$router.replace('/activity/welfare')
      } else if (this.datas.type === 2) {
        const sendAPP = {
          productName: this.datas.product.productName,
          productImage: this.datas.product.productImage,
          productId: this.datas.product.productId,
          productCount: 1,
          attrId: this.datas.product.attrId,
          productPrice: this.datas.product.productPrice,
          unitPrice: this.datas.product.productPrice
        }
        if (IOS) {
          window.callback(ios => {
            ios.callHandler('goConfirmPay', JSON.stringify(sendAPP), res => {
            })
          })
        } else if (ANDROID) {
          const sendIAND = {
            productName: this.datas.product.productName,
            productImage: this.datas.product.productImage,
            productId: this.datas.product.productId,
            num: 1,
            attrId: this.datas.product.attrId,
            productPrice: this.datas.product.productPrice,
            unitPrice: this.datas.product.productPrice
          }
          window.android.goPay(JSON.stringify(sendIAND))
        } else {
          const orderData = []
          orderData.push(sendAPP)
          sessionStorage.setItem('__teaOrder__', JSON.stringify(orderData))
          sessionStorage.setItem('__teapayType__', 'detail')
          if (WX) {
            window.location.href = `${wxreFunPay}`
          } else {
            this.$router.replace('/pay/sure')
          }
        }
      }
    },
    ...mapActions(['saveLogin'])
  },
  computed: {
    ...mapGetters(['user'])
  },
  components: {
    backbar
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
#cdk {
  background: #ffd4be;
  min-height: 100%;
}
.cdkWrpa {
  padding-top: 46px;
  .head {
    width: 100%;
    height: 255px;
    @include bg-image('activity/cdk/head');
  }
  .inp {
    width: 275px;
    height: 55px;
    margin: 20px auto;
    @include bg-image('activity/cdk/inp');
    /deep/ .van-cell {
      background: transparent;
      height: 100%;
    }
    /deep/ .van-field__control {
      text-align: center;
    }
    /deep/ .van-field__body {
      height: 100%;
    }
  }
  .btn {
    width: 270px;
    height: 50px;
    line-height: 50px;
    margin: 13px auto 40px;
    @include bg-image('activity/cdk/btn');
    &.active {
      @include bg-image('activity/cdk/active');
    }
  }
  .rule {
    width: 347px;
    // height: 147px;
    margin: 0 auto;
    border: 1px solid rgba(141, 105, 87, 1);
    border-radius: 5px;
    padding: 22px 10px 12px;
    box-sizing: border-box;
    color: #8d6957;
    .title {
      top: -10px;
      left: 5px;
      width: 43px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background: #ffd4be;
    }
  }
}

.pop {
  // width: 300px;
  // height: 320px;
  padding: 28px;
  .popbtn {
    width: 245px;
    height: 48px;
    margin-top: 20px;
    &.get {
      @include bg-image('activity/cdk/get');
    }
    &.use {
      @include bg-image('activity/cdk/shiyong');
    }
  }
  .text {
    margin: 10px 0;
    @include text-over(2);
  }
  .coupon {
    width: 240px;
    height: 107px;
    @include bg-image('activity/cdk/coupon');
  }
  .close {
    width: 28px;
    height: 28px;
    @include bg-image('activity/cdk/close');
    top: -55px;
    right: 0px;
  }
}
/deep/ .van-popup--center {
  border-radius: 8px;
}
/deep/ .van-popup {
  overflow-y: visible;
}
</style>
