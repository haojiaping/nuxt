<template>
<client-only>
  <!-- 支付组件 -->
  <div>
    <!-- 返回头 -->
    <backbar title="确认信息" />
    <div class="loading"
           v-if="loading">
        <van-loading type="spinner" />
      </div>
    <div class="pay-wrap mescroll-touch">
      <div v-if="!loading"
           class="payWrapone">
        <!-- 地址    to="/self/addselect"
                     tag="div" -->
        <div class="addressnone"
             v-show="!initData.address">
          <!-- <i class="icon add"></i>
          <span class="text">请点击后添加地址</span>
          <van-icon name="arrow"
                    color="#999"
                    size="20px" /> -->
          <setAddress ref="setAddressData"></setAddress>
        </div>
        <router-link class="address"
                     to="/self/addselect"
                     v-if="initData.address"
                     tag="div">
          <i class="icon add"></i>
          <div class="item">
            <div class="left">
              <div class="detail">
                <div class="tag"
                     v-if="initData.address.addressTag!==''||initData.address.defaultStatus!==0">

                  <tag content="默认"
                       :color="true"
                       v-if="initData.address.defaultStatus===1"
                       :bgcolor="true"></tag>
                  <tag :content="initData.address.addressTag"
                       v-if="initData.address.addressTag!==''"
                       :bgcolor="false"></tag>
                </div>
                <span class="name">{{initData.address.recipientName}}</span>
                <span>{{initData.address.recipientMobile}}</span>
              </div>
              <p>{{initData.address.recipientAddress}}{{initData.address.addressDetail}}</p>
            </div>
          </div>
          <van-icon name="arrow"
                    color="#999"
                    size="20px" />
        </router-link>
        <!-- 支付方式 -->
        <div class="pay">
          <h3 class="title">支付方式</h3>
          <ul>
            <li class="item border-bottom">
              <div class="left">
                <i class="icon weixin"></i>
                <span class="text">微信</span>
              </div>
              <div class="right"
                   @click="payTypeSelect='wx'">
                <i class="icon"
                   :class="payTypeSelect==='wx'?'active':''"></i>
              </div>
            </li>
            <li class="item border-bottom"
                v-show='!isWX'>
              <div class="left">
                <i class="icon zfb"></i>
                <span class="text">支付宝</span>
              </div>
              <div class="right"
                   @click="payTypeSelect='zfb'">
                <i class="icon"
                   :class="payTypeSelect==='zfb'?'active':''"></i>
              </div>
            </li>
          </ul>
        </div>
        <!-- 商品详情 -->
        <div class="pro-wrap">
          <h3 class="title">商品详情</h3>
          <ul class="pro">
            <li class="list border-bottom">
              <ul v-if="order">
                <li class="item"
                    v-for="(item,index) of order"
                    :key="`order_${index}`">
                  <div class="left">
                    <img :src="item.productImage"
                         alt="">
                    <div class="desc">
                      <p class="name">{{item.productName}}</p>
                      <div class="num f12 c9">
                        <span>规格:</span>
                        <span>{{item.productStyle}}</span>
                        <span>&nbsp;&nbsp;</span>
                        <span>数量:</span>
                        <span>{{item.productCount}}</span>
                      </div>
                      <p class="price">&yen; {{item.unitPrice}}</p>
                    </div>
                  </div>
                  <!-- <div class="right">
                    X<i class="num">{{item.productCount}}</i>
                  </div> -->
                </li>
              </ul>
            </li>
            <li class="list border-bottom">
              <div class="list-content"
                   @click="handleClickCoupon">
                <span class="text">优惠券</span>
                <div class="df acenter"
                     v-if="this.couponList.availableList&&(!coupon.couponUserId)">
                  <span v-if="this.couponList.availableList.length===0">无可用优惠券</span>
                  <span v-else>{{this.couponList.availableList.length}}张优惠券可用</span>
                  <van-icon name="arrow"
                            color="#999"
                            size="20px" />
                </div>
                <div class="df acenter"
                     v-if="coupon.couponUserId">
                  <span>满{{coupon.favourableCondition}}减{{coupon.discountAmount}}</span>
                  <van-icon name="arrow"
                            color="#999"
                            size="20px" />
                </div>
              </div>
            </li>
            <li class="list border-bottom"
                :class="{'list-switch-active':!teaSilverUsed}">
              <div class="list-content">
                <span class="text">{{initData.teaSilverContent}}</span>
                <van-switch v-model="teaSilverUsed"
                            size="18px"
                            active-color="#fff"
                            inactive-color="#fff"
                            @change="InitUpdate"
                            :disabled="!initData.teaSilverFlag" />
              </div>
            </li>
            <li class="list">
              <van-field v-model="message"
                         label="买家留言"
                         type="textarea"
                         placeholder="请输入留言"
                         rows="1"
                         autosize
                         @blur="blurInput" />
            </li>
          </ul>
        </div>
        <!-- 商品价格 -->
        <ul class="total">
          <li class="item">
            <span class="name">商品总价</span>
            <span class="num">&yen;{{price}}</span>
          </li>
          <!-- <li class="item">
            <span class="name">活动优惠</span>
            <span class="num active">-&yen;0.0</span>
          </li> -->
          <li class="item">
            <span class="name">运费</span>
            <span class="num active">&yen;{{initData.postage}}</span>
          </li>
          <li class="item"
              v-if="initData.counteractStatus&&!teaSilverUsed">
            <span class="name active">茶银</span>
            <span class="num active">-&yen;{{initData.counteractStatus}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 支付bar -->
    <div class="pay-bar border-top"
         v-show="!loading">
      <span class="price">合计：&yen; {{initData.payPrice}}</span>
      <!-- <span class="btn" @click="goPay">去支付</span> -->
      <van-button type="default"
                  class="btn"
                  @click="goPay"
                  :disabled="goPayBtnConfig.goPayBtnDisabled"
                  :loading="goPayBtnConfig.goPayBtnLoading"
                  loading-text="正在支付">去支付</van-button>
    </div>
    <CouponLayer :couponLayerShow.sync="couponLayerShow" ref="CouponLayerRef"
                 v-show="couponLayerShow"
                 v-if="couponList.availableList&&couponList.unavailableList"
                 :availableList="couponList.availableList"
                 :unavailableList="couponList.unavailableList"
                 @sureCouponSelect="sureCouponSelect"></CouponLayer>
    <PopBindphone ref="Popphone" @bindOk="goPay"></PopBindphone>
  </div>
  </client-only>
</template>

<script>
import PopBindphone from '~/components/detail/PopBindphone'
import backbar from '~/components/backbar'
import { setOrder, cartToOrder } from '~/api/product'
import { orderInit, orderInitUpdate } from '~/api/order'
import { WX } from '~/environment/esm'
import { URL } from '~/config/constant'
import { mapGetters } from 'vuex'
import tag from '~/components/tag'
import setAddress from '~/components/self/setAddress'
import { setStore, getStore } from '~/utils/tool'
// import {getAddress} from '~/api/self'
import CouponLayer from '~/components/self/coupon/CouponLayer'
import { setAppendAdd } from '~/api/self'
import { mobileReg } from '~/utils/validate'
export default {
  name: 'Pay',
  data () {
    return {
      loading: true,
      message: '',
      order: [],
      code: '',
      orderlist: {},
      payTypeSelect: 'wx', // 用户选择的支付方式
      payType: '', // 详情页支付  和 订单支付 传参不同
      price: 0, // 订单金额
      addpri: 0, // 邮费
      teaSilverUsed: true,
      productOrderId: '',
      goPayBtnConfig: {
        goPayBtnDisabled: false,
        goPayBtnLoading: false
      },
      initData: {},
      couponList: {
        availableList: [],
        unavailableList: []
      },
      couponLayerShow: false,
      coupon: {}
    }
  },
  components: {
    backbar,
    tag,
    CouponLayer,
    setAddress,
    PopBindphone
  },
  mounted () {
    if (WX) {
      this.code = this.GetQueryString('code')
      this.payTypeSelect = 'wx'
    }
    this.payType = sessionStorage.getItem('__teapayType__')
    this.order = JSON.parse(sessionStorage.getItem('__teaOrder__')) || []
    this.price = 0
    this.goPayBtnConfig.goPayBtnDisabled = false
    this.goPayBtnConfig.goPayBtnLoading = false
    if (this.order) {
      this.order.map(elem => {
        this.price += (elem.unitPrice * elem.productCount)
      })
    }
    this.Init()
  },
  methods: {
    // 获取地址栏后面的参数
    GetQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    blurInput () {
      window.scrollTo(0, 0)
    },
    Init () {
      if (this.user.userId) {
        this.loading = true
        const option = {
          userId: this.user.userId,
          price: this.price,
          initType: this.payType === 'cart' ? 1 : 2,
          productCount: this.payType === 'cart' ? '' : [],
          productId: this.payType === 'cart' ? '' : [],
          attrId: this.payType === 'cart' ? [] : [],
          productOrderIds: this.payType === 'cart' ? [] : '',
          attrIds: this.payType === 'cart' ? [] : []
        }
        if (this.payType !== 'cart') {
          this.order.map(item => {
            option.productCount.push(item.productCount)
            option.productId.push(item.productId)
            option.attrId.push(item.attrId)
            option.attrIds.push(item.attrId)
          })
          option.productCount = option.productCount.join(',')
          option.productId = option.productId.join(',')
          option.attrId = option.attrId.join(',')
          option.attrIds = option.attrIds.join(',')
        } else {
          this.order.map(item => {
            option.productOrderIds.push(item.productOrderId)
            option.attrId.push(item.attrId)
            option.attrIds.push(item.attrId)
          })
          option.productOrderIds = option.productOrderIds.join(',')
          option.attrId = option.attrId.join(',')
          option.attrIds = option.attrIds.join(',')
        }
        this.$axios.$post(orderInit, option).then(res => {
          if (res.code === 10000) {
            this.initData = res.data
            const add = JSON.parse(sessionStorage.getItem('__teaAdd__')) || ''

            // this.price = this.initData.payPrice
            this.couponList.availableList = res.data.availableList
            this.couponList.unavailableList = res.data.unavailableList
            this.loading = false
            const coupon = this.couponList.availableList.filter(item => item.recommendFlag === true)[0]
            this.coupon = coupon || {}
            this.$refs.CouponLayerRef.select = JSON.parse(JSON.stringify(this.coupon || {}))
            if (add) {
              this.initData.address = Object.assign({}, add)
              this.InitUpdate()
            }
          } else {
            this.$toast('订单初始化失败')
          }
        })
      }
    },
    InitUpdate () {
      const option = {
        userId: this.user.userId,
        price: this.price,
        addressId: (this.initData.address && this.initData.address.addressId) ? this.initData.address.addressId : '',
        teaSilverUsed: this.teaSilverUsed ? 0 : 1,
        couponUserId: this.coupon.couponUserId ? this.coupon.couponUserId : ''
      }
      this.$axios.$post(orderInitUpdate, option).then(res => {
        if (res.code === 10000) {
          this.initData = res.data
        } else {
          this.$toast(res.message)
        }
      })
    },
    handleClickCoupon () {
      this.couponLayerShow = true
    },
    // 显示绑定手机
    handleClickPopBindphone () {
      this.$refs.Popphone.toggle()
    },
    sureCouponSelect (coupon) {
      this.couponLayerShow = false
      this.coupon = coupon
      this.InitUpdate()
    },
    onBridgeReady (payData) { // 微信支付函数
      // eslint-disable-next-line
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          appId: payData.appId, // 公众号名称，由商户传入
          timeStamp: payData.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: payData.nonceStr, // 随机串
          package: payData.package,
          signType: payData.signType, // 微信签名方式：
          paySign: payData.paySign // 微信签名
        },
        (res) => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            // this.$router.push({name: 'PayOver', params: {saveOrderData: this.saveOrderData}})
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
          this.goPayBtnConfig.goPayBtnDisabled = false
          this.goPayBtnConfig.goPayBtnLoading = false
          // window.location.href = `${URL}/payover?saveOrderData=${JSON.stringify(this.saveOrderData)}`
          this.$router.push({
            path: '/pay/over',
            query: {
              productOrderId: this.productOrderId,
              price: this.price
            }
          })
        })
    },
    // 新用户会在本页进行添加地址
    saveAddress () {
      return new Promise((resolve, reject) => {
        console.log(this)
        const addData = this.$refs.setAddressData.add
        console.log(addData)
        const option = {
          userId: this.user.userId,
          recipientName: addData.recipientName,
          recipientSex: addData.recipientSex,
          recipientMobile: addData.recipientMobile,
          recipientAddress: addData.recipientAddress,
          addressDetail: addData.addressDetail,
          addressTag: addData.addressTag,
          defaultStatus: addData.defaultStatus // 0 不默认 1 默认
        }
        if (!mobileReg.test(option.recipientMobile)) {
          this.$toast('请输入正确的手机号')
          return
        }
        if (option.recipientName === '' || option.addressDetail === '') {
          this.$toast('请填写完整信息')
          return
        }
        this.goPayBtnConfig.goPayBtnDisabled = true
        this.goPayBtnConfig.goPayBtnLoading = true
        this.$axios.$post(setAppendAdd, option).then(res => {
          if (res.code === 10000) {
            this.initData.address = res.data
            resolve(true)
          } else {
            this.$toast(res.message)
            this.goPayBtnConfig.goPayBtnDisabled = false
            this.goPayBtnConfig.goPayBtnLoading = false
            // eslint-disable-next-line
            reject(false)
          }
        }).catch(() => {
          this.goPayBtnConfig.goPayBtnDisabled = false
          this.goPayBtnConfig.goPayBtnLoading = false
          // eslint-disable-next-line
          reject(false)
        })
      })
    },
    async goPay () { // 保存订单到后台,成功后调起微信支付
      if (!(this.initData.address && this.initData.address.addressId)) {
        // 异步保存地址
        const saveStatus = await this.saveAddress()
        if (!saveStatus) {
          this.$toast('地址信息有误')
          return
        }
      }
      if (!(this.initData.address && this.initData.address.addressId)) {
        this.$toast('请先选择收货地址')
        return
      }
      if (!this.user.mobileFlag) {
        this.handleClickPopBindphone()
        return
      }
      let shopId = sessionStorage.getItem('_shopId_')
      if (shopId) {
        shopId = JSON.parse(shopId).shopId
        if (shopId === 'jrtt001' && window.meteor) {
          // 头条转化检测
          window.meteor.track('shopping', { convert_id: 1644993639783492 })
        }
      }

      if (WX) {
        this.goPayBtnConfig.goPayBtnDisabled = true
        this.goPayBtnConfig.goPayBtnLoading = true

        if (this.payType === 'detail') {
          const params = JSON.parse(sessionStorage.getItem('_shopId_'))
          let odertStrTemp = []
          this.order.map(item => {
            odertStrTemp.push(`${item.productId}&${item.productCount}&${item.attrId}`)
          })
          odertStrTemp = odertStrTemp.join('|')

          const option = {
            addressId: this.initData.address.addressId,
            orderDetailStr: odertStrTemp,
            userId: this.user.userId,
            payWay: 'weJs',
            code: this.code,
            leaveMessage: this.message,
            teaSilverUsed: this.teaSilverUsed ? 0 : 1,
            couponUserId: this.coupon.couponUserId ? this.coupon.couponUserId : '',
            specialType: params && params.specialType ? params.specialType : 0,
            shopId: params && params.shopId ? params.shopId : ''
          }
          this.$axios.$post(setOrder, option).then(res => {
            if (res.code === 10000) {
              this.productOrderId = res.data.productOrderId
              this.price = res.data.price
              if (typeof WeixinJSBridge === 'undefined') {
                if (document.addEventListener) {
                  // eslint-disable-next-line
                  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                } else if (document.attachEvent) {
                  // eslint-disable-next-line
                  document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                  // eslint-disable-next-line
                  document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                }
              } else {
                // eslint-disable-next-line
                this.onBridgeReady(res.data)
              }
            } else {
              this.$toast(res.message)
            }
          })
        } else if (this.payType === 'cart') {
          let orderIdstr = ''
          this.order.forEach(item => {
            orderIdstr += item.productOrderId + ','
          })
          orderIdstr = orderIdstr.replace(/,$/gi, '')
          console.log(orderIdstr)
          const option = {
            productOrderId: orderIdstr,
            userId: this.user.userId,
            addressId: this.initData.address.addressId,
            payWay: 'weJs',
            code: this.code,
            leaveMessage: this.message,
            teaSilverUsed: this.teaSilverUsed ? 0 : 1,
            couponUserId: this.coupon.couponUserId ? this.coupon.couponUserId : ''
          }
          this.$axios.$post(cartToOrder, option).then(res => {
            if (res.code === 10000) {
              this.goPayBtnConfig.goPayBtnDisabled = true
              this.goPayBtnConfig.goPayBtnLoading = true
              this.productOrderId = res.data.productOrderId
              this.price = res.data.price
              if (typeof WeixinJSBridge === 'undefined') {
                if (document.addEventListener) {
                  // eslint-disable-next-line
                  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                } else if (document.attachEvent) {
                  // eslint-disable-next-line
                  document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                  // eslint-disable-next-line
                  document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                }
              } else {
                // eslint-disable-next-line
                this.onBridgeReady(res.data)
              }
            } else {
              this.$toast(res.message)
            }
          })
        }
      } else {
        // 浏览器中支付
        this.goPayBtnConfig.goPayBtnDisabled = true
        this.goPayBtnConfig.goPayBtnLoading = true
        const payTypeSelect = this.payTypeSelect
        if (this.payType === 'detail') {
          let odertStrTemp = []
          this.order.map(item => {
            odertStrTemp.push(`${item.productId}&${item.productCount}&${item.attrId}`)
          })
          odertStrTemp = odertStrTemp.join('|')
          const params = JSON.parse(sessionStorage.getItem('_shopId_'))
          const option = {
            addressId: this.initData.address.addressId,
            orderDetailStr: odertStrTemp,
            userId: this.user.userId,
            payWay: payTypeSelect === 'wx' ? 'weWeb' : 'aliWeb',
            leaveMessage: this.message,
            teaSilverUsed: this.teaSilverUsed ? 0 : 1,
            couponUserId: this.coupon.couponUserId ? this.coupon.couponUserId : '',
            specialType: params && params.specialType ? params.specialType : 0,
            shopId: params && params.shopId ? params.shopId : ''
          }
          this.$axios.$post(setOrder, option).then(res => {
            if (res.code === 10000) {
              if (payTypeSelect === 'zfb') {
                // ------支付宝支付-------
                console.log(payTypeSelect)
                console.log(res)
                const detail = {
                  price: res.data.price,
                  productOrderId: res.data.productOrderId
                }
                setStore('_productDetail_', detail)
                this.aliPay(res.data.ali_res)
              } else if (payTypeSelect === 'wx') {
                // -----微信支付-------
                this.productOrderId = res.data.productOrderId
                this.price = res.data.price
                const url = encodeURIComponent(`${URL}/pay/over?productOrderId=${this.productOrderId}&price=${this.price}`)
                if (res.data.mweb_url) {
                  window.location.href = `${res.data.mweb_url}&redirect_url=${url}`
                }
              }
            } else {
              this.$toast(res.message)
            }
          })
        } else if (this.payType === 'cart') {
          let orderIdstr = ''
          this.order.forEach(item => {
            orderIdstr += item.productOrderId + ','
          })
          orderIdstr = orderIdstr.replace(/,$/gi, '')
          const option = {
            productOrderId: orderIdstr,
            userId: this.user.userId,
            addressId: this.initData.address.addressId,
            payWay: payTypeSelect === 'wx' ? 'weWeb' : 'aliWeb',
            leaveMessage: this.message,
            teaSilverUsed: this.teaSilverUsed ? 0 : 1,
            couponUserId: this.coupon.couponUserId ? this.coupon.couponUserId : ''
          }
          this.$axios.$post(cartToOrder, option).then(res => {
            if (res.code === 10000) {
              if (payTypeSelect === 'zfb') {
                // ------支付宝支付-------
                console.log(payTypeSelect)
                console.log(res)
                const detail = {
                  price: res.data.price,
                  productOrderId: res.data.productOrderId
                }
                setStore('_productDetail_', detail)
                this.aliPay(res.data.ali_res)
              } else if (payTypeSelect === 'wx') {
                // ------微信支付-------

                this.productOrderId = res.data.productOrderId
                this.price = res.data.price
                const url = encodeURIComponent(`${URL}/pay/over?productOrderId=${this.productOrderId}&price=${this.price}`)
                console.log(url)
                if (res.data.mweb_url) {
                  window.location.href = `${res.data.mweb_url}&redirect_url=${url}`
                }
              }
            } else {
              this.$toast(res.message)
            }
          })
        }
      }
    },
    aliPay (res) {
      const form = res
      const div = document.createElement('div')
      div.id = 'alipay'
      div.innerHTML = form
      document.body.appendChild(div)
      document.querySelector('#alipay').children[0].submit() // 执行后会唤起支付宝
    }
  },
  computed: {
    ...mapGetters([
      'user']),
    isWX () {
      return WX
    }
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

.pay-wrap {
  padding: 54px 0;
  background-color: #f1f1f1;
  overflow-y: scroll;
  .payWrapone {
    padding: 0px 0 28px;
  }
  .addressnone {
    color: #333;
    background-color: #fff;
    margin: 0 10px 20px;
    min-height: 60px;
  }
  .address {
    margin: 0 10px 20px;
    min-height: 60px;
    padding: 5px 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    color: #333;
    background-color: #fff;
    .icon {
      margin: 0 10px 5px 15px;
      display: block;
      flex: 0 0 24px;
      width: 24px;
      height: 29px;
      &.add {
        @include bg-image('self/none');
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      .left {
        p {
          margin-top: 10px;
        }
        .detail {
          display: flex;
          align-items: center;
          .tag {
            margin-right: 5px;
          }
          .name {
            margin-right: 15px;
          }
        }
      }
      .right {
        width: 16px;
        height: 16px;

        background-size: cover;
      }
    }
    .text {
      flex: 1;
    }
    .iconfont {
      margin-right: 14px;
      color: #333;
    }
  }
  .pay {
    padding: 0 10px;
    .title {
      margin-left: 5px;
    }
    ul {
      margin-top: 15px;
      background-color: #fff;
      .item {
        margin: 0 10px;
        padding: 0 5px;
        height: 44px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        &:before {
          border: 0;
        }
        .left {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            display: block;
            width: 17px;
            height: 17px;
            &.weixin {
              @include bg-image('pay/weixinlogo');
              background-size: cover;
            }
            &.zfb {
              @include bg-image('pay/zfb');
              background-size: cover;
            }
          }
        }
        .right {
          .icon {
            display: block;
            width: 15px;
            height: 15px;

            border-radius: 100%;
            @include bg-image('pay/select');
            background-size: cover;
            &.active {
              @include bg-image('pay/selected');
            }
          }
        }
      }
    }
  }
  .pro-wrap {
    padding: 20px 10px 10px;
    .title {
      margin-bottom: 15px;
      margin-left: 5px;
    }
    .pro {
      padding-left: 15px;
      background-color: #fff;
      .list /deep/ .van-cell {
        padding-left: 0;
      }
      .list /deep/ .van-field__label {
        max-width: 70px;
      }
      .list {
        padding: 0 5px;
        .list-content /deep/ .van-switch__node {
          background-color: #d55847;
        }
        .list-content /deep/ .van-switch--on > .van-switch__node {
          background-color: #999;
        }
        .list-content {
          height: 44px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
        }
        &:before {
          border-color: #e8e8e8;
        }
        .iconfont {
          color: #333;
        }
        &:first-child {
          overflow: hidden;
          ul {
            width: 100%;
            .item {
              width: 100%;
              padding: 15px 0;
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              align-items: center;
              .left {
                flex: 1;
                display: flex;
                flex-flow: row nowrap;
                img {
                  margin-right: 12px;
                  display: block;
                  width: 74px;
                  height: 75px;
                }
                .desc {
                  .name {
                    display: block;
                    margin-bottom: 5px;
                    line-height: 17px;
                  }
                  .price {
                    font-size: 14px;
                    color: #d45949;
                  }
                }
              }
              .right {
                margin-right: 5px;
                .num {
                  margin-left: 7px;
                }
              }
            }
          }
        }
      }
    }
  }
  .total {
    margin: 0 10px;
    padding: 15px 20px;
    background-color: #fff;
    .item {
      padding-bottom: 15px;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      &:last-child {
        padding-bottom: 0;
      }
      .num {
        &.active {
          color: #d45949;
        }
      }
    }
  }
}
.pay-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: 54px;
  display: flex;
  flex-flow: row nowrap;
  background-color: #fff;
  &:before {
    border-color: #e8e8e8;
  }
  .price {
    flex: 1;
    margin-left: 15px;
    line-height: 54px;
  }
  .btn {
    flex: 0 0 2.8rem;
    height: 54px;
    line-height: 54px;
    text-align: center;
    color: #fff;
    background-color: #d45949;
    font-size: 18px;
  }
}

.loading {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 10px;
  z-index: 9999;
}
</style>
