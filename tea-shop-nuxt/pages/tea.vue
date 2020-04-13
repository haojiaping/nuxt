<template>
   <section>
   </section>
</template>

<script>
import { URL } from '~/config/constant.js'
import { isIOS } from '~/environment/esm'
export default {
  data() {
    return {

    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 100)
  },
  watch: {

  },
  methods: {
    init() {
      console.log(location.search)
      let jumpUrl = ''
      if (location.search) {
        const args = location.search.split('?')[1].split('=')
        console.log(args)
        if (args[0] === 'd') {
          jumpUrl = `/order/detail?productOrderId=${args[1]}`
        } else if (args[0] === 'v') {
          jumpUrl = '/activity/teavip'
        } else {
          jumpUrl = ''
        }
      }
      try {
        if (isIOS) {
          const a = document.createElement('a')
          a.setAttribute('href', `https://www.chazhenxuan.com/downapp.html?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${jumpUrl}` })}`)
          a.setAttribute('id', 'startTelMedicine')
          // 防止反复添加
          if (document.getElementById('startTelMedicine')) {
            document.body.removeChild(document.getElementById('startTelMedicine'))
          }
          document.body.appendChild(a)
          a.click()
        } else {
          window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${jumpUrl}` })}`
          setTimeout(() => {
            window.location.href = 'https://www.chazhenxuan.com/downapp.html'
          }, 300)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>

</style>
