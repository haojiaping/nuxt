<template>
   <view>
      <web-view :src="url"></web-view>
   </view>
</template>

<script>
export default {
  data() {
    return {
      url:''
    }
  },
  onLoad(option) {
    console.log(option.url);
    this.url = option.url
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang='scss'>

</style>
