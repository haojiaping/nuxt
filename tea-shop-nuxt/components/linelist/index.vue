<template>
   <div class="linelistWraper border-bottom df" @click="jumpDetail">
     <div class="left df">
      <img :src="datas.productImage" alt="">
       <div class="sub tover">
         <p class="tover">{{datas.productName}}</p>
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
      this.$router.push({ path: `/${this.datas.productId}` })
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
  background: #fff;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  .left{
    width: 90%;
    img{
      flex: 0 0 45px;
      height: 45px;
      margin-right: 10px;
    }
    .sub {
      :first-child {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
