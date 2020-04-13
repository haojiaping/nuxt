<template>
   <section class="pinpaiWrap">
     <backbar :bgColor="backbarOption.bgColor" :leftColor="backbarOption.leftColor" :title="backbarOption.title" :shartOption="shartOption" />

     <div class="mescroll" ref="mescroll">
       <div>

          <div class="headimg pr">
            <div class="img">
              <img :src="category.categoryImageUrl" alt="" width="100%">
            </div>
            <span class="text">{{category.categoryName}}</span>
          </div>
          <div ref="selWraper" class="navWraper van-hairline--bottom">
            <div ref="selectedWraper" class="nav">
              <div class="nav-item df" @click="handChange(0)" :class="navActive===0?'active':''">
                <p>综合</p>
              </div>
              <div class="nav-item df" @click="handChange(1)" :class="(navActive===1||navActive===4)?'active':''">
                <p>销量</p>
                <i class="icon" :class="navActive===1?'down':'up'"></i>
              </div>
              <div class="nav-item df" @click="handChange(3)" :class="(navActive===3||navActive===6)?'active':''">
                <p>价格</p>
                <i class="icon" :class="navActive===3?'down':'up'"></i>
              </div>
            </div>
          </div>
          <div id="upscrollWarp" class="upscrollWarp">
            <!--展示上拉加载的数据列表-->
            <productList :dataList="dataList"></productList>

          </div>

       </div>
     </div>
   </section>
</template>

<script>
import productList from '~/components/productList'
import backbar from '~/components/backbar'
import { getBrandList } from '~/api/product'
import { brand } from '~/assets/js/brand'
export default {
  data() {
    return {
      navActive: 0,
      mescroll: null,
      shartOption: {},
      backbarOption: {
        bgColor: 'transparent',
        title: '',
        leftColor: '#fff'
      }
    }
  },
  async asyncData ({ $axios, route }) {
    let brandMeta = {}
    brand.map(item => {
      if (item.id === route.params.brandId) {
        brandMeta = Object.assign({}, item)
      }
    })
    const option = {
      // brandId: brandMeta.id,
      brandId: route.params.brandId,
      pageNum: 0,
      orderSortType: 0
    }
    const listData = (await $axios.$post(getBrandList, option)).data
    return {
      dataList: listData.productList,
      category: {
        categoryName: listData.categoryName,
        categoryImageUrl: listData.categoryImageUrl
      },
      brandMeta: brandMeta
    }
  },
  head() {
    return {
      title: this.brandMeta.title ? this.brandMeta.title : this.category.categoryName,
      meta: [
        { hid: 'brand-keywords', name: 'keywords', content: this.brandMeta.keywords ? this.brandMeta.keywords : '' },
        { hid: 'brand-description', name: 'description', content: this.brandMeta.description ? this.brandMeta.description : '' }
      ]
    }
  },
  mounted() {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    productList(page, mescroll) {
      const pageNum = page.num - 1
      const option = {
        brandId: this.$route.params.brandId,
        pageNum: pageNum,
        orderSortType: this.navActive
      }
      this.$axios.$post(getBrandList, option).then(res => {
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
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          callback: this.productList,
          isBounce: false,
          lazyLoad: {
            use: true
          },
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
        this.mescroll.optUp.onScroll = function(mescroll, y, isUp) {
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
        this.mescroll.optUp.onScroll = function(mescroll, y, isUp) {
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
    handChange(val) {
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
  components: {
    productList,
    backbar
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.pinpaiWrap{

    .headimg {
      width: 100%;
      height: 130px;
      background: linear-gradient(#D45949 0 50%, #F2F2F2 50% 100%);
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
        background: #fff;
        .nav-item {
          position: relative;
          width: 33.33%;
          text-align: center;
          margin: 0 6px;
          padding: 5px 10px;
          font-size: 15px;
          font-weight: 400;
          justify-content: center;
          align-items: center;
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
    .upscrollWarp{
      margin:10px;
    }

}
</style>
