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
     <div class="right df " :class="styleBgColor">
       <!-- <div class="tagblack pa" v-if="datas.couponFlag===1"></div>
       <div class="tagred pa" v-else-if="datas.couponFlag===3"></div>
       <div class="active pa" v-if="selectStatus"></div> -->
     </div>
   </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  props: {
    datas: {
      type: Object
    }
  },
  onLoad() {

  },
  methods: {

  },
  components: {

  },
  computed: {
    styleBgColor() {
      if (this.datas.couponFlag === 0) {
        return 'use'
      } else if (this.datas.couponFlag === 2) {
        return 'old'
      } else if (this.datas.couponFlag === 1){
        return 'ed'
      } else if (this.datas.couponFlag === 3){
        return 'wait'
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.couponItemWraper {
  margin: 5px 10px;
  .left {
    width: 530upx;
    height: 90px;
    background-size: cover;
    align-items: center;
    @include bg-image('coupon/leftbg');
    .left-text{
      padding-left:20px;
    }
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
    &.use {
      @include bg-image('coupon/use');
    }
    &.wait {
      @include bg-image('coupon/wait');
    }
    &.old {
      @include bg-image('coupon/old');
    }
    &.ed {
      @include bg-image('coupon/ed');
    }
    .tips{
      padding: 5px;
    }
  }
}
</style>
