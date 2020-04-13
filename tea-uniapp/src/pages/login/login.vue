<template>
   <view>
     <view class="logo-wrap df">
       <image src="/static/common/logo@2x.png" mode="widthFix" style="width:49px;height:49px;"></image>
       <text class="text f15">臻选，只为一杯好茶</text>
     </view>
     <view class="btn-wrap">
        <van-button round  color="#66B645" custom-style="width:100%;height:37px;line-height:37px;" open-type="getUserInfo" @getuserinfo="getuserinfo">微信登录</van-button>
     </view>
     <view class="btn-wrap btn-text">
      <van-button type="default" color="#fff" custom-style="width:100%;" open-type="getPhoneNumber" @getphonenumber="getphonenumber">手机号登录</van-button>
     </view>
   </view>
</template>

<script>
import { getwxLgin, getwxPhone } from "@/api/login";
import { mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {

      code:''
    }
  },
  
  onLoad(){
      this.getcode()
  },
  methods: {
    getphonenumber(res){
      console.log(res.detail);
      let info = res.detail
      let option = {
        encryptedData: info.encryptedData,
        code: this.code,
        iv: info.iv
      }
      getwxPhone(option).then(res=>{
        console.log(res);
        this.getcode()
        this.phone = res.data.phoneNumber
        uni.navigateTo({
          url:`/pages/login/inputcode?phone=${this.phone}`
        })
      }).catch(err=>{
        this.getcode()
      })
    },
    getuserinfo(res){
      console.log(res.detail);
      let info = res.detail
      let option = {
        encryptedData: info.encryptedData,
        code: this.code,
        iv: info.iv,
        platform: 'applet',
        way: 'applet'
      }
      getwxLgin(option).then(res=>{
        let userInfo = res.userInfo
        userInfo.token = res.data.token
        this.saveLogin(userInfo)
        this.getcode()
        uni.navigateBack({})
      }).catch(err=>{
        this.getcode()
      })
    },

    getcode(){
      uni.login({
        provider: 'weixin',
        success:  (loginRes) => {
          console.log(loginRes.code);
          this.code = loginRes.code
        }
      });
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
.logo-wrap{
  flex-direction: column;
  align-items: center;
  padding: 74px 20px 32px;
  .text{
    color: #3B3D3D;
    margin-top: 20px;
  }
}
.btn-wrap{
  padding: 10px 53px;
}
.btn-text{
  /deep/ .van-button__text{
    color: #3B3D3D;
    font-size: 13px;
  }
}
</style>
