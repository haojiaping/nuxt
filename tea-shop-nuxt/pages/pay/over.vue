<template>
<client-only>
  <div class="payover-wrap">
    <backbar title="支付结果" />
    <div class="sub">
      <div class="header"
           v-if="time===0">
        <i class="icon ok"
           v-if="Paystate===0"></i>
        <i class="icon fail"
           v-else-if="Paystate===1"></i>
        <i class="icon close"
           v-else-if="Paystate===2"></i>
        <p class="text">{{Paystate|settext}}</p>
        <p class="money">&yen; {{price}}</p>
      </div>
      <div class="header"
           v-else>
        <i class="icon">
          <van-loading vertical
                       color="#1989fa"
                       size="1.3rem" />
        </i>
        <p class="text">正在获取支付状态</p>
        <div class="money">{{time}}s</div>
        <!-- <van-loading size="1.3rem" vertical text-size="0.42rem">正在获取支付状态{{time}}</van-loading> -->
      </div>
      <div class="btn-wrap">
        <div class="button black cf f16"
             @click="jump">查看订单</div>
        <div class="button white f16"
             @click="toIndex">返回首页</div>
      </div>
      <div class="tips">
        <div class="tiptop df"
             @click="down">
          <img class="tipsleft"
               :src="require('~/assets/img/pay/down@2x.gif')"
               alt="">
          <div class="tipsright">
            <p>点击<span class="urlcolor">m.chazhenxuan.com</span>下载app</p>
            <p>查看物流变化,更有免费试饮装等你来拿</p>
          </div>
        </div>

        <p class="tipbottom tac">客服微信chazhenxuan888</p>
      </div>
    </div>
    <div class="wxtip"
         v-show="wxtipShow"
         @click="wxtipShow = false">
      <span class="wxtip-icon"></span>
      <p class="wxtip-txt">点击右上角
        <br />选择在浏览器中打开</p>
    </div>
    <div class="fixedpop pf" @click="showPop" v-if="fixedPopShow">
      <img :src="require('~/assets/img/pay/fixed.gif')" width="100%">
    </div>
    <pop ref="popRef"></pop>
  </div>
  </client-only>
</template>

<script>
import backbar from '~/components/backbar'
import { getPaystate } from '~/api/weixin'
import { getStore } from '~/utils/tool'
// import { URL } from '~/config/constant.js'
import { WX } from '~/environment/esm'
// import { JUMPTOAPPURL } from '~/config/downapp'
import pop from '~/components/pay/pop'
export default {
  data () {
    return {
      price: '',
      productOrderId: '',
      Paystate: '',
      wxtipShow: false,
      time: 3,
      timer: null,
      fixedPopShow: false
    }
  },
  mounted () {
    const detail = JSON.parse(getStore('_productDetail_'))
    this.productOrderId = this.$route.query.productOrderId ? this.$route.query.productOrderId : detail.productOrderId
    this.price = this.$route.query.price ? this.$route.query.price : detail.price

    this.timer = setInterval(() => {
      this.time--
      if (this.time <= 0) {
        this.getState()
        clearInterval(this.timer)
      }
    }, 1000)
  },
  methods: {
    getState () {
      this.$axios.$post(getPaystate, { productOrderId: this.productOrderId }).then(res => {
        if (res.code === 10000) {
          if (res.data) {
            this.Paystate = 0
            // this.$refs.popRef.show = true
            if (res.flag) {
              this.fixedPopShow = true
            }
          } else {
            this.Paystate = 1
          }
        }
      })
    },
    showPop() {
      this.$refs.popRef.show = true
    },
    jump () {
      // if (WX) {
      //   window.location.href = JUMPTOAPPURL
      // } else {
      //   this.$router.push({ path: '/order/detail', query: { productOrderId: this.productOrderId } })
      // }
      this.$router.push({ path: '/order/detail', query: { productOrderId: this.productOrderId } })
    },
    toIndex () {
      // if (WX) {
      //   this.wxtipShow = true
      // } else {
      //   window.location.href = 'http://uee.me/aXDFy'
      // }
      // if (this.time > 0) {
      //   return
      // }
      this.$router.replace({ path: '/' })
    },
    down () {
      if (WX) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.aiso.tea'
      } else {
        // http://uee.me/aXDFy
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.aiso.tea'
      }
    }
  },
  filters: {
    settext (e) {
      switch (e) {
        case 0:
          return '订单支付成功'
        case 1:
          return '订单支付失败'
        case 2:
          return '订单取消'
      }
    }
  },
  components: {
    backbar,
    pop
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.payover-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  background-color: #f2f2f2;
  .sub {
    width: 100%;
    height: 100%;
    padding-top: 44px;
    .header {
      .icon {
        display: block;
        width: 60px;
        height: 60px;
        background-size: cover;
        margin: 50px auto 20px;
        &.ok {
          @include bg-image('pay/ok');
        }
        &.fail {
          @include bg-image('pay/fail');
        }
        &.close {
          @include bg-image('pay/close');
        }
      }
      .text {
        text-align: center;
        margin-bottom: 20px;
        font-size: 18px;
      }
      .money {
        text-align: center;
        color: #d45949;
        font-size: 24px;
      }
    }
    .btn-wrap {
      margin: 50px 0;
      .button {
        width: 270px;
        height: 45px;
        line-height: 45px;
        margin: 25px auto;
        text-align: center;
        &.white {
          border: 1px solid rgba(51, 51, 51, 1);
        }
        &.black {
          background: rgba(51, 51, 51, 1);
        }
      }
    }
    .tips {
      position: fixed;
      left: 0;
      width: 100%;
      bottom: 40px;
      .tiptop {
        justify-content: center;
        align-items: center;

        .tipsleft {
          width: 34px;
          height: 34px;
          margin-right: 8px;
        }
        .urlcolor {
          color: #0066cc;
        }
      }

      .tipbottom {
        margin-top: 20px;
      }
    }
  }

  .wxtip {
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 998;
    cursor: pointer;
  }
  .wxtip-icon {
    width: 100px;
    height: 75px;
    background: url('~assets/img/common/weixin-tip.png') no-repeat;
    background-size: cover;
    display: block;
    position: absolute;
    right: 50px;
    top: 20px;
    transform: rotate(-30deg);
  }
  .wxtip-txt {
    margin-top: 107px;
    color: #fff;
    font-size: 16px;
    line-height: 1.5;
  }
  .fixedpop{
    right: 0;
    bottom: 150px;
    width: 70px;
  }
}
</style>
