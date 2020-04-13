<template>
   <section>
     <PostContent :serviceId="serviceId" :pageDatas="datas"></PostContent>
   </section>
</template>

<script>
import { detail } from '~/api/post'
import PostContent from '~/components/tiezi/PostContent'
export default {
  data() {
    return {
      serviceId: ''
    }
  },
  // 异步获取数据
  async asyncData ({ $axios, route, store }) {
    try {
      const datas = await $axios.$post(detail, {
        serviceId: route.params.postId || '',
        userType: 0,
        userId: ''
      })
      return {
        datas: datas.data
      }
    } catch (error) {
      console.log(error)
    }
  },
  mounted() {
    this.serviceId = this.$route.params.postId
  },
  watch: {

  },
  methods: {

  },
  components: {
    PostContent
  }
}
</script>

<style scoped lang='scss'>

</style>
