<template>
   <section>
     <van-popup v-model="show">
       <div class="popContent">
         <div class="close" @click="show=false" :class="`close-${bgImage}`"></div>
         <div class="imgcounp pr" :class="bgImage" @click="popClick">
           <div class="pa btn" @click="jump" v-if="btnShow"></div>
         </div>
       </div>
     </van-popup>
   </section>
</template>

<script>
export default {
  name: 'pop',
  data() {
    return {
      show: false
    }
  },
  props: {

    bgImage: {
      type: String,
      default: 'imgcounp'
    },
    btnShow: {
      type: Boolean,
      default: true
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    jump() {
      this.$router.push('/activity/teavip')
    },
    popClick() {
      this.$emit('popClick')
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.popContent{
  .close{
    width: 22px;
    height: 22px;
    @include bg-image('pay/closed');
    margin-left: auto;
  }
  .imgcounp{
    width: 310px;
    height: 370px;
    @include bg-image('pay/pop');
    .btn{
      // background:#ccc;
      width: 310px;
      height: 100px;
      bottom: 0;
    }
  }
  .close-newreg{
    width: 24px;
    height: 24px;
    @include bg-image('common/close-round');
    margin:0 39px 0 auto;
  }
  .newreg{
    width: 375px;
    height: 294px;
    @include bg-image('common/newreg');
    // .btn{
    //   // background:#ccc;
    //   width: 310px;
    //   height: 100px;
    //   bottom: 0;
    // }
  }
}
  /deep/ .van-popup{
    background-color: transparent;
  }
</style>
