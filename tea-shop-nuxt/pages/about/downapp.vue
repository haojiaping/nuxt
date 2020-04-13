<template>
  <client-only>
    <div class="downWraper mescroll-touch">
      <img :src="require('~/assets/img/downapp/big-bg.jpg')"
           alt="" />
      <div v-if="isIOS"
           class="bottom"
           @click="jumpToItunes">
        <span>请前往AppStore查看</span>
      </div>
      <div v-if="isAND"
           class="bottom"
           @click="jumpToAPK">
        <span>立即下载</span>
      </div>
      <div v-show="wxtipShow"
           class="wxtip"
           @click="wxtipShow = false">
        <span class="wxtip-icon" />
        <p class="wxtip-txt">
          点击右上角 <br />
          选择在浏览器中打开
        </p>
      </div>
    </div>
  </client-only>
</template>

<script>
import { isAND, isIOS, WX, IOS, ANDROID } from '~/environment/esm'
import { androidURL, iosURL } from '~/config/downapp'
export default {
  name: 'DownApp',
  components: {},
  data () {
    return {
      isAND: '',
      isIOS: '',
      wxtipShow: false
    }
  },
  watch: {},
  mounted () {
    this.isAND = isAND
    this.isIOS = isIOS
  },
  methods: {
    jumpToItunes () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler(
            'jumpOtherPage',
            { jumpType: 'webViewSystem', jumpContent: `{"url":${iosURL}}` },
            () => { }
          )
        })
      } else {
        window.location.href = `${iosURL}`
      }
    },
    jumpToAPK () {
      if (WX) {
        this.wxtipShow = true
      } else {
        if (ANDROID) {
          window.android.toOpenSystemWeb(`${androidURL}`)
        } else {
          window.location.href = `${androidURL}`
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.downWraper {
  position: relative;
  img {
    width: 100%;
  }
  .top {
    width: 100%;
    margin: 75px 0 75px;
    .logo {
      width: 60px;
      height: 60px;
      @include bg-image('common/logo');
      background-size: cover;
      margin: 0 auto 25px;
    }
    p {
      text-align: center;
      color: #333;
      font-size: 18px;
    }
  }
  .center {
    position: relative;
    margin: 0 37.5px;
    @include bg-image('downapp/border');
    background-size: cover;
    width: 6rem;
    height: 3.2rem;
    .img {
      width: 250px;
      height: 85px;
      margin: 0 auto;
      position: absolute;
      top: -45px;
      left: 0;
      right: 0;
      @include bg-image('downapp/img');
      background-size: cover;
    }
    .text {
      position: absolute;
      bottom: 20px;
      width: 100%;
      p {
        text-align: center;
        font-size: 15px;
        line-height: 30px;
        color: #333;
      }
    }
  }
  .bottom {
    position: absolute;
    width: 250px;
    height: 68px;
    line-height: 63px;
    text-align: center;
    color: #fff;
    top: 386px;
    left: 0;
    right: 0;
    margin: auto;
    @include bg-image-size('downapp/bg');
    background-size: 100% 100%;
    font-size: 18px;
  }
  .wxtip {
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 998;
    cursor: pointer;
  }
  .wxtip-icon {
    width: 100px;
    height: 75px;
    @include bg-image-jpg('downapp/weixin-tip');
    display: block;
    position: absolute;
    right: 50px;
    top: 20px;
    transform: rotate(-30deg);
  }
  .wxtip-txt {
    margin-top: 107px;
    color: #fff;
    font-size: 16px;
    line-height: 1.5;
  }
}
</style>
