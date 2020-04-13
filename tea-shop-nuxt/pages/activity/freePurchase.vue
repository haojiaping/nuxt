<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <Backbar :bgColor="bgColor"
             @setHeight='getHeight'
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
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/newkepro/icon6@2x.png')"
                 alt="">
          </div>
          <!-- getChangeStatus -->
          <topGoodList :dataList='topDataList'
                       goodType='top'
                       :changeStatus.sync='changeStatus'
                       @changeProduct='getTopProduct'></topGoodList>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkepro/icon7@2x.png')"
                 alt="">
            <topGoodList :dataList='dataList'
                         goodType='bottom'
                         @changeProduct='getProductList'></topGoodList>
          </div>
          <van-divider :style="{ color: '#fff', borderColor: '#fff', padding: '0 10px' }">
            专区说明
          </van-divider>
          <div class='guize'>
            <p>
              1.本专区是为了增加前期商城订单量，把部分商品0元赠送给会员体验的活动。
            </p>
            <p>
              2.由于快递费用高昂，本专区0元购商品单独购买需支付12元邮费，邮费支付给合作快递公司。组合其他专区商品购买无需另行支付邮费。
            </p>
            <p>
              3.0元购商品如需退货，需买家支付邮费，购买时支付的邮费不予退还。
            </p>
            <p>
              4.0元购活动有效期为：2019年8月20日至2019年8月31日。
            </p>
            <p>
              5. 特别约定：同一收货地址、同一收货人、同一手机号下单满
              足以上任一条件，视为同一用户，同一用户重复领券下单
              视为恶意刷单，平台有权拒绝发货，退回实际付款并封停
              用户在本商城的账户，用户在本页面购买任意商品视为认
              同此约定。
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 购物车 -->
    <localCart :cartList='carList'
               color="#C9000A"
               :postage='postage'
               :shopId='shopId'
               carName='_freeCar_'
               @cartListChange='cartListChange'></localCart>
  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import Backbar from '~/components/backbar'
import localCart from '~/components/localCart'
import { URL } from '~/config/constant.js'
import { IOS, ANDROID } from '~/environment/esm'
import topGoodList from '~/components/activity/newkepro/goodListGou'
import { mapGetters } from 'vuex'
import { setStore, getStore } from '~/utils/tool'
export default {
  async asyncData ({ $axios }) {
    const option = {
      specialType: 40,
      lastId: 0,
      userId: ''
    }
    let dataList = []
    let topDataList = []
    await $axios.$post(getSpecial, option).then(res => {
      const arr = res.data
      if (res.code === 10000) {
        topDataList = res.data.filter((item, index) => {
          return item.hidden === 1
        })
        dataList = arr.slice(3)
      } else {
        this.$toast(res.message)
      }
    })
    return {
      dataList: dataList,
      topDataList: topDataList
    }
  },
  data () {
    return {
      dataList: [],
      topDataList: [],
      userCartNum: 0,
      shartOption: {
        type: 'url',
        data: {
          title: '【惊喜!】我用0元买了一包茶，你也快来买吧！', // 分享标题
          desc: '原价99元的普洱、85元的龙井、69元的红茶真的只要0元就能拿到', // 分享描述
          link: `${URL}/activity/freepurchase`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/9a4d7657-9336-4378-9f66-2516fdadc17e.jpg'
        }
      },
      carList: [],
      bgColor: 'transparent',
      leftColor: '#333',
      title: '',
      rightIconColor: '#fff',
      // 外部推广shopIp
      shopId: {
        shopId: this.$route.query.shopId,
        specialType: 40
      }
    }
  },
  mounted () {
    this.getSpecialdata()
    this.mescrollInit()
    if (getStore('_freeCar_')) {
      this.carList = JSON.parse(getStore('_freeCar_'))
    }
  },
  watch: {

  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    getSpecialdata () {
      const option = {
        specialType: 40,
        lastId: 0,
        userId: ''
      }
      this.$axios.$post(getSpecial, option).then(res => {
        this.dataList = []
        this.topDataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.topDataList = res.data.filter((item, index) => {
            return item.hidden === 1
          })
          this.dataList = arr.slice(3)
        } else {
          this.$toast(res.message)
        }
      })
    },
    getHeight (data) {
      // if (data > 20) {
      //   this.style.top = data + 'px'
      // }
    },
    // 跳转购物车
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
    getProductList (data) {
      let flag = 0
      this.carList.map((key) => {
        if (key.productId === data.productId) {
          flag = 1
        }
      })
      if (flag === 0) {
        // data.productCount = 1
        this.$set(data, 'productCount', 1)
        this.carList.push(data)
      } else {
        const flagIndex = this.carList.findIndex((key) => {
          return key.productId === data.productId
        })
        this.carList[flagIndex].productCount++
      }
      setStore('_freeCar_', this.carList)
      this.$toast.success('添加购物车成功')
    },
    getTopProduct (data) {
      this.$set(data, 'productCount', 1)
      if (this.carList.length > 0) {
        this.topDataList.map((key) => {
          this.carList.map((item, index, arr) => {
            if (arr[index].productId === key.productId) {
              arr.splice(index, 1)
            }
          })
        })
      }
      this.$toast.success('添加购物车成功')
      this.carList.push(data)
      setStore('_freeCar_', this.carList)
    },
    cartListChange (data) {
      this.carList = data
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
        this.title = '0元购'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.rightIconColor = '#fff'
      }
    }
  },
  beforeDestroy () {
    // this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  components: {
    Backbar,
    topGoodList,
    localCart
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters([
      'user'
    ]),
    postage () {
      let num = 0
      this.topDataList.map((key) => {
        this.carList.map((item, index, arr) => {
          if (arr[index].productId === key.productId && this.carList.length === 1) {
            num = 12
          }
        })
      })
      return num
    },
    changeStatus () {
      let flagArr = []
      this.topDataList.map((key) => {
        this.carList.map((item, index, arr) => {
          if (arr[index].productId === key.productId) {
            flagArr = [arr[index]]
          }
        })
      })
      return flagArr
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.semWraper {
  /deep/ .van-nav-bar__left {
    display: none;
  }
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    /deep/ .mescroll-upwarp {
      display: none;
    }
    .listWrap {
      background: #de282f;
      padding-bottom: 65px;
      position: relative;
      .top-bg {
        background: #f2f7f9;
      }
      .back {
        /deep/ .van-icon-arrow-left {
          color: #fff !important;
          font-size: 20px !important;
        }
        /deep/ .van-icon-share {
          color: #fff !important;
          font-size: 20px;
        }
      }
      .top-img {
        img {
          width: 100%;
        }
        font-size: 0;
      }
      .data-content {
        img {
          width: 355px;
          font-size: 0;
          display: block;
          margin: auto;
        }
      }
      .guize {
        margin: 0 10px;
        border-top: none;
        padding: 0 10px;
        padding-top: 20px;
        margin-top: -27.5px;
        position: relative;
        padding-bottom: 10px;
        &::after {
          content: '';
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid #fff;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: top left;
          border-top: none;
        }
        p {
          font-size: 13px;
          color: #fff;
          line-height: 18px;
          margin-bottom: 10px;
          // opacity: 0.8;
        }
      }
    }
  }
}
</style>
