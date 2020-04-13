<template>
  <!-- 购物车组件 -->
  <div>
    <!-- 头部 -->
    <div class="header">
      <span class="text">购物车</span>
      <span class="edit" @click="edit=false" v-if="edit">编辑</span>
      <span class="edit" @click="edit=true" v-else-if="!edit">完成</span>
    </div>
    <div class="cart-wrapper">
      <div class="mescroll" ref="mescroll">
        <!-- 列表 -->
        <div>
        <ul id="listWraper" class="shopping-wrapper">
          <li class="item" v-for="(item,index) in cartData" :key="`cart_${index}`">
            <div class="icon-wrapper" :class="item.active===1?'active':''" @click="handleClickToggleSelected(item)">
              <i class="icon"></i>
            </div>
            <div class="content">
              <div class="img-wrapper" @click="goDetail(item.productId)">
                <img :src="item.productImage" width="100%">
              </div>
              <div class="desc-wrapper">
                <span class="title" @click="goDetail(item.productId)">{{item.productName}}</span>
                <!-- <span class="desc" @click="goDetail(item.productId)">{{item.productDescription}}</span> -->
                <div class="attrsWraper">
                  <div class="attrs df van-hairline--surround" @click="showAttrs(item)">
                    <span class="style f12">{{item.productStyle}}</span>
                    <i class="down"></i>
                  </div>
                </div>
                <div class="price-wrapper">
                  <span class="price">&yen; {{item.unitPrice}}</span>
                  <!-- <span class="deal">
                    <i class="reduce iconfont border">&#xe68d;</i>
                    <i class="num">1</i>
                    <i class="add active iconfont border">&#xe62b;</i>
                  </span> -->
                  <div class="deal">
                    <van-stepper v-model="item.productCount" @change="getMoney(item)" disable-input/>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        </div>
        <!-- 为你推荐 -->
        <div class="recommend-wrap" v-if="cartAboutList.length!==0&&cartData.length!==0">
          <h3 class="title">为你推荐</h3>
          <MorePro :AboutMore="cartAboutList"></MorePro>
        </div>
    </div>
    </div>
    <!-- 结算 -->
    <div class="settlem-wrap border-top" v-if="cartData.length!==0">
      <div class="selected" @click="handClickAll">
        <i class="icon" :class="{'active':allSelect}"></i>
        <span class="text">全选</span>
      </div>
      <div class="right">
        <span class="all-price">
          合计:
          <em class="price">&yen; {{money.toFixed(2)}}</em>
        </span>
        <span class="btn" v-if="edit" @click="saveOrderData">结算<em class="num" >({{selectNum}})</em></span>
        <span class="btn" v-else-if="!edit" @click="delCart">删除<em class="num" >({{selectNum}})</em></span>
      </div>
    </div>
    <!-- 弹窗 -->
    <PopUp @deleted="deleted" ref="delPop"></PopUp>
    <CartLayer :attrLayerShow.sync="attrLayerShow"  v-show="attrLayerShow"
    :teaAttrProduct="teaAttrProduct"
    :teaAttrSelect="teaAttrSelect"
    @needUpdateList="downUpdateList"></CartLayer>
  </div>
</template>

