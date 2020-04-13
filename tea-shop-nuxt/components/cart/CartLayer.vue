<template>
  <div class="detail-layer"
       @click="close"
       v-show="attrLayerShow">
    <transition name="toggle">
      <div class="content"
           @click.stop
           v-show="attrLayerShow">
        <!-- 商品描述 -->
        <div class="pro-title">
          <div class="pro-img">
            <img :src="teaAttrProduct.productImage"
                 alt="">
          </div>
          <div class="pro-desc"
               v-if="isSelect.productPrice||isSelect.unitPrice">
            <span class="price">&yen; {{isSelect.productPrice||isSelect.unitPrice}}</span>
            <span class="pro">
              <em>已选：{{isSelect.productStyle}}</em>
              <em>数量：{{isSelect.productCount}}</em>
            </span>
          </div>
        </div>
        <!-- 商品类型 -->
        <div class="selected">
          <span class="title">净含量</span>
          <div class="btn-wrap mescroll-touch">
            <div class="btn"
                 :class="isSelect.attrId===item.attrId?'actice':''"
                 v-for="(item,index) in teaAttrProduct.teaAttrProduct"
                 :key="`type_${index}`"
                 @click="checkType(item)">
              <span class="border">{{item.productStyle}}</span>
            </div>
            <!-- <span class="border">170g*3饼</span> -->
          </div>
        </div>
        <div class="btns f18 cash van-hairline--surround"
             @click="sureAttrSelect">确定</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { upCartcount } from '~/api/product'
import { mapGetters } from 'vuex'
export default {
  name: 'CartLayer',
  data () {
    return {
      isSelect: {}
    }
  },
  props: {
    attrLayerShow: {
      type: Boolean,
      default: false
    },
    teaAttrProduct: {
      type: Object
    },
    teaAttrSelect: {
      type: Object
    },
    teaAttrImage: {
      type: String
    }
  },
  mounted () {
  },
  watch: {
    teaAttrSelect (val) {
      this.isSelect = val
    }
  },
  methods: {
    checkType (item) {
      this.isSelect = Object.assign({ productCount: this.isSelect.productCount, productOrderId: this.isSelect.productOrderId }, item)
    },
    close () {
      this.$emit('update:attrLayerShow', false)
      this.isSelect = this.teaAttrSelect
    },
    sureAttrSelect () {
      const option = {
        productOrderId: this.isSelect.productOrderId,
        userId: this.user.userId,
        productCount: this.isSelect.productCount,
        attrId: this.isSelect.attrId
      }
      this.$axios.$post(upCartcount, option).then(res => {
        if (res.code === 10000) {
          this.$emit('needUpdateList')
          this.$emit('update:attrLayerShow', false)
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  components: {

  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';

.detail-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 105;
    background-color: #fff;
    &.toggle-enter-active,
    &.toggle-leave-active {
      transition: all 0.5s;
    }
    &.toggle-enter,
    &.toggle-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    .pro-title {
      position: relative;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      padding: 0 25px;
      .pro-img {
        position: absolute;
        top: -0.63rem;
        left: 15px;
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
        font-size: 12px;
        height: 1rem;
        .price {
          display: block;
          line-height: 0.78rem;
          color: #d45949;
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
          line-height: 1rem;
          font-size: 14px;
        }
      }
    }
    .selected {
      margin-top: 0.45rem;
      padding: 0 25px;
      .title {
        font-size: 14px;
      }
      .btn-wrap {
        margin: 15px 0 25px;
        font-size: 0;
        height: 3rem;
        overflow: scroll;
        .btn {
          display: inline-block;
          vertical-align: top;
          margin-right: 10px;
          margin-bottom: 10px;
          min-width: 1.5rem;

          box-sizing: border-box;
          text-align: center;
          line-height: 0.48rem;
          font-size: 12px;
          color: #333;
          span {
            display: block;
            width: 100%;
            height: 100%;
            padding: 0rem 5px;
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
    .btns {
      width: 100%;
      height: 44px;
      line-height: 44px;
      margin: 20px auto 0;
      text-align: center;
      &.cash {
        color: #fff;
        background-color: #d45949;
      }
    }
  }
}
</style>
