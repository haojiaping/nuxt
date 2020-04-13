<template>
  <!-- 选购商品组件 -->
  <transition name="van-fade">
    <div>
    <van-action-sheet v-model="isShow" >
  <!-- <div class="detail-layer" @click="handleClickToggle" v-show="isShow"> -->
    <!-- <van-action-sheet  v-model="isShow"> -->
    <!-- <transition name="toggle"> -->
      <div class="sub">

      <div class="content pr" @click.stop>
        <!-- 商品描述 -->
        <div class="pro-title">
          <div class="pro-img" @click="ViewImages">
            <img :src="isSelect.attrImageUrl" alt="" v-if="isSelect.attrImageUrl&&isSelect.attrImageUrl!=='-'">
            <img :src="teaProduct.productImage" v-else>
          </div>
          <div class="pro-desc" v-if="isSelect.productPrice">
            <span class="price">&yen; {{isSelect.productPrice}}</span>
            <span class="pro f12">
              <em>已选：{{isSelect.productStyle}}</em>
              <em>数量：{{value}}</em>
            </span>
          </div>
          <div class="pro-desc" v-if="!isSelect.productPrice">
            <span class="prodec">请选择商品规格</span>
          </div>
        </div>
        <!-- 商品类型 -->
        <div class="selected">
          <span class="title" v-if="teaProduct.productType===0">净含量</span>
          <span class="title" v-else>规格</span>
          <div class="btn-wrap mescroll-touch">
            <div class="btn" :class="isSelect.attrId===item.attrId?'actice':''"   v-for="(item,index) in typeData" :key="`type_${index}`" @click="checkType(item)">
              <span class="border">{{item.productStyle}}</span>
            </div>
          </div>
        </div>
        <!-- 数量 -->
        <div class="num-wrap">
          <span class="title">数量</span>
          <div class="num-content">
            <van-stepper v-model="value" @change="addNum" input-width="40px"/>
          </div>
        </div>
        <div class="btnWrap pa" v-if="type==='2'">
          <van-button type="default"
                    class="shopping"
                    @click="handleClickAddCart">加入购物车</van-button>
          <!-- <van-button type="default"
                      class="shopping"
                      :class="{'opacity':toCart}"
                      v-show='toCart'>加入购物车</van-button> -->
          <van-button type="default"
                      class="pay"
                      style='float:right;'
                      @click="handleClickPay">立即购买</van-button>
        </div>
        <div class="btnWrapone pa f18 cf" @click="handleClickToggle" v-if="['pay','cart'].includes(type)">
          确定
        </div>
      </div>
    <!-- </transition> -->
  <!-- </div> -->
      </div>
  </van-action-sheet>
  </div>
  </transition>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'layer',
  data() {
    return {
      isShow: false,
      isSelect: {},
      value: '',
      type: '2'
    }
  },
  props: ['typeData', 'teaProduct', 'selData'],
  mounted () {
    this.isShow = false
    this.isSelect = this.selData
  },
  methods: {
    toggle() {
      this.isShow = !this.isShow
      this.$emit('userSelectnum', this.value)
    },
    handleClickToggle() {
      this.isShow = false
      this.isSelect.num = this.value
      this.$emit('userSelect', this.isSelect)
      if (this.type === 'pay') {
        setTimeout(() => {
          this.$emit('handleClickPay')
        }, 20)
      } else if (this.type === 'cart') {
        this.$emit('handleClickAddCart')
      }
    },
    addNum() {
      this.selData.num = this.value
      // this.$emit('userSelectnum', this.value)
    },
    handleClickAddCart() {
      this.handleClickToggle()
      this.$emit('handleClickAddCart')
    },
    handleClickPay() {
      this.handleClickToggle()
      this.$emit('handleClickPay')
    },
    checkType(item) {
      // this.selData = item
      // this.selData.num = this.value
      // item.num = this.value
      // this.$set(item, 'num', this.value)
      // console.log(item)
      this.isSelect = Object.assign({}, item)
      this.isSelect.num = this.value
      this.$emit('userSelect', this.isSelect)
      // this.$emit('userSelect', item, this.value)
    },
    ViewImages(item) {
      const index = this.imagesList.indexOf(this.selData.attrImageUrl)
      const that = this
      ImagePreview({
        images: this.imagesList,
        startPosition: index,
        onClose(e) {
          const selItem = e.index
          that.checkType(that.typeData[selItem])
        }
      })
    }
  },
  computed: {
    imagesList() {
      const arr = []
      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].attrImageUrl && this.typeData[i].attrImageUrl !== '-') {
          arr.push(this.typeData[i].attrImageUrl)
        } else {
          arr.push(this.teaProduct.productImage)
        }
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';

// .detail-layer {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 49px;
//   z-index: 17;
//   background-color: rgba(0, 0, 0, 0.5);
.sub{
  padding-top: 20px;
  background: rgba(0,0,0,.7);
}
  .content {
    // position: absolute;
    // left: 0;
    // right: 0;
    // bottom: 0;
    min-height: 330px;
    padding:  0 25px  20px;
    background-color: #fff;
    height: 100%;
    .pro-title {
      position: relative;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      .pro-img {
        position: absolute;
        top: -30px;
        left: -10px;
        width: 80px;
        height: 80px;
        padding: 5px;
        box-sizing: border-box;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .pro-desc {
        margin-left: 80px;
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
          em {
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

          box-sizing: border-box;
          text-align: center;
          line-height: 30px;
          font-size: 12px;
          color: #333;
          span {
            display: block;
            width: 100%;
            height: 100%;
            padding: 0 5px;
            box-sizing: border-box;
            &:before {
              border-color: #e5e5e5;
            }
          }
          &.actice {
            background: #d45949;
            color: #fff;
            .border:before {
              border-color: #d45949;
            }
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

    .num-content /deep/ .van-stepper__plus::before {
      background-color: #333;
    }
    .num-content /deep/ .van-stepper__minus::before {
      background-color: #333;
    }
    .num-content /deep/ .van-stepper__plus--disabled::before {
      background-color: #ccc;
    }
    .num-content /deep/ .van-stepper__minus--disabled::before {
      background-color: #ccc;
    }
    .num-content /deep/ .van-stepper__minus, .num-content /deep/ .van-stepper__plus {
      width: 24px;
      height: 24px;
      border-radius: 0;
    }
    .num-content /deep/ .van-stepper__input {
      border: 0;
    }
    .num-content /deep/ .van-stepper__minus {
      border-color: #333;
      color: #333;
    }
    .num-content /deep/ .van-stepper__minus--disabled {
      border-color: #ccc;
    }
    .num-content /deep/ .van-stepper__plus {
      border-color: #333;
      color: #333;
    }
    .num-content /deep/ .van-stepper__input[disabled] {
      color: #333;
      background-color: #fff;
      -webkit-text-fill-color: #333;
    }
  }
// }
</style>
