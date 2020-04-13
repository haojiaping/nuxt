<template>
   <view>
      <div class="self-wrapper">
        <div>
          <!-- 头部 -->
          <div class="avatar-wrapper">
            <image mode="widthFix" style="width:100%;height:100%;" src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/10/af96ca75-7f3f-4611-af75-2b4ad1f707ef.jpg"></image>
            <view  class="avatar" @click="jumpTodetail">
              <img :src="user.avatarPath" alt="">
              <span class="name" v-if="hasLogin">{{user.nickName}}</span>
              <span class="name" v-if="!hasLogin">登录/注册</span>
            </view>
            <div class="numWraper">
              <div class="numItems">
                <view class="numItem" @click="jumpToPage('self/coll')">
                  <p class="number">{{user.collectNum||0}}</p>
                  <p class="text">收藏</p>
                </view>
                <view class="numItem" @click="jumpToPage('self/foot')">
                  <p class="number">{{user.footPrintNum||0}}</p>
                  <p class="text">足迹</p>
                </view>
                <div class="numItem">
                  <p class="number">{{user.integral||0}}</p>
                  <p class="text">茶银(两)</p>
                </div>
                <view class="numItem" @click="jumpToPage('self/coupon')">
                  <p class="number">{{user.coupon||0}}</p>
                  <p class="text">优惠券</p>
                </view>
              </div>
            </div>
          </div>
          
          <div class="order-wrapper">
            <div class="title" @click="jumpToOrder('5')">
              <span class="text">我的订单</span>
              <van-icon name="arrow" color="#999" size="20px"/>
            </div>
            <div class="sign-wrapper">
              <div class="sign-item" @click="jumpToOrder('0')">
                <i class="icon pk"></i>
                <span class="text">待付款</span>
                <span class="tips-num" v-show="orderNum.noPay&&orderNum.noPay!==0">{{orderNum.noPay}}</span>
              </div>
              <div class="sign-item" @click="jumpToOrder('1')">
                <i class="icon fh"></i>
                <span class="text">待发货</span>
                <span class="tips-num" v-show="orderNum.noSend&&orderNum.noSend!==0">{{orderNum.noSend}}</span>
              </div>
              <div class="sign-item" @click="jumpToOrder('2')">
                <i class="icon sh"></i>
                <span class="text">待收货</span>
                <span class="tips-num" v-show="orderNum.noReceive&&orderNum.noReceive!==0">{{orderNum.noReceive}}</span>
              </div>
              <div class="sign-item" @click="jumpToOrder('3')">
                <i class="icon pj"></i>
                <span class="text">待评价</span>
                <span class="tips-num" v-show="orderNum.noComment&&orderNum.noComment!==0">{{orderNum.noComment}}</span>
              </div>
            </div>
          </div>
          <view class="cellWrap">
            <van-cell title="个人资料" is-link @click="jumpToPage('self/detail')"/>
            <van-cell title="收货地址" is-link @click="jumpToPage('self/addlist')"/>
            <van-cell title="消息中心" is-link />
            <van-cell title="分享好友" is-link />
          </view>
          <view class="cellWrap">
            <van-cell title="专属客服-婧婧在线" is-link />
          </view>
          <div class="activeWrpa" v-if="user&&user.activeRegion">
            <img :src="user.activeRegion.activeRegionImage" alt="" style="width:100%" mode="widthFix">
          </div>
        </div>
      </div>
   </view>
</template>

<script>
import { getUserData,getUserOrder } from "@/api/self";
import { mapActions,mapGetters } from "vuex";
export default {
  data() {
    return {
      orderNum: {
        noPay: '', // 待支付
        noSend: '', // 待发货
        noReceive: '', // 待收货
        noComment: ''// 待评价
      }
    }
  },
  onShow(){
    this.getUser()
    this.getOrderNum()
  },
  watch: {

  },
  methods: {
    jumpToLogin(){
      uni.navigateTo({
        url:`/pages/login/login`
      })
    },
    getOrderNum() {
      if (this.hasLogin) {
        getUserOrder({ userId: this.user.userId }).then(res => {
          if (res.code === 10000) {
            this.orderNum = { ...res.data }
          }
        })
      }
    },
    jumpToOrder(arg){
      if(this.hasLogin){
        uni.navigateTo({
          url: `/pages/order/list?type=${arg}`
        });
       }else {
        this.jumpToLogin()
      }
    },
    jumpTodetail(){
      if (this.hasLogin) {
        this.jumpToPage('self/detail')
      }else {
        this.jumpToLogin()
      }
    },
    getUser() {
      if (!this.hasLogin) {
        return
      }
      const option = {
        userId: this.user.userId,
        token: this.user.token
      }
      getUserData( option).then(res => {
        if (res.code === 10000) {
          let userInfo = res.data
          userInfo.token = this.user.token
          this.saveLogin(userInfo)
        }
      })
    },
    jumpToPage(page){
      if (this.hasLogin) {
        uni.navigateTo({
          url: `/pages/${page}`
        });
      } else {
        this.jumpToLogin()
      }
    },
    ...mapActions(['saveLogin'])
  },
  computed: {
    ...mapGetters(['user', 'hasLogin'])
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
.self-wrapper {
  padding-bottom: 46px;
  background: #f2f2f2;
  color: #333;
  font-size: 15px;
  font-weight: normal;
  .avatar-wrapper {
    position: relative;
    width: 100%;
    max-height: 280px;
    .avatar {
      position: absolute;
      left: 50%;
      top: 32%;
      text-align: center;
      transform: translate(-50%, -20%);
      img {
        display: block;
        margin: 0 auto 10px;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        @include bg-image("self/self");
      }
      .name {
        color: #fff;
      }
    }
    .numWraper {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -15px;
      background-size: cover;
      background-image: url('https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/10/8b38e359-e802-45f6-b6b6-39f6fdc968aa.jpg');
      height: 80px;
      .numItems {
        width: 100%;
        height: 100%;
        padding: 0 18px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        .numItem {
          width: 25%;
          p {
            text-align: center;
            color: #fff;
          }
          .number {
            font-size: 15px;
            margin-bottom: 8px;
          }
          .text {
            font-size: 12px;
          }
        }
      }
    }
  }
  .order-wrapper {
    margin: 15px 10px 10px;
    background-color: #fff;
    font-size: 14px;
    .title {
      padding: 0 10px 0 15px;
      height: 44px;
      display: flex;
      font-size: 15px;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      color: #333;
      border-bottom: 1upx solid #e8e8e8;
    }
    .sign-wrapper {
      width: 100%;
      height: 80px;
      display: flex;
      flex-flow: row nowrap;
      .sign-item {
        color: #333;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        position: relative;
        .icon {
          margin-bottom: 10px;
          display: block;
          width: 25px;
          height: 25px;
          &.pk {
            @include bg-image("self/pk");
          }
          &.fh {
            @include bg-image("self/fh");
          }
          &.sh {
            @include bg-image("self/sh");
          }
          &.pj {
            @include bg-image("self/pj");
          }
        }
        .tips-num {
          position: absolute;
          font-size: 10px;
          top: 10px;
          right: 20px;
          width: 15px;
          height: 15px;
          line-height: 15px;
          color: #fff;
          background: #D45949;
          border-radius: 25px;
          text-align: center;
        }
      }
    }
  }
  .cellWrap{
    margin: 10px;
  }
  .server {
    margin: 10px 10px;
    padding: 0 10px 0 15px;
    height: 44px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  .activeWrpa{
    margin: 10px;
  }
}
</style>
