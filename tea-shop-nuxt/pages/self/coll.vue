<template>
   <div class="footWraper">
     <!-- 返回头 -->
    <backbar title="我的收藏"/>
    <div class="mescroll" ref="mescroll">
      <div class="content">
        <linelist v-for="(item,index) in dataList" :key="index" :datas="item"></linelist>
      </div>
    </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import linelist from '~/components/linelist'
import { getUserColl } from '~/api/self'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mescrollInit()
    })
  },
  watch: {

  },
  methods: {
    getCollList(page, mescroll) {
      if (page.num === 1) this.dataList = []
      const option = {
        userId: this.user.userId,
        collectId: this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].collectId : 0
      }
      this.$axios.$post(getUserColl, option).then(res => {
        const arr = res.list
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
      }).catch(err => {
        this.mescroll.endErr()
        console.log(err)
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getCollList,
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: this.$refs.mescroll, // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {
    linelist,
    backbar
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
.footWraper {
  height: 100%;
  background: #f2f2f2;
}
.mescroll{
  position: fixed;
  top: 54px;
  bottom: 0;
  height: auto;
  .content{
    margin: 0 10px;
  }
}
</style>
