<template>
  <div class="wrapper">
    <div class="subWrap">
      <div class='listWrap'>
        <div class='top'>
          <img src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/11/d8bcec6d-9126-4cac-b7fd-698338c86958.jpg"
               class='bg' mode="widthFix">
          <img src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/11/696f1ebd-8621-42b7-b62e-0e6c9b070748.jpg"
               @click="showCoupon"
               class='content' mode="widthFix">
        </div>
        <div class='bottom'>
          <van-divider contentPosition="center" customStyle="color:#C36825; border-color:#C36825; padding:0.4rem 1.6rem;"
                       class='title'>
            活动规则
          </van-divider>
          <ul class='wraning-text'>
            <li>1、本专区内优惠券每个用户ID每天可领取1次，每次可领取1张，每张优惠券有效期为1个自然日，领取当日23:59:59优惠券过期。</li>
            <li>2、优惠券每日限量发放300张，领完即止。</li>
            <li>3、本专区内领取的优惠券适用于全场商品。</li>
            <li>4、一个用户一天仅能领取一张优惠券。每笔订单结算时仅可使用一张优惠券。</li>
            <li>5、优惠券为0-100元随机金额，以实际领取到金额为准。</li>
            <li>6、如使用优惠券支付，产生退款的订单，仅退回实际支付金额，优惠券不予退回。</li>
            <li class='last-text'>
              7、特别约定：同一收货地址、同一收货人、同一手机号视为同一用户，同一用户重复领券下单视为恶意刷单，平台有权拒绝发货，退回实际付款并封停用户账户，用户在本页面领取优惠券视为认同此约定。
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-popup :show="showWindow" custom-style="background-color:transparent;">
      <div class='my-container'>
        <img src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/11/e43ddd98-5aa2-46db-a90d-7bd1e8e65361.jpg"
             @click="exit"
             style="width:24px;height:24px;"
             mode="widthFix"
             class='exit'>
        <img src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/11/cf9cb52a-f396-45c1-bbb5-ec74257833a1.jpg"
             mode="widthFix"
             @click="jump"
             style="width:330px;height:350px;"
             class='content'>
        <p class='number'>{{maney}}元</p>
        <p class='text'>优惠券</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { CouponSave } from '@/api/activity'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showWindow: false,
      maney: '',
      checkClick: true,
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/opera/vouchers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      }
    }
  },
  watch: {

  },
  mounted () {
  },
  methods: {
    showCoupon () {
      if (this.checkClick) {
         if (this.hasLogin) {
            const params = {
              userId: this.user.userId
            }
            this.getmoney(params)
          } else {
            // 如果没有登录保存当前页面拉取授权后再返回当前页面
            
          }
      }
    },
    getmoney (params) {
      this.checkClick = false
      CouponSave(params).then((res) => {
        if (res.code === 10000) {
          setTimeout(() => {
            this.checkClick = true
          }, 100)
          if (res.data !== '已经领取过') {
            this.maney = res.data
            this.showWindow = true
          } else {
            uni.showToast({
                icon:'none',
                title: '您已经领取过了',
                duration: 1500
            });
          }
        }
      })
    },
    exit () {
      this.showWindow = false
    },
    jump () {
      this.showWindow = false
       uni.navigateBack({})
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['user','hasLogin'])
  }
}
</script>

<style scoped lang='scss'>
.wrapper {
  .subWrap {
    .listWrap {
      background: #ffcc83;
      padding-bottom: 50px;
      width: 100%;
      .top {
        width: 100%;
        position: relative;
        .bg {
          width: 100%;
        }
        .content {
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
      .bottom {
        width: 340px;
        background: #fcd9a3;
        border-radius: 5px;
        margin: 0 auto;
        /deep/ .van-divider--content-center::before,
        .van-divider--content-left::before,
        .van-divider--content-right::before {
          margin-right: 20px !important;
        }
        /deep/ .van-divider--content-center::after,
        .van-divider--content-left::after,
        .van-divider--content-right::after {
          margin-left: 20px !important;
        }
        /deep/ .van-divider {
          margin: 0;
        }
        .title {
          font-weight: 600;
          height: 17px;
          font-size: 18px;
        }
        .wraning-text {
          padding: 0 20px;
          li {
            font-size: 15px;
            list-style: none;
            padding-bottom: 20px;
            color: #c45616;
            line-height: 18px;
          }
          .last-text {
            color: #eb582b;
          }
        }
      }
    }
  }
  .van-popup {
    background: transparent;
    width: 100%;
  }
  .my-container {
    background: transparent;
    position: relative;
    width: 100%;
    .content {
      width: 100%;
    }
    .exit {
      position: absolute;
      top: 25px;
      right: 5px;
      width: 24px;
    }
    .number {
      position: absolute;
      top: 188px;
      left: 0;
      right: 0;
      margin: auto;
      text-align: center;
      height: 50px;
      font-size: 45px;
      font-weight: 600;
      color: #f33947;
    }
    .text {
      position: absolute;
      top: 245px;
      left: 0;
      right: 0;
      margin: auto;
      font-size: 18px;
      color: #c95e0a;
      width: 60px;
      font-weight: 600;
    }
  }
}
</style>
