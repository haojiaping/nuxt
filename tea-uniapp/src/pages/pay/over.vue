<template>
  <div class="payover-wrap">
    <div class="sub">
      <div class="header"
           v-if="time===0">
        <i class="icon ok"
           v-if="Paystate===0"></i>
        <i class="icon fail"
           v-else-if="Paystate===1"></i>
        <p class="text">{{Paystate|settext}}</p>
        <p class="money">&yen; {{price}}</p>
      </div>
      <div class="header"
           v-else>
        <i class="icon">
          <van-loading vertical
                       color="#1989fa"
                       size="60px" />
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
      <div class="tips f14">
        <div class="tiptop df"
             @click="down">
          <img class="tipsleft"
               src="/static/pay/down@2x.gif"
               alt="">
          <div class="tipsright">
            <p>点击<span class="urlcolor">m.chazhenxuan.com</span>下载app</p>
            <p>查看物流变化,更有免费试饮装等你来拿</p>
          </div>
        </div>

        <p class="tipbottom tac">客服微信chazhenxuan888</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getPaystate } from '@/api/order'
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
  onLoad(option){
    console.log(option);
    let arg = JSON.parse(option.orderInfo)
    this.price = arg.price
    this.productOrderId = arg.productOrderId
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
      getPaystate({ productOrderId: this.productOrderId }).then(res => {
        if (res.code === 10000) {
          if (res.data) {
            this.Paystate = 0
            // this.$refs.popRef.show = true
            if (res.flag) {
              this.fixedPopShow = true
            }
            let title = ''
            if (Paystate===0) {
              title = '支付成功'
            } else if(Paystate===1){
              title = '支付失败'
            } else {
              title = '支付取消'
            }
            uni.setNavigationBarTitle({
                title: this.categoryName
            });
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
      uni.redirectTo({
        url: `/pages/order/detail?productOrderId=${this.productOrderId}`
      });
    },
    toIndex () {
      uni.switchTab({
          url: '/pages/index/index'
      });
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
  }
}
</script>

<style lang="scss" scoped>
.payover-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  background-color: #f2f2f2;
  /deep/ .van-loading__spinner--circular {
    border-width: 3px;
  }
  .sub {
    width: 100%;
    height: 100%;
    padding-top: 44px;
    .header {
      min-height: 300upx;
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
        border-radius:22px;
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
}
</style>
