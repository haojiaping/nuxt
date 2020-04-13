<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <backbar bgColor="transparent"
             @setHeight='getHeight'
             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :fixed='true'
             :shartOption="shartOption"
             ref='topBar'
             class='back' />
    <div class='top-img'>
      <img :src="require('~/assets/img/activity/newkepro/icon1.png')"
           alt="">
      <img :src="require('~/assets/img/activity/newkepro/1@2x.png')"
           class='title'
           alt="">
    </div>
    <topGoodList :dataList='topDataList'
                 @changeProduct='getProductList'></topGoodList>
    <div class='data-content'>
      <!-- <goodList :dataList='dataList'
                @changeProduct='getProductList1'></goodList> -->
      <goodList :dataList='dataList'
                @changeProduct='getProductList'></goodList>
    </div>
    <div class='data-content 222'>
      <img :src="require('~/assets/img/activity/newkepro/2@2x.png')"
           alt="">
      <goodList :dataList='dataList1'
                @changeProduct='getProductList'></goodList>
    </div>
    <div class='data-content'>
      <img :src="require('~/assets/img/activity/newkepro/3@2x.png')"
           alt="">
      <goodList :dataList='dataList2'
                @changeProduct='getProductList'></goodList>
    </div>
    <div class='guize'>
      <img :src="require('~/assets/img/activity/newkepro/icon5@2x.png')"
           alt="">
      <p>
        1. 本活动仅限茶臻选商城新客可参与，新客是指在茶臻选商城
        未有支付行为的用户，如果支付完成后取消订单或退款，则
        不算新客。
      </p>
      <p>
        2. 新客价仅限新客首单购买享受，且新客专区商品已享受优
        惠，不与优惠券共享。
      </p>
      <p>
        3. 同一新客仅限购买1次新人专享商品，每件商品仅限购买1
        件。
      </p>
      <p>
        4. 如购买新客专区商品需要退款，仅退回实际支付金额。
      </p>
      <p>
        5. 特别约定：同一收货地址、同一收货人、同一手机号下单满
        足以上任一条件，视为同一用户，同一用户重复领券下单
        视为恶意刷单，平台有权拒绝发货，退回实际付款并封停
        用户在本商城的账户，用户在本页面购买任意商品视为认
        同此约定。
      </p>
    </div>
    <!-- 购物车位置 -->
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
              :key="`item_${index}`">
            <p class='product-name'>{{item.productName}}</p>
            <p class='product-price' v-if="item.discountStatus===1">¥{{item.discountPrice}}</p>
            <p class='product-price' v-if="item.discountStatus===0">¥{{item.productPrice}}</p>
            <div class='change-num'>
              <p>
                <span class='less'
                      @click="lessMoney(index)"></span>
                <i>{{item.productCount}}</i>
                <span class='add'
                      @click="addMoney(index)"></span>
              </p>
              <!-- <van-stepper v-model="value" /> -->
            </div>
          </li>
        </ul>
      </van-popup>
    </div>
    <!-- <div class='add-car'
         @click='jumpToCart'>
      <span>{{userCartNum}}</span>
    </div> -->
    <ul class='jumpToPay' ref="jumpToPay">
      <li class='car'
          @click="showCar">
        <span>{{cartNum}}</span>
      </li>
      <li class='totalPrice'>
        <p class='price'>共计:<span>{{cartNewPrice}}元</span></p>
        <p class='Postage'>邮费:<span>0元</span></p>
      </li>
      <li class='pay-btn'>
        <em class='saved'>已省{{cartOldPrice}}元</em>
        <span class='save-btn'
              @click="jumpToPay">立即购买</span>
      </li>
    </ul>

  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import backbar from '~/components/backbar'
