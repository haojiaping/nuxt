<template>
   <div class="couponItemWraper df">
     <div class="left df" :class="styleBgColor">
       <view class="left-text">
        <p class="top"><span class="f18">¥</span><span class="f33">{{datas.discountAmount}}</span></p>
        <p class="bottom f10">满{{datas.favourableCondition}}可用</p>
       </view>
       <view class="line"></view>
       <div class="text">
         <p class="f15 fw400">{{datas.couponContent}}</p>
         <p class="f12 fw400">{{datas.deadline}}</p>
       </div>
     </div>
     <div class="right df">
       <p v-if="type===1" class="tips f10 c9">购买的商品不满足优惠券使用条件</p>
       <!-- <div class="tagblack pa" v-if="datas.couponFlag===1"></div>
       <div class="tagred pa" v-else-if="datas.couponFlag===3"></div>
       <div class="active pa" v-if="selectStatus"></div> -->
        <van-checkbox v-if="type===0" :value="selectStatus" checked-color="#f2766b" icon-size="18"></van-checkbox>
     </div>
   </div>
</template>

<script>
export default {
  name: 'couponItem',
  data() {
    return {

    }
  },
  props: {
    datas: {
      type: Object
    },
    select: {
      type: String
    },
    typeColor: {
      type: String
    },
    type:{
      type:Number,
      default:0
    }
  },
  computed: {
    styleBgColor() {
      if (this.typeColor === 'black') {
        return 'black'
      } else {
        if (this.datas.couponFlag === 3 || this.datas.couponFlag === 1) {
          return 'black'
        } else if (this.datas.couponFlag === 2) {
          return 'blackover'
        } else {
          return 'red'
        }
      }
    },
    selectStatus() {
      if (this.select === this.datas.couponUserId) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.couponItemWraper {
  margin: 10px;
  .left {
    width: 530upx;
    height: 90px;
    background-size: cover;
    align-items: center;
    @include bg-image('coupon/leftbg');
    .left-text{
      padding-left:20px;
    }
    // &.red {
    //   @include bg-image('coupon/red');
    // }
    // &.black {
    //   @include bg-image('coupon/black');
    // }
    // &.blackover {
    //   @include bg-image('coupon/blackover');
    // }
      .top {
        color: #FF7A76;
        text-align: center;
      }
      .bottom {
        color: #333333;
        opacity: 0.75;
        text-align: center;
      }
    .line{
      width: 1px;
      height: 54px;
      @include bg-image('coupon/line');
      margin: 0 8px 0 10px;
    }
    .text {
      flex: 1;
      p {
        text-align: center;
        &:first-child {
          color: #333;
          margin-bottom: 15px;
        }
        &:last-child {
          color: #666;
        }
      }
    }
  }
  .right {
    flex: 1;
    align-items: center;
    justify-content: center;
    @include bg-image('coupon/right');
    .small {
      width: 15px;
      height: 100px;
      background-size: cover;
      // @include bg-image('coupon/small');
    }
    .tagred {
      right: 0;
      bottom: 0;
      width: 65px;
      height: 65px;
      background-size: cover;
      // @include bg-image('coupon/tagred');
    }
    .tagblack {
      right: 0;
      bottom: 0;
      width: 65px;
      height: 65px;
      background-size: cover;
      // @include bg-image('coupon/tagblack');
    }
    .active {
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background-size: cover;
      // @include bg-image('coupon/select');
    }
    .tips{
      padding: 5px;
    }
  }
}
</style>
