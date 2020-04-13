<template>
  <div class="bottom df"
       v-if="dataList">
    <!-- 头部第一个 -->
    <div class='top-product border-bottom'
         v-for='(item,index) in dataTopList'
         :key="`__${index}`">
      <img :src="item.image"
           alt=""
           @click="jumpDetail(item.productId,$event)"
           class='product-img'>
      <div class='product-msg'>
        <p class='product-title'
           @click="jumpDetail(item.productId,$event)">{{item.productName}}</p>
        <p class='dec'>{{item.productDescription}}</p>
        <p class='product-price'>某东某宝&nbsp;&nbsp;¥{{item.discountsPrice}}</p>
        <div class='product-bottom'>
          <p class='product-desc'>直减后:<em>¥</em><span>{{item.productPrice}}</span></p>
          <p class='grap'
             @click="jumpDetail(item.productId,$event)"></p>
        </div>
      </div>
    </div>

    <!-- 下边多个 -->
    <div class='top-product bottomList'
         v-for='(item,index) in dataBottomList'
         :class="[(index%2===0)?'border-rightbottom':'border-bottom',index===(dataList.length-2)||index===(dataList.length-1)?'border-none':'']"
         :key="index">
      <img :src="item.image"
           alt=""
           @click="jumpDetail(item.productId,$event)"
           class='product-img'>
      <div class='product-msg'>
        <p class='product-title'
           @click="jumpDetail(item.productId,$event)">{{item.productName}}</p>
        <p class='dec'>{{item.productDescription}}</p>
        <p class='product-price'>某东某宝&nbsp;&nbsp;¥{{item.discountsPrice}}</p>
        <div class='product-bottom'>
          <p class='product-desc'>直减后:<em>¥</em><span>{{item.productPrice}}</span></p>
        </div>
        <p class='grap-bottom'
           @click="jumpDetail(item.productId,$event)"></p>
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
    dataList: {
      type: Array
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    voucher: {
      type: Number
    }
  },
  activated () {
  },
  watch: {

  },
  methods: {
    jumpDetail (productId, e) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
      // eslint-disable-next-line no-undef
      const p = e.target.parentNode.offsetTop + 300
      sessionStorage.setItem('__special_h__', p)
      console.log(p)
      console.log(e)
    }
  },
  // myjump() {
  //   const jump = sessionStorage.getItem('__special_h__')
  //   sessionStorage.removeItem('__special_h__')
  //   this.$nextTick(() => {
  //     if (jump) {
  //       this.$refs.mescroll.scrollTop = jump
  //     }
  //   })
  // },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    dataTopList () {
      if (this.isCenter) {
        return []
      } else {
        return [this.dataList[0]]
      }
    },
    dataBottomList () {
      // const jump = sessionStorage.getItem('__special_h__')
      // sessionStorage.removeItem('__special_h__')
      let arr = []
      if (this.isCenter) {
        return this.dataList
      } else {
        arr = this.dataList.filter((item, index) => {
          return index >= 1
        })
        return arr
      }
      // eslint-disable-next-line no-unreachable
      // this.$nextTick(() => {
      //   if (jump) {
      //     // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      //     this.$refs.mescroll.scrollTop = jump
      //   }
      // })
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
      background: #efcc8c;
      display: flex;
      justify-content: center;
      padding: 10px;
      width: 100%;
      .product-img {
        width: 140px;
        height: 140px;
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
          color: #a66a46;
          font-size: 13px;
          margin-top: 10px;
          text-decoration: line-through;
        }
        .product-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .product-desc {
            font-size: 13px;
            color: #a66a46;
            em {
              color: #d20015;
              display: inline-block;
              margin-left: 5px;
            }
            span {
              font-size: 22px;
              color: #d20015;
              font-weight: bold;
              display: inline-block;
              margin-left: 3px;
            }
          }
          .grap {
            width: 81px;
            height: 30px;
            @include bg-image-size('activity/bigstraight/grap2');
            background-size: 100% 100%;
          }
          .product-none {
            background: #ccc;
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
    .bottomList {
      width: 50%;
      flex-direction: column;
      box-sizing: border-box;
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
        .grap-bottom {
          width: 155px;
          height: 32px;
          margin-top: 15px;
          @include bg-image-size('activity/bigstraight/grap1');
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
