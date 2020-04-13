<template>
  <!-- 选购商品组件 -->
  <div>
      <div class="overlay" v-if="isShow" @click="close"></div>
      <van-action-sheet :show="isShow" :overlay="false">
      <div class="sub" :class="{'active':isShow}">

      <div class="content pr" @click.stop>
        <!-- 商品描述 -->
        <div class="pro-title">
          <div class="pro-img">
            <img :src="isSelect.attrImageUrl" mode="aspectFit" style="width:100%;height:100%;" alt="" v-if="isSelect.attrImageUrl&&isSelect.attrImageUrl!=='-'">
            <img :src="teaProduct.productImage" v-else style="width:100%;height:100%;">
          </div>
          <div class="pro-desc" v-if="isSelect.attrId">
            <span class="price">&yen; {{isSelect.productPrice||isSelect.unitPrice}}</span>
            <span class="pro f12 fw400">
              <span class="pro-text">已选：{{isSelect.productStyle}}</span>
              <span class="pro-text">数量：{{isSelect.productCount||value}}</span>
            </span>
          </div>
          <div class="pro-desc" v-if="!isSelect.attrId">
            <span class="prodec">请选择商品规格</span>
          </div>
        </div>
        <!-- 商品类型 -->
        <div class="selected">
          <span class="title" v-if="teaProduct.productType===0">净含量</span>
          <span class="title" v-else>规格</span>
          <div class="btn-wrap mescroll-touch">
            <div class="btn" :class="isSelect.attrId===item.attrId?'actice':''"   v-for="(item,index) in typeData" :key="index" @click="checkType(item)">
              <span class="btn-span">{{item.productStyle}}</span>
            </div>
          </div>
        </div>
        <!-- 数量 -->
        <!-- <div class="num-wrap" @click.stop>
          <span class="title">数量</span>
          <div class="num-content">
            <van-stepper :value="value" input-width="40px" @change="onChange"/>
          </div>
        </div> -->
        <van-goods-action v-if="type==='2'">
          <van-goods-action-button
            text="加入购物车"
            type="warning"
            @click="handleClickAddCart"
          />
          <van-goods-action-button
            text="立即购买"
            type="danger"
            :click="handleClickPay"
          />
        </van-goods-action>
        <div class="btnWrapone pa f18 cf" @click="handleClickToggle" v-else>
          确定
        </div>
      </div>
      </div>
  </van-action-sheet>
  </div>
    
</template>

<script>
import { mapGetters } from 'vuex'
import { upCartcount } from '@/api/product'
export default {
  name: 'CartLayer',
  data() {
    return {
      value: 1,
      isSelect:{}
    }
  },
  props: {
    typeData:{
      type:Array
    },
    teaProduct:{
      type:Object
    },
    selData:{
      type:Object
    },
    type:{
      type:String,
      defult:'2'
    },
    isShow:{
      type:Boolean,
      default:false
    }
  },
  mounted () {
    // console.log(this.isSelect);
  },
  methods: {
    handleClickToggle() {
      if (this.selData.attrId===this.isSelect.attrId&&this.value===this.selData.productCount) {
        this.$emit('isShowToOther',1)
        return
      }
      const option = {
        productOrderId: this.isSelect.productOrderId,
        userId: this.user.userId,
        productCount: this.value,
        attrId: this.isSelect.attrId
      }
      upCartcount(option).then(res => {
        if (res.code === 10000) {
          this.$emit('isShowToOther',1)
          this.$emit('needUpList')
        }
      })
    },
    onChange(event) {
      this.value = event.detail
    },
    handleClickAddCart() {
      this.handleClickToggle()
    },
    handleClickPay() {
      this.handleClickToggle()
    },
    checkType(item) {
      this.isSelect = Object.assign({}, item)
    },
    close(){
      this.$emit('isShowToOther',1)
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  components:{
  }
}
</script>
<style lang="scss" scoped>

.overlay{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition-duration: 300ms;
  transition-duration: 300ms;
  z-index: 100;
  background-color: rgba(0, 0, 0, .7);
}
.sub{
  padding-top: 20px;
  &.active{
    background: rgba(0,0,0,.7);

  }
}
  .content {
    min-height: 330px;
    padding:  0 25px  20px;
    background-color: #fff;
    height: 100%;
    .pro-title {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      .pro-img {
        width: 80px;
        height: 80px;
        padding: 5px;
        box-sizing: border-box;
        background: #fff;
        margin-top: -14px;
        border-radius: 5px;
        // img {
        //   display: block;
        //   width: 100%;
        //   height: 100%;
        // }
      }
      .pro-desc {
        margin-left: 10px;
        flex: 1;
        height: 50px;
        .price {
          display: block;
          line-height: 34px;
          color: #D45949;
          font-weight: bold;
          font-size: 15px;
        }
        .pro {
          .pro-text {
            margin-right: 15px;
            font-weight: 300;
            color: #333;
          }
        }
        .prodec {
          display: block;
          line-height: 50px;
          font-size: 14px;
        }
      }
    }
    .selected {
      margin-top: 25px;
      .title {
        font-size: 14px;
      }
      .btn-wrap {
        margin: 15px 0 15px;
        font-size: 0;
        max-height: 200px;
        overflow: scroll;
        .btn {
          display: inline-block;
          vertical-align: top;
          margin-right: 10px;
          margin-bottom: 10px;
          min-width: 90px;
          border-radius: 15px;
          box-sizing: border-box;
          text-align: center;
          line-height: 30px;
          font-size: 12px;
          color: #333;
          border:1upx solid #ccc;
          .btn-span {
            display: block;
            width: 100%;
            height: 100%;
            padding: 0 5px;
            box-sizing: border-box;
          }
          &.actice {
            // background: #d45949;
            background:linear-gradient(90deg,rgba(245,109,104,1) 0%,rgba(240,125,110,1) 100%);
            color: #fff;
            border: 1upx solid rgba(245,109,104,1);
          }
        }
      }
    }
    .num-wrap {
      font-size: 14px;
      .num-content {
        margin: 15px 0 55px;
        display: flex;
        flex-flow: row nowrap;
        .icon {
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          &:before {
            border-color: #333;
          }
        }
        .num {
          margin: 0 18px;
          display: block;
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          border: 0;
          outline: none;
        }
      }
    }

    .btnWrap{
      width: 100%;
      left: 0;
      bottom: 0;
      height:49px;
      background:rgba(234,111,95,1);
      display: flex;
      /deep/ .layer--shopping{
        flex: 1;
        font-size: 100px;
      }
      /deep/ .van-button--normal {
        flex: 1;
        height: 49px;
        color: #fff;
        font-size: 18px;
        padding: 0;
        &.shopping {
          background-color: #ea6f5f;
        }
        &.opacity {
          opacity: 0;
        }
        &.pay {
          background-color: #d45949;
        }
      }
      /deep/ .van-button--default {
        border: 0;
      }
    }
    .btnWrapone{
      width: 100%;
      left: 0;
      bottom: 0;
      height:49px;
      line-height:49px;
      background:rgba(234,111,95,1);
      text-align: center;
    }
  }
</style>
