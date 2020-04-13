<template>
    <div>
      <backbar bgColor="#fff" leftColor="#333" title="我的订单"/>
        <div class="tabs van-hairline--top">
          <span class="tab-item" :class="orderStatus==='5'?'active':''" @click="handleChangeType('5')">
            <p>全部</p>
          </span>
          <span class="tab-item" :class="orderStatus==='0'?'active':''" @click="handleChangeType('0')">
            <p>待付款</p>
          </span>
          <span class="tab-item" :class="orderStatus==='1'?'active':''" @click="handleChangeType('1')">
            <p>待发货</p>
          </span>
          <span class="tab-item" :class="orderStatus==='2'?'active':''" @click="handleChangeType('2')">
            <p>待收货</p>
          </span>
          <span class="tab-item" :class="orderStatus==='3'?'active':''" @click="handleChangeType('3')">
            <p>待评价</p>
          </span>
        </div>
      <div class="mescroll" ref="mescroll">
        <div>
          <orderlist v-for="(elem,index) in dataList"
            :state="elem.orderStatus" :listData="elem"
            :key="`orderAll_${index}`"
            @closeNO="orderlist(0)"
            @payAgain="payAgain"></orderlist>
        </div>
      </div>
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
</template>

<script>
import backbar from '~/components/backbar'
import orderlist from '~/components/orderlist'
import { mapGetters } from 'vuex'
import { getOrderList } from '~/api/order'
import { WX } from '~/environment/esm'
import { setStore } from '~/utils/tool'
import { URL, wxreAgainPay, wxreURL } from '~/config/constant'
export default {
  name: 'list',
  data() {
    return {
      orderStatus: '5',
      mescroll: null,
      dataList: [],
      show: false,
      orderId: '',
      select: 'wx'
    }
  },
  mounted() {
    this.orderStatus = this.$route.query.type
    this.$nextTick(() => {
      this.mescrollInit()
    })
  },
  watch: {

  },
  methods: {
    getList(page, mescroll) {
      if (page.num === 1) this.dataList = []
      const option = {
        userId: this.user.userId,
        orderStatus: this.orderStatus,
        pageNum: page.num - 1
      }
      this.$axios.$post(getOrderList, option).then(res => {
        const arr = res.data.productList
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
            // mescroll.endSuccess(0)
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      }).catch(err => {
        this.mescroll.endErr()
        console.log(err)
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getList,
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: this.$refs.mescroll, // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    handleChangeType(type) {
      this.orderStatus = type
      this.mescroll.resetUpScroll()
    },
    payAgain(id) {
      this.show = true
      this.orderId = id
    },
    onCancel() {
      this.show = false
    },
    choosePay() {
      if (WX) {
        if (this.user.isLogin) {
          const url = `${URL}/pay/again?productOrderId=${this.orderId}`
          // 登录态直接去拉取授权获取code后跳转到支付确认页面
          window.location.href = `${wxreAgainPay(url)}`
        } else {
          // 如果没有登录保存当前页面拉取授权后再返回当前页面
          setStore('__redirectUrl__', this.$route.fullPath)
          window.location.href = `${wxreURL}`
        }
        // this.$router.push('/pay/sure')
      } else {
        this.$router.push({ path: '/pay/again', query: { productOrderId: this.orderId, payway: this.select } })
      }
    }
  },
  beforeDestroy () {
    console.log('index destory!!!!!')
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  computed: {
    ...mapGetters(['user']),
    isWx() {
      return WX
    }
  },
  components: {
    backbar,
    orderlist
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
  .tabs {
    display: flex;
    align-items: center;
    height: 40px;
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: #fff;
    &.van-hairline--top:after{
      border-color: #e8e8e8;
    }
    .tab-item {
      flex: 1;
      position: relative;
      margin: 0 8px;
      box-sizing: border-box;
      font-size: 14px;
      font-family: PingFang-SC-Regular;
      color: #666;
      p {
        text-align: center;
      }
      &.active {
        color: #333;
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
.mescroll{
  position: fixed;
  top: 89px;
  bottom: 0;
  height: auto;
}

.paying-wrap {
  // position: absolute;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // overflow: hidden;
  // z-index: 20;
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
