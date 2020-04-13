<template>
   <div class="linelistWraper border-bottom df" @click="jumpDetail">
     <div class="left df">
      <img :src="datas.productImage" style="width:45px;height:45px;" mode="widthFix" class="imageWrap">
       <div class="sub f15 df">
         <p class="name">{{datas.productName}}</p>
         <p class="ctea">¥ {{datas.productPrice}}</p>
       </div>
     </div>
    <van-icon name="arrow" color="#999" size="20px"/>
   </div>
</template>

<script>
export default {
  name: 'linelist',
  data() {
    return {

    }
  },
  props: ['datas'],
  mounted() {

  },
  watch: {

  },
  methods: {
    jumpDetail(productId) {
      uni.navigateTo({
          url: `/pages/detail/detail?id=${this.datas.productId}`
          // url: `/pages/detail/detail?id=2019031414335488019000029`
      });
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.linelistWraper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 5px 10px;
  box-sizing: border-box;
  .left{
    width: 90%;
    .imageWrap{
      flex: 0 0 45px;
    }
    .sub {
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      .name{
        @include text-over(1);
      }
    }
  }
}
</style>
