<template>
  <section class="prolistWrap df"
           :style="{background:bgcolor}">
    <view  class="prolistItem df pr"
               :style="{width:width}"
               v-for="(pro, index) in dataList"
               :key="index"
               :class="index%2===0?'margin':''" @click="jumpTodetail(pro)">
      <img class="imgItem"
           :src="pro.productImage||pro.image"
           :alt="pro.productName||pro.title">
      <div class="desc-wrapper border-top">
        <div class="desc">
          <span class="text">{{pro.productName||pro.title}}</span>
        </div>
        <div class="sign-wrapper df">
          <span class="sign border"
                v-for="(tag,index) in splitTag(pro.productTitle)"
                :key="index">{{tag}}</span>
        </div>
      </div>
      <div class="pri pa">
        ¥ {{pro.productPrice}}
      </div>
    </view>
  </section>
</template>

<script>
export default {
  name: 'productList',
  data () {
    return {

    }
  },
  props: {
    bgcolor: {
      type: String,
      default: '#fff'
    },
    // 决定一行显示几个商品
    width: {
      type: String,
      default: '50%'
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    jumpTodetail(pro){
      uni.navigateTo({
          url: `/pages/detail/detail?id=${pro.productId}`
          // url: `/pages/detail/detail?id=2019031414335488019000029`
      });
    },
    splitTag (tags) {
      if (tags) {
        return tags.split(',')
      }
    }
  },
  components: {

  },
  computed: {
  }
}
</script>

<style scoped lang='scss'>
.prolistWrap {
  flex-wrap: wrap;
  .prolistItem {
    flex-direction: column;
    padding: 13px 13px 30px;
    box-sizing: border-box;
    color: #333;
    background: #fff;
    margin-bottom: 20upx;
    border-radius: 10upx;
    // &:nth-child(2n) {
    //   &:before {
    //     border: 0;
    //   }
    // }
    .imgItem {
      width: 150px;
      height: 150px;
    }
    &.margin{
      margin-right: 2.5%;
    }
  }
  .desc-wrapper {
    margin-top: 10px;
    &:before {
      border-color: #cccccc;
    }
    .desc {
      padding: 10px 0 7px;
      overflow: hidden;
      font-size: 15px;
      .text {
        display: inline-block;
        // line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .sign-wrapper {
      overflow: hidden;
      margin-bottom: 5px;
      flex-wrap: wrap;
      .sign {
        padding: 2px 6px;
        margin: 0 5px 5px 0;
        color: #d45949;
        font-size: 10px;
        &:before {
          border-color: #d45949;
        }
      }
    }
  }
  .pri {
    color: #d45949;
    font-weight: bold;
    bottom: 10px;
  }
}
</style>
