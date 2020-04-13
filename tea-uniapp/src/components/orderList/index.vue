<template>
  <div class="orderlist-wrap">
    <div class="title"
         @click="jumpOrderDetail">
      <div class="title-left c6">
        <span>订单编号:</span>
        <span class="OrderId">{{listData.productOrderId}}</span>
      </div>
      <div class="title-right">
        <span v-if="state===0">等待付款</span>
        <span v-else-if="state===1">等待发货</span>
        <span v-else-if="state===2">待收货</span>
        <span v-else-if="state===3||state===4||state===6">交易完成</span>
        <!-- <span v-else-if="state===4">交易完成</span> -->
        <span v-else-if="state===5||state===11">交易关闭</span>
      </div>
    </div>
    <div class="goods"
         @click="jumpOrderDetail">
      <div class="good" :class="index+1!==listData.products.length?'border-bottom':''"
           v-for="(item,index) of listData.products"
           :key="index">
        <div class="good-left">
          <div class="good-img">
            <img :src="item.productImage"
                 style="width:60px;height:60px;border-radius: 5px;" mode="widthFix">
          </div>
          <div class="good-del">
            <p class="good-name f14">{{item.productName}}</p>
            <p class="good-pri f15">¥ {{item.unitPrice}}</p>
          </div>
        </div>
        <div class="good-right f15">
          X {{item.productCount}}
        </div>
      </div>
    </div>
    <div class="bottom"
         v-if="state===0">
      <div class="bottom-pri">
        <span>应付金额:</span>
        <span>¥ {{listData.orderPrice}}</span>
      </div>
      <div class="bottom-btn">
        <div class="btn-balck">
          <div class="border"
               @click.stop="closeOrder">
            取消订单
          </div>
        </div>
        <div class="btn-red">
          <div class="border"
               @click.stop="payAgain">
            立即付款
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"
         v-else-if="state===1">
      <div class="bottom-pri">
        <span>已付金额:</span>
        <span>¥ {{listData.orderPrice}}</span>
      </div>
      <div class="bottom-btn">
        <div class="btn-red">
          <div class="border"
               @click="jumpToExpress">
            查看物流
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"
         v-else-if="state===2">
      <div class="bottom-pri">
        <span>已付金额:</span>
        <span>¥ {{listData.orderPrice}}</span>
      </div>
      <div class="bottom-btn">
        <div class="btn-red">
          <div class="border"
               @click="jumpToExpress">
            查看物流
          </div>
        </div>
        <div class="btn-red">
          <div class="border"
               @click="sure">
            确认收货
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"
         v-else-if="state===3">
      <div class="bottom-pri">
        <span>成交金额:</span>
        <span>¥ {{listData.orderPrice}}</span>
      </div>
      <div class="bottom-btn">
        <div class="btn-balck"
             @click="jumpToDis">
          <div class="border">
            立即评价
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"
         v-else-if="state===4">
      <div class="bottom-pri">
        <span>成交金额:</span>
        <span>¥ {{listData.orderPrice}}</span>
      </div>
    </div>
    <div class="bottom"
         v-else-if="state===11">
      <div class="bottom-pri">
        <span>应付金额:</span>
        <span>¥ {{listData.orderPrice}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { delOrder, sureOrder } from '@/api/order'
import { mapGetters } from 'vuex'
export default {
  name: 'orderList',
  props: {
    state: {
      type: Number,
      default: 0 // 0 待付款  1 待发货  2待收货 3 待评价
    },
    listData: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    jumpOrderDetail () {
      uni.navigateTo({
						url: `/pages/order/detail?productOrderId=${this.listData.productOrderId}`
					});
    },
    payAgain () {
      // this.$router.push({name: 'Payagain', query: {productOrderId: this.listData.productOrderId}})
      this.$emit('payAgain', this.listData.productOrderId)
    },
    closeOrder () {
      const option = {
        productOrderId: this.listData.productOrderId,
        userId: this.user.userId
      }
      delOrder(option).then(res => {
        console.log(res)
        if (res.code === 10000) {
          uni.showToast({
            title:'取消成功',
          })
        }
      })
    },
    jumpToExpress () {
      if (this.listData.postFlag === 0) {
        uni.navigateTo({
						url: `/pages/express/express?productOrderId=${this.listData.productOrderId}&postageId=${this.listData.postageId}`
					});} else {
        uni.navigateTo({
						url: `/pages/express/middle?productOrderId=${this.listData.productOrderId}&postageId=${this.listData.postageId}`
				});
      }
    },
    jumpToDis () {
      // if (this.listData.products.length > 1) {
      //   this.$router.push({ name: 'SendDisGoods', query: { productOrderId: this.listData.productOrderId } })
      // } else {
      //   this.$router.push({ name: 'SendDis', query: { productOrderId: this.listData.productOrderId } })
      // }
    },
    sure () {
      const option = {
        productOrderId: this.listData.productOrderId,
        userId: this.user.userId
      }
      sureOrder(option).then(res => {
        if (res.code === 10000) {
          uni.showToast({
            title:'交易完成'
          })
          this.$emit('closeNO')
        }
      })
    }
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>
.orderlist-wrap {
  margin:10px;
  background: #fff;
  font-size: 15px;
  border-radius: 5px;
  .border-bottom:before {
    color: #e8e8e8;
  }
  .title {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .OrderId {
      font-size: 14px;
      color: #333;
    }
    .title-right{
      color: #D45949;
    }
  }
  .good {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 15px;
    padding: 5px 10px 5px 5px;
    background: #f8f8f8;
    box-sizing: border-box;
    border-radius: 5px;
    .good-left {
      display: flex;
      align-items: center;
      .good-img {
        flex: 0 0 60px;
        height: 60px;
        border-radius: 5px;
        margin-right:10px;
      }
      .good-del {
        .good-pri {
          margin-top: 6px;
          color: #d45949;
        }
        .good-name {
          @include text-over(2);
          line-height: 20px;
        }
      }
    }
    .good-right {
      flex: 0 0 auto;
      padding-left: 10px;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px 10px 15px;
    box-sizing: border-box;
    .bottom-left {
      display: flex;
      align-items: center;
    }
    .bottom-btn {
      display: flex;
      align-items: center;
      font-size: 12px;
      
      .btn-red {
        width: 75px;
        height: 27px;
        line-height: 27px;
        text-align: center;
        margin-right: 10px;
        border:1upx solid rgba(212,89,73,1);
        border-radius:13px;
        color: #D45949;
      }
      .btn-balck {
        width: 75px;
        height: 27px;
        line-height: 27px;
        text-align: center;
        margin-right: 10px;
        color: #666;
        border:1px solid rgba(204,204,204,1);
        border-radius:13px;
      }
      .btn-red-white {
        width: 75px;
        height: 27px;
        line-height: 27px;
        text-align: center;
        margin-right: 10px;
        background: #fff;
        color: #d45949;
        .border:before {
          border-color: #d45949;
        }
      }
    }
  }
}
</style>
