<template>
  <!-- 我的组件 -->
  <div>
      <div class="self-wrapper">
        <div>
          <!-- <nuxt-link to="/about/downapp" class="downBtnWrap pf"></nuxt-link> -->
          <jump></jump>
          <!-- 头部 -->
          <div class="avatar-wrapper">
            <nuxt-link to="/self/detail" class="avatar">
              <img :src="userdata.avatarPath" alt="">
              <span class="name" v-show="user.isLogin">{{userdata.nickName}}</span>
              <span class="name" v-show="!user.isLogin">登录/注册</span>
            </nuxt-link>
            <div class="numWraper">
              <div class="numItems">
                <nuxt-link class="numItem" to="/self/coll">
                  <p class="number">{{userdata.collectNum||0}}</p>
                  <p class="text">收藏</p>
                </nuxt-link>
                <nuxt-link class="numItem" to="/self/foot">
                  <p class="number">{{userdata.footPrintNum||0}}</p>
                  <p class="text">足迹</p>
                </nuxt-link>
                <div class="numItem">
                  <p class="number">{{userdata.integral||0}}</p>
                  <p class="text">茶银(两)</p>
                </div>
                <nuxt-link class="numItem" to="/self/coupon">
                  <p class="number">{{userdata.coupon||0}}</p>
                  <p class="text">优惠券</p>
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- 我的订单 -->
          <div class="order-wrapper">
            <div class="title border-bottom" @click="jumpToOrder('5')">
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
              <!-- <div class="sign-item">
                <i class="icon"></i>
                <span class="text">售后</span>
              </div> -->
            </div>
          </div>
          <!-- 列表 -->
          <ul class="list-wrapper">
            <nuxt-link to="/self/detail" class="list border-bottom" tag="li">
              <span class="text">个人资料</span>
              <span class="icon-wrapper">
                <van-icon name="arrow" color="#999" size="20px"/>
              </span>
            </nuxt-link>
            <nuxt-link to="/self/addlist" class="list border-bottom" tag="li">
              <span class="text">收货地址</span>
              <span class="icon-wrapper">
                <van-icon name="arrow" color="#999" size="20px"/>
              </span>
            </nuxt-link>
            <nuxt-link to="/market/home" class="list border-top" tag="li" v-if="userdata.shopkeeper===1">
              <span class="text">我的店铺</span>
              <span class="icon-wrapper">
                <van-icon name="arrow" color="#999" size="20px"/>
              </span>
            </nuxt-link>
          </ul>
          <!-- 客服 -->
          <div class="server" @click="showpopcustom">
            <span class="text">我的客服</span>
            <van-icon name="arrow" color="#999" size="20px"/>
          </div>
          <div class="activeWrpa" v-if="userdata&&userdata.activeRegion" @click="$router.push(jumpUrl(userdata.activeRegion.jumpType,userdata.activeRegion.jumpContent))">
            <img :src="userdata.activeRegion.activeRegionImage" alt="" width="100%">
          </div>
        </div>
      </div>
      <popjump ref="popJumpRef"></popjump>
  </div>
</template>

<script>
import jump from '~/components/popjump/jump'
import { jumpUrl } from '~/utils/jump'
import { mapGetters } from 'vuex'
import { getUserData, getUserOrder } from '~/api/self'
import { WX } from '~/environment/esm'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
import popjump from '~/components/popjump'
export default {
  name: 'self',
  data () {
    return {
      userdata: {},
      orderNum: {
        noPay: '', // 待支付
        noSend: '', // 待发货
        noReceive: '', // 待收货
        noComment: ''// 待评价
      },
      showpop: false
    }
  },
  mounted () {
    if (this.user.isLogin) {
      this.getOrderNum()
      this.getUser()
    } else if (WX) {
      setStore('__redirectUrl__', '/self')
      window.location.replace(wxreURL)
    }
  },
  methods: {
    jumpUrl,
    getOrderNum() {
      if (this.user.userId) {
        this.$axios.$post(getUserOrder, { userId: this.user.userId }).then(res => {
          if (res.code === 10000) {
            this.orderNum = { ...res.data }
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    jumpToOrder(e) {
      this.$refs.popJumpRef.show = true
      // if (WX) {
      //   this.$refs.popJumpRef.show = true
      // } else {
      //   this.$router.push({ path: '/order/list', query: { type: `${e}` } })
      // }
    },
    getUser() {
      if (this.user.isLogin) {
        const option = {
          userId: this.user.userId,
          token: this.user.token
        }
        this.$axios.$post(getUserData, option).then(res => {
          if (res.code === 10000) {
            this.userdata = res.data
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    showpopcustom() {
      // this.$refs.popcustom.show = true
      sessionStorage.removeItem('__teacustom__')
      this.$router.push({ path: '/custom' })
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters(['user'])
  },
  components: {
    popjump,
    jump
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';

.self-wrapper {
  padding-bottom: 46px;
  overflow-y: scroll;
  color: #333;
  font-size: 15px;
  font-weight: normal;
  .downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 10%;
    transform: translateY(-50%);
    z-index: 999;
  }
  .avatar-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    @include bg-image("self/userbg");
    background-size: cover;
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
      @include bg-image("self/selfbg");
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
  .list-wrapper {
    margin: 0 10px 10px;
    background-color: #fff;
    .list {
      padding: 0 10px 0 15px;
      height: 44px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .icon-wrapper {
        em {
          font-size: 14px;
          color: #333;
          &.num {
            display: inline-block;
            vertical-align: top;
            margin-top: -8px;
            width: 8px;
            height: 8px;
            text-align: center;
            line-height: 8px;
            border-radius: 100%;
            color: #fff;
            background-color: #D45949;
          }
        }
      }
    }
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
    margin: 10px 10px 60px;
  }
}
</style>
