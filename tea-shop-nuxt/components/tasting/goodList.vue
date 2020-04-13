<template>
  <div class="bottom df border-top"
       :class='color'
       v-if="dataList">
    <div class="bottomItem"
         v-for="(item,index) in dataList"
         :key="index"
         :class="[(index%2===0)?'border-rightbottom':'border-bottom',index===0?'left-top':'',index===1?'right-top':'',
         index===(dataList.length-2)?'border-none':'',
         index===(dataList.length-1)?'border-none':'']"
         @click="jumpDetail(item)">
      <img :src="item.image"
           alt="">
      <p class="border-top bottomtitle">{{item.title}}</p>
      <p class='tag-wrapper'>
        <van-tag color="#999"
                 plain>市场价{{item.defaultProductAttr.productPrice}}元/{{item.defaultProductAttr.productStyle}}</van-tag>
      </p>
      <div class='product-bottom'>
        <p class="itemprice">
          <span class="price">¥&nbsp;{{item.productAttr.productPrice}}</span>
          <span class='product-attr'>/{{item.productAttr.productStyle}}</span>
          <span class='price-text'>(试饮价)</span>
        </p>

        <p class='add-btn'>
          <img :src="require('~/assets/img/tasting/icon4@2x.png')"
               alt="">
          <span>{{item.commentCount}}</span></p>
      </div>
      <span class='show-none'
            v-if='item.inventoryDeductCount<1'>已抢光</span>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  name: 'list',
  data () {
    return {
      flag: false,
      num: 4,
      productList: []
    }
  },
  props: {
    dataList: {
      type: Array
    },
    color: {
      type: String
    }
  },
  activated () {
    // this.getSpecialdata()
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    jumpDetail (item) {
      let smallAttr = {
        attrId: item.productAttr.attrId,
        productStyle: item.productAttr.productStyle,
        productPrice: item.productAttr.productPrice
      }
      smallAttr = JSON.stringify(smallAttr)
      this.$router.push({
        path: `/tasting/${item.productId}`,
        query: { gobackMyback: this.gobackMyback, smallAttr: smallAttr }
      })
    }
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    isShow () {
      const self_ = this
      if (this.dataList.length > this.num) {
        self_.flag = true
      }
      return this.flag
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';
$man: #dff7ff;
$woman: #fee5ed;
.bottom {
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
    padding: 13px;
    box-sizing: border-box;
    border-bottom: none;
    position: relative;
    img {
      width: 150px;
      height: 150px;
      margin-bottom: 13px;
    }
    .bottomtitle {
      padding-top: 10px;
      line-height: 18px;
      min-height: 33px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      color: #333;
      font-size: 15px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tag-wrapper {
      margin-top: 6px;
      /deep/ [class*='van-hairline']::after {
        border: none;
      }
      /deep/ .van-tag::after {
        border-radius: 0 !important;
      }
      /deep/ .van-tag {
        padding: 0;
      }
    }
    .product-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 18px;
      margin-top: 10px;
      .itemprice {
        display: flex;
        align-items: flex-end;
        .price {
          color: #d45949;
          font-weight: 600;
          font-size: 18px;
          line-height: 18px;
        }
        .product-attr {
          color: #d45949;
          font-size: 12px;
          display: inline-block;
          margin-left: 3px;
        }
        .price-text {
          color: #d45949;
          font-size: 12px;
          margin-left: 5px;
          box-sizing: border-box;
        }
      }

      .add-btn {
        height: 18px;
        font-size: 0;
        display: flex;
        align-items: center;
        img {
          height: 13px;
          width: 13px;
          margin-bottom: 0;
        }
        span {
          margin-left: 5px;
          display: inline-block;
          font-size: 12px;
          color: #999;
          height: 18px;
          line-height: 18px;
          vertical-align: middle;
        }
      }
    }
    .show-none {
      position: absolute;
      right: 8px;
      top: 9px;
      width: 54px;
      height: 18px;
      background: #999999;
      font-size: 12px;
      text-align: center;
      color: #fff;
      line-height: 18px;
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
</style>
