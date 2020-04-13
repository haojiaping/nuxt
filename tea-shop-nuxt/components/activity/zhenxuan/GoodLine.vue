<template>
  <div class="good van-hairline--bottom"
       @click="jumpToDetail">
    <!-- <img :src="datas.productImage" alt=""> -->
    <img :src="datas.image">
    <div class="goodInfo">
      <p class="name">{{datas.title}}</p>
      <p class="dec">{{datas.introduce}}</p>
      <div class="price">
        <span>¥</span>
        <span>{{datas.productPrice}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  name: 'GoodLine',
  data () {
    return {

    }
  },
  props: {
    datas: {}
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    jumpToDetail () {
      this.$router.push({ path: `/${this.datas.productId}`, query: { gobackMyback: this.gobackMyback } })
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
.good {
  display: flex;
  margin: 0.2rem 0.4rem;
  padding: 0.3rem 0;
  background: #fff;
  position: relative;
  img {
    height: 1.9rem;
    background: #ccc;
    flex: 0 0 1.9rem;
  }
  .name {
    font-size: 0.3rem;
    line-height: 0.35rem;
    font-weight: 400;
    margin: 0.1rem 0.1rem 0.3rem 0.3rem;
  }
  .dec {
    font-size: 0.24rem;
    font-weight: 400;
    color: #666;
    margin: 0.1rem 0 0.3rem 0.3rem;
  }
  .price {
    margin-left: 0.2rem;
    color: #d45949;
    font-size: 0.3rem;
    margin: 0.6rem 0 0 0.3rem;
  }
}
</style>
