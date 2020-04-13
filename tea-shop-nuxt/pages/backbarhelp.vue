<template>
   <div  style="background:#f2f2f2;">
     <backbar title="sadasda" bgColor="transparent" :fixed="false">
       <span slot="title">
         <span>商品</span>
         <span>详情</span>
       </span>
     </backbar>
     <backbar :fixed="false"></backbar>
     <backbar title="收获地址" :fixed="false"></backbar>
     <backbar rightText="删除" :fixed="false"></backbar>
     <backbar leftImg="back" rightImg="share" :fixed="false"></backbar>
     <backbar bgColor="#ccc" :fixed="false"></backbar>
     <backbar bgColor="#ccc" leftColor="#fff" :fixed="false"></backbar>
     <van-button type="default" @click="testtoutiao">头条测试</van-button>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
export default {
  name: 'backbarhelp',
  data() {
    return {

    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    testtoutiao(){
      meteor.track('shopping', {convert_id: 1644993639783492 })
    }
  },
  components: {
    backbar
  }
}
</script>

<style scoped lang='scss'>

</style>
