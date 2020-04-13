<template>
   <section class="typedetail">
     <backbar bgColor="#fff" leftColor="#333" :title="$route.query.name" :shartOption="shartOption" @setHeight="setHeight"/>

     <div class="listWrap mescroll pf" ref="mescroll">
      <div class="listSub" ref="listSub">
        <productList :dataList="dataList"></productList>
      </div>
    </div>
   </section>
</template>

<script>
import productList from '~/components/productList'
import backbar from '~/components/backbar'
import { getSpecial } from '~/api/special'
export default {
  data() {
    return {
      mescroll: null,
      shartOption: {}
    }
  },
  async asyncData ({ $axios, route }) {
    const option = {
      specialType: route.query.type,
      lastId: 0
    }
    const listData = (await $axios.$post(getSpecial, option)).data
    return { dataList: listData }
    // eslint-disable-next-line no-unreachable
    console.log(option.specialType)
  },
  mounted() {
    console.log(this.$route)
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    setHeight(height) {
      this.$refs.mescroll.style.top = `${(51 + height) / 37.5}rem`
    },
    productList(page, mescroll) {
      const option = {
        specialType: this.$route.query.type,
        lastId: 0
      }
      const jump = sessionStorage.getItem('__special_h__')
      sessionStorage.removeItem('__special_h__')
      console.log(jump)
      this.$axios.$post(getSpecial, option).then(res => {
        this.dataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            this.mescroll.endSuccess(arr.length)
            if (jump) {
              this.$refs.mescroll.scrollTop = jump
            }
            // eslint-disable-next-line indent
               console.log(this.$refs.mescroll.scrollTop)
            // mescroll.endSuccess(0)
          })
        } else {
          this.$toast(res.message)
          this.mescroll.endErr()
        }
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          callback: this.productList
        },
        up: {
          callback: this.upCallback,
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
    },
    upCallback() {
      this.mescroll.endSuccess(20, false)
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
.typedetail{

    .listWrap{
      top: 56px;
      bottom: 0;
      left: 0;
      height: auto;
      .listSub{
        margin: 0 10px;
      }
    }
}
</style>
