/* eslint-disable no-unused-vars */
<template>
  <div class="tongde">
    <backbar :bgColor="backBar"
             :title="backTitle"
             :leftColor='leftColor'
             :rightIcon="gobackMyback?'share':''"
             :shartOption="shartOption"
             :rightIconColor='rightIconColor'
             @setHeight="setHeight" />
    <div ref="mescroll"
         class="mescroll">
      <div class="content">
        <div class="headimg" ref="headimg"></div>
        <div ref="selWraper" class="navWraper van-hairline--bottom">
            <div class="tag-wrapper df nav" ref="selectedWraper" v-swiper:mySwiper="swiperTagOption">
            <div class="swiper-wrapper">
              <div v-for="item in navitems" class="swiper-slide nav-item" :key="item.value">
                <div class="swiper-item">
                <div :class="navActive.value === item.value ? 'active' : ''">
                  {{item.name}}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="upscrollWarp">
          <!--展示上拉加载的数据列表-->
          <ul id="dataList"
              class="data-list">
            <GoodLine v-for="(item,index) in dataList"
                      :key="index"
                      :ranking='index'
                      :datas="item"></GoodLine>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import GoodLine from '~/components/opera/GoodList/GoodList'
import { hot } from '~/api/special'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
export default {
  data () {
    var that = this
    return {
      backBar: '#fff',
      backTitle: '热销榜单',
      // tag swiper设置
      swiperTagOption: {
        freeMode: true,
        slidesPerView: 'auto',
        on: {
          init() {
            // swiper 初始化时获取所需数据
            that.swiperWidth = this.$el[0].clientWidth
            that.maxTranslate = this.maxTranslate()
            that.maxWidth = -that.maxTranslate + that.swiperWidth / 2
          },
          tap(e) {
            // 点击时  处理
            if (that.navActive.value === that.navitems[this.clickedIndex].value) {
              return
            }

            that.navActive = that.navitems[this.clickedIndex]

            // 切换tab时 重置除推荐外的列表数据
            // that.navActive = 0
            // that.mescroll.scrollTo(0, 0)
            that.mescroll.resetUpScroll()

            var slide, slideLeft, slideWidth, slideCenter, nowTlanslate
            slide = this.slides[this.clickedIndex]
            slideLeft = slide.offsetLeft
            slideWidth = slide.clientWidth
            slideCenter = slideLeft + slideWidth / 2

            this.setTransition(300)
            if (slideCenter < that.swiperWidth / 2) {
              this.setTranslate(0)
            } else if (slideCenter > that.maxWidth) {
              this.setTranslate(that.maxTranslate)
            } else {
              nowTlanslate = slideCenter - that.swiperWidth / 2
              this.setTranslate(-nowTlanslate)
            }
          }
        }
      },
      navitems: [
        {
          value: '18',
          name: '全部',
          icon: 'icon-1'
        },
        {
          value: '201906172105435498000001',
          name: '普洱',
          icon: 'icon-2'
        },
        {
          value: '2019043014303367624000297',
          name: '绿茶',
          icon: 'icon-3'
        },
        {
          value: '2019043014270346824000294',
          name: '红茶',
          icon: 'icon-3'
        },
        {
          value: '2019043014300206924000296',
          name: '白茶',
          icon: 'icon-3'
        },
        {
          value: '2019043014290799924000295',
          name: '花茶',
          icon: 'icon-3'
        },
        {
          value: '201906031504063268000002',
          name: '乌龙茶',
          icon: 'icon-3'
        },
        {
          value: '2019031412011089619000018',
          name: '茶器',
          icon: 'icon-3'
        }
      ],
      // tab切换
      navActive: {
        value: '18',
        name: '全部',
        icon: 'icon-1'
      },
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/activity/newcomers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      mescroll: null,
      leftColor: '#333',
      rightIconColor: '#333',
      dataList: []
    }
  },
  mounted () {
    // this.backBar = 'transparent'
    // this.backTitle = ''
    this.$refs.selectedWraper.classList.remove('nav-fixed')
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    setHeight (height) {
      this.$refs.selWraper.style.top = `${height + 40}px`
      this.$refs.headimg.style.marginTop = `${height + 46}px`
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          callback: this.getdisList,
          isBounce: false,
          warpId: 'upscrollWarp',
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'upscrollWarp', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
      // const that = this
      const navWarp = this.$refs.selWraper
      if (this.mescroll.os.ios) {
        // ios的悬停效果,通过给navWarp添加nav-sticky样式来实现
        navWarp.classList.add('nav-sticky')
        this.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          if (y >= 150) {
            // that.backBar = '#fff'
            // that.backTitle = '热销榜单'
            // that.leftColor = '#333'
            // that.rightIconColor = '#333'
          } else {
            // that.backBar = 'transparent'
            // that.backTitle = ''
            // that.leftColor = '#fff'
            // that.rightIconColor = '#fff'
          }
        }
      } else {
        // android和pc端悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
        navWarp.style.height = navWarp.offsetHeight + 'px'// 固定高度占位,避免悬浮时列表抖动
        const navContent = this.$refs.selectedWraper
        this.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          if (y >= navWarp.offsetTop) {
            navContent.classList.add('nav-fixed')
            // that.backBar = ''
            // that.backTitle = '热销榜单'
          } else {
            navContent.classList.remove('nav-fixed')
            // that.backBar = 'transparent'
            // that.backTitle = ''
          }
        }
      }
    },
    getdisList (page, mescroll) {
      const option = {
        categoryId: this.navActive.value,
        lastId: 0
      }
      // eslint-disable-next-line no-unused-vars
      const jump = sessionStorage.getItem('__special_h__')
      sessionStorage.removeItem('__special_h__')
      this.$axios.$post(hot, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            mescroll.endSuccess(5)
            // mescroll.endSuccess(0)
            if (jump) {
              console.log(jump)
              this.$refs.mescroll.scrollTop = jump
            }
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    handChange (val) {
      this.navActive = val
      if (this.backBar === 'transparent') {
        this.backTitle = ''
      } else {
        this.backTitle = val.name
      }
      /* 调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值) */
      const navWarp = this.$refs.selWraper
      const minHight = this.mescroll.getClientHeight() - navWarp.offsetHeight
      document.getElementById('upscrollWarp').style.minHeight = minHight + 'px'
      this.mescroll.resetUpScroll()
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    }
  },
  components: {
    GoodLine,
    backbar
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
@mixin icon-change($url) {
  background-image: url('~assets/img/'+$url+'.png');
  @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
    background-image: url('~assets/img/'+$url+'@2x.png');
  }
}
.tongde {
  .mescroll {
    position: fixed;
    top: 0;
    bottom: 0;
    background: #fff;
    height: auto;
    .content{
      background: #f2f2f2;

    }
    .nav-sticky {
      z-index: 9999;
      position: -webkit-sticky;
      position: sticky;
      top: 45px;
    }
    .nav-fixed {
      z-index: 9999;
      position: fixed;
      top: 45px;
      left: 0;
      width: 100%;
    }
    /deep/ .mescroll-upwarp{
      padding: 25px 0 15px;
    }
    /deep/ .mescroll-empty {
      top: 57%;
    }
  }
}
.headimg {
  width: 100%;
  height: 266px;
  @include bg-image('opera/bangdan/bg');
  background-size: 100% 100%;
  margin-top: 46px;
}
.navWraper {
  box-sizing: border-box;
  padding: 10px 0;
  background: #fff;
  margin: -80px 8px 0 8px;
  border-radius: 10px 10px 0 0;
  /deep/ .swiper-wrapper{
    align-items: center;
  }
  .nav {
    display: flex;
    background: #fff;
    overflow: hidden;
    align-items: center;
    .nav-item {
      position: relative;
      flex: 0 0 52px;
      text-align: center;
      margin: 0 6px;
      // padding: 5px 10px;
      font-size: 14px;
      font-weight: 400;
      color: #666;
      /deep/ .active {
        font-size: 14px;
        // font-weight: bold;
        flex: 0 0 65px;
        color: #fff;
        background: #F07D6E;
        border-radius: 15px;
        padding: 2px 5px;
      }
    }
  }
}
#upscrollWarp{
  margin: -10px 8px 0;
  background: #fff;
  min-height: 450px;
  padding-top: 10px;
}
</style>
