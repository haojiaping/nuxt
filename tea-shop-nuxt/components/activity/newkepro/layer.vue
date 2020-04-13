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
          <div class="pro-img van-hairline--surround">
            <img :src="isSelect.imageUrl" v-if="isSelect.imageUrl"
                 alt="">
          </div>
          <div class="pro-desc">
            <p class="f14 name">{{name}}</p>
            <p class="pri " v-if="isSelect.discountStatus===1">
              <span class="f16">新人价: ￥</span><span class="fw600 f22">{{isSelect.discountPrice}}</span>
              <!-- <span class="fw600 f18" style="text-decoration: line-through;margin-left:10px;">
                <span class="f16">￥</span>{{isSelect.productPrice||isSelect.unitPrice}}
              </span> -->
            </p>
            <p class="pri " v-else>
              <span class="f16">￥</span><span class="fw600 f22">{{isSelect.productPrice||isSelect.unitPrice}}</span>
            </p>
          </div>
          <!-- <div class="pro-desc"
               v-if="isSelect.productPrice||isSelect.unitPrice">
            <span class="price">&yen; {{isSelect.productPrice||isSelect.unitPrice}}</span>
            <span class="pro">
              <em>已选：{{isSelect.productStyle}}</em>
              <em>数量：{{isSelect.productCount}}</em>
            </span>
          </div> -->
        </div>
        <!-- 商品类型 -->
        <div class="selected">
          <span class="title">规格</span>
          <div class="btn-wrap mescroll-touch">
            <div class="btn border"
                 :class="isSelect.attrId===item.attrId?'actice':''"
                 v-for="(item,index) in productAttrList"
                 :key="`type_${index}`"
                 @click="checkType(item)">
              <span >{{item.productStyle}}</span>
            </div>
            <!-- <span class="border">170g*3饼</span> -->
          </div>
        </div>
        <div class="btns f18 cash"
             @click="sureAttrSelect">确定</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'layer',
  data () {
    return {
      isSelect: {},
      attrLayerShow: false,
      productAttrList: [],
      name: ''
    }
  },
  props: {
    teaAttr: {
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
      this.attrLayerShow = false
    },
    sureAttrSelect () {
      this.isSelect.productName = this.name
      this.$emit('suregood', this.isSelect)
      this.attrLayerShow = false
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
  z-index: 2005;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2006;
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
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      padding: 10px 25px;
      box-sizing: border-box;
      .pro-img {
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
        flex: 1;
        font-size: 12px;
        height: 80px;
        padding: 0 25px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name{
          color: #722707;
          @include text-over(2)
        }
        .pri{
          color: #A41200;
        }
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
          line-height: 50px;
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
          font-size: 15px;
          color: #333;
          padding: 6px 10px;
            &:before {
              border-color: #ccc;
            }
          span {
            display: block;
            width: 100%;
            height: 100%;
            padding: 0 5px;
            box-sizing: border-box;
            &:before {
              border-color: #ccc;
            }
          }
          &.actice {
            background: #A41200;
            color: #fff;
            .border:before {
              border-color: #A41200;
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
        background-color: #A41200;
      }
    }
  }
}
</style>
