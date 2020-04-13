<template>
   <section class="downBtnWrap pf" @click="jumpToAPP" v-if="downBtn"></section>
</template>

<script>
import { IOS, ANDROID, WX } from '~/environment/esm'
import { JUMPTOAPPURL } from '~/config/downapp'
export default {
  name: 'jump',
  data() {
    return {
      downBtn: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.downBtn = !(IOS || ANDROID)
    }, 500)
  },
  props: {
    jumpOption: {
      type: String,
      default: ''
    }
  },
  watch: {

  },
  methods: {
    jumpToAPP() {
      window.location.href = `${JUMPTOAPPURL}${this.jumpOption}`
      // window.location.href = 'https://www.chazhenxuan.com/downapp.html'
      // if (WX) {
      //   // window.location.href = TXAppStore
      //   window.location.href = 'https://www.chazhenxuan.com/downapp.html'
      // } else {
      //   this.$router.push('/about/downapp')
      // }
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 20%;
    transform: translateY(-50%);
    z-index: 999;
  }
</style>
