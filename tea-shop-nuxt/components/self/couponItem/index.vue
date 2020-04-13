<template>
   <div class="couponItemWraper df">
     <div class="left" :class="styleBgColor">
       <p class="top"><span class="f24">¥</span><span class="f40">{{datas.discountAmount}}</span></p>
       <p class="bottom">/满{{datas.favourableCondition}}可用/</p>
     </div>
     <div class="right df pr">
       <div class="small"></div>
       <div class="text">
         <p class="f15 fw400">{{datas.couponContent}}</p>
         <p class="f12 fw400">{{datas.deadline}}</p>
       </div>
       <div class="tagblack pa" v-if="datas.couponFlag===1"></div>
       <div class="tagred pa" v-else-if="datas.couponFlag===3"></div>
       <div class="active pa" v-if="selectStatus"></div>
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
@import '~assets/css/variable.scss';
.couponItemWraper {
  margin: 10px;
  .left {
    width: 130px;
    height: 100px;
    background-size: cover;
    &.red {
      @include bg-image('coupon/red');
    }
    &.black {
      @include bg-image('coupon/black');
    }
    &.blackover {
      @include bg-image('coupon/blackover');
    }
    p {
      text-align: center;
      &.top {
        padding-top: 15px;
        color: #fff;
      }
      &.bottom {
        color: #fff;
        opacity: 0.75;
      }
    }
  }
  .right {
    flex: 1;
    .small {
      width: 15px;
      height: 100px;
      background-size: cover;
      @include bg-image('coupon/small');
    }
    .text {
      flex: 1;
      padding: 30px 0 25px;
      background-color: #fff;
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
    .tagred {
      right: 0;
      bottom: 0;
      width: 65px;
      height: 65px;
      background-size: cover;
      @include bg-image('coupon/tagred');
    }
    .tagblack {
      right: 0;
      bottom: 0;
      width: 65px;
      height: 65px;
      background-size: cover;
      @include bg-image('coupon/tagblack');
    }
    .active {
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background-size: cover;
      @include bg-image('coupon/select');
    }
  }
}
</style>
