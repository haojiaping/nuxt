<template>
   <section>
     <van-button type="primary" @click="jump">主要按钮</van-button>
   </section>
</template>

<script>
import { isAND, isIOS } from '~/environment/esm'
export default {
  data() {
    return {

    }
  },
  mounted() {
    // this.jump()
    setTimeout(() => {
      window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: 'https://www.baidu.com' })}`
    }, 20)
  },
  watch: {

  },
  methods: {
    jump() {
      window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: 'https://www.baidu.com' })}`
      // if (isIOS) {
      //   console.log('isIOS')
      //   window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: 'https://www.baidu.com' })}`
      // } else if (isAND) {
      //   console.log('isAND')
      // }
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>

</style>
