<template>
   <div>

   </div>
</template>

<script>
import { getwxLgin } from '~/api/weixin'
import { mapActions } from 'vuex'
import { getStore, removeStore } from '~/utils/tool'
import { URL } from '~/config/constant'
export default {
  name: 'wxpage',
  data() {
    return {

    }
  },
  mounted() {
    this.wxInit()
  },
  watch: {

  },
  methods: {
    wxInit() {
      const code = this.GetQueryString('code')
      if (code) {
        const option = {
          code: code,
          platform: 'h5',
          way: 'weJs'
        }
        this.$axios.$post(getwxLgin, option).then(res => {
          if (res.code === 10000) {
            const data = res.data
            this.saveLogin({
              userId: data.userId,
              token: data.token,
              isLogin: true,
              mobileFlag: data.mobileFlag
            })
            const redirectUrl = getStore('__redirectUrl__') || ''
            window.location.replace(`${URL}${redirectUrl}`)
            removeStore('__redirectUrl__')
          } else {
            window.location.replace(`${URL}`)
            this.$toast(res.message)
          }
        })
      }
    },
    // 获取地址栏后面的参数
    GetQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    ...mapActions(['saveLogin'])
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>

</style>
