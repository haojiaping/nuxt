<template>
  <div class="bottom">
    <div class="good"
         v-for="(item,index) in dataList"
         :key="item.productId"
         :class="index===0?'changeStyle':''">
      <div class='good-img'>
        <img :imgurl="item.image"
             class='good-content'
             @click="jumpDetail(item.productId)"
             src="~/assets/img/zhanwei/150.png"
             alt=""
             width="100%">
      </div>
      <div class="goodInfo">
        <p class="name"
           @click="jumpDetail(item.productId)">{{item.productDescription}}</p>
        <p class="dec">{{item.productName}}</p>

        <div class='center'>
          <div class="price">
            <p><span class='left'>特惠价</span>
              <span class='right'>{{item.discountsPrice}}元</span></p>
            <p class='daily-price'>原价<span>{{item.productPrice}}</span></p>
          </div>
          <p class='grab'
             @click="handleClickAddCart(item)"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      showRank: ''
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    color: {
      type: String
    }
  },
  created () {
  },
  mounted () {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    handleClickAddCart (item) {
      this.addToCart(item)
      // if (IOS) {
      //   setTimeout(() => {
      //     window.callback(ios => {
      //       ios.callHandler('getUserInfo', null, res => {
      //         let userId = res.userId
      //         let token = res.token
      //         this.userId = res.userId
      //         if (userId && token) {
      //           let isLogin = true
      //           this.saveLogin({
      //             userId: userId,
      //             token: token,
      //             isLogin: true,
      //             mobileFlag: true
      //           })
      //           this.addToCart(item)
      //         } else {
      //           let isLogin = false
      //           ios.callHandler('goLogin', null, res => {
      //           })
      //         }
      //       })
      //     })
      //   }, 20)
      // } else if (ANDROID) {
      //   // 加入购物车前判断安卓是否登录 未登录拉起安卓登录
      //   if (window.android.getIsLogin()) {
      //     let userId = window.android.getUserId()
      //     let token = window.android.getToken()
      //     let isLogin = true
      //     this.saveLogin({
      //       userId: userId,
      //       token: token,
      //       isLogin: true,
      //       mobileFlag: true
      //     })
      //     this.addToCart(item)
      //   } else {
      //     window.android.isLoginFinishWeb(true, ' ')
      //   }
      // } else {
      //   if (this.user.isLogin) {
      //     this.addToCart(item)
      //   } else {
      //     setStore('__redirectUrl__', '/activity/newkepro')
      //     //微信中  先保存当前url  然后进行重定向获取code  提交code   获取到用户信息 后会跳转到之前保存的url中
      //     if (WX) {
      //       window.location.replace(wxreURL)
      //     } else {
      //       this.$router.push('/login')
      //     }
      //   }
      // }
    },
    addToCart (item) {
      this.$emit('changeProduct', item)
    },
    ...mapActions(['saveLogin'])
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.bottom {
  margin: 10px;
  position: relative;
  margin-top: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .good {
    padding: 10px;
    display: flex;
    box-sizing: border-box;
    @include bg-image-size('activity/midAutumn/good-bg3');
    // background-size: 100% 100%;
    background-size: 100% 100%;
    margin-bottom: 15px;
    flex-direction: column;
    width: 49%;
    .good-img {
      width: 150px;
      height: 150px;
      font-size: 0;
      position: relative;
      .good-content {
        height: 150px;
        width: 150px;
      }
    }
    .goodInfo {
      position: relative;
      flex: 1;
      .name {
        height: 44px;
        font-size: 17px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        color: rgba(254, 254, 254, 1);
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 10px;
      }
      .dec {
        font-size: 12px;
        color: #fff;
        line-height: 18px;
        margin-top: 10px;
        height: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .center {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: nowrap;
        width: 100%;
        .daily-price {
          height: 15px;
          font-size: 12px;
          color: #2693ab;
          line-height: 15px;
          span {
            text-decoration: line-through;
          }
        }
        .price {
          margin-top: 8px;
          .left {
            height: 14px;
            font-size: 12px;
            color: #ffce98;
            line-height: 15px;
          }
          .right {
            font-size: 24px;
            font-weight: 600;
            color: #ffce98;
            display: inline-block;
            margin-left: 5px;
          }
        }
        .grab {
          @include bg-image('activity/midAutumn/grap2');
          width: 42px;
          height: 42px;
        }
        .grab1 {
          line-height: 36px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          width: 36px;
          height: 36px;
          background: rgba(207, 85, 75, 1);
          box-shadow: 0px 2px 8px 0px rgba(224, 57, 44, 0.47);
          border-radius: 50%;
        }
      }
    }
  }
  .changeStyle {
    width: 100%;
    flex-direction: row;
    @include bg-image-size('activity/midAutumn/good-bg2');
    background-size: 100% 100%;
    .goodInfo {
      padding-left: 13px;
    }
  }
}
</style>