<script>
import { getCart, getCartAbout, upCartcount, deleteCart, attrList } from '~/api/product'
import { WX } from '~/environment/esm'
import { mapGetters } from 'vuex'
import { wxreFunPay } from '~/config/constant'
import CartLayer from '~/components/cart/CartLayer'
import PopUp from '~/components/cart/PopUp'
export default {
  data () {
    return {
      value: 1,
      edit: true,
      money: 0.00,
      selectNum: 0,
      allSelect: true,
      attrLayerShow: false,
      teaAttrProduct: {},
      teaAttrSelect: {},
      cartAboutList: [], // 下方相关推荐
      list: [],
      mescroll: null, // mescroll实例对象
      cartData: []// 列表数据
    }
  },
  mounted () {
    this.mescrollInit()
    this.cartAbout()
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit () {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: { // 上拉加载的配置.
          callback: this.getCartList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 // 每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
          noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
          // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          // 这就是为什么无更多数据有时候不显示的原因
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'listWraper', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    getCartList(page, mescroll) {
      var pageIndex = page.num - 1
      const option = {
        userId: this.user.userId,
        pageNum: 0
      }
      this.$axios.$post(getCart, option).then(res => {
        const arr = res.data.cartList
        if (res.code === 10000) {
          res.data.cartList.forEach(elem => {
            elem.active = 1
          })
          if (page.num === 1) this.cartData = []
          this.cartData = this.cartData.concat(arr)
          this.getMoney()
          this.$nextTick(() => {
            setTimeout(() => {
              this.mescroll.endSuccess(arr.length)
            }, 500)
          })
        } else {
          this.$toast(res.message)
          this.mescroll.endErr()
        }
      })
    },
    showAttrs(item) {
      this.$axios.$post(attrList, { productId: item.productId }).then(res => {
        if (res.code === 10000) {
          this.teaAttrProduct = res.data
          this.teaAttrSelect = item
          this.attrLayerShow = true
        } else {
          this.$toast(res.message)
        }
      })
    },
    downUpdateList() {
      this.mescroll.triggerDownScroll()
    },
    handleClickToggleSelected(item) {
      if (item.active === 0) {
        item.active = 1
      } else {
        item.active = 0
      }
      this.getMoney()
    },
    goDetail(productId) {
      this.$router.push({ path: `/${productId}` })
    },
    cartAbout() {
      if (this.user.userId) {
        const option = {
          userId: this.user.userId
        }
        this.$axios.$post(getCartAbout, option).then(res => {
          if (res.code === 10000) {
            this.cartAboutList = res.data
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    handClickAll() {
      this.money = 0
      if (this.allSelect) {
        this.cartData.forEach(elem => {
          elem.active = 0
        })
        this.money = 0
        this.selectNum = 0
        this.allSelect = false
      } else {
        this.cartData.forEach(elem => {
          elem.active = 1
          this.money += (Number(elem.unitPrice) * elem.productCount)
        })
        this.selectNum = this.cartData.length
        this.allSelect = true
      }
    },
    // 计算总金额
    getMoney(item) {
      this.money = 0
      this.selectNum = 0
      this.cartData.forEach(elem => {
        if (elem.active === 1) {
          this.selectNum++
          this.money += (Number(elem.unitPrice) * elem.productCount)
        } else {
          this.allSelect = false
        }
      })
      if (item) {
        this.cartcount(item)
      }
    },
    // 更新购物车数量
    cartcount(item) {
      const option = {
        productOrderId: item.productOrderId,
        userId: this.user.userId,
        productCount: item.productCount
      }
      this.$axios.$post(upCartcount, option).then(res => {
        if (res.code === 10000) {
        } else {
          this.$toast(res.message)
        }
      })
    },
    saveOrderData() {
      const selCarData = []
      this.cartData.forEach(item => {
        if (item.active === 1) {
          selCarData.push(item)
        }
      })
      if (selCarData.length === 0) {
        this.$toast('您还没有选择商品')
      } else {
        console.log(selCarData)
        sessionStorage.setItem('__teaOrder__', JSON.stringify(selCarData))
        sessionStorage.setItem('__teapayType__', 'cart')
        if (WX) {
          window.location.href = `${wxreFunPay}`
        } else {
          this.$router.push('/pay/sure')
        }
      }
    },
    delCart() {
      // eslint-disable-next-line
      let productOrderId = ''
      this.cartData.forEach(elem => {
        if (elem.active === 1) {
          productOrderId += elem.productOrderId + ','
        } else {
          this.allSelect = false
        }
      })
      if (productOrderId === '') {
        this.$toast('请选择您要删除的商品')
      } else {
        this.$refs.delPop.isShow = true
      }
    },
    deleted() {
      // eslint-disable-next-line
      let productOrderId = ''
      this.cartData.forEach(elem => {
        if (elem.active === 1) {
          productOrderId += elem.productOrderId + ','
        } else {
          this.allSelect = false
        }
      })
      productOrderId = productOrderId.replace(/,$/gi, '') // 去掉最后一个 , 号
      this.$refs.delPop.isShow = false // 删除选中的商品
      const option = {
        userId: this.user.userId,
        productOrderId: productOrderId
      }
      this.$axios.$post(deleteCart, option).then(res => {
        if (res.code === 10000) {
          this.$toast('删除成功')
          this.edit = true
          setTimeout(() => {
            this.mescroll.triggerDownScroll()
          }, 300)
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  watch: {
    // 监听选中的数量
    selectNum(val) {
      if (val === this.cartData.length) {
        this.allSelect = true
      } else {
        this.allSelect = false
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  components: {
    PopUp,
    CartLayer
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  text-align: center;
  line-height: 44px;
  font-size: 15px;
  background-color: #fff;
  font-weight: normal;
  .edit {
    position: absolute;
    right: 0;
    padding: 0 20px;
    font-size: 16px;
    color: #333;
  }
}
.cart-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 100px;
  .shopping-wrapper {
    padding: 10px 10px 20px 0;
    .item {
      margin-bottom: 12px;
      width: 100%;

      display: flex;
      &:last-child {
        margin-bottom: 0;
      }
      .icon-wrapper {
        flex: 0 0 35px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          .icon {
            @include bg-image("cart/selected");
          }
        }
        .icon {
          width: 15px;
          height: 15px;
          border-radius: 100%;
          background-size: cover;
          @include bg-image("cart/cir");
        }
      }
      .content {
        flex: 1;
        display: flex;
        background-color: #fff;
        // padding: 10px 0;
        padding-bottom: 10px;
        .img-wrapper {
          margin-right: 5px;
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          padding: 10px;
          box-sizing: border-box;
          img {
            width: 100%;
            height: 100%;
            @include bg-image('cart/pro');
            background-size: cover;
          }
        }
        .desc-wrapper {
          width: 100%;
          padding-right: 10px;
          .title {
            margin: 15px 0 5px;
            display: block;
            font-size: 14px;
            font-weight: 700;
            line-height: 18px;
          }
          .desc {
            max-width: 200px;
            margin-bottom: 10px;
            display: block;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #666;
            line-height: 15px;
          }
          .attrsWraper {
            display: inline-block;
            margin-bottom: 10px;
            .attrs {
              background: #f8f8f8;
              align-items: center;

              padding: 2px 5px;
              box-sizing: border-box;
              /deep/ &.van-hairline--surround::after {
                border-color: #e8e8e8;
              }
              .style {
                color: #999;
                margin-right: 30px;
              }
              .down {
                width: 12px;
                height: 12px;
                @include bg-image('cart/down');
                background-size: cover;
              }
            }
          }
          .price-wrapper {
            overflow: hidden;
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .price {

              font-size: 15px;
              color: #D45949;
              font-weight: bold;
            }
            .deal {
              margin-right: 5px;

              font-size: 0;
              i {
                position: relative;
                display: inline-block;
                vertical-align: top;
                width: 14px;
                height: 14px;
                text-align: center;
                line-height: 14px;
                font-size: 12px-s;
                &.reduce, &.add {
                  color: #e8e8e8;
                  &:before {
                    border-color: #e8e8e8;
                  }
                  &.active {
                    color: #333;
                    &:before {
                      border-color: #666;
                    }
                  }
                }
                &.num {
                  width: 37px;
                }
              }
            }
            .deal /deep/ .van-stepper__plus::before, .deal /deep/ .van-stepper__plus::after {
              background-color: #333;
            }
            .deal /deep/ .van-stepper__minus::before, .deal /deep/ .van-stepper__minus::after {
              background-color: #333;
            }
            .deal /deep/ .van-stepper__plus--disabled::before {
              background-color: #ccc;
            }
            .deal /deep/ .van-stepper__minus--disabled::before {
              background-color: #ccc;
            }
            .deal /deep/ .van-stepper {
              font-size: 15px;
            }
            .deal /deep/ .van-stepper__plus {
              border-color: #333;
              border-radius: 0;
            }
            .deal /deep/ .van-stepper__minus {
              border-color: #333;
              border-radius: 0;
            }
            .deal /deep/ .van-stepper__minus--disabled {
              border-color: #ccc;
            }
            .deal /deep/ .van-stepper .van-stepper__minus, .deal /deep/ .van-stepper .van-stepper__plus {
              height: 20px;
              width: 20px;
            }
            .deal /deep/ .van-stepper__input {
              height: 20px;
              line-height: 20px;
              width: 30px;
              border: none;
            }
            .deal /deep/ .van-stepper__input[disabled] {
              color: #333;
              background-color: #fff;
              -webkit-text-fill-color: #333;
            }
          }
        }
      }
    }
  }
  .recommend-wrap {
    padding: 0 0 10px 10px;
    .title {
      padding: 0 0 200px 3px;
      line-height: 20px;
      font-size: 15px;
      font-weight: 700;
    }
  }
}
.settlem-wrap {
  position: fixed;
  left: 0;
  right: 0;
  // bottom: calc(55px + constant(safe-area-inset-bottom));
  // bottom: calc(55px + env(safe-area-inset-bottom));
  bottom:55px;
  height: 45px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background-color: #fff;
  &:before {
    border-color: #cccccc;
  }
  .selected {
    flex: 0 0 100px;
    display: flex;
    align-items: center;
    width: 100px;
    height: 45px;
    font-size: 0;
    .icon {
      margin-left: 10px;
      display: inline-block;
      vertical-align: top;
      width: 13px;
      height: 13px;
      background-size: cover;
      @include bg-image("cart/cir");
      &.active {
        @include bg-image("cart/selected");
      }
    }
    .text {
      display: inline-block;
      vertical-align: top;
      margin: 0.0100px 0 0 10px;
      font-size: 15px;
      color: #333;
    }
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
    height: 45px;
    .all-price {
      font-size: 15px;
      color: #333;
      .price {
        margin: 0 14px 0 10px;
      }
    }
    .btn {
      display: inline-block;
      vertical-align: top;
      width: 140px;
      height: 45px;
      text-align: center;
      line-height: 45px;
      color: #fff;
      background-color: #D45949;
      font-size: 18px;
      .num {
        margin-left: 20px;
      }
    }
  }
}
#listWraper{
  .mescroll-empty{
    .empty-icon{
      height: auto;
    }
  }
}
</style>
