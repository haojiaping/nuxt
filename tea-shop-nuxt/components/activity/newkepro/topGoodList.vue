<template>
  <div class="bottom df"
       v-if="dataList">
    <div class='top-product'
         v-for='(item,index) in dataList'
         :key="index">
      <img :src="item.image"
           alt=""
           @click="jumpDetail(item.productId)"
           class='product-img'>
      <div class='product-msg'>
        <p class='product-title'
           @click="jumpDetail(item.productId)">{{item.productName}}</p>
        <p class='dec'>{{item.productDescription}}</p>
        <p class='product-price'>日常价:<span>¥{{item.discountsPrice}}</span></p>
        <div class='product-bottom'>
          <p class='product-desc'>新客价:<i>¥</i><span>{{item.productPrice}}</span></p>
          <van-button round
                      @click="handleClickAddCart(item)">加入购物车</van-button>
        </div>
      </div>
    </div>
    <layer ref="newkeLayerRef" @suregood="suregood"></layer>
  </div>
</template>

<script>
import { IOS, ANDROID, WX } from '~/environment/esm'
import { upCart } from '~/api/product'
import { mapActions, mapGetters } from 'vuex'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
import layer from './layer'
export default {
  data () {
    return {
      productId: '',
      attrId: '',
      productList: []
    }
  },
  props: {
    dataList: {
      type: Array
    }
  },
  activated () {
    // this.getSpecialdata()
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
                this.localAddToCart(item)
              } else {
                ios.callHandler('goLogin', null, res => {
                })
              }
              // var userid = JSON.parse(res)
              // alert(res.userId)
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
          this.localAddToCart(item)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.localAddToCart(item)
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
                  this.localAddToCart(item.productAttrList[0])
                }
              } else {
                ios.callHandler('goLogin', null, res => {
                })
              }
              // var userid = JSON.parse(res)
              // alert(res.userId)
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
            this.localAddToCart(item.productAttrList[0])
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
            this.localAddToCart(item.productAttrList[0])
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
    localAddToCart (item) {
      this.$emit('changeProduct', item)
    },
    addToCart () {
      const option = {
        orderDetailStr: `${this.productId}&${1}&${this.attrId}`,
        userId: this.user.userId
      }
      this.$axios.$post(upCart, option).then(res => {
        if (res.code === 10000) {
          this.$toast.success('添加购物车成功')
          const productId = { productId: this.productId }
          setTimeout(() => {
            this.$parent.findUser()
          }, 100)
          if (IOS) {
            window.callback(ios => {
              ios.callHandler('addToCart', JSON.stringify(productId), res => {
              })
            })
          } else if (ANDROID) {
            window.android.refreshShoppingData()
          }
        } else {
          this.$toast(res.message)
        }
      })
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
@mixin title {
  padding-top: 10px;
  height: 35px;
  line-height: 17.5px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.semWraper {
  .bottom {
    margin: 10px 0;
    position: relative;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 0;
    img {
      width: 100%;
      font-size: 0;
    }
    .top-product {
      background: #efcc8c;
      margin: 10px;
      display: flex;
      align-items: center;
      padding: 10px;
      width: 100%;
      border-radius: 5px;
      .product-img {
        width: 92.5px;
        height: 92.5px;
      }
      .product-msg {
        flex: 1;
        padding-left: 10px;
        .product-title {
          @include title;
          color: #722707;
          font-weight: 500;
        }
        .dec {
          color: rgba(114, 39, 7, 1);
          line-height: 18px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-price {
          color: rgba(166, 106, 70, 1);
          font-size: 13px;
          margin-top: 10px;
          span {
            text-decoration: line-through;
            display: inline-block;
            padding-left: 5px;
          }
        }
        .product-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .product-desc {
            font-size: 13px;
            color: rgba(166, 106, 70, 1);
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
          /deep/ .van-button {
            height: 27px;
            line-height: 27px;
            background: rgba(168, 0, 2, 1);
            border-radius: 13.5px;
            color: rgba(251, 240, 216, 1);
            border: none;
          }
          .product-none {
            background: #ccc;
          }
        }
      }
    }
  }
}
</style>
