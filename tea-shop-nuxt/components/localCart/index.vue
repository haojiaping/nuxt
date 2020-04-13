<template>
  <div class="wrapper"
       v-if="carList">
    <!-- 购物车列表 -->
    <div class='buy-car'>
      <van-popup v-model="buyCar"
                 position="bottom"
                 :style="{ paddingBottom: '45px' }">
        <p class='clear'
           @click='clearData'>
          <van-icon name="delete" /><span>清空</span>
        </p>
        <ul class='car-list'>
          <li class='product-content'
              v-for='(item,index) in carList'
              :key="item.productId">
            <p class='product-name'>{{item.productName}}</p>
            <p class='product-price'>¥{{item.discountsPrice}}</p>
            <div class='change-num'>
              <p>
                <span class='less'
                      @click="lessMoney(index)"></span>
                <i>{{item.productCount}}</i>
                <span class='add'
                      @click="addMoney(item,index)"></span>
              </p>
              <!-- <van-stepper v-model="value" /> -->
            </div>
          </li>
        </ul>
      </van-popup>
    </div>
    <!-- 购物车底部位置 -->
    <ul class='jumpToPay'>
      <li class='car'
          @click="showCar">
        <i class="iconfont"
           :style='{
              color:color
              }'>&#xe505;</i>
        <span :style='{
              background:color
              }'>{{cartNum}}</span>
      </li>
      <li class='totalPrice'>
        <p class='price'>共计:<span>{{cartNewPrice}}元</span></p>
        <p class='Postage'>邮费:<span>{{postage}}元</span></p>
      </li>
      <li class='pay-btn'>
        <em class='saved'
            :style='{
              color:color
              }'>已省{{cartOldPrice}}元</em>
        <span class='save-btn'
              :color='color'
              :style='{
              background:color
              }'
              @click="jumpToPay">立即购买</span>
      </li>
    </ul>

  </div>
</template>

