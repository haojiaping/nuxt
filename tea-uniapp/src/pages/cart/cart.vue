<template>
   <view class="cart-wrap">
     <view class="cart-list">
       <view class="cart-item df" v-for="(item,index) in cartList" :key="index">
         <view class="item-radio">
            <van-checkbox :value="item.selected" checked-color="#f2766b" @change="radioChange($event,item)" icon-size="18"></van-checkbox>
         </view>
         <image class="item-img" :src="item.productImage" style="width:80px;height:80px;border-radius:5px;" mode="widthFix"></image>
         <view class="item-info df">
           <text class="f15 c3 fw400 item-name">{{item.productName}}</text>
           <view class="item-attr df f12 c9" @click="showAttrs(item)">
             <text>{{item.productStyle}}</text>
             <view class="item-down-icon"></view>
           </view>
           <view class="item-foot df">
             <text class="f15 foot-pri">¥{{item.unitPrice}}</text>
             
            <van-stepper :value="item.productCount" @change="onChange($event,item)"/>
           </view>
         </view>
       </view>
     </view>
     <view class="cart-foot">
       <van-submit-bar
          :price="money"
          :button-text="`结算(${selectNum})`"
          @submit="onSubmit">
          <view class="foot-left">
            <van-checkbox :value="allSelect" checked-color="#f2766b" @change="radioChangeAll($event)">全选</van-checkbox>
          </view>
        </van-submit-bar>
     </view>
     <CartLayer ref="CartLayerRef"
           :typeData="teaAttrProduct"
           :teaProduct="teaProduct"
           :selData="teaAttrSelect"
           :isShow="isShow"
           @needUpList="upCartList"
           @isShowToOther="isShowToOther"></CartLayer>
   </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCart,upCartcount,attrList } from "@/api/product";
import CartLayer from '@/components/cart/CartLayer'
export default {
  data() {
    return {
      cartList:[],
      pageNum:0,
      endFlag:0,
      money:0,
      selectNum:0,
      attrLayerShow: false,
      allSelect:true,
      teaAttrProduct: {},
      teaAttrSelect: {},
      isShow:false,
      teaProduct:{}
    }
  },
  onLoad() {
    this.getList()
  },
  onPullDownRefresh(){
    this.pageNum = 0
    this.getList()
  },
  onReachBottom(){
    if (this.endFlag===0) {
      this.getList()
    }
  },
  methods: {
    getList(){
      if (this.hasLogin) {
        getCart({userId:this.user.userId,pageNum: this.pageNum}).then(res=>{
          let arr = res.data.cartList
          arr.map(item=>{
            item.selected = true
          })
          this.endFlag = res.data.endFlag
          if(this.pageNum===0) this.cartList = []
          this.cartList = [...this.cartList,...arr]
          if(this.endFlag===0) this.pageNum++
          this.getMoney()
          uni.stopPullDownRefresh();
        })
      } else {
        uni.navigateTo({
          url:`/pages/login/login`
        })
      }
    },
    upCartList(){
      this.pageNum = 0
      this.getList()
    },
    // 计算总金额
    getMoney(item) {
      this.money = 0
      this.selectNum = 0
      this.cartList.forEach(elem => {
        if (elem.selected) {
          this.selectNum++
          this.money += (Number(elem.unitPrice) * elem.productCount *100)
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
      upCartcount(option).then(res => {
        if (res.code === 10000) {
        }
      })
    },
    isShowToOther(arg){
      this.isShow = arg===1?false:true
    },
    onChange(event,item){
      item.productCount = event.detail
      this.getMoney(item)
      console.log(item);
    },
    onSubmit(){
      if (this.selectNum === 0) {
        uni.showToast({
          icon:'none',
          title: '您还没有选择商品',
          duration: 1500
        });
        return
      }
      const orderData = []
      this.cartList.forEach(item => {
        if (item.selected) {
          orderData.push(item)
        }
      })
      uni.navigateTo({
        url:`/pages/pay/paysure?orderData=${JSON.stringify(orderData)}&payType=cart`
      })
    },
    radioChange(event,item){
      console.log(event);
      console.log(item);
      item.selected = event.detail
      this.getMoney()
    },
    radioChangeAll(event){
      this.allSelect = event.detail
      this.cartList.map(item=>{
        item.selected = this.allSelect
      })
      this.getMoney()
    },
    showAttrs(item) {
      attrList({ productId: item.productId }).then(res => {
        if (res.code === 10000) {
          this.teaProduct = res.data
          this.teaAttrProduct = res.data.teaAttrProduct
          this.teaAttrProduct.map(elem=>{
            elem.productOrderId = item.productOrderId
          })
          this.teaAttrSelect = item
          this.$refs.CartLayerRef.isSelect = item
          this.$refs.CartLayerRef.value = item.productCount
          console.log(item);
          this.isShow = true
        }
      })
    }
  },
  components: {
    CartLayer
  },
  computed: {
    ...mapGetters(['hasLogin','user'])
  }
}
</script>

<style>
page{
  background: #f2f2f2;
}
</style>
<style scoped lang='scss'>
.cart-wrap{
  background: #f2f2f2;
  .cart-list{
    background: #f2f2f2;
    padding-bottom: 50px;
    .cart-item{
      margin: 20upx;
      background: #fff;
      border-radius: 5px;
      padding: 20upx;
      align-items: center;
      .item-img{
        flex: 0 0 80px;
        margin:0 10px;
      }
      .item-info{
        flex-direction: column;
        justify-content: space-around;
        min-height: 80px;
        flex: 1;
        .item-name{
          @include text-over(1);
        }
        .item-attr{
          background:rgba(248,248,248,1);
          border:1upx solid rgba(232,232,232,1);
          border-radius:10px;
          align-items: center;
          align-self: baseline;
          padding: 2upx 8px;
          .item-down-icon{
            width: 9px;
            height: 9px;
            @include bg-image('cart/down');
            margin-left: 5px;
          }
        }
        .item-foot{
          justify-content: space-between;
          align-items: center;
          .foot-pri{
            color: #D45949;
            align-self:flex-end;
          }
        }
      }
    }
  }
  .cart-foot{
    .foot-left{
      padding-left: 20px;
    }
  }
}
</style>
