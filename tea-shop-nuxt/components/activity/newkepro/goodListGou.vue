<template>
  <div class="bottom df"
       v-if="dataList">
    <div class='top-product'
         :class="index===(list.length-1)?'':'border-bottom'"
         v-for='(item,index) in list'
         :key="index">
      <img :src="item.image"
           alt=""
           @click="jumpDetail(item.productId)"
           class='product-img'>
      <div class='product-msg'>
        <p class='product-title'
           @click="jumpDetail(item.productId)">{{item.productName}}</p>
        <p class='dec'>{{item.productDescription}}</p>
        <p class='product-price'
           :class="goodType==='top'?'':'product-price-bottom'">零售价:<span>¥{{item.productPrice}}</span></p>
        <div class='product-bottom'
             v-if="goodType==='top'">
          <p class='product-desc'><span>已领取:{{item.interest}}份</span></p>
          <van-button round
                      v-if='item.flag'
                      plain
                      color='#C9000A'
                      @click="handleClickAddCart(item,index)">免费领</van-button>
          <van-button round
                      v-else
                      @click="handleClickAddCart(item,index)"
                      color='#C9000A'>已领取</van-button>
        </div>
        <div class='product-bottom'
             v-else>
          <p class='product-desc-bottom'>今日特价:<i>¥</i><span>{{item.discountsPrice}}</span></p>
          <van-button round
                      color='#C9000A'
                      @click="handleClickAddCart(item)">加入购物车</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID, WX } from '~/environment/esm'
import { upCart } from '~/api/product'
import { mapActions, mapGetters } from 'vuex'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
export default {
  data () {
    return {
      splitTag (tags) {
        if (tags) {
          return tags.split(',')
        }
      },
      productId: '',
      attrId: '',
      productList: [],
      flag: true
      // getChangeStatus: false
    }
  },
  props: {
    dataList: {
      type: Array
    },
    goodType: {
      type: String
    },
    changeStatus: {
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
    },
    handleClickAddCart (item, index) {
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
                this.localAddToCart(item, index)
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
          this.localAddToCart(item, index)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.localAddToCart(item, index)
        } else {
          setStore('__redirectUrl__', this.$route.fullPath)
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
    localAddToCart (item, i) {
      this.$emit('changeProduct', item)
      if (this.goodType === 'top') {
        if (item.flag) {
          this.list.map((key, index, arr) => {
            if (index === i) {
              arr[index].flag = false
            } else {
              arr[index].flag = true
            }
          })
        }
      }
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

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters([
      'user'
    ]),
    list () {
      if (this.goodType === 'top') {
        this.dataList.map((item) => {
          this.$set(item, 'flag', true)
        })
        if (this.changeStatus.length > 0) {
          this.dataList.map((item) => {
            if (item.productId === this.changeStatus[0].productId) {
              item.flag = false
            }
          })
        } else {
          this.dataList.map((item) => {
            item.flag = true
          })
        }
      }
      return this.dataList
    }
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
    margin: 0 10px;
    position: relative;
    flex-wrap: wrap;
    justify-content: space-between;
    img {
      width: 100%;
      font-size: 0;
    }
    .top-product {
      background: #fff;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px;
      .product-img {
        width: 100px;
        height: 100px;
        border: 1px solid #c6c6c6;
      }
      .product-msg {
        flex: 1;
        padding-left: 10px;
        .product-title {
          @include title;
          color: #000;
          font-weight: 500;
        }
        .dec {
          color: #000;
          line-height: 18px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-price {
          color: #c9000a;
          font-size: 13px;
          margin-top: 10px;
          span {
            text-decoration: line-through;
            display: inline-block;
            padding-left: 5px;
          }
        }
        .product-price-bottom {
          color: #999;
        }
        .product-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .product-desc {
            font-size: 13px;
            color: #999999;
          }
          .product-desc-bottom {
            font-size: 13px;
            color: #c9000a;
            span {
              color: #c9000a;
              display: inline-block;
              font-weight: 600;
              font-size: 22px;
            }
            i {
              padding-left: 5px;
              color: #c9000a;
            }
          }
          /deep/ .van-button {
            height: 30px;
            line-height: 30px;
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
