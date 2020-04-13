<template>
   <view class="list-wrap">
     <div class="tabs">
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
      <div class="orderlist-wrap">
          <orderList v-for="(elem,index) in dataList"
            :state="elem.orderStatus" :listData="elem"
            :key="index"
            @closeNO="refList"
            @payAgain="payAgain"></orderList>
        </div>
   </view>
</template>

<script>
import orderList from "@/components/orderList"
import { getOrderList } from '@/api/order'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      orderStatus:'5',
      pageNum:0,
      endFlag:0,
      dataList:[]
    }
  },
  onLoad(option) {
    this.orderStatus = option.type
    this.getList()
  },

  onReachBottom(){
    if (this.endFlag===0) {
      this.getList()
    }
  },
  methods: {
    refList(){
      this.handleChangeType(this.orderStatus)
    },
    payAgain(){

    },
    handleChangeType(type){
      this.orderStatus = type
      this.pageNum = 0
      this.dataList = []
      this.getList()
    },
    getList() {
      if (this.pageNum === 0) this.dataList = []
      const option = {
        userId: this.user.userId,
        orderStatus: this.orderStatus,
        pageNum: this.pageNum
      }
      getOrderList(option).then(res => {
        const arr = res.data.productList
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          this.endFlag = res.data.endFlag
          if (this.endFlag===0) {
            this.pageNum++ 
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
  },
  computed: {
    ...mapGetters(['user','hasLogin'])
  },
  components: {
    orderList
  }
}
</script>

<style>
page{
  background: #f2f2f2;
}
</style>
<style scoped lang='scss'>
.list-wrap{
  .tabs {
    display: flex;
    align-items: center;
    height: 40px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: #fff;
    border-top: 1upx solid #e8e8e8;
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
  .orderlist-wrap{
    margin-top: 50px;
  }
}
</style>
