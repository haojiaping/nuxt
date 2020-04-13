<template>
   <section>

   </section>
</template>

<script>
import { getDoPay } from '~/api/weixin'
import { mapGetters } from 'vuex'
import { WX } from '~/environment/esm'
import { setStore } from '~/utils/tool'
import { URL } from '~/config/constant'
export default {
  data() {
    return {
      productOrderId: '',
      price: 0,
      payway: ''
    }
  },
  mounted() {
    this.payway = this.$route.query.payway
    this.productOrderId = this.$route.query.productOrderId
    if (WX) {
      this.payInitWX()
    } else {
      this.payInit()
    }
  },
  watch: {

  },
  methods: {
    payInit() {
      const payway = this.payway
      const option = {
        productOrderId: this.productOrderId,
        payWay: payway === 'wx' ? 'weWeb' : 'aliWeb',
        userId: this.user.userId,
        token: this.user.token
      }
      this.$axios.$post(getDoPay, option).then(res => {
        if (res.code === 10000) {
          this.price = res.data.price
          if (payway === 'zfb') {
            // ------支付宝支付-------
            console.log(payway)
            console.log(res)
            const detail = {
              price: res.data.price,
              productOrderId: res.data.productOrderId
            }
            setStore('_productDetail_', detail)
            this.aliPay(res.data.ali_res)
          } else if (payway === 'wx') {
            // -----微信支付-------
            this.productOrderId = res.data.productOrderId
            this.price = res.data.price
            const url = encodeURIComponent(`${URL}/pay/over?productOrderId=${this.productOrderId}&price=${this.price}`)
            if (res.data.mweb_url) {
              window.location.href = `${res.data.mweb_url}&redirect_url=${url}`
            }
          }
        }
      })
    },
    payInitWX() {
      const search = decodeURIComponent(window.location.search).split('?')[1].split('&')
      const code = search[1].split('=')[1]
      this.productOrderId = search[0].split('=')[1]
      const option = {
        productOrderId: this.productOrderId,
        payWay: 'weJs',
        userId: this.user.userId,
        token: this.user.token,
        code: code
      }
      this.$axios.$post(getDoPay, option).then(res => {
        console.log(res)
        if (res.code === 10000) {
          this.price = res.data.price
          setTimeout(() => {
            if (typeof WeixinJSBridge === 'undefined') {
              alert('undefined')
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
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      })
    },

    onBridgeReady(payData) { // 微信支付函数
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
          // this.$router.push({name:'order'})
          console.log(res)
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            this.$toast('支付成功')
            // this.$router.push({name: 'PayOver', params: {saveOrderData: this.saveOrderData}})
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            this.$toast('支付取消')
            // this.saveOrderData.Paystate = 2
            // this.$router.push({path: '/payover', query: {saveOrderData: JSON.stringify(this.saveOrderData)}})
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            // this.saveOrderData.Paystate = 1
            this.$toast('支付失败')
            // this.$router.push({path: '/payover', query: {saveOrderData: JSON.stringify(this.saveOrderData)}})
          }
          this.$router.push({ path: '/pay/over', query: { productOrderId: this.productOrderId, price: this.price } })
        })
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
  components: {

  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>

</style>
