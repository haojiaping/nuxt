<template>
  <div class="bottom"
       :class='color'
       v-if="dataList">
    <div class="bottomItem"
         :class="index%2===0?'':'flexChange'"
         v-for="(item,index) in dataList"
         :key="index"
         @click="jumpDetail(item.productId)">
      <img :src="item.image"
           alt="">
      <div class='right'>
        <p class="bottomtitle">{{item.title}}</p>
        <p class="dec">{{item.productTitle}}</p>
        <div class='product-bottom'>
          <p class="itemprice">
            <i class='left'>臻选价:</i>
            <span class="f12">¥</span>
            <span class="fw600 font44">{{item.productPrice}}</span>
          </p>
          <p class='toLook'>
            <span>查看详情</span>
          </p>
        </div>
      </div>
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
      productList: []
    }
  },
  props: {
    dataList: {
      type: Array
    },
    color: {
      type: String
    },
    specialType: {
      type: String
    },
    title: {
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
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
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
$man: #dff7ff;
$woman: #fee5ed;
@mixin icon-change($url) {
  background-image: url('~assets/img/activity/teapot/'+$url+'.png');
  @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
    background-image: url('~assets/img/activity/teapot/'+$url+'@2x.png');
  }
}
.bottom {
  margin: 10px;
  position: relative;
  margin-top: 0;
  padding: 4px;
  .bottomItem {
    width: 100%;
    background: #e5dacd;
    border-radius: 5px;
    display: flex;
    padding: 14px;
    box-sizing: border-box;
    margin-top: 10px;
    border: 1px solid #c9a47a;
    img {
      width: 100px;
      height: 100px;
    }
    .right {
      margin-left: 10px;
      .bottomtitle {
        // padding-bottom: 10px;
        min-height: 31px;
        line-height: 20px;
        width: 209px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(1, 1, 1, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .line {
        height: 1px;
        @include icon-change('border');
        background-repeat: repeat;
        margin-top: 5px;
      }
      .dec {
        min-height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
        // margin-top: 5px;
      }
      .product-bottom {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .itemprice {
          .left {
            width: 43px;
            height: 12px;
            font-size: 13px;
            color: rgba(51, 51, 51, 1);
            line-height: 18px;
          }
          height: 20px;
          line-height: 20px;
          .font44 {
            font-size: 22px;
          }
          span {
            color: rgba(192, 56, 50, 1);
          }
        }
        .toLook {
          width: 80px;
          height: 22px;
          background: rgba(192, 56, 50, 1);
          border-radius: 22px;
          text-align: center;
          color: rgba(229, 218, 206, 1);
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          /deep/.van-icon {
            margin-left: 2px;
          }
        }
      }
    }
  }
  .flexChange {
    flex-direction: row-reverse;
    .right {
      margin-left: 0;
      margin-right: 10px;
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
.show-more {
  background: #e3d6bc;
  display: flex;
  width: 189px;
  height: 37px;
  border: 1px solid rgba(140, 83, 48, 1);
  border-radius: 37px;
  justify-content: center;
  align-items: center;
  margin: auto;
  top: 15px;
  position: relative;
  p {
    color: rgba(45, 127, 185, 1);
    font-size: 14px;
    color: rgba(140, 83, 48, 1);
  }
  .arrow {
    width: 6px;
    font-size: 16px;
    color: rgba(140, 83, 48, 1);
  }
}
</style>
