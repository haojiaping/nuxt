<template>
   <section class="goodItem df">
     <img :src="pro.image" alt="">
     <div class="proinfo">
       <p class="f14 name fw500">{{pro.productName}}</p>
       <div class="desc f12 fw400">{{pro.productDescription}}</div>
       <div class="attr df">
         <p>
           <span>{{typeText[0]}}:</span>
           <span style="color:#C92E40;">￥</span><span style="color:#C92E40;" class="fw600 f22">{{pro.productPrice}}</span>
         </p>
         <p class="lastattr">
           <span>{{typeText[1]}}:</span>
           <span style="color:#C92E40;">￥</span><span style="color:#C92E40;" class="fw600 f22">{{pro.bigPrice}}</span>
         </p>
       </div>
       <div class="btn tac cf f15 fw500" @click="jump">去屯茶</div>
     </div>
   </section>
</template>

<script>
export default {
  name: 'goodLarge',
  data() {
    return {

    }
  },
  props: {
    pro: {
      type: Object
    },
    typeText: {
      type: Array,
      default: () => {
        return ['单饼', '一提']
      }
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    jump() {
      this.$router.push(`/${this.pro.productId}`)
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.goodItem{
  margin:10px;
  padding: 16px 10px;
  background: #fff;
  border-radius:5px;
  align-items: center;
  img{
    flex: 0 0 120px;
    width: 120px;
    height: 120px;
  }
  .proinfo{
    margin-left: 10px;
    .name{
      color: #1F3950;
      line-height: 18px;
      @include text-over(2);
    }
    .desc{
      color: #1F3950;
      // height:31px;
      // line-height:31px;
      padding: 10px 7px;
      background: #F0F7FA;
      margin: 10px 0;
      @include text-over(2);
    }
    .attr{
      margin: 10px 0;
      .lastattr{
        margin-left: 10px;
      }
    }
    .btn{
      width:200px;
      height:31px;
      line-height:31px;
      background:rgba(201,46,64,1);
      border-radius:16px;
    }
  }
}
</style>
