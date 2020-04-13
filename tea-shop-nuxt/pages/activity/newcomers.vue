<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <backbar :bgColor="bgColor"
             rightIcon="share"
             rightSize="20px"
             :fixed='true'
             :shartOption="shartOption"
             ref='topBar'
             @setHeight='getHeight'
             :title='title'
             :rightIconColor='rightIconColor'
             :leftColor='leftColor' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/newcomers/icon1@2x.png')"
                 v-if='!isLiuHai'
                 alt="">
            <img :src="require('~/assets/img/activity/newcomers/icon111@2x.png')"
                 v-else
                 alt="">
            <img :src="require('~/assets/img/activity/newcomers/icon2@2x.png')"
                 alt="">
            <ul class='tab-list'>
              <li :class="topDataFlag===($index+1)?'active':''"
                  v-for='(item,$index) in topTitle'
                  :key='item'
                  @click="changeTop($index+1)">{{item}}</li>
            </ul>
            <div class='getquan'>
              <img :src="require('~/assets/img/activity/newcomers/icon4@2x.png')"
                   v-if='isNewKe'
                   @click='initGet'
                   alt="">
              <img :src="require('~/assets/img/activity/newcomers/icon5@2x.png')"
                   v-else
                   alt="">
            </div>
          </div>
          <div class='data-content'>
            <goodList :dataList='topChange'
                      @changeProduct='getProductList'
                      :bottom='true'></goodList>
          </div>
          <div class='data-content'
               style='margin-top:40px;'>
            <img :src="require('~/assets/img/activity/newcomers/icon3@2x.png')"
                 alt="">
            <p class='title-dec'>折扣区商品不可与直减券同用</p>
            <ul class='tab-list tablist2'>
              <li :class="bottomDataFlag===($index+1)?'active':''"
                  v-for='(item,$index) in bottomTitle'
                  :key='item'
                  @click="changeBottom($index+1)">{{item}}</li>
            </ul>
            <goodList :dataList='bottomChange'
                      @changeProduct='getProductList'
                      :price='100'></goodList>
          </div>
          <!-- <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon8@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'></goodList>
          </div> -->
          <p class='guize'>
            活动规则: <br>
            1. 本活动仅限茶臻选商城新客可参与，新客是指在茶臻选商城 未有支付行为的用户，如果支付完成后取消订单或退款，则 不算新客。 <br>
            2. 新客价仅限新客首单购买享受，且新客专区商品已享受优 惠，不与优惠券共享。 <br>
            3. 同一新客仅限购买1次新人专享商品，每件商品仅限购买1件。<br>
            4. 如购买新客专区商品需要退款，仅退回实际支付金额。<br>
            5. 特别约定：同一收货地址、同一收货人、同一手机号下单满 足以上任一条件，视为同一用户，同一用户重复领券下单 视为恶意刷单，平台有权拒绝发货，退回实际付款并封停 用户在本商城的账户，用户在本页面购买任意商品视为认 同此约定。<br>
          </p>
        </div>
      </div>

      <van-dialog v-model="isShow"
                  :show-confirm-button='false'
                  :show-cancel-button='false'
                  message-align='center'
                  class='show-content'>
        <p class='show-text'>亲爱的茶友<br>
          本优惠券仅限新用户领取<br>
          您可以去看看其他优惠活动</p>
        <div class='show-btn'>
          <van-button type="primary"
                      class='cancel'
                      @click='handelCancel'>取消</van-button>
          <van-button type="primary"
                      class='sure'
                      @click='handelJump'>去看看</van-button>
        </div>
      </van-dialog>
      <!-- 购物车位置 -->
      <div class='car-wrap '>
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
                          @click="lessMoney(item,index)"></span>
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
        <!-- <div class='add-car'
         @click='jumpToCart'>
      <span>{{userCartNum}}</span>
    </div> -->
        <ul class='jumpToPay'>
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
    </div>
    <!-- <localCart :cartList='carList'
               color="#C9000A"
               carName='_newcomersCar_'
               @cartListChange='cartListChange'></localCart> -->
  </div>
</template>

