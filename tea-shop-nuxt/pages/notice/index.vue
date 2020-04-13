<template>
   <section class="content" ref="content">
     <backbar bgColor="#fff" leftColor="#333" title="通知" @setHeight="setHeight"/>
      <div class="imgWrap">
        <img :src="require('~/assets/img/notice/01.jpg')" width="100%">
      </div>
      <div class="imgWrap">
        <img :src="require('~/assets/img/notice/02.jpg')" width="100%">
      </div>
      <div class="imgWrap">
        <img :src="require('~/assets/img/notice/03.jpg')" width="100%">
      </div>
      <div class="imgWrap">
        <img :src="require('~/assets/img/notice/04.jpg')" width="100%">
      </div>
      <div class="imgWrap">
        <img :src="require('~/assets/img/notice/05.jpg')" width="100%">
      </div>
    </section>
</template>

<script>
import backbar from '~/components/backbar'
export default {
  data() {
    return {

    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    setHeight(height) {
      this.$refs.content.style.paddingTop = `${(40 + height) / 37.5}rem`
    }
  },
  components: {
    backbar
  }
}
</script>

<style scoped lang='scss'>
.content{
  font-size: 0;
  padding-top: 45px;
}
</style>
