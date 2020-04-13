<template>
  <div class="orderall-wrap">
    <van-pull-refresh v-model="isLoading"
                      @refresh="onRefresh">
      <div class="none"
           v-if="orderListData.length===0">
        <!-- <noData></noData> -->
      </div>
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                v-if="orderListData.length!==0">
        <div class="orderlist-wrap border-bottom"
             @click="sendOrder(elem)"
             v-for="(elem,index) in orderListData"
             :key="index">
          <div class="title">
            <div class="title-left">
              <span>订单编号:</span>
              <span class="OrderId">{{elem.productOrderId}}</span>
            </div>
            <div class="title-right">
              <span v-if="elem.state===0">等待付款</span>
              <span v-else-if="elem.state===1">等待发货</span>
              <span v-else-if="elem.state===2">待收货</span>
              <span v-else-if="elem.state===3||elem.state===4||elem.state===6">交易完成</span>
              <!-- <span v-else-if="state===4">交易完成</span> -->
              <span v-else-if="elem.state===5||elem.state===11">交易关闭</span>
            </div>
          </div>
          <div class="goods">
            <div class="good">
              <div class="good-left">
                <div class="good-img">
                  <img :src="elem.products[0].productImage"
                       width="100%">
                </div>
                <div class="good-del">
                  <p class="good-name">{{elem.products[0].productName}}</p>
                  <p class="good-pri">¥ {{elem.products[0].unitPrice}}</p>
                </div>
              </div>
              <div class="good-right">
                X {{elem.products[0].productCount}}
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getOrderList } from '~/api/order'
import { mapGetters } from 'vuex'
export default {
  name: 'CustomOrder',
  data () {
    return {
      isLoading: false,
      orderListData: [],
      list: [],
      loading: false,
      finished: false,
      endFlag: 1,
      pageNum: 0
    }
  },
  mounted () {
    this.orderlist(0)
  },
  methods: {
    onLoad () {
      this.orderlist(this.pageNum)
    },
    onRefresh () {
      this.orderlist(0)
    },
    orderlist (pageNum) {
      const option = {
        userId: this.user.userId,
        orderStatus: 5,
        pageNum: pageNum
      }
      this.$axios.$post(getOrderList, option).then(res => {
        if (res.code === 10000) {
          console.log(res)
          setTimeout(() => {
            this.isLoading = false
          }, 500)
          this.finished = true
          this.loading = false
          if (pageNum !== 0) {
            this.orderListData = [...this.orderListData, ...res.data.productList]
          } else {
            this.orderListData = res.data.productList
          }
          this.pageNum = res.data.pageNum
          this.endFlag = res.data.endFlag
        } else {
          this.$toast(res.message)
        }
      })
    },
    sendOrder (e) {
      this.$emit('sendOrder', e)
    }
  },
  watch: {
    endFlag (val) {
      if (val === 1) {
        this.finished = true
      } else if (val === 0) {
        this.finished = false
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.orderall-wrap {
  overflow-y: scroll;
  height: 100%;
  .none {
    height: 10rem;
  }
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 0.1rem;
  }
}
.orderlist-wrap {
  margin: 0.1rem 0.2rem;
  background: #fff;
  .border-bottom:before {
    color: #e8e8e8;
  }
  .title {
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .OrderId {
      font-size: 0.24rem;
    }
  }
  .good {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.3rem;
    padding: 0.2rem 0;
    .good-left {
      display: flex;
      align-items: center;
      .good-img {
        width: 40px;
        height: 40px;

        margin-right: 0.2rem;
      }
      .good-del {
        .good-pri {
          margin-top: 0.16rem;
          color: #d45949;
        }
      }
    }
    .good-right {
      text-align: right;
      width: 30px;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 0.1rem 0.2rem 0.3rem;
    box-sizing: border-box;
    .bottom-left {
      display: flex;
      align-items: center;
    }
    .bottom-btn {
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      .btn-balck {
        width: 1.5rem;
        height: 0.54rem;
        line-height: 0.54rem;
        text-align: center;
        margin-right: 0.2rem;
        .border:before {
          border-color: #ccc;
        }
      }
      .btn-red {
        width: 1.5rem;
        height: 0.54rem;
        line-height: 0.54rem;
        text-align: center;
        margin-right: 0.2rem;
        background: #d45949;
        color: #fff;
        .border:before {
          border-color: #d45949;
        }
      }
      .btn-red-white {
        width: 1.5rem;
        height: 0.54rem;
        line-height: 0.54rem;
        text-align: center;
        margin-right: 0.2rem;
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
