<template>
   <section class="pinpaiWrap">
     <backbar :title="name" :shartOption="shartOption" @setHeight="setHeight"/>

     <div class="mescroll" ref="mescroll">
       <div>
          <div id="upscrollWarp" class="upscrollWarp">
            <!--展示上拉加载的数据列表-->
            <productList :dataList="dataList"></productList>

          </div>

       </div>
     </div>
   </section>
</template>

<script>
import productList from '~/components/productList'
import backbar from '~/components/backbar'
import { operate } from '~/api/special'
export default {
  data() {
    return {
      dataList: [],
      navActive: 0,
      mescroll: null,
      shartOption: {},
      name: '',
      operationId: ''
    }
  },
  mounted() {
    this.operationId = this.$route.query.operationId
    this.name = this.$route.query.name
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    setHeight(height) {
      this.$refs.mescroll.style.top = `${(46 + height) / 37.5}rem`
    },
    productList(page, mescroll) {
      const pageNum = page.num - 1
      const option = {
        operationId: this.operationId,
        pageNum: pageNum
      }
      this.$axios.$post(operate, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
            // mescroll.endSuccess(0)
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          callback: this.productList,
          isBounce: false,
          lazyLoad: {
            use: true
          },
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 // 每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">茶有底，道无尽。</p>',
          toTop: { // 配置回到顶部按钮
            warpClass: 'mescroll-totop-home',
            src: require('~/assets/img/common/toTop.png') // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
          }
        }
      })
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {
    productList,
    backbar
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.pinpaiWrap{

    .mescroll {
      position: fixed;
      top: 46px;
      bottom: 0;
      height: auto;
      /deep/ .mescroll-empty {
        top: 57%;
      }
    }
    .upscrollWarp{
      margin:10px;
    }

}
</style>
