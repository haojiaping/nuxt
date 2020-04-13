<template>
  <div class="OutWrap">
    <backbar :bgColor="backBarOptions.bgColor"
             :leftImg="backBarOptions.leftImg"
             :rightImg="shareshow?backBarOptions.rightImg:''"
             :leftSize="backBarOptions.leftSize"
             :rightSize="backBarOptions.rightSize">
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
                <div class="swiper-slide"
                     v-for="(image , index) in banner"
                     :key="`menu_${index}`">
                  <img :src="image.productImage"
                       width="100%"
                       class="banner-img"
                       @click="ViewBannerImages(image.productImage)" />
                </div>
              </div>
            </div>
            <div class="custom-indicator">
              <div class="swiper-pagination"></div>
            </div>
            <!-- <div class="playerWraper" @click="onClickPlay" v-show="playerBtnShow">
            <van-icon name="play-circle-o" size="70" color="#333"/>
          </div> -->
            <!-- 完整购买 -->
            <div class='all-buyBtn'
                 @click="jumpDetail">整饼购买</div>
          </div>
          <div class="priWraper"
               v-else>
            <span class="ctea f28 fw600">¥ {{selData.productPrice}}</span>
          </div>
          <!-- 商品信息 -->
          <div class="pro-wrap"
               v-if="teaAttr[0]">
            <div class="content">
              <!-- 规格 -->
              <p class='product-size'>
                <span class='price'>¥{{smallAttr.productPrice}}</span><span class='size'>/{{smallAttr.productStyle}}</span><span class='all'>¥ {{defaultAttr.productPrice}} /{{defaultAttr.productStyle}}</span>
              </p>
              <h3 class="title">{{teaProduct.productName}}</h3>
              <!-- <div class="price-wrap">
                <div class="pingfen"
                     @click="jumpToDis">
                  <i></i>
                  <span class="text">品评分</span>
                  <span class="num">{{disData.synthesize||10}}</span>
                </div>
              </div> -->
            </div>
          </div>
          <!-- 试饮流程 -->
          <div class='process'>
            <p class='title'>
              <span class='left'>试饮流程</span>
              <span class='right'
                    @click='showMsg'></span>
            </p>
            <ul class='list'>
              <li>
                <div>
                  <img :src="require('~/assets/img/tasting/Process1@2x.png')"
                       alt="">
                  <span class='line'></span>
                </div>
                <span>领取下单</span>
              </li>
              <li>
                <div>
                  <img :src="require('~/assets/img/tasting/Process2@2x.png')"
                       alt="">
                  <span class='line'></span>
                </div><span>商家发货</span>
              </li>
              <li>
                <div>
                  <img :src="require('~/assets/img/tasting/Process3@2x.png')"
                       alt="">
                  <span class='line'></span>
                </div><span>试饮评价</span>
              </li>
              <li>
                <div>
                  <img :src="require('~/assets/img/tasting/Process4@2x.png')"
                       alt="">
                  <span class='line'></span>
                </div><span>提交客服</span>
              </li>
              <li>
                <div>
                  <img :src="require('~/assets/img/tasting/Process5@2x.png')"
                       alt="">
                </div><span>双倍茶银</span>
              </li>
            </ul>
          </div>
          <!-- 用户评价 -->
          <div class="eva-wrap"
               v-if="disData.commentId">
            <div class="titleWraper">
              <div>
                <span class="disstitle">试饮报告</span>
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
    <!-- <div class="shopping-wrap border-top">
      <div class="icon-wrap"> -->
    <!-- <i class="iphone" @click="showpopcustom"></i> -->
    <!-- <div class='have'>
          <p class='top'>今日剩余3份</p>
          <p class='bottom'>(每日更新)</p>
        </div>
        <div class='none'>今日已抢光</div>
      </div>
      <div class="btnWrap"> -->
    <!-- <van-button type="default"
                    class="shopping"
                    :class="{'opacity':toCart}"
                    v-show='toCart'>加入购物车</van-button> -->
    <!-- <van-button type="default"
                    class="pay"
                    style='float:right;'
                    @click="handleClickPay">立即购买</van-button>
        <van-button type="default"
                    class="grab"
                    style='float:right;'>已提醒</van-button>
        <van-button type="default"
                    class="grabed"
                    style='float:right;'>开抢提醒</van-button>

      </div>
    </div> -->
    <div class="shopping-wrap border-top">
      <div class="icon-wrap">
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
                    @click="handleClickAddCart">加入购物车</van-button>
        <!-- <van-button type="default"
                    class="shopping"
                    :class="{'opacity':toCart}"
                    v-show='toCart'>加入购物车</van-button> -->
        <van-button type="default"
                    class="pay"
                    style='float:right;'
                    @click="handleClickPay">立即购买</van-button>
      </div>
    </div>
    <!-- 选购商品类型 -->
    <!-- !!!!!!! -->
    <layer ref="proSelected"
           :typeData="teaAttr"
           :teaProduct="teaProduct"
           :selData="selData"
           @userSelect="userSelect"
           @userSelectnum="userSelectnum"></layer>
    <!-- 微信登录未绑定手机弹出绑定手机 -->
    <!-- !!!!!!!!! -->
    <!-- <PopBindphone ref="Popphone"></PopBindphone> -->
    <MyVideoDis :videoOption="videoOption"
                v-if="VideoShow"
                @videoExit="videoExit"></MyVideoDis>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
