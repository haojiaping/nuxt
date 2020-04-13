<template>
   <div>
     <backbar title="提现"></backbar>
     <div class="sub pf">
       <p class="f18 headertext fw400">可提现余额</p>
       <div class="header">
         <span class="f50 fw600 price">0.00</span>
         <span class="f24 fw400">元</span>
       </div>
       <div class="btnWraper">
        <!-- <div class="btn f18 cash van-hairline--surround">我要提现</div> -->
        <div class="btn f18 flow van-hairline--surround" @click="$toast('正在开发中...')">查看明细</div>
       </div>
       <div class="footer pa">
         <p class="f15 fw400 title">温馨提示</p>
         <p class="f12 fw400 content">用户确认收货的订单才会收到佣金，每个月20号佣金发放到您提供的银行卡账户上。</p>
       </div>
     </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
export default {
  name: 'tocash',
  data() {
    return {

    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  },
  components: {
    backbar
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.sub {
  padding-top: 44px;
  background: #fff;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .headertext {
    padding: 50px 24px;
    text-align: center;
  }
  .header {
    text-align: center;
    padding-bottom: 50px;
    padding-left: 20px;
    .price {
      margin-right: 10px;
      color: #DB4325;
    }
  }
  .btnWraper {
    .btn {
      width: 270px;
      height: 44px;
      line-height: 44px;
      margin: 20px auto;
      text-align: center;
      &.cash {
        color: #fff;
        background-color: #D45949;
        /deep/ &.van-hairline--surround::after {
          border-color: #D45949;
        }
      }
      &.flow {
        color: #333;
        background-color: #fff;
        /deep/ &.van-hairline--surround::after {
          border-color: #ccc;
        }
      }
    }
  }
  .footer {
    left: 55px;
    right: 55px;
    bottom: 40px;
    .title {
      text-align: center;
      margin-bottom: 10px;
    }
    .content {
      text-align: center;
      color: #999;
    }
  }
}
</style>
