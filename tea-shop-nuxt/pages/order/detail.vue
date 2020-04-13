<template>
<client-only>
  <div>
  <div v-if="detailData.postFlag===0||detailData.postFlag===1">
    <backbar  title="订单详情" @setHeight="setHeight"/>
    <div class="orderdetail-wrap mescroll-touch" :class="detailData.orderStatus===0?'bottom':''" ref="detail">
    <div >
      <!-- <nuxt-link to="/about/downapp" class="downBtnWrap pf" v-if="downBtn"></nuxt-link> -->
      <jump></jump>
      <div class="header-wrap" :class="{'bgcolor-size':detailData.orderStatus===0}">
        <div class="header-title">
          <div class="header-left" v-if="detailData.orderStatus===0">
            <span>等待付款</span>
            <span>剩余:</span>
            <span>{{showTime}}</span>
          </div>
          <div class="header-left" v-else>
            <span>{{detailData.orderStatus|formatStatus}}</span>
          </div>
          <!-- <div class="header-left" v-else-if="detailData.orderStatus===2">
            <span>待收货</span>
          </div>
          <div class="header-left" v-else-if="detailData.orderStatus===3||detailData.orderStatus===4||detailData.orderStatus===6">
            <span>待评价</span>
          </div>
          <div class="header-left" v-else-if="detailData.orderStatus===5||detailData.orderStatus===11">
            <span>交易关闭</span>
          </div> -->
          <div class="header-right" :class="detailData.orderStatus===0?'waitPay':'Payed'"></div>
        </div>
        <div class="header-log" @click="jumpToEx"
        v-if="![0,4,5,6,11].includes(detailData.orderStatus)">
          <div class="log-add" v-if="detailData.postageContent&&detailData.postFlag===0">{{detailData.postageContent|formatContent}}</div>
          <div class="log-add" v-else-if="detailData.postageContent&&detailData.postFlag===1">{{detailData.postageContent}}</div>
          <div class="log-add" v-else>等待揽件</div>
          <!-- <div class="log-time">{{logisticsInfo.AcceptTime}}</div> -->
        </div>
        <div class="header-content" v-if="detailData">
          <div class="cont-name">
            <span>{{detailData.nickName}}</span>
            <span>{{detailData.userMobile}}</span>
          </div>
          <div class="cont-add">
            <span>地址:</span>
            <span>{{detailData.recipientAddress}}</span>
          </div>
        </div>
      </div>
      <div class="sub-wrap">
        <div class="sub-title">商品信息</div>
        <div class="sub-content" v-if="detailData">
          <div class="good border-bottom" v-for="(item,index) in detailData.products" :key="`goods${index}`" @click="jumpToDetail(item)">
            <div class="good-sub">
              <div class="good-img">
                <img :src="item.productImage" width="100%">
              </div>
              <div class="good-text">
                <p class="good-name">{{item.productName}}</p>
                <div class="good-num f12 c9">
                  <span>规格:</span>
                  <span>{{item.productStyle}}</span>
                  <span>&nbsp;&nbsp;</span>
                  <span>数量:</span>
                  <span>{{item.productCount}}</span>
                </div>
                <p class="good-pri">¥ {{item.unitPrice}}</p>
              </div>
            </div>
            <!-- <div class="good-num">
              X {{item.productCount}}
            </div> -->
          </div>
          <div class="sub-text">
            <span>商品总价</span>
            <span>¥{{detailData.orderPrice}}</span>
          </div>
          <!-- <div class="sub-text">
            <span>活动优惠</span>
            <span>暂无</span>
          </div> -->
          <div class="sub-text">
            <span>运费</span>
            <span>¥{{detailData.transportPrice}}</span>
          </div>
          <div class="sub-text">
            <span>优惠券</span>
            <span class="active" v-if="detailData.discountCoupon!=='0'">-¥{{detailData.discountCoupon}}</span>
            <span class="active" v-if="detailData.discountCoupon==='0'">暂无</span>
          </div>
          <div class="sub-text">
            <span>茶银</span>
            <span class="active">-¥{{detailData.counteractPrice}}</span>
          </div>
          <div class="sub-text">
            <span>留言内容</span>
            <span>{{detailData.leaveMessage}}</span>
          </div>
        </div>
        <div class="sub-foot">
          <div class="foot-text">
            <div>
              <span>订单编号:</span>
              <span>{{detailData.productOrderId}}</span>
            </div>
            <!-- <div class="copy border" ref="orderCopy" :data-clipboard-text="this.productOrderId">复制</div> -->
            <div class="copy border" ref="orderCopy" @click="copyData">复制</div>
          </div>
          <div class="foot-text">
            <div>
              <span>提交时间:</span>
              <span>{{detailData.createTime}}</span>
            </div>
          </div>
          <div class="foot-text">
            <span>支付方式: 在线支付</span>
          </div>
          <div class="foot-text" v-if="detailData.remark&&detailData.remark!=='-'"  style="line-height: 0.35rem;align-items: flex-start;">
            <span style="width:57px;">订单备注: </span>
            <span style="color:#D45949;">{{detailData.remark}}</span>
          </div>
        </div>
        <div class="sub-foot">
          <div class="foot-pin df" @click="jumpToPin">
            <div class="pinyin df">
              <i class="pin"></i>
              <span class="f15 fw400">品饮指南</span>
            </div>
            <van-icon name="arrow" color="#999" size="20px"/>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="footer" v-if="detailData.orderStatus===0">
      <div class="footer-txt">
        <span>应付金额</span>
        <span>¥ {{detailData.orderPrice}}</span>
      </div>
      <span class="footer-btn close" @click="closeOrder">取消订单</span>
      <div tag="span" class="footer-btn pay" @click="payAgain">立即付款</div>
    </div>
    <div class="customWraper" @click="jumpTocustom"></div>
    <div class="paying-wrap">
      <van-action-sheet v-model="show" :close-on-click-overlay="false"
      title="请选择支付方式" @cancel="onCancel">
        <ul>
          <li class="item border-bottom">
            <div class="left">
              <i class="icon weixin"></i>
              <span class="text">微信</span>
            </div>
            <div class="right">
              <i class="icon" :class="select==='wx'?'active':''" @click="select='wx'"></i>
            </div>
          </li>
          <li class="item border-bottom" v-if="!isWx">
            <div class="left">
              <i class="icon zfb"></i>
              <span class="text">支付宝</span>
            </div>
            <div class="right">
              <i class="icon" :class="select==='zfb'?'active':''" @click="select='zfb'"></i>
            </div>
          </li>
          <li class="btn" @click="choosePay">
            <p>确定</p>
          </li>
        </ul>
      </van-action-sheet>
    </div>
  </div>
  </div>
  </client-only>
