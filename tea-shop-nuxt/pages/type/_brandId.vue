<template>
   <section class="typedetail">
     <backbar bgColor="#fff" leftColor="#333" :title="categoryName" :shartOption="shartOption" @setHeight='setHeight'/>
     <div class="navWraper pf" ref="navWraper">
        <div class="nav">
          <div class="nav-item df" @click="handChange(0)" :class="navActive===0?'active':''">
            <p>综合</p>
          </div>
          <div class="nav-item df" @click="handChange(1)" :class="(navActive===1||navActive===4)?'active':''">
            <p>销量</p>
            <i class="icon" :class="navActive===1?'down':'up'"></i>
          </div>
          <div class="nav-item df" @click="handChange(3)" :class="(navActive===3||navActive===6)?'active':''">
            <p>价格</p>
            <i class="icon" :class="navActive===3?'down':'up'"></i>
          </div>
        </div>
      </div>
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
import { getProductList } from '~/api/product'
import { category } from '~/assets/js/category'
export default {
  data() {
    return {
      mescroll: null,
      navActive: 0,
      shartOption: {},
      categoryName: ''
    }
  },
  async asyncData ({ $axios, route }) {
    let typeMeta = {}
    category.map(item => {
      if (item.id === route.params.brandId) {
        typeMeta = Object.assign({}, item)
      }
    })
    const option = {
      // categoryId: typeMeta.id,
      categoryId: route.params.brandId,
      pageNum: 0,
      orderSortType: 0
    }
    const listData = (await $axios.$post(getProductList, option)).data
    return { dataList: listData.productList, categoryName: listData.categoryName, typeMeta: typeMeta }
  },
  mounted() {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    setHeight(height) {
      this.$refs.navWraper.style.top = `${(41 + height) / 37.5}rem`
      this.$refs.mescroll.style.top = `${(85 + height) / 37.5}rem`
    },
    productList(page, mescroll) {
      const pageNum = page.num - 1
      const option = {
        categoryId: this.$route.params.brandId,
        pageNum: pageNum,
        orderSortType: this.navActive
      }
      this.$axios.$post(getProductList, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.data.productList
        if (res.code === 10000) {
          this.categoryName = res.data.categoryName
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
    },
    handChange(val) {
      switch (val) {
        case 0:
          this.navActive = val
          break
        case 1:
          this.navActive === 1 ? this.navActive = 4 : this.navActive = 1
          break
        case 2:
          this.navActive === 2 ? this.navActive = 5 : this.navActive = 2
          break
        case 3:
          this.navActive === 3 ? this.navActive = 6 : this.navActive = 3
          break
      }
      this.mescroll.resetUpScroll()
    }
  },
  head() {
    return {
      title: this.typeMeta.title ? this.typeMeta.title : this.categoryName,
      meta: [
        { hid: 'type-keywords', name: 'keywords', content: this.typeMeta.keywords ? this.typeMeta.keywords : '' },
        { hid: 'type-description', name: 'description', content: this.typeMeta.description ? this.typeMeta.description : '' }
      ]
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

    .navWraper {
      top: 46px;
      left: 0;
      right: 0;
      box-sizing: border-box;
      padding: 0 10px;
      background: #fff;
      .nav {
        display: flex;
        background: #fff;
        .nav-item {
          position: relative;
          width: 33.33%;
          text-align: center;
          margin: 0 6px;
          padding: 5px 10px;
          font-size: 15px;
          font-weight: 400;
          justify-content: center;
          align-items: center;
          &.active {
            font-weight: 600;
            font-size: 18px;
          }
          .icon {
            width: 6px;
            height: 14px;
            @include bg-image('home/default');
            background-size: cover;
            margin-left: 10px;
            &.down {
              @include bg-image('home/down');
            }
            &.up {
              @include bg-image('home/up');
            }
          }
        }
      }
    }

    .listWrap{
      top: 90px;
      bottom: 0;
      left: 0;
      height: auto;
      .listSub{
        margin: 0 10px;
      }
    }
}
</style>