<script>
import { activityList, Coupon } from '~/api/activity'
import { getSpecial } from '~/api/special'
import backbar from '~/components/backbar'
import goodList from '~/components/activity/newcomers'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import { upCart } from '~/api/product'
import { mapGetters, mapActions } from 'vuex'
import { setStore, getStore, removeStore } from '~/utils/tool'
import { wxreFunPay, wxreURL } from '~/config/constant'
export default {
  data () {
    return {
      backBar: 'transparent',
      dataList1: [],
      dataList2: [],
      dataList3: [],
      dataList4: [],
      dataList5: [],
      title: '',
      topTitle: ['爆款1元起', '品牌福利区'],
      bottomTitle: ['新客必买', '精品捡漏', '产地直发'],
      topDataFlag: 1,
      bottomDataFlag: 1,
      topArrflag: false,
      isLiuHai: false,
      isShow: false,
      isNewKe: true,
      carList: [],
      buyCar: false,
      btnStatus: true,
      totalPrice: 0,
      flag: 0,
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/activity/newcomers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#fff',
      rightIconColor: '#fff'
    }
  },
  created () {
  },
  mounted () {
    if (getStore('_newcomersCar_')) {
      this.carList = JSON.parse(getStore('_newcomersCar_'))
      this.carList.map((item, index, arr) => {
        if (item.isTopDataFlag) {
          this.topArrflag = true
        }
      })
    }
    this.isLogin()
    this.mescrollInit()
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
  },
  watch: {

  },
  methods: {
    async getSpecialdata (userId) {
      const option = {
        activityId: '2019092717542364616000079',
        userId: userId
      }
      this.$axios.$post(activityList, option).then(res => {
        const arr = res.data
        this.dataList1 = []
        this.dataList2 = []
        if (res.code === 10000) {
          this.isNewKe = res.userFlag
          const len = [12, 24]
          arr.map((item, index) => {
            this.$set(item, 'discountsPrice', Number(item.productPrice - 100))
            this.$set(item, 'isTopDataFlag', true)
            if (index < len[0]) {
              this.dataList1.push(item)
            } else if (index < len[1]) {
              this.dataList2.push(item)
            }
          })
        } else {
          this.$toast(res.message)
        }
      })
      this.$axios.$post(getSpecial, {
        specialType: 35,
        lastId: 0,
        userId: ''
      }).then(res => {
        this.dataList3 = []
        this.dataList4 = []
        this.dataList5 = []
        const arr = res.data
        const len = [8, 16, 32]
        arr.map((item, index) => {
          if (index < len[0]) {
            this.dataList3.push(item)
          } else if (index < len[1] && index >= len[0]) {
            this.dataList4.push(item)
          } else if (index < len[2] && index >= len[1]) {
            this.dataList5.push(item)
          }
        })
      })
    },
    // 判断登陆状态
    isLogin () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.getSpecialdata(userId)
            } else {
              this.getSpecialdata('')
              this.isNewKe = true
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          this.getSpecialdata(userId)
        } else {
          this.getSpecialdata('')
          this.isNewKe = true
        }
      } else {
        if (this.user.isLogin) {
          this.getSpecialdata(this.user.userId)
        } else {
          this.getSpecialdata('')
          this.isNewKe = true
        }
      }
    },
    // tab切换
    changeTop (index) {
      this.topDataFlag = index
    },
    changeBottom (index) {
      this.bottomDataFlag = index
    },
    // 兼容刘海屏
    getHeight (data) {
      if (data > 20) {
        this.isLiuHai = true
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
        this.$set(data, 'productCount', 1)
        this.carList.push(JSON.parse(JSON.stringify(data)))
        this.carList.map((item, index, arr) => {
          if (item.isTopDataFlag) {
            this.carList[index].discountsPrice = Number(item.productPrice)
            this.topArrflag = true
          }
        })
      } else {
        const flagIndex = this.carList.findIndex((key) => {
          return key.productId === data.productId
        })
        this.carList[flagIndex].productCount++
      }
      setStore('_newcomersCar_', this.carList)
      this.$toast.success('添加购物车成功')
    },
    // cartListChange (data) {
    //   this.carList = data
    // },
    initGet () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            this.saveLogin({
              userId: userId,
              token: token,
              isLogin: true,
              mobileFlag: true
            })
            if ((userId && token)) {
              // 领券方法
              this.$dialog.confirm({
                title: '提示',
                message: '是否确认领取?',
                beforeClose: this.beforeClose
              })
            } else {
              // 登陆方法
              ios.callHandler('goLogin', null, res => {
              })
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          // let token = window.android.getToken()
          // let isLogin = true
          // 领券方法
          this.user.userId = userId
          this.$dialog.confirm({
            title: '提示',
            message: '是否确认领取?',
            beforeClose: this.beforeClose
          })
        } else {
          // 登陆方法
          window.android.goLogin()
        }
      } else {
        if (this.user.isLogin) {
          this.$dialog.confirm({
            title: '提示',
            message: '是否确认领取?',
            beforeClose: this.beforeClose
          })
        } else {
          // 如果没有登录保存当前页面拉取授权后再返回当前页面
          setStore('__redirectUrl__', this.$route.fullPath)
          if (WX) {
            window.location.href = `${wxreURL}`
          } else {
            this.$router.push({
              path: '/login',
              query: { shopId: this.$route.query.shopId ? this.$route.query.shopId : '' }
            })
          }
        }
      }
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        const params = {
          couponType: '3',
          userId: this.user.userId,
          activityId: '2019092717542364616000079'
        }
        const close = done
        this.$axios.$post(Coupon, params).then((res) => {
          if (res.code === 10000) {
            close()
            if (res.data === '0') {
              this.$toast({ message: '领取成功!您已经领过此券，本区商品下单用券减100元', duration: 2000 })
            } else if (res.data === '1') {
              this.isShow = true
            } else {
              this.$toast({ message: '您已经领过此券,本区商品下单用券减100元', duration: 2000 })
            }
            this.isNewKe = false
          }
        }).catch(() => {
          close()
        })
      } else {
        done()
      }
    },
    handelJump () {
      this.isShow = false
    },
    handelCancel () {
      this.isShow = false
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
        this.title = '超值福利专区'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
      }
    },
    // 购物车逻辑
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
            productImage: item.image ? item.image : item.productImage,
            productId: item.productId,
            productCount: item.productCount,
            attrId: item.attrId ? item.attrId : '',
            productPrice: item.discountsPrice,
            unitPrice: item.discountsPrice
          })
        })
        console.log(arrList)
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
          // if (this.shopId !== {}) {
          //   sessionStorage.setItem('_shopId_', JSON.stringify(this.shopId))
          // }
          if (this.user.isLogin) {
            if (WX) {
              // 登录态直接去拉取授权获取code后跳转到支付确认页面
              window.location.href = `${wxreFunPay}`
            }
            this.$router.push('/pay/sure')
          } else {
            if (WX) {
              // 如果没有登录保存当前页面拉取授权后再返回当前页面
              setStore('__redirectUrl__', this.$route.fullPath)
              window.location.href = `${wxreURL}`
            } else {
              this.$router.push('/login')
            }
          }
        }
      } else {
        this.$toast('请先选择商品')
      }
    },
    addMoney (item, index) {
      this.carList[index].productCount++
      setStore('_newcomersCar_', this.carList)
    },
    lessMoney (item, index) {
      this.carList[index].productCount -= 1
      if (this.carList[index].productCount < 1) {
        this.carList.splice(index, 1)
      }
      let top = 0
      this.carList.map((item) => {
        if (item.isTopDataFlag) {
          top += 1
        }
      })
      if (top === 0) {
        this.topArrflag = false
      }
      if (this.carList.length === 0) {
        this.buyCar = false
        this.carList = []
        removeStore('_newcomersCar_')
      } else {
        setStore('_newcomersCar_', this.carList)
      }
    },
    clearData () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定清空购物车?'
      }).then(() => {
        this.carList = []
        setStore('_newcomersCar_', this.carList)
        removeStore('_newcomersCar_')
        this.topArrflag = false
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
    backbar
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    topChange () {
      return this.topDataFlag === 1 ? this.dataList1 : this.dataList2
    },
    bottomChange () {
      if (this.bottomDataFlag === 1) {
        return this.dataList3
      } else if (this.bottomDataFlag === 2) {
        return this.dataList4
      } else {
        return this.dataList5
      }
    },
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
      // const sameArr = this.getArrEqual(this.carList, this.dataList1).concat(this.getArrEqual(this.carList, this.dataList2))
      // // const bottomAllData = [...this.dataList3, ...this.dataList4, ...this.dataList5]
      // const arr1 = this.getArrEqual(this.carList, this.dataList3)
      // const arr2 = this.getArrEqual(this.carList, this.dataList4)
      // const arr3 = this.getArrEqual(this.carList, this.dataList5)
      // const bottomAllData = arr1.concat(arr2, arr3)
      // const noSameArr = this.getArrEqual(this.carList, bottomAllData)
      // if (sameArr.length > 0) {
      //   sameArr.map((item) => {
      //     price += parseInt(item.productPrice) * item.productCount
      //   })
      //   price = price - 100
      // }
      this.carList.map((item) => {
        price += item.discountsPrice * item.productCount
      })
      if (this.topArrflag) {
        price -= 100
      }
      return price.toFixed(1)
    },
    cartOldPrice () {
      let price = 0
      this.carList.map((item) => {
        price += item.productPrice * item.productCount
      })
      return (price - this.cartNewPrice).toFixed(1)
    },
    shareBtn () {
      // return (IOS || ANDROID) ? 'share' : ''
      return 'share'
    },
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
@mixin title {
  padding-top: 10px;
  height: 35px;
  line-height: 17.5px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.semWraper {
  padding-bottom: 40px;
  position: relative;
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: -44px;
    background: #fbecd6;
    .listWrap {
      position: relative;
      .tab-list {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: flex-start;
        margin: 10px 0 5px;
        position: relative;
        bottom: -8px;
        z-index: 10;
        li {
          width: 175px;
          height: 42px;
          @include bg-image-size('activity/newcomers/icon8');
          background-size: 100% 100%;
          color: rgba(123, 73, 2, 1);
          font-size: 15px;
          text-align: center;
          line-height: 42px;
          &.active {
            @include bg-image-size('activity/newcomers/icon7');
            height: 47px;
            color: rgba(251, 236, 214, 1);
          }
        }
      }
      .getquan {
        margin: 0 10px;
        font-size: 0;
        box-sizing: border-box;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid #fbecd6;
        img {
          width: 100%;
        }
      }
      .top-bg {
        background: #f2f7f9;
      }
      .top-img {
        font-size: 0;
        img {
          width: 100%;
        }
      }
      .data-content {
        & > img {
          width: 100%;
        }
        .title-dec {
          text-align: center;
          font-size: 14px;
          color: rgba(123, 73, 2, 1);
          line-height: 40px;
          height: 40px;
        }
        .tablist2 {
          margin-top: 0;
          li {
            width: 115px;
            @include bg-image-size('activity/newcomers/icon11');
            background-size: 100% 100%;
            &.active {
              @include bg-image-size('activity/newcomers/icon10');
              height: 47px;
              color: rgba(251, 236, 214, 1);
            }
          }
        }
      }
      .guize {
        font-size: 15px;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        padding: 10px;
        margin-bottom: 60px;
      }
    }
    /deep/ .mescroll-upwarp {
      min-height: 0;
    }
    /deep/ .van-dialog {
      padding: 20px;
      width: 72%;
      .show-text {
        font-size: 15px;
        line-height: 20px;
        color: rgba(51, 51, 51, 1);
        margin: 0 auto;
      }
      .show-btn {
        margin-top: 25px;
        text-align: center;
        .cancel {
          background: #ccc;
          width: 100px;
        }
        .sure {
          background: #333;
          width: 100px;
          margin-left: 30px;
        }
      }
    }
    .car-wrap {
      // 购物车
      .jumpToPay {
        height: 45px;
        background: #ffffff;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        z-index: 1000000;
        .car {
          @include bg-image('activity/newcomers/icon12');
          width: 30px;
          height: 30px;
          margin-top: 9px;
          margin-left: 13px;
          position: relative;
          span {
            width: 21px;
            height: 21px;
            background: #c51804;
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
            background: #c51804;
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
  }
}
</style>
