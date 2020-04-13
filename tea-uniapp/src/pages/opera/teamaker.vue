<template>
  <section class="semWraper">
    <backbar :bgColor="backbarOption.bgColor"
             :leftColor="backbarOption.leftColor"
             :title="backbarOption.title"
             :rightIcon="gobackMyback?'share':''"
             :shartOption="shartOption"
             />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class='listWrap'>
        <div class="subWrap pr">
          <div class='top-img'>
            <img :src="require(`~/assets/img/opera/oldtea/top.png`)"
                 alt="">
            <div class="menu">
              <div class="tag-wrapper df"
                   v-if="tagList.length>0"
                   v-swiper:mySwiper="swiperOption">
                <div class="swiper-wrapper">
                  <div v-for="(item , index) in tagList"
                       class="swiper-slide"
                       :key="`tag_${index}`">
                    <div class="swiper-item"
                         @click="handelChangeTab(item,index)">
                      <!-- <span>{{item.categoryName}}</span> -->
                      <img :src="require(`~/assets/img/opera/oldtea/${index+1}@2x.png`)"
                           alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="selWraper"
               class="navWraper van-hairline--bottom">
            <div ref="selectedWraper"
                 class="nav">
              <div class="nav-item df"
                   @click="handChange(0)"
                   :class="navActive===0?'active':''">
                <p>综合</p>
              </div>
              <div class="nav-item df"
                   @click="handChange(1)"
                   :class="(navActive===1||navActive===4)?'active':''">
                <p>销量</p>
                <i class="icon"
                   :class="navActive===1?'down':'up'"></i>
              </div>
              <div class="nav-item df"
                   @click="handChange(3)"
                   :class="(navActive===3||navActive===6)?'active':''">
                <p>价格</p>
                <i class="icon"
                   :class="navActive===3?'down':'up'"></i>
              </div>
            </div>
          </div>
          <div id="upscrollWarp"
               class="upscrollWarp">
            <!--展示上拉加载的数据列表-->
            <productList :dataList="dataList"></productList>

          </div>

        </div>
      </div>
    </div>
    <div v-show="loading"
         class='loding-content'>
      <div class='loading-inner'>
        <van-loading size="24px"
                     type="spinner"
                     color="#666"></van-loading>
      </div>
    </div>
  </section>
</template>