import { IOS, ANDROID, WX } from '~/environment/esm'
import goodList from '~/components/activity/newkepro/goodList'
import topGoodList from '~/components/activity/newkepro/topGoodList'
import { upCart } from '~/api/product'
import { mapGetters, mapActions } from 'vuex'
import { setStore, getStore, removeStore } from '~/utils/tool'
import { wxreFunPay, wxreURL, URL } from '~/config/constant'
export default {
  async asyncData ({ $axios }) {
    const option = {
      specialType: 35,
      lastId: 0,
      userId: ''
    }
    const dataList = []
    let topDataList = []
    const dataList1 = []
    const dataList2 = []
    await $axios.$post(getSpecial, option).then(res => {
      let arr = res.data
      if (res.code === 10000) {
        topDataList = res.data.filter((item, index) => {
          return index < 6
        })
        const len = [6, 16, 1000]
        arr = arr.slice(6)
        arr.map((item, index) => {
          if (index < len[0]) {
            dataList.push(item)
          } else if (index < len[1] && index >= len[0]) {
            dataList1.push(item)
          } else if (index >= len[1]) {
            dataList2.push(item)
          }
        })
      } else {
        this.$toast(res.message)
      }
    })
    return {
      dataList: dataList,
      topDataList: topDataList,
      dataList1: dataList1,
      dataList2: dataList2
    }
  },
  data () {
    return {
      dataList: [],
      topDataList: [],
      dataList1: [],
      dataList2: [],
      style: {
        top: 0
      },
      userCartNum: 0,
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利：多件商品9块9，快来捡漏!', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/about/downapp`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/9a4d7657-9336-4378-9f66-2516fdadc17e.jpg'
        }
      },
      buyCar: false,
      carList: [],
      btnStatus: true
    }
  },
  mounted () {
    this.getSpecialdata()
    this.shareFun()
    if (getStore('__newkeCartListOne__')) {
      this.carList = JSON.parse(getStore('__newkeCartListOne__'))
      const option = {
        specialType: 35,
        lastId: 0,
        userId: ''
      }
      this.$axios.$post(getSpecial, option).then(res => {
        if (res.code === 10000) {
          const arr = res.data
          arr.map((item) => {
            this.carList.map((key, index, arr) => {
              if (key.productId === item.productId) {
                key = item
              }
              if (key.discountsPrice === '0' || key.productPrice === 0) {
                arr.splice(index, 1)
              }
            })
          })
          setStore('__newkeCartListOne__', this.carList)
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    getSpecialdata () {
      const option = {
        specialType: 35,
        lastId: 0,
        userId: ''
      }
      this.$axios.$post(getSpecial, option).then(res => {
        this.dataList = []
        this.topDataList = []
        this.dataList1 = []
        this.dataList2 = []
        let arr = res.data
        if (res.code === 10000) {
          this.topDataList = res.data.filter((item, index) => {
            return index < 6
          })
          const len = [6, 16, 1000]
          arr = arr.slice(6)
          arr.map((item, index) => {
            if (index < len[0]) {
              this.dataList.push(item)
            } else if (index < len[1] && index >= len[0]) {
              this.dataList1.push(item)
            } else if (index >= len[1]) {
              this.dataList2.push(item)
            }
          })
        } else {
          this.$toast(res.message)
        }
      })
    },
    shareFun () {
      if (WX) {
        const option = {
          type: 'url',
          data: {
            title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
            desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
            link: `${URL}/activity/newkepro`, // 分享链接
            imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/9a4d7657-9336-4378-9f66-2516fdadc17e.jpg'
          }
        }
        this.getShareWxArg(option)
      }
    },
    getHeight (data) {
      // if (data > 20) {
      //   this.style.top = data + 'px'
      // }
    },
    // 请求购物车数量
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

                const jumpPay = () => {
                  ios.callHandler('getAppVersion', null, res => {
                    const arrList = []
                    this.carList.map((item) => {
                      arrList.push({
                        productName: item.productName,
                        productImage: item.imageUrl,
                        productId: item.productId,
                        productCount: item.productCount,
                        attrId: item.attrId,
                        productPrice: item.productPrice,
                        unitPrice: item.productPrice
                      })
                    })
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
                      }).catch(() => {
                        this.btnStatus = true
                      })
                    }
                  })
                }
                this.handleShowWindow(jumpPay)
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
            const jumpPay = () => {
              const version = window.android.getAppVersion()
              const arrList = []
              this.carList.map((item) => {
                arrList.push({
                  productName: item.productName,
                  productImage: item.imageUrl,
                  productId: item.productId,
                  productCount: item.productCount,
                  attrId: item.attrId,
                  productPrice: item.productPrice,
                  unitPrice: item.productPrice
                })
              })
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
                }).catch(() => {
                  this.btnStatus = true
                })
              }
            }
            this.handleShowWindow(jumpPay)
          } else {
            window.android.goLogin()
          }
        } else {
          const jumpPay = () => {
            const arrList = []
            this.carList.map((item) => {
              arrList.push({
                productName: item.productName,
                productImage: item.imageUrl,
                productId: item.productId,
                productCount: item.productCount,
                attrId: item.attrId,
                productPrice: item.productPrice,
                unitPrice: item.productPrice
              })
            })
            sessionStorage.setItem('__teaOrder__', JSON.stringify(arrList))
            sessionStorage.setItem('__teapayType__', 'detail')
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
              if (this.user.isLogin) {
                this.$router.push('/pay/sure')
              } else {
                this.$router.push({
                  path: '/login',
                  query: { shopId: this.$route.query.shopId ? this.$route.query.shopId : '' }
                })
              }
            }
          }
          this.handleShowWindow(jumpPay)
        }
      }
    },
    handleShowWindow (done) {
      if (this.carList[0].discountsPrice === '1.0' && this.carList.length === 1 && this.carList[0].productCount === 1) {
        this.$dialog.confirm({
          message: '客官，活动中的商品第一次购买超优惠，何不再买点别的？',
          confirmButtonText: '继续下单',
          cancelButtonText: '再逛逛',
          cancelButtonColor: '#1989fa'
        }).then(() => {
          // on confirm
          done()
        }).catch(() => {
          // on cancel
        })
      } else {
        done()
      }
    },
    getProductList (data) {
      let flag = 0
      this.carList.map((key) => {
        if (key.productId === data.productId && key.attrId === data.attrId) {
          flag = 1
        }
      })
      if (flag === 0) {
        // data.productCount = 1
        this.$set(data, 'productCount', 1)
        this.carList.push(data)
      } else {
        const flagIndex = this.carList.findIndex((key) => {
          return key.productId === data.productId && key.attrId === data.attrId
        })
        this.carList[flagIndex].productCount++
      }
      setStore('__newkeCartListOne__', this.carList)
      this.$toast.success('添加购物车成功')
    },
    addMoney (index) {
      this.carList[index].productCount++
      setStore('__newkeCartListOne__', this.carList)
    },
    lessMoney (index) {
      this.carList[index].productCount -= 1
      if (this.carList[index].productCount < 1) {
        this.carList.splice(index, 1)
      }
      if (this.carList.length === 0) {
        this.buyCar = false
        this.carList = []
        removeStore('__newkeCartListOne__')
      } else {
        setStore('__newkeCartListOne__', this.carList)
      }
    },
    clearData () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定清空购物车?'
      }).then(() => {
        this.carList = []
        removeStore('__newkeCartListOne__')
        this.buyCar = false
        this.$toast.success('购物车已清空')
      }).catch(() => {
        // on cancel
      })
    },
    ...mapActions(['saveLogin', 'getShareWxArg'])
  },
  components: {
    goodList,
    backbar,
    topGoodList
  },
  watch: {
    buyCar(newval) {
      newval ? this.$refs.jumpToPay.style.zIndex = 1000000 : this.$refs.jumpToPay.style.zIndex = 2004
    }
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
      this.carList.map((item, index) => {
        if (item.productCount > 1) {
          price += (item.discountStatus === 1 ? Number(item.discountPrice) : item.productPrice) + item.productPrice * (item.productCount - 1)
        } else {
          price += item.discountStatus === 1 ? Number(item.discountPrice) : item.productPrice
        }
      })
      return price.toFixed(1)
    },
    cartOldPrice () {
      let price = 0
      this.carList.map((item) => {
        price += (item.virtualPrice === 0 ? item.productPrice : item.virtualPrice) * item.productCount
      })
      console.log(price)
      price = price - this.cartNewPrice
      return price.toFixed(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.semWraper {
  background: #09304a;
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
      font-size: 0;
    }
    .title {
      width: 244px;
      display: block;
      margin: auto;
      padding: 10px 0;
    }
  }
  .data-content {
    margin-top: 5px;
    img {
      width: 100%;
      font-size: 0;
      width: 244px;
      display: block;
      margin: auto;
      padding: 10px 0;
    }
  }
  .guize {
    p {
      font-size: 13px;
      color: #f2cb91;
      line-height: 18px;
      padding: 0 10px;
      margin-bottom: 10px;
    }
    img {
      width: 244px;
      display: block;
      margin: auto;
      padding: 10px 0;
    }
  }
  .add-car {
    @include bg-image('activity/newkepro/car1');
    width: 75px;
    height: 62.5px;
    position: fixed;
    right: 0;
    top: 60%;
    background-size: cover;
    z-index: 99999;
    display: none;
    span {
      width: 21px;
      height: 21px;
      border-radius: 50%;
      background: rgba(168, 0, 2, 1);
      color: rgba(252, 236, 215, 1);
      text-align: center;
      position: absolute;
      top: 8px;
      right: 8.5px;
      line-height: 21px;
      border: 1px solid #fbecd5;
    }
  }
  .jumpToPay {
    height: 45px;
    background: rgba(252, 236, 215, 1);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 2004;
    .car {
      @include bg-image('activity/newkepro/car2');
      width: 30px;
      height: 30px;
      margin-top: 9px;
      margin-left: 13px;
      position: relative;
      span {
        width: 21px;
        height: 21px;
        background: #a80002;
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
        color: #a80002;
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
        background: #a80002;
        font-size: 15px;
        color: rgba(252, 236, 215, 1);
        line-height: 45px;
        text-align: center;
        width: 90px;
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
