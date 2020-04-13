<template>
   <div class="footWraper">
     <!-- 返回头 -->
    <backbar title="我的足迹" rightText="清空" @onClickRight="clearFoot"/>
    <div class="mescroll" ref="mescroll">
      <div class="content">
        <div v-for="(item,index) in dataList" :key="index" class="item">
          <p class="time" v-if="dataList[index-1]?(item.timeShow===dataList[index-1].timeShow?false:true):true">{{item.timeShow}}</p>
          <linelist :datas="item"></linelist>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import linelist from '~/components/linelist'
import { footList, clearfootList } from '~/api/self'
import { mapGetters } from 'vuex'
export default {
  name: 'coll',
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
        footprintId: this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].footprintId : 0
      }
      this.$axios.$post(footList, option).then(res => {
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
    },
    clearFoot() {
      this.$dialog.confirm({
        title: '清空',
        message: '确定要清空我的足迹么'
      }).then(() => {
        this.$axios.$post(clearfootList, { userId: this.user.userId }).then(res => {
          if (res.code === 10000) {
            this.$toast('清空成功')
            this.getfootList(0)
          } else {
            this.$toast(res.message)
          }
        })
      }).catch(() => {
        // on cancel
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
  .time {
    padding: 0 15px;
    font-size: 14px;
    color: #666;

    line-height: 40px;
  }
}
.mescroll{
  position: fixed;
  top: 44px;
  bottom: 0;
  background: #f2f2f2;
  height: auto;
  .content{
    margin: 0 10px;
  }
}
</style>
