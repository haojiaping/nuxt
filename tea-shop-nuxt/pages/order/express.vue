<template>
  <div>
    <div class="express">
      <backbar title="订单跟踪"
                @setHeight="setHeight" />
      <div class="express-wrap"
           ref="detailex">
        <nuxt-link to="/about/downapp" class="downBtnWrap pf" v-if="downBtn"></nuxt-link>
        <div class="express-header">
          <div class="goodimg"
               v-if="datas.productList&&datas.productList[0]">
            <img :src="datas.productList[0].productImage"
                 width="100%">
            <span class="goosNum">共{{datas.productList.length}}件商品</span>
          </div>
          <div class="expressInfo">
            <div class="name"
                 v-if="datas.postageName&&datas.postageName!=='-'">
              <span>配送企业:</span>
              <span>{{datas.postageName}}</span>
            </div>
            <div>
              <span>快递单号:</span>
              <span>{{datas.postageId}}</span>
            </div>
            <div class="orderNum"
                 v-if="postageId&&expressPhone&&postageId!=='-'">
              <div>
                <span>联系电话:</span>
                <a :href="`tel:${expressPhone}`"
                   style="color:#fff;">
                  <span>{{expressPhone}}</span>
                </a>
              </div>
            </div>
            <div class="name"
                 v-else>
              {{datas.state}}
            </div>
          </div>
        </div>
        <div class="text">物流信息</div>
        <div class="express-sub"
             v-if="datas.postageContent">
          <div class="listWrap">
            <div class="tipsTop">
              <span class="ballTop"></span>
              <span>{{datas.state}}</span>
            </div>
            <div class="list-sub"
                 :class="index===0?'one':''"
                 v-for="(item,index) in datas.postageContent"
                 :key="index">
              <div class="tips"
                   v-if="index!==0">
                <span class="ball"></span>
              </div>
              <div class="list-text">
                <div class="conttext">
                  {{item.AcceptStation}}
                </div>
                <div class="time">
                  {{item.AcceptTime}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="express-none"
             v-if="!datas.postageContent">
          <!-- <noData></noData> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
// import { getOrderPro } from '@/api/order'
import { getpostdetail, getOrderPro, getOrderdetail } from '~/api/order'
import { IOS, ANDROID } from '~/environment/esm'
import { EXPRESS } from '~/config/express'
import { mapGetters } from 'vuex'
export default {
  name: 'express',
  components: {
    backbar
  },
  data () {
    return {
      // logisticsInfo: {},
      products: {},
      // expressPhone: '',
      product: {},
      postageId: '',
      datas: {},
      postFlag: '',
      detailData: {},
      downBtn: false
      // showType: false // false 详情  true 中间页
      // company: ''// 配送企业
    }
  },
  mounted () {
    // if (this.IOSHeight) {
    //   this.$refs.detailex.style.top = `${this.IOSHeight + 44}px`
    // }
    this.productOrderId = this.$route.query.productOrderId
    this.postageId = this.$route.query.postageId
    this.getExpress(this.postageId)
    setTimeout(() => {
      this.downBtn = !(IOS || ANDROID)
    }, 100)
    // this.orderDetaildata()
    if (this.productOrderId) {
      // this.getExpress()
    } else {
      this.$toast('订单ID不存在')
    }
    if (this.detailData.postFlag === 0) {
      this.postFlag = 0
      this.getExpress(this.detailData.products[0].postageId)
    } else {
      this.postFlag = 1
      this.getDetail()
    }
  },
  computed: {
    expressPhone() {
      for (let i = 0; i < EXPRESS.length; i++) {
        if (EXPRESS[i].expressname === this.datas.postageName) {
          return EXPRESS[i].expresstelephone
        }
      }
      return ''
    },
    showType: {
      get () {
        return this.detailData.postFlag
      }
    },
    ...mapGetters([
      'user'])
  },
  watch: {
    showType (val) {
      if (this.detailData.postFlag === 0) {
        this.getExpress(this.detailData.products[0].postageId)
      }
      this.postFlag = val
    }
  },
  methods: {
    orderDetaildata() {
      const option = {
        productOrderId: this.productOrderId,
        userId: this.user.userId
      }
      this.$axios.$post(getOrderdetail, option).then(res => {
        if (res.code === 10000) {
          this.detailData = res.data
        }
      })
    },
    // 物流页请求
    orderDetail (userId, postageId) {
      const option = {
        productOrderId: this.productOrderId,
        userId: userId,
        postageId: postageId
      }
      this.$axios.$post(getpostdetail, option).then(res => {
        if (res.code === 10000) {
          this.datas = res.data
          try {
            if (res.data.postageContent && res.data.postageContent !== '-') {
              this.datas.postageContent = JSON.parse(res.data.postageContent)
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    getExpress (postageId) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.orderDetail(userId, postageId)
            }
          })
        })
      } else if (ANDROID) {
        const userId = window.android.getUserId()
        this.orderDetail(userId, postageId)
      } else {
        this.orderDetail(this.user.userId, postageId)
      }
    },
    setHeight (height) {
      this.$refs.detailex.style.top = `${(height + 42) / 37.5}rem`
      // alert(height)
    },
    // 中间页请求
    getDetail () {
      this.$axios.$post(getOrderPro, { productOrderId: this.productOrderId }).then(res => {
        if (res.code === 10000) {
          this.postageNumContent = res.data.postageNumContent
          this.postageInfo = [...res.data.postageInfo]
        } else {
          this.$toast(res.message)
        }
      })
    },
    jumpToEx (item) {
      this.postFlag = 0
      // console.log(this.postFlag)
      this.getExpress(item.postageId)
      // if (item.postageId !== '-') {
      // this.$router.push({name: 'Express', query: {productOrderId: this.productOrderId, postageId: item.postageId}})
      // }
    }
  },
  filters: {
    setstate (e) { // 快递状态 0-无轨迹 1-已揽收 2-在途中 3-签收'
      switch (e) {
        case 0:
          return '暂无物流信息'
        case 1:
          return '已揽收'
        case 2:
          return '在途中'
        case 3:
          return '已签收'
        default:
          return '运输中'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/variable.scss";
.express /deep/ .header-icon {
  z-index: 20;
}
.express {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 20;
  user-select: text;
  .downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 30%;
    transform: translateY(-50%);
    z-index: 999;
  }
  .express-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 0;
    overflow: hidden;
    z-index: 12;
    background-color: #f2f2f2;
    .express-header {
      background: #d45949;
      padding: 15px 20px;
      display: flex;
      height: 90px;
      align-items: center;
      color: #fff;
      .goodimg {
        width: 65px;
        height: 65px;
        margin: 0 25px 0 15px;
        position: relative;
        .goosNum {
          font-size: 12px;
          background: #000;
          color: #fff;
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          text-align: center;
          line-height: 15px;
        }
      }
      .expressInfo {
        height: 60px;
        .name {
          font-size: 14px;
          margin: 5px 0 12px 0;
        }
        .orderNum {
          font-size: 12px;
          div {
            line-height: 15px;
          }
        }
      }
    }
    .text {
      margin: 15px;
    }
    .express-none {
      height: 250px;
      position: absolute;
      top: 125px;
      left: 0;
      right: 0;
      margin: 100px 10px;
    }
    .express-sub {
      margin: 0 10px;
      overflow-y: scroll;

      position: absolute;
      top: 160px;
      left: 0;
      right: 0;
      bottom: 0;
      .listWrap {
        background: #fff;
        padding: 30px;
        .list-sub {
          margin: 30px 0;
          border-left: 1px solid #ccc;
          padding: 0 10px 0 10px;
          box-sizing: border-box;
          position: relative;

          color: #999;
          &.one {
            color: #333;
            .list-text {
              top: -2px;
              left: 24px;
            }
          }
          .tips {
            font-size: 12px;
            position: absolute;
            top: -15px;
            left: -5px;
            border-radius: 25px;
            padding: 2px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #e8e8e8;
            color: #999999;
            .ball {
              width: 5px;
              height: 5px;
              border-radius: 25px;
              background: #cccccc;
            }
          }
          .list-text {
            .conttext {
              line-height: 20px;
            }
            .time {
              margin-top: 5px;
            }
          }
        }
      }
      .tipsTop {
        background: #ffe4e0;
        color: #d45949;
        position: absolute;
        top: 21px;
        left: 22px;
        padding: 3px 7px 3px 3px;
        box-sizing: border-box;
        border-radius: 9px;
        font-size: 12px;
        .ballTop {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 25px;
          background: #d45949;
        }
      }
    }
  }
}
</style>
