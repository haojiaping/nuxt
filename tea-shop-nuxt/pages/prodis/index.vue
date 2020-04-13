<template>
   <div class="detaildisWrap">
    <backbar title="茶评" :gobackMyback='true' @setHeight="setHeight"/>
    <div class="titles" ref="title">
      <span class="titleleft">品评分</span>
      <div class="titleright">
        <van-rate v-model="value" :size="12" :readonly="true"/>
        <span>{{value*2}}分</span>
      </div>
    </div>
    <div ref="mescroll" class="mescroll">
      <div id="listWraper">
        <Discuss
          :dianzanShow="false"
          :lineShow="true"
          v-for="(item,index) in dataList"
          :key="index"
          :itemdata="item"
          @videoPlay="videoPlay"
          @videoExit="videoExit"></Discuss>
      </div>
    </div>
    <MyVideoDis :videoOption="videoOption" v-if="VideoShow" @videoExit="videoExit"></MyVideoDis>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import { disList } from '~/api/product'
import { IOS, ANDROID } from '~/environment/esm'
import { mapGetters, mapActions } from 'vuex'
import MyVideoDis from '~/components/detail/MyVideoDis'
import Discuss from '~/components/detail/Discuss'
export default {
  data() {
    return {
      value: 5,
      mescroll: null, // mescroll实例对象
      dataList: [], // 列表数据
      videoOption: {},
      VideoShow: false
    }
  },
  mounted () {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit () {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          // isBounce:false,
          callback: this.getdisList,
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'listWraper', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    setHeight(height) {
      this.$refs.title.style.top = `${(height + 46) / 37.5}rem`
      this.$refs.mescroll.style.top = `${(height + 80) / 37.5}rem`
    },
    getdisList(page, mescroll) {
      const option = {
        productId: this.$route.query.productId,
        pageNum: page.num - 1,
        userId: ''
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            option.userId = userId
            this.getDisdata(page, mescroll, option)
          })
        })
      } else if (ANDROID) {
        const userId = window.android.getUserId()
        option.userId = userId
        this.getDisdata(page, mescroll, option)
      } else {
        option.userId = this.user.userId
        this.getDisdata(page, mescroll, option)
      }
    },
    getDisdata(page, mescroll, option) {
      this.$axios.$post(disList, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.list
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.value = Number(res.synthesize) / 2
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
    videoPlay(val) {
      // this.$refs.mescroll.$el.style.overflow = 'visible'
      // this.mescroll.lockDownScroll(true)
      this.videoOption = val
      this.VideoShow = true
    },
    videoExit() {
      this.videoOption = {}
      this.VideoShow = false
    },
    ...mapActions(['saveLogin'])
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  components: {
    backbar,
    Discuss,
    MyVideoDis
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/variable.scss";
.titles {
  position: fixed;
  top: 46px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  font-weight: normal;
  .titleleft {
    font-size: 15px;
  }
  .titleright {
    display: flex;
    align-items: center;
    font-size: 15px;
  }
}
.mescroll {
  position: fixed;
  top: 80px;
  bottom: 0;
  height: auto;
  background: #fff;
  z-index: 20;
}
</style>
