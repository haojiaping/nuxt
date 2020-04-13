<template>
  <div class="bottom df"
       v-if="dataList">
    <div class="bottomItem"
         v-for="(item,index) in dataList"
         :key="index"
         :class="[(index%2===0)?'border-rightbottom':'border-bottom',index===(dataList.length-2)||index===(dataList.length-1)||index===0||index===1?'border-none':'']">
      <img :src="item.productImage?item.productImage:item.image"
           alt=""
           @click="jumpDetail(item.productId)">
      <p class="bottomtitle"
         @click="jumpDetail(item.productId)">{{item.productName}}</p>
      <p class="product-dec">{{item.productDescription}}</p>
      <p class='product-price'>日常价:<span>¥{{item.productPrice}}</span></p>
      <div class='product-bottom'>
        <p class='itemprice'
           v-if='bottom'>券后价:<i>¥</i><span>{{item.discountsPrice}}</span></p>
        <p class='itemprice'
           v-else>新客价:<i>¥</i><span>{{item.discountsPrice}}</span></p>
        <p class='add-car'
           @click="handleClickAddCart(item)"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID, WX } from '~/environment/esm'
import { mapActions, mapGetters } from 'vuex'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
export default {
  data () {
    return {
      productId: '',
      attrId: '',
      productList: [],
      flag: 0
    }
  },
  props: {
    dataList: {
      type: Array
    },
    bottom: {
      type: Boolean,
      default: false
    }
  },
  activated () {
  },
  watch: {
  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
      // const params = {
      //   specialType: 35,
      //   shopId: this.$route.query.shopId ? this.$route.query.shopId : ''
      // }
      // sessionStorage.setItem('_shopId_', JSON.stringify(params))
    },
    handleClickAddCart (item) {
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('getUserInfo', null, res => {
              const userId = res.userId
              const token = res.token
              this.userId = res.userId
              if (userId && token) {
                this.saveLogin({
                  userId: userId,
                  token: token,
                  isLogin: true,
                  mobileFlag: true
                })
                this.addToCart(item)
              } else {
                ios.callHandler('goLogin', null, res => {
                })
              }
            })
          })
        }, 20)
      } else if (ANDROID) {
        // 加入购物车前判断安卓是否登录 未登录拉起安卓登录
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({
            userId: userId,
            token: token,
            isLogin: true,
            mobileFlag: true
          })
          this.addToCart(item)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.addToCart(item)
        } else {
          setStore('__redirectUrl__', '/activity/newcomers')
          // 微信中  先保存当前url  然后进行重定向获取code  提交code   获取到用户信息 后会跳转到之前保存的url中
          if (WX) {
            window.location.replace(wxreURL)
          } else {
            this.$router.push({
              path: '/login',
              query: { shopId: this.$route.query.shopId ? this.$route.query.shopId : '' }
            })
          }
        }
      }
    },
    addToCart (item) {
      this.$emit('changeProduct', item)
    },
    ...mapActions(['saveLogin'])
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters([
      'user'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
$woman: #fbecd6;
.semWraper {
  .bottom {
    margin: 10px;
    position: relative;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 0;
    img {
      width: 100%;
      font-size: 0;
    }
    .bottomItem {
      width: 50%;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 14px;
      box-sizing: border-box;
      border-bottom: none;
      img {
        width: 150px;
        height: 150px;
        border: 1px solid rgba(251, 236, 214, 1);
      }
      .showNone {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 10px;
      }
      .product-dec {
        padding-top: 10px;
        line-height: 18px;
        font-size: 16px;
        height: 36px;
        font-weight: 600;
        color: #702a02;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .bottomtitle {
        color: #6f2a02;
        font-size: 12px;
        padding-top: 4px;
        height: 32px;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .tagWraper {
        margin: 10px 0;
      }
      .product-price {
        color: rgba(166, 106, 70, 1);
        font-size: 13px;
        margin-top: 5px;
        margin-bottom: -10px;
        span {
          text-decoration: line-through;
          display: inline-block;
          padding-left: 5px;
        }
      }
      .product-bottom {
        display: flex;
        justify-content: space-between;
        height: 33px;
        .itemprice {
          font-size: 13px;
          color: rgba(166, 106, 70, 1);
          padding-top: 10px;
          span {
            color: #e01d1d;
            display: inline-block;
            font-weight: 600;
            font-size: 22px;
          }
          i {
            padding-left: 5px;
            color: #e01d1d;
          }
        }
        .add-car {
          @include bg-image-size('activity/newcomers/icon6');
          background-size: 100% 100%;
          height: 33px;
          width: 33px;
          background-size: 100% 100%;
        }
      }
    }
    .left-top {
      border-top-left-radius: 5px;
    }
    .right-top {
      border-top-right-radius: 5px;
    }
    .left-bottom {
      border-bottom-left-radius: 5px;
    }
    .right-bottom {
      border-bottom-right-radius: 5px;
    }
    .border-rightbottom:before {
      border-right: 1px solid $woman !important;
    }
    .show-more:after {
      border-color: $woman !important;
    }
    .border-rightbottom::after,
    .border-bottom::before {
      border-bottom: 1px solid $woman !important;
    }
    .border-none {
      &.border-rightbottom:after {
        border: none;
      }
      &.border-bottom:before {
        border: none;
      }
    }
  }
}
</style>
