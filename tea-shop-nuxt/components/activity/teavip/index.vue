<template>
  <div class="bottom df"
       v-if="dataList">
    <!-- 头部第一个 -->
    <div class='top-product'
         v-for='(item,index) in dataTopList'
         :key="`__${index}`">
      <img :src="item.productImage"
           alt=""
           @click="jumpDetail(item.productId)"
           class='product-img van-hairline--surround'>
      <div class='product-msg'>
        <p class='product-title'
           @click="jumpDetail(item.productId)">{{item.productName}}</p>
        <p class='dec'>{{item.productDescription}}</p>
        <p class='product-price'>¥{{item.productPrice}}</p>
        <div class='product-bottom'>
          <p class='product-desc'><span></span></p>
          <p class='grap'
             @click="jumpDetail(item.productId)"></p>
        </div>
      </div>
    </div>

    <!-- 下边多个 -->
    <div class='top-product bottomList'
         v-for='(item,index) in dataList'
         v-if='index>0'
         :class="[(index%2===0)?'myborderbottom':'myborderrightbottom',index===(dataList.length-2)||index===(dataList.length-1)?'border-none':'']"
         :key="index">
      <img :src="item.productImage"
           alt=""
           @click="jumpDetail(item.productId)"
           class='product-img'>
      <div class='product-msg'>
        <p class='product-title'
           @click="jumpDetail(item.productId)">{{item.productName}}</p>
        <p class='dec'>{{item.productDescription}}</p>
        <div class='product-bottom'>
          <p class='product-price'>¥{{item.productPrice}}</p>
            <p class='product-desc'><span></span></p>

        </div>
        <div class='big'
             @click="jumpDetail(item.productId)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  data () {
    return {
      productId: '',
      attrId: '',
      productList: []
    }
  },
  props: {
    dataTopList: {
      type: Array
    },
    dataList: {
      type: Array
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    voucher: {
      type: String
    }
  },
  activated () {
  },
  watch: {

  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    }
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    // dataTopList () {
    //   if (this.isCenter) {
    //     return []
    //   } else {
    //     return [this.dataList[0]]
    //   }
    // },
    dataBottomList () {
      if (this.isCenter) {
        return this.dataList
      } else {
        this.dataList.filter((item, index) => {
          return index > 0
        })
        return this.dataList
      }
    }
  }
  // filters: {
  //   changePrice (value) {
  //     value = Number(value)
  //     if (value >= 200) {
  //       value -= 100
  //     } else if (value < 200 && value >= 150) {
  //       value -= 50
  //     } else if (value < 150 && value >= 100) {
  //       value -= 20
  //     }
  //     return value
  //   }
  // }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
@mixin title {
}
.semWraper {
  .bottom {
    margin: 10px;
    position: relative;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 0;
    .top-product {
      background: #fff;
      display: flex;
      justify-content: center;
      padding: 10px;
      width: 100%;
      border-bottom: 1px solid #FBECD6;
      .product-img {
        width: 140px;
        height: 140px;
        &.van-hairline--surround:after{
          border-color:  #FBECD6;
        }
      }
      .product-msg {
        flex: 1;
        padding-left: 10px;
        .product-title {
          height: 35px;
          color: rgba(114, 39, 7, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 12px;
        }
        .dec {
          font-weight: 500;
          color: rgba(114, 39, 7, 1);
          line-height: 20px;
          font-size: 16px;
          margin-top: 13px;
          height: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-price {
          color: #eb3531;
          font-size: 22px;
          margin-top: 10px;
          span {
            display: inline-block;
            padding-left: 5px;
          }
        }
        .product-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin:5px 0;
          .product-price{
            margin:0;
          }
          .product-desc {
            span {
              font-size: 13px;
              color: #a66a46;
              display: inline-block;
            }
          }
          .grap {
            width: 81px;
            height: 29px;
            @include bg-image('activity/teavip/smallbtn');
          }
          .product-none {
            background: #ccc;
          }
        }
          .big{
            width:155px;
            height:32px;
            @include bg-image-size('activity/teavip/bigbtn');
            background-size: 100% 100%;
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
    .bottomList {
      width: 50%;
      flex-direction: column;
      box-sizing: border-box;
      &.myborderrightbottom{
        border-right: 1px solid #FBECD6;
        border-bottom: 1px solid #FBECD6;
      }
      &.myborderbottom{
        border-bottom: 1px solid #FBECD6;
      }
      .product-img {
        width: 155px;
        height: 155px;
      }
      .product-msg {
        padding-left: 0;
        .dec {
          margin-top: 9px;
        }
        .product-title {
          margin-top: 9px;
        }
      }
    }
  }
}
</style>
