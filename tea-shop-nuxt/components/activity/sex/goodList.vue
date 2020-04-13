<template>
  <div class="bottom df"
       :class='color'
       v-if="dataList">
    <div class="bottomItem"
         v-for="(item,index) in dataList"
         :key="index"
         v-if='index<num'
         :class="[(index%2===0)?'border-rightbottom':'border-bottom',index===(dataList.length-2)||index===(dataList.length-1)?'border-none':'']"
         @click="jumpDetail(item.productId)">
      <img :src="item.image"
           alt="">
      <p class="f15 fw400 border-top bottomtitle">{{item.title}}</p>
      <div class='product-bottom'>
        <p class="itemprice">
          <span class="f12 fw600">¥</span>
          <span class="f15 fw600">{{item.productPrice}}</span>
        </p>
      </div>
    </div>
    <div class='show-more'
         v-show='isShow'
         @click='showMoreData'>
      <p>点击查看更多</p>
      <van-icon name="arrow"
                class='arrow' />
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
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    showMoreData () {
      this.num = 10
      this.flag = false
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
@import '~/assets/css/variable.scss';
$man: #dff7ff;
$woman: #fee5ed;
.bottom {
  margin: 10px;
  position: relative;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0;
  padding: 4px;
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
    .bottomtitle {
      padding-top: 10px;
      height: 35px;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      color: #333;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tagWraper {
      margin: 10px 0;
    }
    .sign-wrapper {
      height: 20px;
      overflow: hidden;
      font-size: 12px;
      margin: 5px 0;
      .sign {
        padding: 2px 10px;
        float: left;
        margin-right: 5px;
        color: #d45949;
        &:before {
          border-color: #d45949;
        }
      }
    }
    .product-bottom {
      display: flex;
      justify-content: space-between;
      .itemprice {
        color: #d45949;
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
      }
      .sales-volume {
        font-size: 10px;
        color: #999;
        vertical-align: middle;
        line-height: 15px;
        padding-right: 5px;
        .text {
          display: inline-block;
          padding-left: 5px;
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
.show-more {
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  position: relative;
  &:after {
    //  单边框
    content: '';
    position: absolute;
    top: 0;
    border-top: 1px solid #fff;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  p {
    font-size: 15px;
    color: rgba(45, 127, 185, 1);
  }
  .arrow {
    width: 6px;
    font-size: 16px;
  }
}
.man {
  .border-rightbottom:before {
    border-right: 1px solid $man !important;
  }
  .show-more:after {
    border-color: $man !important;
  }
  .border-rightbottom::after,
  .border-bottom::before {
    border-bottom: 1px solid $man !important;
  }
  .show-more {
    p {
      color: rgba(45, 127, 185, 1);
    }
    .arrow {
      color: rgba(45, 127, 185, 1);
    }
  }
}
.woman {
  .border-rightbottom:before {
    border-right: 1px solid $woman !important;
  }
  .show-more:after {
    border-color: $woman !important;
  }
  .border-rightbottom::after,
  .border-bottom::before {
    border-bottom: 1px solid $woman !important;
  }
  .show-more {
    p {
      color: rgba(201, 96, 130, 1);
    }
    .arrow {
      color: rgba(201, 96, 130, 1);
    }
  }
}
</style>