// import PopCustom from 'base/PopCustom/PopCustom'
import layer from '~/components/detail/layer'
import { getProduct, upCart, cartNum, upFoot, upColl, delColl } from '~/api/product'
import { IOS, ANDROID, WX } from '~/environment/esm'
// import { getShareWxArg } from '~/utils/shareWX'
import { mapGetters, mapActions } from 'vuex'
import { ImagePreview } from 'vant'
import MyVideoDis from '~/components/detail/MyVideoDis'
import Discuss from '~/components/detail/Discuss'
import { URL, wxreFunPay, wxreURL } from '~/config/constant'

import { setStore } from '~/utils/tool'
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
        }
      },
      MyVideoControls: false,
      playerBtnShow: true,
      goHome: false,
      videoOption: {},
      VideoShow: false,
      countTime: 0,
      shartOption: {}
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
        if (item.defaultStatus === 1) {
          item.num = 1
          selData = item
          defaultAttr = item
        }
      })
      const smallAttr = JSON.parse(route.query.smallAttr)
      return {
        teaData: teaData.data, //
        teaProduct: teaData.data.teaProduct, // 基本信息
        teaAttr: teaData.data.teaAttrProduct, // 商品属性
        banner: teaData.data.teaProductBannerTop, // 顶部banner图
        detailImg: teaData.data.teaProductBannerBottom, // 下方商品详情图
        disData: teaData.data.productComment, // 评论数据
        selData: selData,
        defaultAttr: defaultAttr,
        smallAttr: smallAttr
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
    // this.productDetail()
    this.countTime = this.teaData.endTime - new Date().getTime()
    const shartOption = {
      type: 'productDetail',
      title: this.teaProduct.productName, // 分享标题
      desc: this.teaProduct.productDescription, // 分享描述
      link: `${URL}/${this.productId}`, // 分享链接
      imgUrl: this.teaProduct.productImage // 分享图标
    }
    this.getShareWxArg(shartOption)
  },
  methods: {
    showMsg () {
      this.$dialog.alert({
        message: '确认收货后，提交50字以上试饮报告并截图发给客服，可获得实付金额双倍的茶银。100茶银抵5元。',
        confirmButtonText: '我知道了',
        messageAlign: 'left'
      })
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
    // 整饼购买
    jumpDetail () {
      const productId = this.productId
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    slideChangeTransitionStart () {
      // this.exitVideo()
    },
    onClickPlay () {
      this.$refs.mySwiper.swiper.slideTo(1)
      this.popupVideo = true // 设置弹出层
      this.playerBtnShow = false // 播放安宁
      this.$refs.MyVideo.play()
      this.MyVideoControls = true // 显示默认的控制栏
    },
    exitVideo () {
      this.popupVideo = false
      // 切换到视频时显示播放按钮
      if (this.$refs.mySwiper.swiper.realIndex === 0) {
        this.playerBtnShow = true
      } else {
        this.playerBtnShow = false
      }
      this.$refs.MyVideo.pause()
      this.MyVideoControls = false
    },
    videoPlay (val) {
      this.videoOption = val
      this.VideoShow = true
      console.log(val)
      // this.$refs.mescroll.$el.style.zIndex = 20
      // this.$refs.mescroll.$el.style.bottom = '0px'
    },
    videoExit () {
      this.videoOption = {}
      this.VideoShow = false
      // this.$refs.mescroll.$el.style.zIndex = 15
      // this.$refs.mescroll.$el.style.bottom = '44px'
    },
    onChange (index) {
      this.current = index
    },
    share () {
      const option = {
        type: 'productDetail',
        data: {
          productName: this.teaProduct.productName,
          productDescription: this.teaProduct.productDescription,
          productId: this.productId,
          productImage: this.teaProduct.productImage
        }
      }
      console.log(JSON.stringify(option))
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goShare', JSON.stringify(option), res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goShare(JSON.stringify(option))
      } else {
        // let url = `${URL}/#/?type=商品详情&productId=${this.productId}`
        // url = encodeURIComponent(url)
      }
    },
    // 跳转全部评价
    handleClickMorePj () {
      this.$router.push('/evaluate')
    },
    // 立即购买 跳转支付页面
    handleClickPay () {
      // if (!this.selData.attrId) {
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
                productCount: 1,
                attrId: this.smallAttr.attrId,
                productPrice: this.smallAttr.productPrice,
                unitPrice: this.smallAttr.productPrice
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
            num: 1,
            attrId: this.smallAttr.attrId,
            productPrice: this.smallAttr.productPrice,
            unitPrice: this.smallAttr.productPrice
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
          productCount: 1,
          attrId: this.smallAttr.attrId,
          productPrice: this.smallAttr.productPrice,
          unitPrice: this.smallAttr.productPrice
        }]
        console.log(orderData)
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
          this.$router.push('/pay/sure')
        }
        // } else {
        //   this.$refs.Popphone.toggle()
        // }
      }
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
    // 加入购物车
    addToCart () {
      const option = {
        orderDetailStr: `${this.productId}&${1}&${this.smallAttr.attrId}`,
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
    // 显示绑定手机
    handleClickBindPhone () {
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
    userSelect (selData, num) {
      // 为设置响应式数据 需要这样赋值
      this.selData = Object.assign({}, selData)
      this.selData.num = num
    },
    // 用户选择的商品属性
    userSelectnum (num) {
      // 为设置响应式数据 需要这样赋值
      // this.selData = Object.assign({}, selData)
      this.selData.num = num
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
          this.teaData = res.data
          this.teaProduct = res.data.teaProduct
          this.teaAttr = res.data.teaAttrProduct
          this.banner = res.data.teaProductBannerTop
          this.detailImg = res.data.teaProductBannerBottom
          this.disData = res.data.productComment
          this.countTime = this.teaData.endTime - new Date().getTime()
          this.teaAttr.forEach(item => {
            if (item.defaultStatus === 1) {
              item.num = 1
              this.selData = item
              // this.$set(this.selData, 'num', 1)
              this.defaultAttr = item
            }
          })
          if (res.data.teaAttrProduct.length === 1) {
            this.selData = res.data.teaAttrProduct[0]
          }
          setTimeout(() => {
            this.shareFun()
          }, 50)
        } else {
          this.$toast(res.message)
        }
      }).catch(err => {
        console.log(err)
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
  beforeRouteEnter (to, from, next) {
    if (from.name === 'LiveDetail') {
      next(vm => {
        vm.gobackMyback = true
      })
    } else if (from.fullPath === '/' && (!IOS) && (!ANDROID)) {
      next(vm => {
        vm.goHome = true
      })
    } else {
      next()
    }
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
  filters: {
    formatTime (val) {
      return val < 10 ? `0${val}` : val
    }
  },
  components: {
    backbar,
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
      img {
        width: 100%;
        height: 375px;
      }
      .custom-indicator {
        position: absolute;
        left: 0;
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
      .all-buyBtn {
        position: absolute;
        width: 90px;
        height: 30px;
        right: 15px;
        bottom: 6px;
        @include bg-image('tasting/buy');
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        text-align: center;
        z-index: 99999;
      }
      .playerWraper {
        position: absolute;
        bottom: 50px;
        z-index: 1;
        left: 50%;
        transform: translateX(-50%);
      }
      video {
        width: 350px;
        height: 350px;
        background: rgba(0, 0, 0, 1);
      }
    }
    .priWraper {
      padding: 15px 15px 0;
      background: #fff;
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
          margin-top: 17px;
        }
        .desc {
          line-height: 22px;
          font-size: 14px;
          color: #666;
        }
        .product-size {
          .price {
            height: 22px;
            font-size: 30px;
            font-weight: 600;
            color: rgba(195, 96, 79, 1);
          }
          .size {
            height: 19px;
            font-size: 18px;
            color: rgba(195, 96, 79, 1);
            display: inline-block;
            margin-left: 5px;
          }
          .all {
            margin-left: 15px;
            height: 19px;
            font-size: 18px;
            font-weight: 400;
            color: #999999;
            display: inline-block;
          }
        }
      }
    }
    .process {
      width: 375px;
      height: 130px;
      margin: 10px auto;
      background: #fff;
      padding-bottom: 15px;
      .title {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          color: rgba(51, 51, 51, 1);
          font-size: 15px;
        }
        .right {
          @include bg-image('tasting/qa');
          height: 18px;
          width: 18px;
        }
      }
      .list {
        display: flex;
        align-items: center;
        justify-content: center;
        li {
          div {
            display: flex;
            align-items: center;
            img {
              width: 45px;
              height: 51px;
            }
            .line {
              width: 15px;
              height: 1px;
              display: inline-block;
              margin: 0 5px;
              background: rgba(220, 184, 121, 1);
            }
          }
          span {
            display: block;
            font-size: 12px;
            margin-top: 9px;
            width: 100%;
            text-align: left;
            font-weight: 500;
            color: rgba(218, 174, 104, 1);
          }
        }
      }
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
  // .shopping-wrap {
  //   position: fixed;
  //   left: 0;
  //   bottom: 0;
  //   z-index: 19;
  //   display: flex;
  //   flex-flow: row nowrap;
  //   width: 100%;
  //   height: calc(48px + constant(safe-area-inset-bottom));
  //   background-color: #ffffff;
  //   .icon-wrap {
  //     flex: 1;
  //     display: flex;
  //     align-items: center;
  //     .have {
  //       text-align: center;
  //       height: 100%;
  //       width: 100%;
  //       display: flex;
  //       flex-direction: column;
  //       justify-content: center;
  //       display: none;
  //       .top {
  //         color: rgba(51, 51, 51, 1);
  //         font-size: 15px;
  //       }
  //       .bottom {
  //         color: rgba(51, 51, 51, 1);
  //         font-size: 12px;
  //       }
  //     }
  //     .none {
  //       color: rgba(195, 96, 79, 1);
  //       text-align: center;
  //       height: 100%;
  //       width: 100%;
  //       font-size: 15px;
  //       line-height: 49px;
  //     }
  //   }
  //   .btnWrap {
  //     flex: 0 0 240px;
  //     display: flex;
  //   }
  //   .btnWrap /deep/ .van-button {
  //     border-radius: 0;
  //   }
  //   .btnWrap /deep/ .van-button--normal {
  //     flex: 0 0 120px;
  //     height: 49px;
  //     color: #fff;
  //     font-size: 18px;
  //     padding: 0;
  //     &.shopping {
  //       background-color: #ea6f5f;
  //     }
  //     &.opacity {
  //       opacity: 0;
  //     }
  //     &.pay {
  //       background-color: #d45949;
  //     }
  //     &.grab {
  //       background: rgba(255, 240, 214, 1);
  //     }
  //     &.grabed {
  //       background: rgba(242, 191, 102, 1);
  //     }
  //   }
  //   .btnWrap /deep/ .van-button--default {
  //     border: 0;
  //   }
  // }
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
  .productArgWrap /deep/ .van-action-sheet__content {
    padding-bottom: 25px;
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
