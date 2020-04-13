<template>
  <div class="semWraper"
       id="clickDownsem">
    <Backbar :bgColor="bgColor"
             rightIcon="share"
             rightSize="20px"
             :fixed='true'
             :shartOption="shartOption"
             ref='topBar'
             :title='title'
             :rightIconColor='rightIconColor'
             :leftColor='leftColor' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class="banner-wrapper pr">
            <div v-swiper:mySwiperBanner="swiperOptionBanner">
              <div class="swiper-wrapper">
                <div class="swiper-slide"
                     v-for="ban in 4"
                     :key="ban">
                  <img :src="require(`~/assets/img/activity/ninetynine/swiper${ban}.jpg`)"
                       width="100%"
                       style="object-fit: cover;">
                </div>
              </div>
              <div class="swiper-pagination swiper-pagination-bullets"></div>
            </div>
          </div>
          <ul class='show-img'>
            <li v-for='item in 16'
                :key="item">
              <img :src="require(`~/assets/img/activity/ninetynine/icon${item}.png`)"
                   alt="">
            </li>
          </ul>
          <div class='jump-btn'>
            <img :src="require('~/assets/img/activity/ninetynine/icon19.png')"
                 alt=""
                 @click="handleClickPay">
            <img :src="require('~/assets/img/activity/ninetynine/icon18.gif')"
                 alt="">
          </div>
        </div>
      </div>
    </div>
    <ul class='push-list'
        v-if='flag'>
      <li class='list'>
        <span></span>
        <transition appear
                    name="fade">
          <p>{{pushItem}}</p>
        </transition>
      </li>
    </ul>
    <div class='fixed'>
      <img :src="require('~/assets/img/activity/ninetynine/icon17.png')"
           @click='handleClickPay'
           alt="">
    </div>
  </div>
</template>

<script>
import Backbar from '~/components/backbar'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import { mapGetters, mapActions } from 'vuex'
import { getSpecial } from '~/api/special'
import { swiperOptionBanner } from '~/assets/js/swiperOptios'
import { setStore } from '~/utils/tool'
import { wxreFunPay, wxreURL } from '~/config/constant'

export default {
  data () {
    return {
      backBar: 'transparent',
      changeColor: 'white',
      swiperOptionBanner: Object.assign({}, swiperOptionBanner),
      shartOption: {
        type: 'url',
        data: {
          title: '原价345，现在只要99', // 分享标题
          desc: '一斤半高山绿茶特价只要99元！现在还送价值198的茶具一套', // 分享描述
          link: `${URL}/activity/ninetynine`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#333',
      title: '',
      rightIconColor: '#333',
      teaProduct: {},
      shopId: {
        shopId: this.$route.query.shopId,
        specialType: 39
      },
      pushListData: [],
      timer: '',
      pushItem: '',
      index: 0,
      flag: false
    }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata()
    this.getShareWxArg(this.shartOption)
    this.$nextTick(() => {
      this.timer = setInterval(this.changePush, 2000)
    })
  },
  watch: {

  },
  methods: {
    async getSpecialdata () {
      await this.$axios.$post(getSpecial, {
        specialType: 39,
        lastId: 0,
        userId: ''
      }).then((res) => {
        if (res.code === 10000) {
          this.teaProduct = res.data[0]
          this.pushListData = res.horseRaceLampOrderList
        }
      })
    },
    changePush () {
      if (this.index > this.pushListData.length - 1) {
        this.index = 0
      }
      this.flag = !this.flag
      this.pushItem = this.pushListData[this.index]
      this.index++
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
      if (y >= 50) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '99元购'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
      }
    },
    // 立即购买 跳转支付页面
    handleClickPay () {
      // if (getLocalStorage('mobileFlag') || this.mobileFlag) {
      if (this.$route.query.shopId === 'bdsem002') {
        _czc.push(['_trackEvent', '百度99元购', "'点击立即购买", `${this.$route.query.shopId}`])
      }
      const orderData = [{
        productName: this.teaProduct.productName,
        productImage: this.teaProduct.image,
        productId: this.teaProduct.productId,
        productCount: 1,
        attrId: this.teaProduct.attrId,
        productPrice: this.teaProduct.discountsPrice,
        unitPrice: this.teaProduct.discountsPrice
      }]
      sessionStorage.setItem('__teaOrder__', JSON.stringify(orderData))
      sessionStorage.setItem('__teapayType__', 'detail')
      sessionStorage.setItem('_shopId_', JSON.stringify(this.shopId))
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
        if (this.user.isLogin) {
          this.$router.push('/pay/sure')
        } else {
          this.$router.push({
            path: '/login',
            query: { shopId: this.$route.query.shopId ? this.$route.query.shopId : '' }
          })
        }
      }
      // } else {
      //   this.$refs.Popphone.toggle()
      // }
    },
    ...mapActions(['getShareWxArg'])
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
    clearInterval(this.timer)
  },
  components: {
    Backbar
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters(['user'])
  },
  head: {
    script: [
      { src: '/js/toutiao.js' }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';

.semWraper {
  /deep/ .van-nav-bar__left {
    display: none;
  }
  position: relative;
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 0;
    img {
      width: 100%;
    }
  }
  .push-list {
    top: 106px;
    left: 10px;
    position: fixed;
    z-index: 100000;
    li {
      position: relative;
      height: 31px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 5px;
      span {
        width: 0px;
        height: 0px;
        border-top: 5px solid transparent;
        border-right: 5px solid rgba(0, 0, 0, 0.7);
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -10px;
        margin: auto;
      }
      p {
        color: #fff;
        height: 31px;
        padding: 0 10px;
        line-height: 31px;
        text-align: center;
      }
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
      }
    }
  }
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      padding-bottom: 18px;
      position: relative;
      background: #fff;
      .banner-wrapper {
        height: 375px;
      }
      .show-img {
        width: 100%;
        li {
          font-size: 0;
          width: 100%;
          img {
            width: 100%;
          }
        }
      }
      .jump-btn {
        position: absolute;
        top: 955px;
        left: 0;
        img {
          width: 100%;
        }
      }
    }
    /deep/ .mescroll-upwarp {
      min-height: 0;
    }
  }
  .top-bg {
    background: #f2f7f9;
  }
  .white {
    /deep/ .van-icon-arrow-left {
      color: #fff !important;
    }
  }
  .top-img {
    img {
      width: 100%;
      font-size: 0;
    }
  }
  .top-good {
    margin: 10px;
    font-size: 0;
    img {
      width: 100%;
    }
  }
}
</style>
