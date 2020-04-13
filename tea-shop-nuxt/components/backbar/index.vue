<template>
  <div class='backBar'>
    <van-nav-bar :title="title"
                 :fixed="fixed"
                 :style="{backgroundColor:bgColor}"
                 :z-index="zIndex"
                 @click-left="onClickLeft"
                 @click-right="onClickRight"
                 :border="border"
                 ref="header">

      <!-- 左侧文字或图片 -->
      <van-icon name="arrow-left"
                slot="left"
                :size="leftSize"
                :color="leftColor"
                v-if="!leftImg" />

      <van-icon :name="require(`./images/${leftImg}.png`)"
                slot="left"
                :size="leftSize"
                v-if="leftImg" />

      <!-- title插槽 -->
      <slot slot="title"
            name="title"></slot>

      <!-- 右侧文字或图片 -->

      <van-icon :name="rightIcon"
                slot="right"
                :size="rightSize"
                :color='rightIconColor'
                v-if="rightIcon" />
      <van-icon :name="require(`./images/${rightImg}.png`)"
                slot="right"
                :size="rightSize"
                v-if="rightImg" />
      <img :src="require(`./images/${rightImgTea}.png`)"
           slot="right"
           class='right-img'
           :style='{width:rightSize}'
           v-if="rightImgTea"
           alt="">
      <span slot='right'
            v-if='myshare'
            :style='{
              color:myshare
              }'
            class='iconfont'>&#xe612;</span>
      <span slot="right"
            v-if="rightText"
            :style='{color:rightColor}'>{{rightText}}</span>
    </van-nav-bar>
  </div>
</template>

<script>
import { ANDROID, IOS } from '~/environment/esm'
// eslint-disable-next-line no-unused-vars
import productList from '~/components/productList'
export default {
  name: 'backbar',
  data () {
    return {
      goMyPage: false
    }
  },
  props: {
    // 标题  可用插槽重写
    title: {
      type: String,
      default: ''
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#fff'
    },
    // 左侧文字颜色
    leftColor: {
      type: String,
      default: '#333'
    },
    // 右侧文字颜色
    rightColor: {
      type: String,
      default: '#333'
    },
    rightIcon: {
      type: String,
      default: ''
    },
    // 右侧自定义文字
    rightText: {
      type: String,
      default: ''
    },
    leftSize: {
      type: String,
      default: '20px'
    },
    rightSize: {
      type: String,
      default: '20px'
    },
    // 左侧背景图
    leftImg: {
      type: String,
      default: ''
    },
    // 右侧背景图
    rightImg: {
      type: String,
      default: ''
    },
    rightImgTea: {
      type: String,
      default: ''
    },
    // 右侧icon的颜色
    rightIconColor: {
      type: String,
      default: '#333'
    },
    // 自定义分享图标颜色
    myshare: {
      type: String
    },
    // 自定义分享类型
    myshareType: {
      type: String
    },
    // 层级
    zIndex: {
      type: Number,
      default: 10
    },
    // fixed在顶部
    fixed: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    goHome: {
      type: Boolean,
      default: false
    },
    gobackMyback: {
      type: Boolean,
      default: false
    },
    shartOption: {
      type: Object
    }
  },
  mounted () {
    if (IOS) {
      window.callback(ios => {
        ios.callHandler('getStatusBarH', null, res => {
          this.$refs.header.style.paddingTop = `${res}px`
          this.$emit('setHeight', res)
        })
      })
    }
  },
  watch: {

  },
  methods: {
    onClickLeft () {
      // console.log('onClickLeft');
      // this.$router.go(-1)

      const jump = sessionStorage.getItem('__jump__')
      if (jump === 'backmypage') this.goMyPage = true
      if (this.goHome) {
        this.$router.push('/')
        return
      }
      if (this.goMyPage || this.gobackMyback || this.$route.query.gobackMyback) {
        if (ANDROID) {
          window.android.goBackH5(false)
        } else {
          this.$router.back()
        }
      } else {
        if (IOS) {
          setTimeout(() => {
            window.callback(ios => {
              ios.callHandler('goBack', null, res => { })
            })
          }, 20)
        } else if (ANDROID) {
          window.android.goBackH5(true)
        } else {
          // window.history.length <= 1 ? this.$router.push('/') : this.$router.back()
          this.$router.back()
        }
      }
      sessionStorage.removeItem('__jump__')
    },
    onClickRight () {
      // 若要触发本组件内分享  rightImg文本必须包含share
      if (this.rightImg.indexOf('share') >= 0 || this.rightIcon.indexOf('share') >= 0 || this.myshareType.indexOf('share') >= 0) {
        if (IOS) {
          setTimeout(() => {
            window.callback(ios => {
              ios.callHandler('goShareType', JSON.stringify(this.shartOption), res => {
              })
            })
          }, 20)
        } else if (ANDROID) {
          window.android.goShareType(JSON.stringify(this.shartOption))
        }
      } else {
        this.$emit('onClickRight')
        console.log('onClickRight')
      }
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    productList
  }
}
</script>

<style scoped lang='scss'>
@font-face {
  font-family: 'iconfont';
  src: url('./iconfont/iconfont.eot');
  src: url('./iconfont/iconfont.eot?#iefix') format('embedded-opentype'),
    url('./iconfont/iconfont.woff2') format('woff2'),
    url('./iconfont/iconfont.woff') format('woff'),
    url('./iconfont/iconfont.ttf') format('truetype'),
    url('./iconfont/iconfont.svg#iconfont') format('svg');
}

.backBar {
  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 20px;
  }
  .right-img {
    vertical-align: middle;
  }
}
</style>
