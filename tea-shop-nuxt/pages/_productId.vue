<template>
  <div class="OutWrap">
    <backbar :bgColor="backBarOptions.bgColor"
             :leftImg="backBarOptions.leftImg"
             :rightImg="shareshow?backBarOptions.rightImg:''"
             :leftSize="backBarOptions.leftSize"
             :rightSize="backBarOptions.rightSize"
             :shartOption="shartOption">
      <div class="selected-wrapper"
           slot="title"
           v-if="backBarOptions.title">
        <span class="selected-item"
              :class="{active: backBarActive === 0}"
              data-index="0"
              @click="scrollTotop">商品</span>
        <span class="selected-item"
              :class="{active: backBarActive === 1}"
              data-index="1"
              @click="scrollTodetail">详情</span>
      </div>
    </backbar>
    <!-- <nuxt-link  to="/about/downapp" class="downBtnWrap pf" v-if="downBtn"></nuxt-link> -->
    <jump :jumpOption="jumpOption"></jump>
    <div ref="mescroll"
         class="mescroll">
      <div class="detail-wrap"
           ref="container">
        <div ref="goodWrap">
          <!-- 商品图片 -->
          <div class="img-wrpper pr"
               ref="top"
               v-if="teaProduct">
            <div v-swiper:mySwiper="swiperOption"
                 class="menu-wrapper"
                 ref="mySwiper"
                 v-if="banner.length>0">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-if="videoSrc">
                    <video :src="videoSrc" id="videoSlide"
                    :controls="MyVideoControls" webkit-playsinline="true" playsinline preload="true"
                    ref="MyVideo" :poster="`${videoSrc}?x-oss-process=video/snapshot,t_10000,m_fast`" />
                </div>
                <div class="swiper-slide"
                     v-for="(image , index) in banner"
                     :key="`menu_${index}`">
                  <img :src="image.productImage"
                       width="100%"
                       class="banner-img" :class="image.bannerSort===-1?'videoFast':''"
                       @click="ViewBannerImages(image.productImage)" />
                </div>
              </div>
            </div>
            <div class="custom-indicator">
              <div class="swiper-pagination"></div>
            </div>

            <div class="playerWraper" @click="onClickPlay" v-show="playerBtnShow&&videoTemp">
              <van-icon name="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/7/4785fa13-a1b5-4f39-932d-45d94d689f04.jpg" size="70" color="#fff"/>
            </div>

          </div>
          <!-- 限时购 -->
          <div class="timeWraper df"
               v-if="showLimtTime">
            <div class="left df">
              <div class="text f12 center">限时购&nbsp;</div>
              <div class="pri fw600 f24 cf"
                   v-if="teaData.discountPrice">¥ {{teaData.discountPrice}}</div>
              <div class="oldpri f18 fw400 cf"
                   style="text-decoration:line-through;line-height:24px;">
                   ¥ {{selData.virtualPrice||teaData.virtualPrice}}</div>
            </div>
            <div class="right">
              <p class="f15 fw400 ctea timetext">距离结束还有</p>
              <div class="timedown f28 fw400 ctea">
                <!-- <span class="timebg cfff center">{{timedown.hours}}</span>
              <span>:</span>
              <span class="timebg cfff center">{{timedown.minutes}}</span>
              <span>:</span>
              <span class="timebg cfff center">{{timedown.seconds}}</span> -->

                <van-count-down :time="countTime"
                                format="HH:mm:ss">
                  <template v-slot="timeData">
                    <span class="timebg cf tac">{{ timeData.hours|formatTime }}</span>
                    <span class="ctea">:</span>
                    <span class="timebg cf tac">{{ timeData.minutes|formatTime }}</span>
                    <span class="ctea">:</span>
                    <span class="timebg cf tac">{{ timeData.seconds|formatTime }}</span>
                  </template>
                </van-count-down>
              </div>
            </div>
          </div>
          <div class="priWraper"
               v-else>
            <span class="ctea f28 fw600">¥ {{selData.productPrice||defaultAttr.productPrice}}</span>
          </div>
          <div class="timebefore df" v-if="selData.defaultStatus===1&&teaData.discountFlag===2">
            <div class="f10 van-hairline--surround tips">限时购预告</div>
            <p class="f15">{{teaData.endTime | formatStartTime}} 开抢  抢购价: ¥{{teaData.discountPrice}}</p>
          </div>
          <!-- 商品信息 -->
          <div class="pro-wrap"
               v-if="teaAttr[0]">
            <div class="content">
              <h3 class="title">{{teaProduct.productName}}</h3>
              <p class="desc">{{teaProduct.productDescription}}</p>
              <div class="couponWrap f12 df" v-if="teaData.belongToCategory!==0" @click="jumpToCoupon">
                <div class="coupon-img"></div>
                <p class="coupon-text">回馈老茶友活动，2件9折、3件8折、5件7折</p>
                <div class="coupon-right df">
                  <span>查看</span>
                  <van-icon name="arrow"
                          color="#DE857A"
                          size="10px" />
                </div>
              </div>
              <div class="price-wrap">
                <div class="hot" style="margin-right:10px;">
                  <i></i>
                  <span class="text">销量</span>
                  <span class="num">{{teaData.saleTotal||100}}</span>
                </div>
                <div class="pingfen"
                     @click="jumpToDis">
                  <i></i>
                  <span class="text">品评分</span>
                  <span class="num">{{disData.synthesize||10}}</span>
                </div>
              </div>
            </div>
            <div class="state-wrap border-bottom"
                 @click="handleClickShowlayer"
                 style="margin-top:15px;">
              <div class="left"
                   v-if="selData.productStyle">
                <span class="lefttitle">
                  已选
                </span>
                <span class="nameselect">
                  {{selData.productStyle}}
                </span>
                <span class="nameselect"
                      style="margin-right:10px;">
                  数量:
                </span>
                <span class="nameselect">
                  {{selData.num}}
                </span>
              </div>
              <div class="left"
                   v-if="!selData.productStyle">
                <span class="selected">选择商品规格</span>
              </div>
              <div class="right">
                <div class="newtips"
                     v-if="teaData.labelStatus"></div>
                <van-icon name="arrow"
                          color="#999"
                          size="20px" />
              </div>
            </div>
            <div class="address-wrap"
                 @click="productArg=true">
              <div class="left attrd">
                <span class="name">
                  <i class="icon brand"></i>
                  <em class="text">{{teaProduct.productBrand}}</em>
                </span>
                <span class="name"
                      v-if="teaProduct.productYear&&teaProduct.productYear!=='-'&&teaProduct.productType!==1">
                  <i class="icon year"></i>
                  <em class="text">{{teaProduct.productYear}}</em>
                </span>
                <span class="name"
                      v-if="teaProduct.textureMaterial&&teaProduct.textureMaterial!=='-'&&teaProduct.productType===1">
                  <i class="icon caizhi"></i>
                  <em class="text">{{teaProduct.textureMaterial}}</em>
                </span>
                <span class="name"
                      v-if="teaProduct.productPlace&&teaProduct.productPlace!=='-'">
                  <i class="icon address"></i>
                  <em class="text">{{teaProduct.productPlace}}</em>
                </span>
              </div>
              <div class="right">
                <van-icon name="arrow"
                          color="#999"
                          size="20px" />
              </div>
            </div>
          </div>
          <div class="fuwuWraper"
               @click="productfuwu=true"
               v-if="teaProduct">
            <div class="left">
              <span class="lefttitle fw400">
                服务
              </span>
              <div class="tagWraper df">
                <van-tag size="large"
                         :round="true"
                         color="#FFE8E5"
                         v-if="teaProduct.dayDayRealSelect===1">
                  <div class="tagsub df">
                    <i class="tag tui"></i>
                    <span class="f15 text">无忧退</span>
                  </div>
                </van-tag>
                <van-tag size="large"
                         :round="true"
                         color="#FFE8E5"
                         v-if="teaProduct.dayDayRealSelect===1">
                  <div class="tagsub df">
                    <i class="tag mai"></i>
                    <span class="f15 text">随心买</span>
                  </div>
                </van-tag>
                <van-tag size="large"
                         :round="true"
                         color="#FFE8E5"
                         v-if="teaProduct.dayDayRealSelect===0">
                  <div class="tagsub df">
                    <i class="tag baozhan"></i>
                    <span class="f15 text">正品保障</span>
                  </div>
                </van-tag>
                <van-tag size="large"
                         :round="true"
                         color="#FFE8E5"
                         v-if="teaProduct.dayDayRealSelect===0">
                  <div class="tagsub df">
                    <i class="tag tuikuan"></i>
                    <span class="f15 text">极速退款</span>
                  </div>
                </van-tag>
                <van-tag size="large"
                         :round="true"
                         color="#FFE8E5">
                  <div class="tagsub df">
                    <i class="tag you"></i>
                    <span class="f15 text">包邮</span>
                  </div>
                </van-tag>
              </div>
            </div>
            <!-- <div class="right"> -->
            <van-icon name="arrow"
                      color="#D45949"
                      size="20px" />
            <!-- </div> -->
          </div>
          <!-- 用户评价 -->
          <div class="eva-wrap"
               v-if="disData.commentId">
            <div class="titleWraper">
              <div>
                <span class="disstitle">茶评</span>
                <span class="dissnum">({{disData.totalCount}})</span>
              </div>
              <div class="lookAll"
                   @click="jumpToDis">查看全部</div>
            </div>
            <Discuss v-if="disData&&disData.commentId"
                     :dianzanShow="false"
                     :lineShow="false"
                     :itemdata="disData"
                     @videoPlay="videoPlay"
                     @videoExit="videoExit"></Discuss>
          </div>
          <!-- 上拉加载更多 -->
          <div class="pull"></div>
        </div>
        <div class="detail-img"
             ref="detail">
          <div class="bottomWraper"
               v-for="(img,index) in detailImg"
               :key="index">
            <!-- <img  width="100%" :src="img.productImage"> -->
            <!-- <img :imgurl="img.productImage"
                 src="detail/detailbanner@2x.png"
                 alt=""
                 width="100%"> -->
            <img :imgurl="img.productImage"
                 src="~/assets/img/detail/detailbanner@2x.png"
                 alt=""
                 width="100%">
            <!-- <p v-html="img.bannerContent"
               v-if="img.bannerContent&&img.bannerContent!=='-'"
               class="bottomText"></p> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 加入购物车 -->
    <div class="shopping-wrap border-top">
      <div class="icon-wrap">
        <!-- <i class="iphone" @click="showpopcustom"></i> -->
        <i class="iphone"
           @click="customchat"></i>
        <i class="like"
           @click="collclose"
           v-if="teaData.collectionFlag===1"></i>
        <i class="coll"
           @click="collgood"
           v-else-if="teaData.collectionFlag===0"></i>
        <i class="car"
           @click="jumpToCart">
          <span class="cartnum"
                v-if="userCartNum!==0">{{userCartNum}}</span>
        </i>
      </div>
      <div class="btnWrap">
        <van-button type="default"
                    class="shopping"
                    @click="handleShowLayer('cart')">加入购物车</van-button>
        <!-- <van-button type="default"
                    class="shopping"
                    :class="{'opacity':toCart}"
                    v-show='toCart'>加入购物车</van-button> -->
        <van-button type="default"
                    class="pay"
                    style='float:right;'
                    @click="handleShowLayer('pay')">立即购买</van-button>
      </div>
    </div>
    <!-- 选购商品类型 -->
    <!-- !!!!!!! -->

    <!-- <transition name="van-fade"> -->
    <layer ref="proSelected"
           :typeData="teaAttr"
           :teaProduct="teaProduct"
           :selData="selData"
           @userSelect="userSelect"
           @handleClickAddCart="handleClickAddCart"
           @handleClickPay="handleClickPay"></layer>

    <!-- </transition> -->
    <!-- 微信登录未绑定手机弹出绑定手机 -->
    <!-- !!!!!!!!! -->
    <!-- <PopBindphone ref="Popphone"></PopBindphone> -->
    <!-- 商品属性弹出 -->
    <transition name="van-fade">
      <div v-show="productArg"
           class="productArgWrap">
        <van-action-sheet v-model="productArg"
                          :overlay='false'>
          <div class="proArgTitle">
            <span>产品参数</span>
            <i class="closeicon"
               @click="productArg=false"></i>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productBrand&&teaProduct.productBrand!=='-'">
            <span>品牌</span>
            <span>{{teaProduct.productBrand}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.textureMaterial&&teaProduct.textureMaterial!=='-'">
            <span>材质</span>
            <span>{{teaProduct.textureMaterial}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.style&&teaProduct.style!=='-'">
            <span>风格</span>
            <span>{{teaProduct.style}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.dateManufacture&&teaProduct.dateManufacture!=='-'">
            <span>生产日期</span>
            <span>{{teaProduct.dateManufacture}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productYear&&teaProduct.productYear!=='-'">
            <span>年份</span>
            <span>{{teaProduct.productYear}}年</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productPlace&&teaProduct.productPlace!=='-'">
            <span>产区</span>
            <span>{{teaProduct.productPlace}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productMaterial&&teaProduct.productMaterial!=='-'">
            <span>原料</span>
            <span>{{teaProduct.productMaterial}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productStyle&&teaProduct.productStyle!=='-'">
            <span>净重</span>
            <span>{{defaultAttr.productStyle}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productStorageCondition&&teaProduct.productStorageCondition!=='-'">
            <span>贮藏条件</span>
            <span>{{teaProduct.productStorageCondition}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productCraft&&teaProduct.productCraft!=='-'">
            <span>工艺</span>
            <span>{{teaProduct.productCraft}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productionLicense&&teaProduct.productionLicense!=='-'">
            <span>生产许可证</span>
            <span>{{teaProduct.productionLicense}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.productStandards&&teaProduct.productStandards!=='-'">
            <span>产品标准</span>
            <span>{{teaProduct.productStandards}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.factoryName&&teaProduct.factoryName!=='-'">
            <span>厂名</span>
            <span>{{teaProduct.factoryName}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.factoryAddress&&teaProduct.factoryAddress!=='-'">
            <span>厂址</span>
            <span>{{teaProduct.factoryAddress}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.numberApplicant&&teaProduct.numberApplicant!=='-'">
            <span>适用人数</span>
            <span>{{teaProduct.numberApplicant}}</span>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.qualityGuaranteePeriod&&teaProduct.qualityGuaranteePeriod!=='-'">
            <span>保质期</span>
            <span>{{teaProduct.qualityGuaranteePeriod}}</span>
          </div>
        </van-action-sheet>
      </div>
    </transition>
    <!-- 商品保证弹出 -->
    <transition name="van-fade">
      <div v-show="productfuwu"
           class="productfuwuWrap">
        <van-action-sheet v-model="productfuwu"
                          :overlay='false'>
          <div class="proArgTitle">
            <span>茶臻选基础保障</span>
            <i class="closeicon"
               @click="productfuwu=false"></i>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.dayDayRealSelect===1">
            <p>无忧退</p>
            <p>凡是加入品鉴计划的商品，消费者收到茶叶后，可先冲泡品鉴装。对比茶叶品质后，再决定是否购买。若要退货，快递费由平台承担。</p>
          </div>
          <div class="proArgInfo border-bottom"
               v-if="teaProduct.dayDayRealSelect===1">
            <p>随心买</p>
            <p>为满足不同客户需求，加入“随心买”的产品可选择小规格（10g，20g）购买</p>
          </div>
          <div class="proArgInfo border-bottom">
            <p>正品保证</p>
            <p>商品支持正品保证服务</p>
          </div>
          <div class="proArgInfo border-bottom">
            <p>极速退款</p>
            <p>极速退款是为诚信会员提供的退款退货流程，收到退货包裹确认无误后，将在48小时内办理退款，退款原路退回</p>
          </div>
          <div class="proArgInfo border-bottom">
            <!-- <p>满¥88包邮</p>
          <p>单笔订单金额(不含运费)，大陆地区享受满¥88包邮服务</p> -->
            <p>全场包邮</p>
            <p>平台全品类包邮服务已开启</p>
          </div>
        </van-action-sheet>
      </div>
    </transition>
    <!-- <router-view></router-view> -->
    <!-- !!!!!!!!! -->
    <MyVideoDis :videoOption="videoOption"
                v-if="VideoShow"
                @videoExit="videoExit"></MyVideoDis>
  </div>
</template>

<script>
import jump from '~/components/popjump/jump'
import backbar from '~/components/backbar'
// import PopCustom from 'base/PopCustom/PopCustom'
import layer from '~/components/detail/layer'
import { getProduct, upCart, cartNum, upFoot, upColl, delColl } from '~/api/product'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { mapGetters, mapActions } from 'vuex'
import { ImagePreview } from 'vant'
import MyVideoDis from '~/components/detail/MyVideoDis'
import Discuss from '~/components/detail/Discuss'
import { URL, wxreFunPay, wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
import { parseTime } from '~/utils'
// import PopBindphone from '~/components/detail/PopBindphone'
// belongToCategory 0  没有  1老茶   2  严选
const backBarOptionsScroll = {
  bgColor: '#fff',
  leftImg: '',
  rightImg: 'share-line',
  title: true,
  leftSize: '20px',
  rightSize: '25px'
}
const backBarOptionsOn = {
  bgColor: 'transparent',
  leftImg: 'back',
  rightImg: 'share',
  title: false,
  leftSize: '25px',
  rightSize: '25px'
}
export default {
  validate ({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.productId)
  },
  data () {
    var that = this
    return {
      current: 0,
      backBarOptions: Object.assign({}, backBarOptionsOn),
      backBarActive: 0,
      productId: '',
      specialId: '',
      userCartNum: 0,
      gobackMyback: false,
      productArg: false, // 产品参数弹窗
      productfuwu: false, // 产品服务弹窗
      mescroll: null, // mescroll实例对象
      swiperOption: {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        on: {
          slideChangeTransitionStart: function() {
            if (that.videoTemp) {
              that.exitVideo()
            }
          }
        }
      },
      jumpOption: '',
      MyVideoControls: false,
      playerBtnShow: true,
      goHome: false,
      videoOption: {},
      VideoShow: false,
      countTime: 0,
      shartOption: {},
      downBtn: false,
      videoTemp: false
    }
  },
  // 异步获取数据
  async asyncData ({ $axios, route, store }) {
    try {
      const teaData = await $axios.$post(getProduct, {
        productId: route.params.productId,
        specialId: route.params.specialId || '',
        userId: store.getters.user.userId || ''
      })
      let selData = {}
      let defaultAttr = {}
      teaData.data.teaAttrProduct.forEach(item => {
        item.num = 1
        if (item.defaultStatus === 1) {
          selData = item
          defaultAttr = item
        }
      })
      const banner = teaData.data.teaProductBannerTop
      if (teaData.data.teaAttrProduct.length === 1) {
        selData = teaData.data.teaAttrProduct[0]
      }
      return {
        teaData: teaData.data, //
        teaProduct: teaData.data.teaProduct, // 基本信息
        teaAttr: teaData.data.teaAttrProduct, // 商品属性
        banner: banner, // 顶部banner图
        detailImg: teaData.data.teaProductBannerBottom, // 下方商品详情图
        disData: teaData.data.productComment, // 评论数据
        selData: selData,
        defaultAttr: defaultAttr,
        videoSrc: teaData.data.productVideo
      }
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    this.mescrollInit()
    this.productId = this.$route.params.productId
    this.specialId = this.$route.params.specialId || ''
    this.gobackMyback = this.$route.params.gobackMyback || false
    this.jumpOption = `?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}/${this.productId}` })}`
    this.productDetail()
    this.findUser()
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
    setTimeout(() => {
      this.downBtn = !(IOS || ANDROID)
    }, 100)
  },
  methods: {
    parseTime,
    videoInit() {
      if (!ANDROID) {
        if (this.videoSrc) {
          this.videoTemp = true
        } else {
          // this.$refs.mySwiper.swiper.removeSlide(0)
        }
        this.$refs.mySwiper.swiper.update()
      } else {
        if (this.videoSrc) {
          this.$refs.mySwiper.swiper.removeSlide(0)
          this.videoTemp = true
          this.banner.unshift({
            bannerContent: '-',
            bannerSort: -1,
            productImage: `${this.videoSrc}?x-oss-process=video/snapshot,t_10000,m_fast`
          })
        }
        this.$refs.mySwiper.swiper.update()
      }
    },
    mescrollInit () {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          isBounce: false,
          auto: false,
          lazyLoad: {
            use: true
          }
        }
      })
      this.mescroll.optUp.onScroll = this.meScorllScroll
    },
    meScorllScroll (mescroll, y, isUp) {
      const goodHeight = this.$refs.goodWrap.clientHeight
      if (y >= 150) {
        this.backBarOptions = Object.assign({}, backBarOptionsScroll)
      } else {
        this.backBarOptions = Object.assign({}, backBarOptionsOn)
      }
      if (y > (goodHeight - 100)) {
        this.backBarActive = 1
      } else {
        this.backBarActive = 0
      }
    },
    onClickPlay () {
      this.$refs.mySwiper.swiper.slideTo(1)
      this.playerBtnShow = false // 播放安宁
      if (!ANDROID) {
        this.myVideo.play()
      } else {
        this.videoPlay({
          frameImage: `${this.videoSrc}?x-oss-process=video/snapshot,t_10000,m_fast`,
          videoPath: this.videoSrc
        })
      }
      this.MyVideoControls = true // 显示默认的控制栏
    },
    exitVideo () {
      // 切换到视频时显示播放按钮
      console.log(this.$refs.mySwiper.swiper.realIndex)
      if (this.$refs.mySwiper.swiper.realIndex === 0) {
        this.playerBtnShow = true
      } else {
        this.playerBtnShow = false
      }
      this.myVideo.pause()
      this.MyVideoControls = false
    },
    videoPlay (val) {
      this.videoOption = val
      this.VideoShow = true
      console.log(val)
    },
    videoExit () {
      this.videoOption = {}
      this.VideoShow = false
      if (this.videoSrc) {
        this.playerBtnShow = true
      }
    },
    jumpToCoupon() {
      // 1老茶   2  严选
      // if (this.teaData.belongToCategory === 2) {
      //   this.$router.push({ path: '/opera/special', query: { type: 57, name: '严选口粮茶', gobackMyback: this.gobackMyback } })
      // } else if (this.teaData.belongToCategory === 1) {
      //   this.$router.push({ path: '/opera/oldtea', query: { gobackMyback: this.gobackMyback } })
      // }
      if ([1, 2].includes(this.teaData.belongToCategory)) {
        this.$router.push({ path: '/activity/feedback', query: { gobackMyback: this.gobackMyback } })
      }
    },
    onChange (index) {
      this.current = index
    },
    share () {
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goShareType', JSON.stringify(this.shartOption), res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goShareType(JSON.stringify(this.shartOption))
      } else {
        // let url = `${URL}/#/?type=商品详情&productId=${this.productId}`
        // url = encodeURIComponent(url)
      }
    },
    // 跳转全部评价
    handleClickMorePj () {
      this.$router.push('/evaluate')
    },
    // 添加购物车
    handleClickAddCart () {
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('getUserInfo', null, res => {
              const userId = res.userId
              const token = res.token
              if (userId && token) {
                this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
                this.addToCart()
              } else {
                this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
                window.callback(ios => {
                  ios.callHandler('goLogin', null, res => {
                    this.$toast('去登录')
                  })
                })
              }
              // var userid = JSON.parse(res)
              // alert(res.userId)
            })
          })
        }, 20)
      } else if (ANDROID) {
        // 加入购物车前判断安卓是否登录 未登录拉起安卓登录
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          this.addToCart()
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.addToCart()
        } else if (WX) {
          // this.$router.push({ name: 'WXLogin', query: { type: '商品详情', productId: this.productId } })
          setStore('__redirectUrl__', this.$route.fullPath)
          window.location.href = `${wxreURL}`
        } else {
          this.$router.push('/login')
        }
      }
    },
    handleShowLayer(val) {
      if (this.teaAttr.length > 1) {
        this.$refs.proSelected.type = val
        this.$refs.proSelected.toggle()
      } else {
        if (val === 'cart') {
          this.handleClickAddCart()
        } else if (val === 'pay') {
          this.handleClickPay()
        }
      }
    },
    // 立即购买 跳转支付页面
    handleClickPay () {
      // if (this.teaAttr.length > 1) {
      //   this.$refs.proSelected.type = 'pay'
      //   this.$refs.proSelected.toggle()
      //   return
      // }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            console.log('getUserInfo', res)
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              const sendIOS = {
                productName: this.teaProduct.productName,
                productImage: this.teaProduct.productImage,
                productId: this.productId,
                productCount: this.selData.num,
                attrId: this.selData.attrId,
                productPrice: this.selData.productPrice,
                unitPrice: this.selData.productPrice
              }
              window.callback(ios => {
                ios.callHandler('goConfirmPay', JSON.stringify(sendIOS), res => {
                })
              })
            } else {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              window.callback(ios => {
                ios.callHandler('goLogin', null, res => {
                  this.$toast('去登登录')
                })
              })
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          const sendIAND = {
            productName: this.teaProduct.productName,
            productImage: this.teaProduct.productImage,
            productId: this.productId,
            num: this.selData.num,
            attrId: this.selData.attrId,
            productPrice: this.selData.productPrice,
            unitPrice: this.selData.productPrice
          }
          console.log(sendIAND)
          window.android.goPay(JSON.stringify(sendIAND))
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        // if (getLocalStorage('mobileFlag') || this.mobileFlag) {
        const orderData = [{
          productName: this.teaProduct.productName,
          productImage: this.teaProduct.productImage,
          productId: this.productId,
          productCount: this.selData.num,
          attrId: this.selData.attrId,
          productPrice: this.selData.productPrice,
          unitPrice: this.selData.productPrice
        }]
        sessionStorage.setItem('__teaOrder__', JSON.stringify(orderData))
        sessionStorage.setItem('__teapayType__', 'detail')
        if (WX) {
          // wxreFunPay()
          console.log(wxreFunPay)
          if (this.user.isLogin) {
            // 登录态直接去拉取授权获取code后跳转到支付确认页面
            window.location.href = `${wxreFunPay}`
          } else {
            // 如果没有登录保存当前页面拉取授权后再返回当前页面
            setStore('__redirectUrl__', this.$route.fullPath)
            window.location.href = `${wxreURL}`
          }
          // this.$router.push('/pay/sure')
        } else {
          this.$router.push({
            path: '/pay/sure'
          })
        }
        // } else {
        //   this.$refs.Popphone.toggle()
        // }
      }
    },
    // 加入购物车
    addToCart () {
      // if (this.teaAttr.length > 1) {
      //   this.$refs.proSelected.type = 'cart'
      //   this.$refs.proSelected.toggle()
      //   return
      // }
      const option = {
        orderDetailStr: `${this.productId}&${this.selData.num}&${this.selData.attrId}`,
        userId: this.user.userId
      }
      this.$axios.$post(upCart, option).then(res => {
        if (res.code === 10000) {
          this.$toast('添加购物车成功')
          const productId = { productId: this.productId }
          setTimeout(() => {
            this.findUser()
          }, 100)
          if (IOS) {
            window.callback(ios => {
              ios.callHandler('addToCart', JSON.stringify(productId), res => {
              })
            })
          } else if (ANDROID) {
            window.android.refreshShoppingData()
          }
        } else {
          this.$toast(res.message)
        }
      })
    },
    // 添加收藏
    collgood () {
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('clickCollect', null, res => {
            })
          })
          window.callback(ios => {
            ios.callHandler('getUserInfo', null, res => {
              const userId = res.userId
              const token = res.token
              if (userId && token) {
                this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
                this.upgoodColl()
              } else {
                this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
                window.callback(ios => {
                  ios.callHandler('goLogin', null, res => {
                    this.$toast('去登录')
                  })
                })
              }
              // var userid = JSON.parse(res)
              // alert(res.userId)
            })
          })
        }, 20)
      } else if (ANDROID) {
        // 加入购物车前判断安卓是否登录 未登录拉起安卓登录
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          this.upgoodColl()
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        this.upgoodColl()
      }
    },
    upgoodColl () {
      const option = {
        userId: this.user.userId,
        productId: this.productId,
        productPrice: this.selData.productPrice ? this.selData.productPrice : this.teaAttr[0].productPrice
      }
      this.$axios.$post(upColl, option).then(res => {
        if (res.code === 10000) {
          this.$toast('收藏成功')
          this.teaData.collectionFlag = 1
        } else {
          this.$toast(res.message)
        }
      })
    },
    collclose () {
      const option = {
        userId: '',
        productId: this.productId,
        delType: '0'
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            option.userId = res.userId
            this.upCollClose(option)
          })
        })
      } else if (ANDROID) {
        option.userId = window.android.getUserId()
        this.upCollClose(option)
      } else {
        option.userId = this.user.userId
        this.upCollClose(option)
      }
    },
    upCollClose (option) {
      this.$axios.post(delColl, option).then(res => {
        console.log(res.data)
        // ??????????????????????
        if (res.data.code === 10000) {
          this.$toast('取消成功')
          this.teaData.collectionFlag = 0
        } else {
          this.$toast(res.data.message)
        }
      })
    },
    // 获取购物车数量 先拿取用户信息,未登录就不在请求接口  当中 会添加本商品到足迹
    findUser () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              this.productDetail()
              this.$axios.$post(cartNum, { userId: userId }).then(res => {
                if (res.code === 10000) {
                  this.userCartNum = res.data.count
                } else {
                  this.$toast(res.message)
                }
              })
              // 添加到足迹
              if (this.productId) {
                this.$axios.$post(upFoot, { userId: userId, productId: this.productId }).then(res => { })
              }
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          this.productDetail()
          this.$axios.$post(cartNum, { userId: userId }).then(res => {
            if (res.code === 10000) {
              this.userCartNum = res.data.count
            } else {
              this.$toast(res.message)
            }
          })
          // 添加到足迹
          if (this.productId) {
            this.$axios.$post(upFoot, { userId: userId, productId: this.productId }).then(res => { })
          }
        }
      } else {
        if (this.user.isLogin) {
          this.$axios.$post(cartNum, { userId: this.user.userId }).then(res => {
            if (res.code === 10000) {
              this.userCartNum = res.data.count
            } else {
              this.$toast(res.message)
            }
          })
          // 添加到足迹
          if (this.productId) {
            this.$axios.$post(upFoot, { userId: this.user.userId, productId: this.productId }).then(res => { })
          }
        }
      }
    },
    // 点击购物车icon跳转到购物车页面
    jumpToCart () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('goCartList', null, res => {
          })
        })
      } else if (ANDROID) {
        window.android.goShoppingData()
      } else {
        this.$router.push('/cart')
      }
    },
    showpopcustom () {
      this.$refs.popcustom.show = true
    },
    // 显示商品属性选择
    handleClickShowlayer () {
      this.$refs.proSelected.type = '2'
      this.$refs.proSelected.toggle()
    },
    // 显示绑定手机
    handleClickPopBindphone () {
      this.$refs.PopBindphone.toggle()
    },
    // 返回到顶部
    scrollTotop () {
      this.mescroll.scrollTo(0)
    },
    // 滑动到商品详情
    scrollTodetail () {
      const goodHeight = this.$refs.goodWrap.clientHeight
      this.mescroll.scrollTo(goodHeight)
    },
    // 用户选择的商品属性
    userSelect (selData) {
      this.selData = Object.assign({}, selData)
      // this.selData.num = num
    },
    // 获取商品详情
    productDetail () {
      const option = {
        productId: this.productId,
        specialId: this.specialId,
        userId: this.user.userId
      }
      this.$axios.$post(getProduct, option).then(res => {
        if (res.code === 10000) {
          try {
            this.teaData = res.data
            this.teaProduct = res.data.teaProduct
            this.teaAttr = res.data.teaAttrProduct
            this.banner = res.data.teaProductBannerTop
            this.detailImg = res.data.teaProductBannerBottom
            this.disData = res.data.productComment
            this.videoSrc = res.data.productVideo
            this.videoInit()
            this.countTime = this.teaData.endTime - new Date().getTime()
            this.teaAttr.forEach(item => {
              item.num = 1
              if (item.defaultStatus === 1) {
                // item.num = 1
                this.selData = item
                this.defaultAttr = item
              }
            })
            // console.log(this.selData)
            if (res.data.teaAttrProduct.length === 1) {
              this.selData = res.data.teaAttrProduct[0]
            }
            setTimeout(() => {
              this.shareFun()
            }, 50)
          } catch (error) {
            console.log(error)
          }
        } else {
          this.$toast(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 跳转到客服页面
    customchat () {
      const sendData = {
        productId: this.productId,
        imageUrl: this.teaProduct.productImage,
        productName: this.teaProduct.productName,
        price: this.selData.productPrice,
        productCount: this.selData.num
      }
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('getUserInfo', null, res => {
              const userId = res.userId
              const token = res.token
              if (userId && token) {
                this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
                window.callback(ios => {
                  ios.callHandler('goCustomerService', sendData, res => {

                  })
                })
              } else {
                this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
                window.callback(ios => {
                  ios.callHandler('goLogin', null, res => {
                    this.$toast('去登录')
                  })
                })
              }
              // var userid = JSON.parse(res)
              // alert(res.userId)
            })
          })
        }, 20)
      } else if (ANDROID) {
        const sendDataAND = {
          productId: this.productId,
          imageUrl: this.teaProduct.productImage,
          productName: this.teaProduct.productName,
          price: `${this.selData.productPrice}`,
          productCount: this.selData.num
        }
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          window.android.goCustomerService(JSON.stringify(sendDataAND))
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        sendData.from = 'detail'
        sessionStorage.setItem('__teacustom__', JSON.stringify(sendData))
        this.$router.push({ path: '/custom' })
      }
    },
    shareFun () {
      this.shartOption = {
        type: 'url',
        data: {
          title: this.teaProduct.productName, // 分享标题
          desc: this.teaProduct.productDescription, // 分享描述
          link: `${URL}/${this.productId}`, // 分享链接
          imgUrl: this.teaProduct.productImage // 分享图标
        }
      }
      this.getShareWxArg(this.shartOption)
    },
    jumpToDis () {
      this.$router.push({ name: 'prodis', query: { productId: this.productId } })
    },
    ViewBannerImages (item) {
      const index = this.bannerImagesList.indexOf(item)
      const that = this
      ImagePreview({
        images: this.bannerImagesList,
        startPosition: index,
        onClose (e) {
          that.$refs.mySwiper.swiper.slideToLoop(e.index, 0, false)
        }
      })
    },
    ...mapActions(['saveLogin', 'getShareWxArg'])
  },
  beforeDestroy () {
    // this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  watch: {
    productId (newval) {
      if (!newval) {
        this.$toast('产品ID不能为空')
      }
    }
  },
  computed: {
    ...mapGetters([
      'user']),
    shareshow () {
      return IOS || ANDROID
    },
    myVideo() {
      return document.getElementById('videoSlide')
    },
    showLimtTime() {
      return ([0, 1].includes(this.selData.defaultStatus) ? this.selData.defaultStatus === 1 : this.defaultAttr.defaultStatus === 1) && this.teaData.discountFlag === 1
      // return false
    },
    shoTagPlan () {
      return this.teaProduct.productType === 0 && this.teaAttr.length > 1
    },
    showTagBuy () {
      return this.teaProduct.productType === 0 && this.teaAttr.length > 1
    },
    bannerImagesList () {
      const arr = []
      for (let i = 0; i < this.banner.length; i++) {
        if (this.banner[i].productImage && this.banner[i].productImage !== '-') {
          arr.push(this.banner[i].productImage)
        } else {
          arr.push(this.productImage)
        }
      }
      return arr
    },
    toCart () {
      return IOS && !this.user.isLogin
    }
  },
  head() {
    return {
      title: `${this.teaProduct.productName} - 商品信息 - 茶臻选`,
      meta: [
        { hid: 'type-keywords', name: 'keywords', content: `${this.teaProduct.productName}商品信息，${this.teaProduct.productName}价格，茶臻选` },
        { hid: 'type-description', name: 'description', content: `茶臻选商城为您提供${this.teaProduct.productName}商品信息，包含价格、图片、用户真实评论等信息，选好茶就到茶臻选商城。` }
      ]
    }
  },
  filters: {
    formatTime (val) {
      return val < 10 ? `0${val}` : val
    },
    formatStartTime(val) {
      const today = parseTime(new Date(), '{m}-{d}')
      const dateformat = parseTime(val, '{m}-{d}')
      const timeformat = parseTime(val, '{h}:{i}')
      if (today === dateformat) {
        return `今天${timeformat}`
      } else if ((parseInt(dateformat.split('-')[1]) - parseInt(today.split('-')[1])) === 1) {
        return `明天${timeformat}`
      } else {
        return `${dateformat} ${timeformat}`
      }
    }
  },
  components: {
    backbar,
    jump,
    // BackShare,
    // Back,
    // PopCustom,
    layer,
    // PopBindphone,
    Discuss,
    // MescrollVue,
    MyVideoDis
    // videoPlayer
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.OutWrap {

  .downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 20%;
    transform: translateY(-50%);
    z-index: 999;
  }
  /deep/ .mescroll {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 49px;
    height: auto;
    // z-index: 10;
  }
  /deep/ .mescroll-upwarp {
    display: none;
  }
  .detail-wrap {
    z-index: 10;
    background-color: #f2f2f2;
    font-weight: normal;
    .img-wrpper {
      // width: 100%;
      height: 375px;
      @include bg-image('detail/detailbanner');

      background-position: 50% 50%;
      background-size: 120%;
      .swiper-slide{
        .videoFast{
          object-fit: contain;
          background: #000;
        }
        *::-webkit-media-controls-panel {
          display: none!important;
          -webkit-appearance: none;
        }

        /* Old shadow dom for play button */

        *::--webkit-media-controls-play-button {
          display: none!important;
          -webkit-appearance: none;
        }

        /* New shadow dom for play button */

        /* This one works */

        *::-webkit-media-controls-start-playback-button {
          display: none!important;
          -webkit-appearance: none;
        }
      }
      img {
        width: 100%;
        height: 375px;
      }
      .custom-indicator {
        position: absolute;
        right: 50%;
        bottom: 5px;
        z-index: 12;
        padding: 3px 9px;
        box-sizing: border-box;
        transform: translate(50%, 0);
        font-size: 14px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        /deep/ .swiper-pagination {
          position: static;
        }
      }
      .playerWraper {
        position: absolute;
        // bottom: 50px;
        z-index: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
      /deep/ #videoSlide {
        width: 375px;
        height: 375px;
        background: rgba(0, 0, 0, 1);
      }
    }
    .timeWraper {
      width: 100%;
      height: 60px;
      background-size: cover;
      @include bg-image('detail/timewraper');
      align-items: center;
      justify-content: space-between;
      .left {
        flex: 0 0 200px;
        justify-content: space-between;
        align-items: center;
        .text {
          width: 49px;
          height: 22px;
          line-height: 22px;
          color: #fe7e71;
          text-align: center;
          background-size: cover;
          @include bg-image('detail/text');
        }
      }
      .right {
        flex: 0 0 100px;
        height: 100%;
        .timetext {
          margin: 5px 0 4px;
        }
        .timedown {
          .timebg {
            display: inline-block;
            width: 22px;
            height: 22px;
            line-height: 22px;
            background-size: cover;
            @include bg-image('detail/timebg');
          }
        }
      }
    }
    .priWraper {
      padding: 15px 15px 0;
      background: #fff;
    }
    .timebefore{
      padding: 15px 15px 0;
      background: #fff;
      color: #E8B563;
      align-items: center;
      .tips{
        padding: 1px 15px;
        margin-right: 10px;
        &.van-hairline--surround:after{
          border: 1px solid #E8B563;
          border-radius: 50px;
        }
      }
    }
    .pro-wrap {
      .content {
        padding: 15px;
        background: #fff;
        &:before {
          border-color: #e8e8e8;
        }
        .title {
          margin-bottom: 10px;
          font-size: 18px;
          line-height: 22px;
          font-weight: bold;
        }
        .desc {
          line-height: 22px;
          font-size: 14px;
          color: #666;
        }
        .couponWrap{
          background:rgba(241,123,109,0.08);
          color: #DE857A;
          border-radius:5px;
          align-items: center;
          padding: 4px 6px;
          margin-top: 10px;
          .coupon-img{
            width: 24px;
            height: 12px;
            @include bg-image('detail/youhui');
            margin-right: 10px;
          }
          .coupon-text{
            flex: 1;
          }
          .coupon-right{
            align-items: center;
          }
        }
        .price-wrap {
          margin-top: 10px;
          font-size: 18px;
          color: #d45949;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .price {
            margin-left: 5px;
            font-size: 24px;
          }
          .hot {
            display: flex;
            align-items: center;
            i {
              width: 10px;
              height: 10px;
              @include bg-image('detail/hot');
              background-size: cover;
              margin-bottom: 1px;
            }
            .text {
              color: #999;
              font-size: 12px;
              margin: 0 5px;
            }
            .num {
              color: #333;
              font-size: 12px;
            }
          }
          .pingfen {
            display: flex;
            align-items: center;
            i {
              width: 10px;
              height: 10px;
              @include bg-image('detail/star');
              background-size: cover;
              margin-bottom: 1px;
            }
            .text {
              color: #999;
              font-size: 12px;
              margin: 0 5px;
            }
            .num {
              color: #333;
              font-size: 12px;
            }
          }
        }
      }
    }
    .state-wrap,
    .address-wrap {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      height: 43px;
      background: #fff;
      .left {
        font-size: 15px;
        display: flex;
        align-items: center;
        &.attrd {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .name {
            .text {
              font-size: 15px;
              line-height: 18px;
              color: #333;
            }
          }
        }
        .lefttitle {
          color: #999;
          font-size: 15px;
          flex: 0 0 50px;
        }
        .nameselect {
          margin-right: 15px;
          font-size: 15px;
          flex: 0 0 auto;
        }
        .name {
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 16px;
            height: 16px;
            background-size: cover;
            &.brand {
              @include bg-image('detail/brand');
            }
            &.year {
              @include bg-image('detail/year');
            }
            &.caizhi {
              @include bg-image('detail/caizhi');
            }
            &.address {
              @include bg-image('detail/address');
            }
          }
          .text {
            margin-top: 0.01px;

            vertical-align: top;
            white-space: nowrap;
            font-weight: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 31px;
            font-size: 12px;
          }
          &:nth-child(2) {
            margin: 0 30px 0 30px;
          }
        }
        .selected {
          margin-right: 15px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .newtips {
          width: 25px;
          height: 10px;
          @include bg-image('detail/tag');
          background-size: cover;
        }
      }
    }
    .address-wrap {
      .name {
        font-size: 0;
        .icon {
          margin-right: 15px;
        }
      }
      .text {
        font-size: 15px;
        color: #333;
        font-weight: normal;
      }
    }
  }
  .fuwuWraper {
    display: flex;

    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 15px;
    background: #ffe8e5;
    .tagWraper {
      // align-items: center;
      .tagsub {
        justify-content: space-between;
        .tag {
          width: 17px;
          height: 17px;
          margin-right: 7px;
          background-size: cover;
          display: inline-block;
          &.baozhan {
            @include bg-image('detail/baozhan');
          }
          &.tuikuan {
            @include bg-image('detail/tuikuan');
          }
          &.tui {
            @include bg-image('detail/tui');
          }
          &.mai {
            @include bg-image('detail/mai');
          }
          &.you {
            @include bg-image('detail/you');
          }
        }
        .text {
          // height: 15px;
          line-height: 16px;
          color: #d45949;
        }
      }
    }
    .left {
      display: flex;
      align-items: center;
      flex: 1;
      color: #d45949;
      .lefttitle {
        font-size: 15px;
        flex: 0 0 40px;
      }
      .name {
        margin-right: 15px;
        font-size: 15px;
        line-height: 16px;
      }
      .plan {
        position: relative;
        margin-right: 25px;
        .planImg {
          @include bg-image('detail/tag');
          background-size: cover;
          width: 25px;
          height: 10px;
          top: -20px;
          right: -15px;
          position: absolute;
        }
      }
    }
    .eval-wrap {
      padding-left: 10px;
      overflow: hidden;
      .title {
        float: left;
        font-size: 14px;
        font-weight: 700;
      }
      .sub {
        float: right;
        font-size: 12px;
      }
    }
    .content {
      width: 100%;
      height: 90px;
      .group {
        height: 90px;
        white-space: nowrap;
        .item {
          box-sizing: border-box;
          display: inline-block;
          vertical-align: top;
          margin-right: 10px;
          padding: 10px;
          width: 350px;
          height: 100%;
          background-color: #fff;
          .info {
            width: 100%;
            .img {
              display: inline-block;
              vertical-align: top;
              width: 33px;
              height: 33px;
              background-color: #000000;
            }
            .name-wrap {
              margin-left: 10px;
              display: inline-block;
              vertical-align: top;
              .name {
                margin-bottom: 4px;
                line-height: 19px;
              }
              .icon-wrap {
                display: block;
                width: 100%;
                height: 10px;
                background-color: red;
              }
            }
          }
          .text {
            margin: 20px 4px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .more {
      float: right;
      padding: 10px;
      margin: 5px 0.01px 0 0;
    }
  }
  .eva-wrap {
    margin-top: 15px;
    .titleWraper {
      padding: 15px 13px 15px 14px;
      font-weight: normal;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      .disstitle {
        color: #333;
      }
      .dissnum {
        color: #666;
      }
      .lookAll {
        color: #666;
        font-size: 14px;
      }
    }
  }
  .rele-wrap {
    padding-left: 10px;
    .title {
      margin: 10px 0 14px 5px;
      font-size: 14px;
      font-weight: 700;
    }
  }
  .pull {
    width: 125px;
    height: 23px;
    margin: 15px auto;
    background-size: cover;
    @include bg-image('detail/detailtitle');
  }
  .detail-img {
    min-height: 250px;
    line-height: 0;
    .bottomWraper {
      .bottomText {
        text-align: center;
        background: #fff;
        padding: 0 100px;
        line-height: 22px;
        font-size: 14px;
        color: #666;
      }
    }
  }
  .shopping-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 19;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: calc(48px + constant(safe-area-inset-bottom));
    background-color: #ffffff;
    .icon-wrap {
      flex: 1;
      padding: 0 0 0 15px;
      display: flex;
      align-items: center;
      i {
        margin: 0 10px;
        display: inline-block;
        vertical-align: top;
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;
        &.iphone {
          @include bg-image('detail/iphone');
        }
        &.coll {
          @include bg-image('detail/coll');
        }
        &.like {
          @include bg-image('detail/like');
        }
        &.car {
          position: relative;
          @include bg-image('detail/car');
          .cartnum {
            position: absolute;
            top: -8px;
            right: -6px;
            display: block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            background: #ea6f5f;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
    .btnWrap {
      flex: 0 0 220px;
      display: flex;
    }
    .btnWrap /deep/ .van-button {
      border-radius: 0;
    }
    .btnWrap /deep/ .van-button--normal {
      flex: 0 0 110px;
      height: 49px;
      color: #fff;
      font-size: 18px;
      padding: 0;
      &.shopping {
        background-color: #ea6f5f;
      }
      &.opacity {
        opacity: 0;
      }
      &.pay {
        background-color: #d45949;
      }
    }
    .btnWrap /deep/ .van-button--default {
      border: 0;
    }
  }
  .selected-wrapper {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    .selected-item {
      position: relative;
      margin: 0 10px;
      padding: 2px 20px;
      font-size: 15px;
      color: #666;
      font-family: PingFang-SC-Regular;
      &.active {
        font-weight: 600;
        font-size: 18px;
        color: #333;
        // @include under();
      }
    }
  }
  .productArgWrap {
    font-size: 15px;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 22;
    background: rgba(0, 0, 0, 0.5);
    .proArgTitle {
      color: #333;
      height: 44px;
      line-height: 44px;
      text-align: center;
      position: relative;
      .closeicon {
        display: block;
        position: absolute;
        right: 15px;
        top: 15px;
        width: 20px;
        height: 20px;
        padding: 5px;
        box-sizing: border-box;
        @include bg-image('detail/closebtn');
        background-size: 74%;
        background-repeat: no-repeat;
        font-weight: normal;
      }
    }
    .proArgInfo {
      height: 44px;

      margin: 0 10px;
      padding: 0 5px;
      display: flex;
      align-items: center;
      white-space: nowrap;
      :first-child {
        color: #999;
        width: 25%;
      }
      :last-child {
        width: 75%;
        color: #333;
        font-weight: normal;
        white-space: normal;

        text-overflow: ellipsis;
      }
    }
  }
  .productArgWrap /deep/ .van-action-sheet__content {
    padding-bottom: 25px;
  }
  .productfuwuWrap {
    font-weight: normal;
    font-size: 15px;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 22;
    background: rgba(0, 0, 0, 0.5);
    .proArgTitle {
      color: #333;
      height: 44px;
      line-height: 44px;
      text-align: center;
      position: relative;
      .closeicon {
        display: block;
        position: absolute;
        right: 15px;
        top: 15px;
        width: 20px;
        height: 20px;
        padding: 5px;
        box-sizing: border-box;
        @include bg-image('detail/closebtn');
        background-size: 74%;
        background-repeat: no-repeat;
        font-weight: normal;
      }
    }
    .proArgInfo {
      margin: 0 10px;
      padding: 0 5px;
      white-space: nowrap;
      :first-child {
        color: #333;
        width: 100%;
        font-size: 18px;
        padding-top: 15px;
      }
      :last-child {
        width: 100%;
        color: #999;
        font-size: 15px;
        line-height: 16px;
        font-weight: normal;
        white-space: normal;
        padding: 15px 0;

        text-overflow: ellipsis;
      }
    }
  }
}
.palyer {
  width: 2.5px;
  height: 2.5px;
  overflow: hidden;
  position: relative;

  z-index: 30;
  margin: 0 10px 10px 0;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  .btn {
    position: absolute;
    width: 17px;
    height: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // @include bg-image('btnplayer');
    background-size: cover;
  }
  video {
    width: 100%;
    width: 350px;
    height: 350px;
  }
}
.videofixed {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  video {
    // width: 90%;
    // height: 90%;
    width: 350px;
    height: 350px;
  }
  .exitBtn {
    margin: 0 auto;
    width: 80px;
    text-align: center;
    margin-top: 15px;
    font-size: 15px;
    color: #333;
    letter-spacing: 0;
    padding: 10px 15px;
    background: hsla(0, 0%, 100%, 0.8);
    box-shadow: 0 2.5px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 15px;
  }
}
</style>
