<template>
  <div class="bottom df"
       v-if="dataList">
    <div class="bottomItem"
         v-for="(item,index) in dataList"
         :key="index"
         :class="[(index%2===0)?'border-rightbottom':'border-bottom',index===(dataList.length-2)||index===(dataList.length-1)?'border-none':'',]"
         @click="jumpDetail(item.productId)">
      <img :src="item.productImage"
           alt="">
      <img :src="require('~/assets/img/activity/newkezhuce/none.png')"
           class='showNone'
           v-if='item.inventoryCount<1'
           alt="">
      <p class="border-top bottomtitle">{{item.productName}}</p>
      <p class="dec">{{item.productDescription}}</p>
      <!-- <div class="sign-wrapper">
        <van-tag v-for="(tag,index) in splitTag(item.productTitle)"
                 :key="index"
                 type="danger">{{tag}}</van-tag>
      </div> -->
      <div class='product-bottom'>
        <p class="itemprice"><span class='price-text'>券后价:</span>
          <span class='price-left'>¥</span>
          <span class='price-right'>{{parseInt(item.productPrice-price) === parseFloat(item.productPrice-price)?parseInt(item.productPrice-price):(item.productPrice-price).toFixed(1)}}</span>
        </p>
        <p class='price-daliy'>
          <span>市场价:</span><span>¥{{item.productPrice}}</span>
        </p>
        <!-- <span class='sales-volume'>销量<span class='text'>{{item.saleNum}}</span></p> -->
        <p class='grap'
           @click="jumpDetail(item.productId)"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  data () {
    return {
      splitTag (tags) {
        if (tags) {
          return tags.split(',')
        }
      }
    }
  },
  props: {
    dataList: {
      type: Array
    },
    price: {
      type: Number
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
        specialType: 42,
        shopId: this.$route.query.shopId
      }
      sessionStorage.setItem('_shopId_', JSON.stringify(params))
    }
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.semWraper {
  .top-img {
    img {
      width: 100%;
      font-size: 0;
    }
  }
  .bottom {
    margin: 0 10px;
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
      background: #fff;
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
      .bottomtitle {
        padding-top: 10px;
        line-height: 17px;
        height: 32px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
      }
      .dec {
        line-height: 20px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        height: 36px;
        font-size: 16px;
        margin-top: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .tagWraper {
        margin: 10px 0;
      }
      .sign-wrapper {
        height: 20px;
        font-size: 12px;
        margin: 5px 0;
        /deep/ .van-tag {
          margin-left: 5px;
        }
      }
      .product-bottom {
        // display: flex;
        // justify-content: space-between;
        margin-top: 5px;
        .itemprice {
          color: #333;
          font-size: 16px;
          .price-text {
            font-size: 13px;
          }
          .price-left {
            font-size: 13px;
            color: #e01d1d;
          }
          .price-right {
            font-size: 22px;
            color: #e01d1d;
            font-weight: 600;
          }
        }
        .price-daliy {
          color: rgba(51, 51, 51, 1);
          line-height: 18px;
          font-size: 13px;
          text-decoration: line-through;
        }
        .grap {
          @include bg-image-size('activity/newkezhuce/grap');
          width: 108px;
          height: 36px;
          margin: 0 auto;
          background-size: 100% 100%;
          margin-top: 10px;
        }
        .sales-volume {
          font-size: 10px;
          color: #999;
          vertical-align: middle;
          line-height: 15px;
          padding-right: 5px;
          .text {
            display: inline-block;
            padding-left: 0.1rem;
          }
        }
      }
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
