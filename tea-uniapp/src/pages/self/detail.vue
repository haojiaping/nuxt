<template>
   <view class="user-wrap">
     <van-cell title="头像" is-link @click="jumpToPage('self/detail')" custom-class="cellItem avatar">
      <img :src="user.avatarPath" alt="" style="width:33px;height:33px;border-radius: 20px;">
     </van-cell>
      <van-cell title="昵称" :value="user.nickName" is-link @click="jumpToPage('self/addlist')" custom-class="cellItem"/>
      <van-cell title="性别" :value="user.sex==1?'男':'女'" is-link custom-class="cellItem"/>
      <van-cell title="绑定手机" :value="user.mobile" is-link custom-class="cellItem"/>
      <van-cell title="收货地址" is-link custom-class="cellItem"/>
      <van-cell title="个性签名"  is-link custom-class="cellItem"/>
      <view class="btn pa" @click="loginOut">退出登录</view>
   </view>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
export default {
  data() {
    return {

    }
  },
  onLoad() {

  },
  methods: {
    loginOut(){
      this.logout();
      uni.switchTab({
          url: '/pages/self/user'
      });
    },
    ...mapActions(['logout'])
  },
  components: {

  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style>
page{
  background: #f2f2f2;
}
</style>
<style scoped lang='scss'>
.user-wrap{
  margin: 20upx;
  border-radius: 10upx;
  background: #fff;
  /deep/ .cellItem{
    background: transparent;
  }
  /deep/ .avatar{
    align-items: center;
  }
  .btn{
    width:270px;
    height:44px;
    line-height:44px;
    background:#fff;
    border-radius:22px;
    border-radius: 1upx solid #e8e8e8;
    text-align: center;
    color: #999;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 15px;
  }
}
</style>
