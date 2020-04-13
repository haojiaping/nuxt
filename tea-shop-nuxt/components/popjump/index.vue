<template>
   <section>
     <van-popup v-model="show" round>
       <div class="popContent df">
         <div class="colse" @click="close"></div>
         <div class="orderbg"></div>
         <p class="c3 f18 title">需前往茶臻选App查看订单</p>
         <p class="c3 f14 tip" >在App内还可随时查看订单物流信息哦~</p>
         <div class="btn tac cf f17" @click="jumpToAPP">前往APP</div>
       </div>
     </van-popup>
   </section>
</template>

<script>
import { JUMPTOAPPURL } from '~/config/downapp'
export default {
  name: 'popjump',
  data() {
    return {
      show: false
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    close() {
      this.show = false
    },
    jumpToAPP() {
      window.location.href = `${JUMPTOAPPURL}`
      // const option = {
      //   jumpType: 'webViewX5',
      //   jumpContent: {
      //     url: 'https://www.baidu.com'
      //   }
      // }
      // window.location.href = `https://www.chazhenxuan.com/downapp.html?${JSON.stringify(option)}`
      // window.location.href = TXAppStore
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.popContent{
  width: 300px;
  height: 300px;
  background: #fff;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px 28px 10px;
  .colse{
    width: 22px;
    height: 22px;
    @include bg-image('downapp/close');
    align-self: flex-end;
    margin: 5px;
  }
  .orderbg{
    width: 70px;
    height: 79px;
    @include bg-image('downapp/order');
    margin: 10px 0;
  }
  .title{
    margin-top: 25px;
  }
  .tip{
    margin:14px 0 29px;
  }
  .btn{
    width:255px;
    height:45px;
    line-height:45px;
    background:rgba(212,89,73,1);
    border-radius:5px;
  }
}
</style>