<script>
import { IOS, ANDROID, WX } from '~/environment/esm'
import { upCart } from '~/api/product'
import { mapGetters, mapActions } from 'vuex'
import { setStore, removeStore } from '~/utils/tool'
import { wxreFunPay, wxreURL } from '~/config/constant'
export default {
  data () {
    return {
      buyCar: false,
      btnStatus: true
      // carList: []
    }
  },
  props: {
    cartList: {
      type: Array
    },
    color: {
      type: String
    },
    carName: {
      type: String,
      default: '__newkeCartList__'
    },
    postage: {
      type: Number,
      default: 0
    },
    shopId: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted () {

  },
  watch: {
  },
  methods: {
    showCar () {
      if (this.carList.length > 0) {
        this.buyCar = true
      } else {
        this.$toast('购物车还没有宝贝去看看吧')
      }
    },
    // 跳立即支付页面
    jumpToPay () {
      if (this.btnStatus && this.carList.length > 0) {
        const arrList = []
        this.carList.map((item) => {
          arrList.push({
            productName: item.productName,
            productImage: item.image,
            productId: item.productId,
            productCount: item.productCount,
            attrId: item.attrId,
            productPrice: item.discountsPrice,
            unitPrice: item.discountsPrice
          })
        })
        if (IOS) {
          window.callback(ios => {
            ios.callHandler('getUserInfo', null, res => {
              const userId = res.userId
              const token = res.token
              if (userId && token) {
                // let isLogin = true
                this.saveLogin({
                  userId: userId,
                  token: token,
                  isLogin: true,
                  mobileFlag: true
                })
                ios.callHandler('getAppVersion', null, res => {
                  if (res.substring(0, 1) === '2' && res !== '2.0.0') {
                    ios.callHandler('goConfirmPayWithArr', JSON.stringify(arrList), res => {
                      console.log(res)
                    })
                  } else {
                    // 这里写全部加入购物车
                    let odertStrTemp = []
                    arrList.map(item => {
                      odertStrTemp.push(`${item.productId}&${item.productCount}&${item.attrId}`)
                    })
                    odertStrTemp = odertStrTemp.join('|')
                    const option = {
                      orderDetailStr: odertStrTemp,
                      userId: this.user.userId
                    }
                    // try {
                    this.btnStatus = false
                    console.log(odertStrTemp)
                    this.$axios.$post(upCart, option).then(res => {
                      this.btnStatus = true
                      if (res.code === 10000) {
                        ios.callHandler('goCartList', null, res => {
                        })
                      }
                    }).catch(_ => {
                      this.btnStatus = true
                    })
                  }
                })
              } else {
                ios.callHandler('goLogin', null, res => {
                })
              }
            })
          })
        } else if (ANDROID) {
          if (window.android.getIsLogin()) {
            const userId = window.android.getUserId()
            const token = window.android.getToken()
            this.saveLogin({
              userId: userId,
              token: token,
              isLogin: true,
              mobileFlag: true
            })
            const version = window.android.getAppVersion()
            if (version.substring(0, 1) === '2' && version !== '2.0.0') {
              window.android.goConfirmPayWithArr(JSON.stringify(arrList))
            } else {
              this.btnStatus = false
              // 这里写全部加入购物车
              let odertStrTemp = []
              arrList.map(item => {
                odertStrTemp.push(`${item.productId}&${item.productCount}&${item.attrId}`)
              })
              odertStrTemp = odertStrTemp.join('|')
              const option = {
                orderDetailStr: odertStrTemp,
                userId: this.user.userId
              }
              this.$axios.$post(upCart, option).then(res => {
                this.btnStatus = true
                if (res.code === 10000) {
                  window.android.goShoppingData()
                }
              }).catch(_ => {
                this.btnStatus = true
              })
            }
          } else {
            window.android.goLogin()
          }
        } else {
          // 这里是网页端
          sessionStorage.setItem('__teaOrder__', JSON.stringify(arrList))
          sessionStorage.setItem('__teapayType__', 'detail')
          // 保存shopId
          if (this.shopId !== {}) {
            sessionStorage.setItem('_shopId_', JSON.stringify(this.shopId))
          }
          if (WX) {
            if (this.user.isLogin) {
              // 登录态直接去拉取授权获取code后跳转到支付确认页面
              window.location.href = `${wxreFunPay}`
            } else {
              // 如果没有登录保存当前页面拉取授权后再返回当前页面
              setStore('__redirectUrl__', this.$route.fullPath)
              window.location.href = `${wxreURL}`
            }
          } else {
            this.$router.push({
              path: '/login',
              query: { shopId: this.$route.query.shopId ? this.$route.query.shopId : '' }
            })
          }
        }
      }
    },
    addMoney (item, index) {
      if (item.hidden === 1) {
        this.$toast.fail('限购商品只能购买一件')
      } else {
        this.carList[index].productCount++
      }
      setStore(this.carName, this.carList)
    },
    lessMoney (index) {
      this.carList[index].productCount -= 1
      if (this.carList[index].productCount < 1) {
        this.carList.splice(index, 1)
      }
      if (this.carList.length === 0) {
        this.buyCar = false
        this.carList = []
        this.$emit('cartListChange', [])
        removeStore(this.carName)
      } else {
        setStore(this.carName, this.carList)
      }
    },
    clearData () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定清空购物车?'
      }).then(() => {
        this.$emit('cartListChange', [])
        this.carList = []
        setStore(this.carName, this.carList)
        removeStore(this.carName)
        this.buyCar = false
        this.$toast.success('购物车已清空')
      }).catch(() => {
        // on cancel
      })
    },
    ...mapActions(['saveLogin', 'getShareWxArg'])
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters([
      'user'
    ]),
    cartNum () {
      let num = 0
      // this.carList = JSON.parse(getStore('carList'))
      this.carList.map((item) => {
        num += item.productCount
      })
      return num
    },
    cartNewPrice () {
      let price = 0
      this.carList.map((item) => {
        price += item.discountsPrice * item.productCount
      })
      return price.toFixed(1)
    },
    cartOldPrice () {
      let price = 0
      this.carList.map((item) => {
        price += (item.productPrice - item.discountsPrice) * item.productCount
      })
      return price.toFixed(1)
    },
    carList: {
      get () {
        return this.cartList
      },
      set () {

      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
@import './iconfont/iconfont.css';
@mixin change-color($color) {
  &.theme-#{$color} {
    background: $color;
  }
}
.wrapper {
  .jumpToPay {
    height: 45px;
    background: #fff;
    box-shadow: 0px 1px 15px 0px rgba(68, 0, 1, 0.52);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 1000000;
    .car {
      // @include bg-image('activity/midAutumn/cart4');
      width: 30px;
      height: 30px;
      margin-top: 9px;
      margin-left: 13px;
      position: relative;
      .iconfont {
        font-size: 30px;
        color: #9e1823;
      }
      span {
        width: 21px;
        height: 21px;
        background: #9e1823;
        border: 1px solid rgba(252, 236, 215, 1);
        border-radius: 50%;
        font-size: 15px;
        color: rgba(252, 236, 215, 1);
        line-height: 21px;
        text-align: center;
        position: absolute;
        right: -10px;
        top: -5px;
      }
    }
    .totalPrice {
      height: 100%;
      margin-left: 24px;
      .price {
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
        font-size: 16px;
        height: 16px;
        margin-top: 8px;
        line-height: 16px;
      }
      .Postage {
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
        line-height: 15px;
        font-size: 13px;
        margin-top: 2px;
      }
      span {
        display: inline-block;
        margin-left: 7px;
      }
    }
    .pay-btn {
      flex: 1;
      .saved {
        color: #9e1823;
        line-height: 15px;
        font-size: 12px;
        height: 100%;
        line-height: 45px;
        display: inline-block;
        margin-left: 20px;
        text-align: right;
        width: 80px;
        word-wrap: wrap;
      }
      .save-btn {
        height: 100%;
        float: right;
        background: #9e1823;
        font-size: 15px;
        color: rgba(252, 236, 215, 1);
        line-height: 45px;
        text-align: center;
        width: 90px;
        @include change-color(#000);
        // @include themify($themes) {
        //   color: themed('font-color');
        // };;;
      }
    }
  }
  .buy-car {
    .clear {
      height: 36px;
      background: rgba(238, 238, 238, 1);
      text-align: right;
      color: rgba(153, 153, 153, 1);
      font-size: 0;
      span {
        display: inline-block;
        margin-right: 12px;
        font-size: 14px;
        line-height: 36px;
        vertical-align: middle;
      }
      /deep/ .van-icon-delete {
        display: inline-block;
        margin-right: 5px;
        font-size: 16px;
        line-height: 36px;
        vertical-align: middle;
      }
    }
    .car-list {
      max-height: 516px;
      overflow: scroll-y;
      .product-content {
        height: 60px;
        border-bottom: 1px solid #eeeeee;
        display: flex;
        .product-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 190px;
          height: 60px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          line-height: 60px;
          padding-left: 15px;
        }
        .product-price {
          margin-left: 5px;
          font-size: 14px;
          height: 60px;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 60px;
        }
        .change-num {
          flex: 1;
          p {
            float: right;
            padding-right: 10px;
            & > * {
              display: inline-block;
              vertical-align: middle;
            }
            .add {
              @include bg-image('activity/newkepro/add');
              height: 23px;
              width: 23px;
            }
            .less {
              @include bg-image('activity/newkepro/less');
              height: 23px;
              width: 23px;
            }
            i {
              height: 60px;
              line-height: 60px;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
}
</style>
