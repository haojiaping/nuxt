<template>
  <div class="__wraper">
    <nuxt />
    <footertabs></footertabs>
  </div>
</template>

<script>
import footertabs from './footertabs'
import { mapGetters, mapActions } from 'vuex'
import { isProdMode, isBrowser, ANDROID, IOS } from '~/environment/esm'
// import { getStore } from "~/utils/localStorage"
// import Cookies from 'js-cookie'
// 注册ios
if (isBrowser) {
  require('~/assets/js/register-ioscallback.js')
}
if (isProdMode && isBrowser && !ANDROID && !IOS) {
  require('~/assets/js/baidu.js')
}
export default {
  components: {
    footertabs
  },
  mounted () {
    // this.init()
    this.userStarusInit()
    this.getShareWxArg()

    // const option = {
    //   scheme: {
    //     protocol: 'aisotea'
    //   },
    //   outChain: {
    //     protocol: 'aisotea',
    //     path: 'temporary',
    //     key: 'url'
    //   },
    //   intent: {
    //     package: 'com.aiso.tea',
    //     scheme: 'aisotea'
    //   },
    //   // universal: {
    //   //   host: 'm.chazhenxuan.com',
    //   //   pathKey: 'action'
    //   // },
    //   appstore: 'https://itunes.apple.com/cn/app/id1457932298?mt=8',
    //   yingyongbao: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.aiso.tea',
    //   fallback: 'https://m.chazhenxuan.com/about/download',
    //   timeout: 2000
    // }

    // // eslint-disable-next-line
    // const lib = new CallApp(option);
    // lib.open({
    //   path: ''
    // })
  },
  methods: {
    ...mapActions(['userStarusInit', 'getShareWxArg'])
  },
  computed: {
    ...mapGetters(['user'])
  },
  head: {
    // script: [{ innerHTML: isBrowser ? require('~/assets/js/toutiao.js'): null, type: 'text/javascript', charset: 'utf-8'}],
    //   __dangerouslyDisableSanitizers: ['script']
  }
}
</script>

<style>
.__wraper{
  height: 100%;
  background-color: #f2f2f2;
  font-size: 14px;
}
</style>