</template>

<script>
import jump from '~/components/popjump/jump'
import backbar from '~/components/backbar'
import ClipboardJS from 'clipboard'
import { getOrderdetail, delOrder } from '~/api/order'
import { mapGetters } from 'vuex'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { wxreAgainPay, URL, wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
export default {
  data () {
    return {
      productOrderId: '',
      detailData: {},
      isEnd: false,
      endTime: '',
      showTime: '',
      logisticsInfo: {},
      IOSHeight: 0,
      show: false,
      select: 'wx',
      downBtn: false
    }
  },
  // mounted () {
  // },
  mounted () {
    this.productOrderId = this.$route.query.productOrderId
    this.orderDetail()

    setTimeout(() => {
      this.downBtn = !(IOS || ANDROID)
      // this.copytext(this.$refs.orderCopy)
    }, 500)
  },
  methods: {
    payAgain() {
      const arg = {
        productOrderId: this.productOrderId,
        orderPrice: this.detailData.orderPrice
      }
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goSelectPayway', JSON.stringify(arg), res => {

              // var userid = JSON.parse(res)
              // alert(res.userId)
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goOrderDetailPayPop(this.productOrderId, `${this.detailData.orderPrice}`)
      } else {
        this.show = true
        // this.$router.push({path: '/pay/again', query: {productOrderId: this.detailData.productOrderId}})
      }
    },
    copyData() {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', window.location.href)
      document.body.appendChild(input)
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$toast('复制成功')
      }
      document.body.removeChild(input)
      console.log(window.location.href)
    },
    choosePay() {
      if (WX) {
        if (this.user.isLogin) {
          const url = `${URL}/pay/again?productOrderId=${this.productOrderId}`
          // 登录态直接去拉取授权获取code后跳转到支付确认页面
          window.location.href = `${wxreAgainPay(url)}`
        } else {
          // 如果没有登录保存当前页面拉取授权后再返回当前页面
          setStore('__redirectUrl__', this.$route.fullPath)
          window.location.href = `${wxreURL}`
        }
        // this.$router.push('/pay/sure')
      } else {
        this.$router.push({ path: '/pay/again', query: { productOrderId: this.productOrderId, payway: this.select } })
      }
    },
    onCancel() {
      this.show = false
    },
    closeOrder() {
      let userIdNew = ''
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            userIdNew = res.userId
            const option = {
              productOrderId: this.productOrderId,
              userId: userIdNew
            }
            this.$axios.$post(delOrder, option).then(res => {
              if (res.code === 10000) {
                this.$toast('取消成功')
                window.callback(ios => {
                  ios.callHandler('clickCancelOrder', null, res => {
                  })
                })
                this.orderDetail()
              } else {
                this.$toast(res.message)
              }
            })
          })
        })
      } else if (ANDROID) {
        userIdNew = window.android.getUserId()
        const option = {
          productOrderId: this.productOrderId,
          userId: userIdNew
        }
        this.$axios.$post(delOrder, option).then(res => {
          if (res.code === 10000) {
            this.$toast('取消成功')
            this.orderDetail()
          } else {
            this.$toast(res.message)
          }
        })
      } else {
        userIdNew = this.user.userId
        const option = {
          productOrderId: this.productOrderId,
          userId: userIdNew
        }
        this.$axios.$post(delOrder, option).then(res => {
          if (res.code === 10000) {
            this.$toast('取消成功')
            this.orderDetail()
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    jumpToEx() {
      if (this.detailData.postFlag === 1) {
        this.$router.push({ path: '/order/middle', query: { productOrderId: this.productOrderId, type: 'detail' } })
      } else {
        this.$router.push({ path: '/order/express', query: { productOrderId: this.productOrderId, postageId: this.detailData.products[0].postageId, type: 'detail' } })
      }
    },
    jumpToPin() {
      this.$router.push({ path: '/introduce/drinkinfo', query: { gobackMyback: true } })
    },
    jumpTocustom() {
      const sendData = {
        productOrderId: this.detailData.productOrderId,
        // productId: this.detailData.products[0].productId,
        imageUrl: this.detailData.products[0].productImage,
        productName: this.detailData.products[0].productName,
        price: `${this.detailData.products[0].productPrice}`,
        productCount: 1
      }
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goCustomerService', sendData, res => {

            })
          })
        }, 20)
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          // let userId = window.android.getUserId()
          // let token = window.android.getToken()
          // let isLogin = true
          // this.adminActions({userId, token, isLogin})
          window.android.goCustomerService(JSON.stringify(sendData))
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        sessionStorage.removeItem('__teacustomorder__')
        this.detailData.from = 'order'
        sessionStorage.setItem('__teacustomorder__', JSON.stringify(this.detailData))

        this.$router.push('/custom')
      }
    },
    orderDetail() {
      const option = {
        productOrderId: this.productOrderId,
        userId: this.user.userId
      }
      this.$axios.$post(getOrderdetail, option).then(res => {
        if (res.code === 10000) {
          this.detailData = res.data
          // if (this.detailData.postFlag === 0) {
          //   this.$router.push({path: '/exmiddle', query: {productOrderId: this.productOrderId, postageId: this.detailData.products[0].postageId}})
          // }
          if (res.data.logisticsInfo && res.data.logisticsInfo.state !== 0) {
            const traceJson = JSON.parse(res.data.logisticsInfo.traceJson)
            this.logisticsInfo = traceJson[0]
          } else {
            this.logisticsInfo.AcceptStation = '暂无物流信息'
            this.logisticsInfo.AcceptTime = new Date().toLocaleString()
          }
          if (this.detailData.orderStatus === 0) {
            this.endTime = res.data.createTime.replace(/-/g, '/')
            this.setEndTime()
          }
        }
      })
    },
    copytext(target) {
      this.clipboard = new ClipboardJS(target)
      this.clipboard.on('success', (e) => {
        // console.info('Action:', e.action)
        // console.info('Text:', e.text)
        // console.info('Trigger:', e.trigger)
        this.layerTitle = '复制成功'
        this.layerText = e.text
        this.copySucc = true
        this.$toast('复制成功')
        setTimeout(() => {
          this.copySucc = false
        }, 2000)
        e.clearSelection()
      })

      this.clipboard.on('error', function(e) {
        console.error('Action:', e.action)
        console.error('Trigger:', e.trigger)

        this.layerTitle = '复制失败请长按手动复制'
        this.layerText = e.text
        this.copySucc = true
        this.$toast('复制失败请长按手动复制')
        setTimeout(() => {
          this.copySucc = false
        }, 2000)
      })
    },
    // 获取地址栏后面的参数
    GetQueryString(key) {
      var after = window.location.href
      if (after.indexOf('?') === -1) return null // 如果url中没有传参直接返回空
      // key存在先通过search取值如果取不到就通过hash来取
      after = window.location.hash.split('?')[1]
      if (after) {
        var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
        var r = after.match(reg)
        if (r != null) {
          return decodeURIComponent(r[2])
        } else {
          return null
        }
      }
    },
    setEndTime() {
      this.timestampToTime()
      this.interval = setInterval(() => {
        this.timestampToTime()
      }, 1000)
    },
    timestampToTime() {
      const time = {
        m: '',
        s: ''
      }
      var date = (Date.parse(new Date(this.endTime)) + 3600000) - (Date.parse(new Date())) // 计算剩余的毫秒数
      if (date <= 0) {
        this.detailData.orderStatus = 11
        clearInterval(this.interval)
      } else {
        time.m = parseInt(date / 1000 / 60 % 60, 10)// 计算剩余的分钟
        if (time.m < 10) {
          time.m = '0' + time.m
        }
        time.s = parseInt(date / 1000 % 60, 10)// 计算剩余的秒数
        if (time.s < 10) {
          time.s = '0' + time.s
        }
        this.showTime = `${time.m}分${time.s}秒`
      }
    },
    setHeight(height) {
      this.IOSHeight = height
      this.$refs.detail.style.paddingTop = `${(height + 42) / 37.5}rem`
      // alert(height)
    },
    jumpToDetail(item) {
      if (item.productSaleFlag === 0) {
        this.$router.push({ path: `/${item.productId}`, query: { gobackMyback: true } })
      } else {
        this.$toast('该商品已下架')
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    clearInterval(this.interval)
    next()
  },
  computed: {
    ...mapGetters([
      'user']),
    isWx() {
      return WX
    }
  },
  components: {
    backbar,
    jump
  },
  filters: {
    formatStatus(value) {
      if (value === 0) {
        return '待付款'
      } else if (value === 1) {
        return '待发货'
      } else if (value === 2) {
        return '待收货'
      } else if (value === 3) {
        return '待评价'
      } else if (value === 4) {
        return '已评价'
      } else if (value === 5) {
        return '已过期'
      } else if (value === 6) {
        return '已完成'
      } else if (value === 7) {
        return '申请订单退货'
      } else if (value === 8) {
        return '待退货'
      } else if (value === 9) {
        return '待确认'
      } else if (value === 10) {
        return '确认退货'
      } else if (value === 11) {
        return '订单取消'
      } else {
        return '待付款'
      }
    },
    formatContent(val) {
      const str = JSON.parse(val)[0].AcceptStation
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';

.orderdetail-wrap {
  // position: fixed;
  // top: 44px;
  // left: 0;
  // right: 0;
  // bottom: 10px;
  // z-index: 10;
  padding: 44px 0 10px;
  overflow-y: scroll;
  background-color: #f2f2f2;
  .downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 30%;
    transform: translateY(-50%);
    z-index: 999;
  }
  &.bottom{
    padding-bottom: 50px;
  }
  .header-wrap {
    width: 100%;

    background: linear-gradient(0deg, rgba(255, 72, 48, 0) 0%, rgba(255, 72, 48, 1) 100%);
    &.bgcolor-size {
      background-size: 100% 50%;
      background-repeat: no-repeat;
    }
    .header-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 17px;

      color: #fff;
      .header-right {
        width: 40px;
        height: 40px;
        background-size: cover;
        &.waitPay {
          @include bg-image('order/money');
        }
        &.Payed {
          @include bg-image('order/money');
        }
      }
    }
    .header-content {
      margin: 0 auto;
      width: 95%;
      background: #fff;
      padding: 15px;
      box-sizing: border-box;
      .cont-name {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 10px;
      }
      .cont-add {
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;
      }
    }
    .header-log {
      margin: 0 auto 15px auto;
      width: 95%;
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
      .log-add {
        font-size: 15px;
        // margin-bottom: 10px;
        line-height: 19px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .log-time {
        font-size: 12px;
      }
    }
  }
  .sub-wrap {
    margin: 10px;
    font-size: 13px;
    .sub-title {
      margin-bottom: 15px;
    }
    .sub-content {
      background: #fff;
      .border-bottom:before {
        border-color: #E8E8E8;
      }
      .good {
        margin: 10px;
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .good-sub {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .good-img {
            width: 75px;
            height: 75px;
            margin-right: 10px;
          }
          .good-text {
            .good-name {

              line-height: 20px;
            }
            .good-pri {
              color: #D45949;
            }
          }
        }
        .good-num {
          flex: 0 0 auto;
        }
      }
    }
    .sub-text {
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      :first-child {
        flex: 0 0 57px;
      }
      .active {
        color: #d45949;
      }
    }
    .sub-foot {
      margin-top: 10px;
      padding: 7px 10px;
      background: #fff;
      .foot-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        .copy {
          font-size: 12px;
          padding: 0.50px 10px;
          box-sizing: border-box;
          margin-right: 0.50px;
        }
        .border:before {
          border-color: #ccc;
        }
      }
      .foot-pin{
        justify-content: space-between;
        padding: 0.50px 0;
        .pinyin{
          align-items: center;
          .pin{
            width: 18px;
            height: 18px;
            background-size: cover;
            margin-right: 10px;
            @include bg-image('order/pin');
          }
        }
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  z-index: 11;
  display: flex;
  align-items: center;
  background: #fff;
  .footer-txt {
    color: #333;
    flex: 1;
    text-align: center;
  }
  .footer-btn {
    flex: 0 0 110px;
    width: 110px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 18px;
    color: #fff;
    &.close {
      background: #ccc;
    }
    &.pay {
      background: #D45949;
    }
  }
}
.customWraper {
  position: fixed;
  bottom: 56px;
  right: 15px;
  width: 60px;
  height: 60px;
  z-index: 15;
  @include bg-image('order/kefu');
  background-size: cover;
}

.paying-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 20;
  ul {
    margin-top: 15px;
    background-color: #fff;
    .btn {
      margin: 10px;
      padding: 0 5px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
    }
    .item {
      margin: 0 10px;
      padding: 0 5px;
      height: 44px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      &:before {
        border: 0;
      }
      .left {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          display: block;
          width: 15px;
          height: 15px;
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
          @include bg-image("pay/select");
          background-size: cover;
          &.active {
            @include bg-image('pay/selected');
          }
        }
      }
    }
  }
}
</style>
