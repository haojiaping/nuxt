<template>
  <div class="bottom df"
       v-if="dataList">
    <div class="bottomItem"
         v-for="(item,index) in dataList"
         :key="index"
         :class="[(index%2===0)?'border-rightbottom':'border-bottom',index===(dataList.length-2)||index===(dataList.length-1)||index===0||index===1?'border-none':'',index===0?'left-top':'',index===1?'right-top':'',
         index===(dataList.length-2)?'left-bottom':'',
         index===(dataList.length-1)?'right-bottom':'']">
      <img :src="item.image"
           alt=""
           @click="jumpDetail(item.productId)">
      <p class="border-top bottomtitle"
         @click="jumpDetail(item.productId)">{{item.productName}}</p>
      <p class="product-dec">{{item.productDescription}}</p>
      <p class='product-price'>日常价:<span>¥{{item.discountsPrice}}</span></p>
      <div class='product-bottom'>
        <p class='itemprice'>新客价:<i>¥</i><span>{{item.productPrice}}</span></p>
        <p class='add-car'
           @click="handleClickAddCart(item)"></p>
      </div>
    </div>
    <layer ref="newkeLayerRef" @suregood="suregood"></layer>
  </div>
</template>

<script>
import { IOS, ANDROID, WX } from '~/environment/esm'
import { mapActions, mapGetters } from 'vuex'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
import layer from './layer'
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
    }
  },
  activated () {
  },
  watch: {
  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
      const params = {
        specialType: 35,
        shopId: this.$route.query.shopId ? this.$route.query.shopId : ''
      }
      sessionStorage.setItem('_shopId_', JSON.stringify(params))
    },
    suregood(item) {
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
          setStore('__redirectUrl__', '/activity/newkepro')
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
                if (item.productAttrList.length > 1) {
                  console.log(item.productAttrList)
                  this.$refs.newkeLayerRef.productAttrList = item.productAttrList
                  this.$refs.newkeLayerRef.attrLayerShow = true
                  this.$refs.newkeLayerRef.isSelect = item.productAttr
                  this.$refs.newkeLayerRef.name = item.productName
                } else {
                  item.productAttrList[0].productName = item.productName
                  this.addToCart(item.productAttrList[0])
                }
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
          if (item.productAttrList.length > 1) {
            console.log(item.productAttrList)
            this.$refs.newkeLayerRef.productAttrList = item.productAttrList
            this.$refs.newkeLayerRef.attrLayerShow = true
            this.$refs.newkeLayerRef.isSelect = item.productAttr
            this.$refs.newkeLayerRef.name = item.productName
          } else {
            item.productAttrList[0].productName = item.productName
            this.addToCart(item.productAttrList[0])
          }
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          if (item.productAttrList.length > 1) {
            console.log(item.productAttrList)
            this.$refs.newkeLayerRef.productAttrList = item.productAttrList
            this.$refs.newkeLayerRef.attrLayerShow = true
            this.$refs.newkeLayerRef.isSelect = item.productAttr
            this.$refs.newkeLayerRef.name = item.productName
          } else {
            item.productAttrList[0].productName = item.productName
            this.addToCart(item.productAttrList[0])
          }
        } else {
          setStore('__redirectUrl__', '/activity/newkepro')
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
      // this.productId = item.productId
      // this.attrId = item.attrId
      // let id = item.productId
      // let flag = 0
      // this.productList.map((key) => {
      //   if (key.productId === id) {
      //     flag = 1
      //   }
      // })
      // if (flag === 0) {
      //   this.$set(item, 'productCount', 1)
      //   this.productList.push(item)
      // } else {
      //   const flagIndex = this.productList.findIndex((key) => {
      //     return key.productId === id
      //   })
      //   this.productList[flagIndex].productCount++
      // }
      // this.$emit("changeProduct", this.productList)
      this.$emit('changeProduct', item)
    },
    ...mapActions(['saveLogin'])
  },
  components: {
    layer
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
$woman: #09304a;
.semWraper {
  .top-img {
    img {
      width: 100%;
      font-size: 0;
    }
  }
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
      background: #efcc8c;
      padding: 14px;
      box-sizing: border-box;
      border-bottom: none;
      img {
        width: 150px;
        height: 150px;
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
        line-height: 17.5px;
        font-size: 14px;
        height: 34px;
        font-weight: 500;
        color: rgba(114, 39, 7, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .bottomtitle {
        color: rgba(114, 39, 7, 1);
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
            color: rgba(168, 0, 2, 1);
            display: inline-block;
            font-weight: 600;
            font-size: 22px;
          }
          i {
            padding-left: 5px;
            color: rgba(168, 0, 2, 1);
          }
        }
        .add-car {
          @include bg-image('activity/newkepro/car');
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
