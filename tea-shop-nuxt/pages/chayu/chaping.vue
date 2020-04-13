<template>
   <div class="Wrap pa mescroll" ref="mescroll">
     <div>

      <div class="listWrap df">
        <div class="listItem" ref="left">
            <pingjiaItem v-for="(item,index) in dataList1" :key="`chayu_${index}`"
            :datas="item"></pingjiaItem>
        </div>
        <div class="listItem" ref="right">
            <pingjiaItem v-for="(item,index) in dataList2" :key="`chayu_${index}`"
            :datas="item"></pingjiaItem>
        </div>
      </div>
     </div>
   </div>
</template>

<script>
import { pinjiaList } from '~/api/chayu'
import { mapGetters } from 'vuex'
import pingjiaItem from '~/components/chayu/pingjiaItem'
import { jumpUrl } from '~/utils/jump'
export default {
  data() {
    return {
      dataList1: [],
      dataList2: []
    }
  },
  async asyncData ({ $axios }) {
    const dataList = await $axios.$post(pinjiaList, { pageNum: 0, userId: '' })
    const bannerList = dataList.data[0].bannerList
    return { dataList: dataList.data, bannerList: bannerList }
  },
  mounted() {
      this.mescrollInit()
  },
  watch: {

  },
  methods: {
    jumpUrl,
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getList,
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: this.$refs.mescroll, // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    getList(page, mescroll) {
      this.$axios.$post(pinjiaList, { pageNum: page.num - 1, userId: this.user.userId }).then(res => {
        if (res.code === 10000) {
          const arr = res.data
          if (page.num === 1) {
            this.dataList = []
            this.dataList1 = []
            this.dataList2 = []
            this.bannerList = []
            this.bannerList = arr[0].bannerList
          }
          this.dataList = [...this.dataList, ...arr]
          arr.map(item => {
            setTimeout(() => {
              const leftHeight = this.$refs.left.clientHeight
              const rightHeight = this.$refs.right.clientHeight
              if (leftHeight <= rightHeight) {
                this.dataList1.push(item)
              } else {
                this.dataList2.push(item)
              }
            }, 20)
          })
          this.$nextTick(() => {
            this.mescroll.endSuccess(arr.length)
          })
        }
      }).catch(() => {
        this.mescroll.endErr()
      })
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {
    pingjiaItem
  },
  computed: {
    ...mapGetters(['user']),
    itemWidth() {
      if (process.client) {
        return (173 * (document.documentElement.clientWidth / 375)) // rem布局 计算宽度
      }
      return null
    },
    gutterWidth() {
      if (process.client) {
        return (9 * (document.documentElement.clientWidth / 375)) // rem布局 计算x轴方向margin(y轴方向的margin自定义在css中即可)
      }
      return 10
    }
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.Wrap{
  top: 90px;
  left: 0;
  right: 0;
  bottom: 60px;
  background: #f2f2f2;
  &.mescroll{
    height: auto;
  }
  .banner-wrapper{
    margin: 0 10px;
    height: 135px;
    margin-bottom: 10px;
    overflow: hidden;
    .alink{
      display: block;
      width: 100%;
      height: 100%;
      img{
        height: 130px;
      }
    }
  }
  .listWrap{
    margin: 0 10px;
    align-items:flex-start;
    justify-content: space-between;
    .listItem{
      width: 49%;
    }
    // flex-direction: column;
    // column-count: 2;
    // column-gap: 10px;
  }
}
</style>
