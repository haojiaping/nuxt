<template>
   <div class="indexWraper">
    <!-- <nuxt-link to="/about/downapp" class="downBtnWrap pf"></nuxt-link> -->
    <jump></jump>
     <div class="hometopWrap pf" ref="hometop" :class="activetab.categoryId==='001'?'active':'listactive'">
       <div class="typeList">
          <div class="tag-wrapper df"
                  v-if="homeTopData&&homeTopData.length>0"
                  v-swiper:mySwiper="swiperTagOption">
            <div class="swiper-wrapper">
              <div v-for="item in homeTopData" class="swiper-slide" :key="`tag_${item.categoryId}`">
                <div class="swiper-item"
                :class="activetab.categoryId === item.categoryId ? 'activeTag' : ''">{{item.categoryName}}</div>
              </div>
            </div>
          </div>
       </div>
        <div class="search df" v-if="activetab.categoryId==='001'" @click="jumpToSearch">
          <van-icon name="search" size="0.5rem" color="#999"/>
          <span class="f15">{{hotSearchText}}</span>
        </div>

        <div class="navWraper" v-show="activetab.categoryId!=='001'">
          <div class="nav">
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

     </div>
    <div class="conentWrap pf mescroll" ref="mescroll" v-show="activetab.categoryId==='001'">
      <div class="subWrap pr" ref="subWrap" >
        <div class="banner-wrapper pr">
            <div v-swiper:mySwiperBanner="swiperOptionBanner">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="ban in banner" :key="ban.bannerId">
                  <nuxt-link class="alink" :to="`${jumpUrl(ban.jumpType,ban.jumpContent)}`">
                    <img :src="ban.imageUrl" width="100%" style="object-fit: cover;">
                  </nuxt-link>
                </div>
              </div>
              <div class="swiper-pagination swiper-pagination-bullets"></div>
            </div>
          </div>

          <div class="notice van-hairline--bottom">
            <div class="noticeWraper df">
              <div class="icon"></div>
              <div v-swiper:mySwiperHorse="swiperOptionHorse">
                <div class="swiper-wrapper">
                  <div class="swiper-slide tover" v-for="(horse,index) in horseData" :key="`horse_${index}`">
                    {{horse.content}}
                  </div>
                </div>
                <div class="swiper-pagination swiper-pagination-bullets"></div>
            </div>
            </div>
          </div>

          <div class="menuWraper van-hairline--top">
            <div v-swiper:mySwiperMenu="swiperOptionMenu" class="menu-wrapper">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="menu in menuData" :key="menu.categoryId" @click="$router.push(jumpUrl(menu.jumpType,menu.jumpContent))">
                  <div class="icon-wrapper">
                    <img :src="menu.categoryLogo" width="100%">
                  </div>
                  <span class="f12">{{menu.categoryName}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="operaWrap df">
            <div class="operaItem one df border-rightbottom" v-if="operaData&&operaData[0]" @click="$router.push(jumpUrl(operaData[0].jumpType,operaData[0].jumpContent))">
              <div class="title df f15">
                <span>{{operaData[0].labelName}}</span>
                <van-count-down :time="(operaData[0].endTime - new Date().getTime())" class="countDownWrap cf f10">
                  <template v-slot="timeData">
                  <van-tag round color="#EA6F5F">
                    <span class="item f10">{{ timeData.hours | formatTime }}</span>
                    <span class="item f10">:</span>
                    <span class="item f10">{{ timeData.minutes | formatTime }}</span>
                    <span class="item f10">:</span>
                    <span class="item f10">{{ timeData.seconds | formatTime }}</span>
                    </van-tag>
                  </template>
                </van-count-down>
              </div>
              <div class="operaGoods df">
                <div class="operaGood df" v-for="pro in operaData[0].productList" :key="`gou_${pro.productId}`">
                  <img :src="pro.productImage" :alt="pro.productName" width="100%">
                  <p class="price tac">
                    <span class="f14 ctea">¥ {{pro.discountPrice}}</span>
                    <span class="f11 c9" style="text-decoration:line-through;">¥ {{pro.virtualPrice}}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="operaItem one df border-bottom" v-if="operaData&&operaData[1]" @click="$router.push(jumpUrl(operaData[1].jumpType,operaData[1].jumpContent))">
              <div class="title df f15">
                <span>{{operaData[1].labelName}}</span>
                <span></span>
              </div>
              <div class="operaGoods df">
                <div class="operaGood df" v-for="(pro, index) in operaData[1].productList" :key="`tian_${index}`">
                  <img :src="pro.productImage" :alt="pro.productName" width="100%">
                  <p class="price tac">
                    <span class="f14 ctea">¥ {{pro.productPrice}}</span>
                    <span class="f11"></span>
                  </p>
                </div>
              </div>
            </div>

            <div class="operaItem two border-right" v-if="operaData&&operaData[2]" @click="$router.push(jumpUrl(operaData[2].jumpType,operaData[2].jumpContent))">
              <p class="titletext c3 f15">{{operaData[2].labelName}}</p>
              <p class="titletips c9 f12">{{operaData[2].operationTitle}}</p>
              <div class="operaImg df ">
                <img :src="proItem.productImage" :alt="proItem.productName" v-for="(proItem, index ) in operaData[2].productList" :key="`proItem_${index}`" v-if="index<2">
              </div>
            </div>

            <div class="operaItem two" v-if="operaData&&operaData[3]" @click="$router.push(jumpUrl(operaData[3].jumpType,operaData[3].jumpContent))">
              <p class="titletext c3 f15">{{operaData[3].labelName}}</p>
              <p class="titletips c9 f12">{{operaData[3].operationTitle}}</p>
              <div class="operaImg df ">
                <img :src="proItem.productImage" :alt="proItem.productName" v-for="(proItem, index ) in operaData[3].productList" :key="`proCha_${index}`" v-if="index<2">
              </div>
            </div>

          </div>

          <div class="activeWraper" v-if="activeData" @click="$router.push(jumpUrl(activeData.jumpType,activeData.jumpContent))">
            <img :src="activeData.activeRegionImage" alt="" width="100%">
          </div>

          <div class="brandWrap df" v-if="brandData">
            <div class="imgWrap"></div>
            <div class="brandItemWrap">
              <div v-swiper:mySwiperBrand="swiperOptionBrand">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="brand in brandData" :key="brand.brandId">
                  <nuxt-link :to="`/pinpai/${brand.brandId}`" class="icon-wrapper">
                    <img :src="brand.brandUrl" width="100%" :alt="brand.brandName">
                  </nuxt-link>
                </div>
              </div>
            </div>
            </div>

          </div>

          <div class="recommendText border-bottom">
            <div class="recommendImg"></div>
          </div>
          <div class="listPro">
            <productList :dataList="likeData"></productList>
          </div>

          <div class="friendlink" id="test">
            <p class="foot tac">茶有底，道无尽。</p>
            <div class="link">
              <span class="c6">友情链接: </span>
              <a href="https://www.1905.com">CCTV6—电影频道</a>
              <a href="https://www.liepin.com/">猎聘网</a>
              <a href="http://www.puercn.com/">中国普洱茶网</a>
              <a href="https://www.chayu.com/">茶语网</a>
              <a href="https://www.kanzhun.com/msh/">面试技巧</a>
              <a href="https://www.chayi5.com">茶艺网</a>
              <a href="https://www.pingguolv.com">苹果绿养生网</a>
            </div>
            <div class="copy tac c6 van-hairline--top">
              Copyright © 2018 北京臻茶科技有限公司
            </div>
          </div>
      </div>

    </div>

    <div class="listWrap mescroll pf" ref="mescroll1" v-show="activetab.categoryId!=='001'">
      <div class="listSub" ref="listSub">
        <productList :dataList="ListData"></productList>
      </div>
    </div>
    <a href="https://www.kanzhun.com/msh/ " style="display:none;"></a>
   </div>
</template>

<script>
import { index } from '~/meta'
import { getIndexBanner, getLike, homeTop, homeContent, hotSearch } from '~/api/index'
import { getProductList } from '~/api/product'
import { jumpUrl } from '~/utils/jump'
import { mapActions } from 'vuex'
import productList from '~/components/productList'
import { brand } from '~/assets/js/brand'
import jump from '~/components/popjump/jump'
import { swiperOptionBanner, swiperOptionHorse, swiperOptionMenu, swiperOptionBrand } from '~/assets/js/swiperOptios'
// 首页
export default {
  data() {
    var that = this
    return {
      // 配置数据
      swiperOptionBanner: Object.assign({}, swiperOptionBanner),
      swiperOptionHorse: Object.assign({}, swiperOptionHorse),
      swiperOptionMenu: Object.assign({}, swiperOptionMenu),
      swiperOptionBrand: Object.assign({}, swiperOptionBrand),

      activetab: {
        categoryId: '001',
        categoryName: '推荐',
        jumpContent: '{"categoryId":"001"}'
      },
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
            if (that.activetab.categoryId === that.homeTopData[this.clickedIndex].categoryId) {
              return
            }

            that.activetab = that.homeTopData[this.clickedIndex]

            // 切换tab时 重置除推荐外的列表数据
            that.navActive = 0
            that.mescroll1.scrollTo(0, 0)
            that.mescroll1.resetUpScroll(false)

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
      mescroll: null,
      mescroll1: null,
      // 页面数据
      navActive: 0,
      ListData: []
    }
  },
  // 异步获取数据
  async asyncData ({ $axios }) {
    try {
      const [banner, likeData, homeTopData, homeContentData, hotSearchData] = await Promise.all([
        $axios.$post(getIndexBanner),
        $axios.$post(getLike, { productReco: 0 }),
        $axios.$post(homeTop),
        $axios.$post(homeContent),
        $axios.$post(hotSearch)
      ]).catch((error) => {
        console.log(error)
      })
      // 给顶部label添加推荐
      const homeTopDataTemp = homeTopData.data
      homeTopDataTemp.unshift({ categoryId: '001', categoryName: '推荐', jumpContent: '{"categoryId":"001"}' })
      // 拆解  跑马灯   中部功能区   推广区  活动区 品牌
      const horseData = homeContentData.data.horseRaceLampList
      const menuData = homeContentData.data.activityClassify
      const operaData = homeContentData.data.labelList
      const activeData = homeContentData.data.activeRegion
      const brandData = homeContentData.data.brand.list
      const hotSearchText = hotSearchData.data[0].keyWord

      return {
        banner: banner.data,
        likeData: likeData.data.productList,
        homeTopData: homeTopDataTemp,
        horseData: horseData,
        menuData: menuData,
        operaData: operaData,
        activeData: activeData,
        brandData: brandData,
        hotSearchText: hotSearchText
      }
    } catch (error) {
      console.log(error)
    }
  },
  mounted() {
    this.mescrollInit()
    this.mescrollInit1()
    this.getShareWxArg()
    this.mescroll1.resetUpScroll(false)
  },
  beforeDestroy () {
    this.mescroll.destroy()
    this.mescroll1.destroy()
  },
  watch: {

  },
  methods: {
    jumpUrl,
    getLikeData(page, mescroll) {
      this.$axios.$post(getLike, { productReco: 0, pageNum: page.num }).then(res => {
        const arr = res.data.productList
        const hasNext = res.data.endFlag === 0
        if (page.num === 0) this.likeData = []
        this.likeData = [...this.likeData, ...arr]
        this.$nextTick(() => {
          this.mescroll.endSuccess(arr.length, hasNext)
        })
      }).catch(() => {
        this.mescroll.endErr()
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          callback: this.homeInit,
          auto: true
        },
        up: {
          callback: this.getLikeData,
          // auto:false,
          isBounce: false,
          lazyLoad: {
            use: true
          },
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 40 // 每页数据条数,默认10
          },
          warpId: 'test',
          htmlNodata: '',
          onScroll: this.meOnScroll,
          toTop: { // 配置回到顶部按钮
            warpClass: 'mescroll-totop-home',
            src: require('~/assets/img/common/toTop.png') // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
          }
        }
      })
    },
    mescrollInit1() {
    // eslint-disable-next-line
      this.mescroll1 = new MeScroll(this.$refs.mescroll1, {
        up: {
          callback: this.getListData,
          auto: false,
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
    },
    // 除推荐外  列表api
    getListData(page, mescroll) {
      if (this.activetab.categoryId === '001') {
        this.mescroll1.endErr()
      } else {
        const pageNum = page.num - 1
        this.$axios.$post(getProductList,
          {
            categoryId: this.activetab.categoryId,
            pageNum: pageNum,
            orderSortType: this.navActive
          }
        ).then(res => {
          const arr = res.data.productList
          const hasNext = res.data.endFlag === 0
          if (page.num === 1) this.ListData = []
          this.ListData = [...this.ListData, ...arr]
          this.$nextTick(() => {
            this.mescroll1.endSuccess(arr.length, hasNext)
          })
        }).catch(() => {
          this.mescroll1.endErr()
        })
      }
    },
    async homeInit() {
      const [banner, likeData, homeTopData, homeContentData, hotSearchData] = await Promise.all([
        this.$axios.$post(getIndexBanner),
        this.$axios.$post(getLike, { productReco: 0 }),
        this.$axios.$post(homeTop),
        this.$axios.$post(homeContent),
        this.$axios.$post(hotSearch)
      ]).catch((error) => {
        console.log(error)
      })
      // 给顶部label添加推荐
      const homeTopDataTemp = homeTopData.data
      homeTopDataTemp.unshift({ categoryId: '001', categoryName: '推荐', jumpContent: '{"categoryId":"001"}' })
      const hotSearchText = hotSearchData.data[0].keyWord
      // 拆解  跑马灯   中部功能区   推广区  活动区 品牌
      this.homeTopData = homeTopDataTemp
      this.banner = banner.data
      this.horseData = homeContentData.data.horseRaceLampList
      this.menuData = homeContentData.data.activityClassify
      this.operaData = homeContentData.data.labelList
      this.activeData = homeContentData.data.activeRegion
      this.brandData = homeContentData.data.brand.list
      this.likeData = likeData.data.productList
      this.hotSearchText = hotSearchText
      this.$nextTick(() => {
        this.mescroll.endSuccess(this.likeData.length)
      })
    },
    meOnScroll(mescroll, y, isUp) {
      const hometop = this.$refs.hometop
      if (this.activetab.categoryId === '001') {
        if (y > 100) {
          hometop.classList.add('unactive')
        } else {
          hometop.classList.remove('unactive')
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
      this.mescroll1.resetUpScroll()
    },
    jumpToSearch() {
      this.$router.push('/search')
    },
    getIdBrand(id) {
      let path = ''
      brand.map(item => {
        if (item.id === id) {
          path = item.path
        }
      })
      return path
    },
    ...mapActions(['getShareWxArg'])
  },
  filters: {
    formatTime (val) {
      return val < 10 ? `0${val}` : val
    }
  },
  components: {
    productList,
    jump
  },
  head() {
    return index
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.indexWraper{
  padding-bottom: 55px;
  .downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 20%;
    transform: translateY(-50%);
    z-index: 999;
  }
  .hometopWrap{
    background: #fff;
    width: 100%;
    height: 174px;
    top: 0;
    left: 0;
    &.listactive{
      height: auto;
      color: #333;
      .typeList{
        color: #333;
      }
    }
    &.active{
      @include bg-image('home/topbg')
    }
    &.unactive{
      background: #fff;
      .typeList{
        color: #333;
      }
      .search{
        background:rgba(242,242,242,1) ;
        box-shadow: none ;
      }
    }
    .typeList{
      color: #fff;
      border-radius: 5px;
      margin: 15px 0;
      .swiper-slide {
        width: auto;
        text-align: center;
        font-size: 15px;
        font-weight: normal;
        margin: 0 15px;
        .swiper-item {
          height: 30px;
          line-height: 30px;
          &.activeTag {
            font-size: 18px;
            font-weight: 600;
            position: relative;

          }
          &.activeTag:after{
            display: block;
            content:'';
            width: 4px;
            height: 4px;
            position: absolute;
            top: 0;
            right: -10px;
            background: #D45949;
          }

        }
      }

    }
    .search{
      margin: 10px 10px;
      width:310px;
      height:30px;
      background:rgba(242,242,242,1);
      box-shadow:0px 3px 8px 0px rgba(0, 0, 0, 0.15);
      border-radius:15px;
      align-items: center;
      padding-left: 15px;
      span{
        color: #bbb;
        margin-left: 10px;
      }
    }

    .navWraper {
      box-sizing: border-box;
      padding: 0 10px;
      background: #fff;
      margin: 0 10px;
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

  }

  .conentWrap{
    top: 100px;
    bottom: 55px;
    left: 0;
    height: auto;
    .subWrap{
      .banner-wrapper{
        height: 130px;
        // margin-bottom: 10px;
        margin: 0 10px 10px;
        overflow: hidden;
        .alink{
          display: block;
          width: 100%;
          height: 100%;
          img{
            height: 130px;
          }
        }
      }
    }
      .notice{
        margin: 0 10px;
        color:#1A1A1B;
        // line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        // height: 40px;
        background: #fff;
        // padding: 0 10px;
        &.van-hairline--bottom:after{
          border-color:#e8e8e8;
        }
        .noticeWraper{
          flex:1;
          height :30px;
          overflow: hidden;
          // background: #f2f2f2;
          border-radius: 15px;
          .swiper-container{
            margin: 0;
          }
          .swiper-wrapper{
            height:30px;
            .swiper-slide{
              line-height:30px;
            }
          }
          .icon{
            width: 70px;
            height: 13px;
            line-height: 40px;
            align-self: center;
            margin: 0 10px 0 15px;
            @include bg-image-size('home/notice');
            background-size: contain;
          }
        }
      }

      .menuWraper {
        margin: 0 10px;
        position: relative;
        .menu-wrapper {
          padding: 12px 0;
          width: 100%;
          height: auto;
          margin-left: auto;
          margin-right: auto;
          background: #fff;
          .menu-item {
            width: 25%;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            height: 100px;
          }
        }
        .swiper-slide {
          text-align: center;
          font-size: 18px;
          background: #fff;
          height:auto;
          .icon-wrapper {
            width: 42px;
            height: 42px;
            margin: 0 auto 2px;
            background-size: cover;
            .icon {
              display: block;
              width: 100%;
              height: 0;
              padding-bottom: 96.9%;
              background-size: 100% 100%;
            }
          }
        }
      }

      .operaWrap{
        flex-wrap: wrap;
        margin: 10px 10px;
        .operaItem{
          height: 132px;
          width: 50%;
          flex-direction: column;
          background: #fff;
          .title{
            align-items: center;
            padding:5px 0 0 15px;
            line-height: 40px;
            .countDownWrap{
              margin-left: 10px;
              padding: 4px 8px;
            }
          }

          .titletext{
            margin-top:10px;
            padding:5px 0 0 15px;

          }
          .titletips{
            padding:5px 0 0 15px;

          }
          .operaImg{
            padding: 0 15px;
            margin-top:10px;
            justify-content: space-between;
            img{
              width: 60px;
              height: 60px;
            }
          }

          .operaGoods{
            flex-wrap: wrap;
            height: 124px;
            overflow: hidden;
            .operaGood{
              width: 50%;
              flex-direction: column;
              align-items: center;
              margin-bottom: 5px;
              img{
                width: 60px;
                height: 60px;
              }
              .price{
                width: 100%;
                line-height: 30px;
                padding: 0 5px;
              }
            }
          }
        }
      }
  }

  .listWrap{
    top: 100px;
    bottom: 50px;
    left: 0;
    height: auto;
    .listSub{
      margin: 0 10px;
    }
  }
}
  .activeWraper {
    // margin: 0 10px;
    width: 93%;
    max-height: 320px;
    margin: 0 auto;
  }

  .brandWrap{
    margin: 10px 10px;
    .imgWrap{
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      @include bg-image('home/brand')
    }
    .brandItemWrap{
      flex: 1;
      background: #fff;
      overflow: hidden;
      padding-left: 10px;
      // margin: 0 10px;
      .swiper-wrapper{
        width: auto;
        .swiper-slide{
          width: auto;
          .icon-wrapper{
            width: 45px;
            height: 45px;
            padding: 8px 0px;
            display: inline-block;
          }
        }
      }
    }
  }

  .recommendText {
    margin: 0 10px;
    background: #fff;
    padding: 10px 0;
    .recommendImg {
      width: 123px;
      height: 23px;
      display: block;
      margin: 0 auto;
      @include bg-image('home/like')
    }
  }
  .listPro{
    margin: 0 10px;
  }
  .friendlink{
    .foot{
      padding: 15px 0;
    }
    .link{
      background: #fff;
      padding: 10px 15px;
      a{
        color: #666;

      }
    }
    .copy{
      background: #fff;
      padding: 10px 15px;
    }
  }
  /deep/ .mescroll-totop{
    bottom: 60px;
    width: 60px;
    height: 60px;
  }
  /deep/ .mescroll-upwarp{
    min-height: 0px;
  }
</style>