<script>
import productList from '~/components/productList'
import backbar from '~/components/backbar'
import { getProductList } from '~/api/product'
import { list } from '~/api/type'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
export default {
  data () {
    var that = this
    return {
      dataList: [],
      tagList: [],
      id: '',
      jump: null,
      navActive: 0,
      mescroll: null,
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/activity/newcomers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      backbarOption: {
        bgColor: 'transparent',
        title: '',
        leftColor: '#fff'
      },
      loading: false,
      category: {
        categoryName: '',
        categoryImageUrl: ''
      },
      activetab: {},
      swiperOption: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
        initialSlide: 1,
        on: {
          init () {
            // swiper 初始化时获取所需数据
            that.swiperWidth = this.$el[0].clientWidth
            that.maxTranslate = this.maxTranslate()
            that.maxWidth = -that.maxTranslate + that.swiperWidth / 2
          },
          tap () {
            // 点击时  处理
            if (that.activetab === that.tagList[this.clickedIndex]) {
              return
            }
            that.activetab = that.tagList[this.clickedIndex]
            that.id = that.tagList[this.clickedIndex].nodeCategoryId
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
      }
    }
  },
  async asyncData ({ $axios }) {
    const typeData = await $axios.$post(list)
    return { datas: typeData }
  },
  created () {
    // this.getTopMenu()
  },
  mounted () {
    this.getTopMenu()
    this.mescrollInit()
  },
  watch: {

  },
  methods: {

    getTopMenu () {
      // eslint-disable-next-line no-unused-vars
      this.jump = sessionStorage.getItem('__special_h__')
      sessionStorage.removeItem('__special_h__')
      console.log(this.jump)
      this.$axios.$post(list).then((res) => {
        if (res.code === 10000) {
          this.tagList = res.data.filter((item) => {
            return item.categoryName === '茶器'
          })[0].categoryList
          const item = sessionStorage.getItem('_activityItem_') ? JSON.parse(sessionStorage.getItem('_activityItem_')) : ''

          if (item !== '') {
            this.id = item.nodeCategoryId
            this.swiperOption.initialSlide = item.inite
            if (this.backbarOption.title !== '') {
              this.backbarOption.title = item.categoryName
            }
          } else {
            this.id = this.tagList[0].nodeCategoryId
          }
          this.mescroll.resetUpScroll()
        }
      })
    },
    handelChangeTab (item, index) {
      this.$set(item, 'inite', index)
      const str = JSON.stringify(item)
      sessionStorage.setItem('_activityItem_', str)
    },
    productList (page, mescroll) {
      const pageNum = page.num - 1
      const option = {
        categoryId: this.id,
        pageNum: pageNum,
        orderSortType: this.navActive
      }

      this.loading = true
      this.$axios.$post(getProductList, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.data.productList
        if (res.code === 10000) {
          this.category.categoryName = res.data.categoryName
          this.category.categoryImageUrl = res.data.categoryImageUrl
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []

          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
            // mescroll.endSuccess(0)
            // eslint-disable-next-line no-undef
            console.log(this.$refs.mescroll.scrollTop)
            // eslint-disable-next-line no-undef
            if (this.jump) {
              // eslint-disable-next-line no-undef
              this.$refs.mescroll.scrollTop = this.jump
            }
            // eslint-disable-next-line no-undef
            // this.$refs.mescroll.scrollTop = this.jump
          })
          this.loading = false
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          callback: this.productList,
          isBounce: false,
          lazyLoad: {
            use: true
          },
          auto: false,
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 // 每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">茶有底，道无尽。</p>',
          toTop: { // 配置回到顶部按钮
            warpClass: 'mescroll-totop-home',
            src: require('~/assets/img/common/toTop.png') // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
          }
        }
      })
      const that = this
      const navWarp = this.$refs.selWraper
      if (this.mescroll.os.ios) {
        // ios的悬停效果,通过给navWarp添加nav-sticky样式来实现
        navWarp.classList.add('nav-sticky')
        this.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          if (y >= 100) {
            that.backbarOption.leftColor = '#333'
            that.backbarOption.bgColor = '#fff'
            that.backbarOption.title = that.category.categoryName
          } else {
            that.backbarOption.leftColor = '#fff'
            that.backbarOption.bgColor = 'transparent'
            that.backbarOption.title = ''
          }
        }
      } else {
        // android和pc端悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
        navWarp.style.height = navWarp.offsetHeight + 'px'// 固定高度占位,避免悬浮时列表抖动
        const navContent = this.$refs.selectedWraper
        this.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          if (y >= navWarp.offsetTop) {
            navContent.classList.add('nav-fixed')
            that.backbarOption.leftColor = '#333'
            that.backbarOption.bgColor = '#fff'
            that.backbarOption.title = that.category.categoryName
          } else {
            navContent.classList.remove('nav-fixed')
            that.backbarOption.leftColor = '#fff'
            that.backbarOption.bgColor = 'transparent'
            that.backbarOption.title = ''
          }
        }
      }
    },
    handChange (val) {
      switch (val) {
        case 0:
          this.navActive = val
          break
        case 1:
          this.navActive === 1 ? this.navActive = 4 : this.navActive = 1
          break
        case 2:
          this.navActive === 2 ? this.navActive = 5 : this.navActive = 2
          break
        case 3:
          this.navActive === 3 ? this.navActive = 6 : this.navActive = 3
          break
      }
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
    productList,
    backbar
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.semWraper {
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      position: relative;
      padding-bottom: 0px;
      .top-img {
        font-size: 0;
        img {
          width: 100%;
        }
        position: relative;
        .menu {
          width: 355px;
          position: absolute;
          left: 10px;
          bottom: 10px;
          .swiper-slide {
            text-align: center;
            font-size: 14px;
            font-weight: normal;
            height: 60px;
            width: auto;
            .swiper-item {
              box-sizing: border-box;
              width: 90px;
              height: 60px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .headimg {
        width: 100%;
        height: 130px;
        background: linear-gradient(#d45949 0 50%, #f2f2f2 50% 100%);
        .img {
          position: absolute;
          width: 75px;
          height: 75px;
          left: 10px;
          bottom: 10px;
        }
        .text {
          position: absolute;
          left: 100px;
          bottom: 10px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
      }
      .navWraper {
        box-sizing: border-box;
        padding: 0 10px;
        background: #fff;
        top: 0;
        left: 0;
        right: 0;
        .nav {
          display: flex;
          align-items: center;
          background: #fff;
          height: 44px;
          .nav-item {
            position: relative;
            width: 33.33%;
            text-align: center;
            margin: 0 6px;
            padding: 0px 10px;
            font-size: 15px;
            font-weight: 400;
            justify-content: center;
            align-items: center;
            height: 100%;
            &.active {
              font-weight: 600;
              font-size: 18px;
            }
            .icon {
              width: 6px;
              height: 14px;
              @include bg-image('home/default');
              background-size: cover;
              margin-left: 10px;
              &.down {
                @include bg-image('home/down');
              }
              &.up {
                @include bg-image('home/up');
              }
            }
          }
        }
      }

      .mescroll {
        position: fixed;
        top: 0;
        bottom: 0;
        height: auto;
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
        /deep/ .mescroll-empty {
          top: 57%;
        }
      }
      .upscrollWarp {
        margin: 10px;
      }
      .loding-content {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .loading-inner {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 100px;
          height: 100px;
          // background: #fff;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          span {
            color: #1989fa;
          }
        }
      }
    }
  }
}
</style>
