<template>
  <div class="about-wrap">
    <div class="header">
      <div class="logo"></div>
      <p>当前版本: {{Version}}</p>
    </div>
    <div class="sub-wrap">
    <div class="sub">
      <div class="label">公司名称</div>
      <div class="name">北京臻茶科技有限公司</div>
    </div>
    <div class="sub">
      <div class="label">客服微信</div>
      <div class="name">chazhenxuan888</div>
    </div>
    <div class="sub">
      <div class="label">微信公众号</div>
      <div class="name">茶臻选商城</div>
    </div>
  </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  data () {
    return {
      Version: '1.0.0'
    }
  },
  mounted () {
    if (IOS) {
      setTimeout(() => {
        window.callback(ios => {
          ios.callHandler('getAppVersion', null, res => {
            this.Version = res
          })
        })
      }, 20)
    } else if (ANDROID) {
      this.Version = window.android.getAppVersion()
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.about-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  background-color: #f2f2f2;
  font-weight: normal;
  .header {
    margin: 75px auto;
    .logo {
      margin: 0 auto;
      @include bg-image('common/logo');
      width: 60px;
      height: 60px;
      background-size: cover;
    }
    p {
      text-align: center;
      margin: 15px auto;
    }
  }
  .sub-wrap {
    width: 355px;
    background: #fff;
    margin: 0 auto;
    font-size: 15px;
    .sub {
      display: flex;
      align-items: center;
      height: 44px;
      padding: 0 15px;
      .label {
        flex: 0 0 90px;
        color: #999;
      }
      .name {
        color: #333;
      }
    }
  }
}
</style>
