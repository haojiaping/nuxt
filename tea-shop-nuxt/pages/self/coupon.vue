<template>
  <div>
    <!-- 菜单 -->
    <div class="top-warp">
      <backbar title="优惠券"/>
      <div class="nav">
        <div :class="{'active':tabType==0}" class="pr fw400 f30" @click="changeTab(0)">未使用({{couponUnusedCount}})</div>
        <div :class="{'active':tabType==1}" class="pr fw400 f30" @click="changeTab(1)">已使用</div>
        <div :class="{'active':tabType==2}" class="pr fw400 f30" @click="changeTab(2)">已过期</div>
      </div>
    </div>

    <!--全部-->
    <div class="mescroll" ref="mescroll0" v-show="tabType==0" >
      <div id="dataList0">
        <ul>
          <li v-for="(datas,index) in tab0.list" :key="index">
            <couponItem :datas="datas"></couponItem>
          </li>
        </ul>
      </div>
    </div>

    <!-- 奶粉 可不配down-->
    <div class="mescroll" ref="mescroll1" v-show="tabType==1" >
      <div id="dataList1">
        <ul>
          <li v-for="(datas,index) in tab1.list" :key="index">
            <couponItem :datas="datas"></couponItem>
          </li>
        </ul>
      </div>
    </div>

    <!-- 面膜 -->
    <div class="mescroll" ref="mescroll2" v-show="tabType==2">
      <div id="dataList2">
        <ul>
          <li v-for="(datas,index) in tab2.list" :key="index">
            <couponItem :datas="datas"></couponItem>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCoupon } from '~/api/self'
import { mapGetters } from 'vuex'
import couponItem from '~/components/self/couponItem'
import backbar from '~/components/backbar'

export default {
  name: 'coupon',
  components: {
    couponItem,
    backbar
  },
  data () {
    return {
      tab0: { mescroll: null, list: [], isListInit: false }, // 全部
      tab1: { mescroll: null, list: [], isListInit: false }, // 奶粉
      tab2: { mescroll: null, list: [], isListInit: false }, // 面膜
      mockData: [],
      couponUnusedCount: 0,
      tabType: 0 // 菜单类型
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.mescrollInit()
    })
  },
  methods: {
    mescrollInit() {
    // eslint-disable-next-line
      this.tab0.mescroll = new MeScroll(this.$refs.mescroll0, {
        down: this.getMescrollDown(0),
        up: this.getMescrollUp(0)
      })
      // eslint-disable-next-line
      this.tab1.mescroll = new MeScroll(this.$refs.mescroll1, {
        down: this.getMescrollDown(1),
        up: this.getMescrollUp(1)
      })
      // eslint-disable-next-line
      this.tab2.mescroll = new MeScroll(this.$refs.mescroll2, {
        down: this.getMescrollDown(2),
        up: this.getMescrollUp(2)
      })
      this.tab0.mescroll.tabType = 0
      this.tab1.mescroll.tabType = 1
      this.tab2.mescroll.tabType = 2
    },
    // 多mescroll的配置,需通过方法获取,保证每个配置是单例
    getMescrollDown (tabType) {
      const isAuto = tabType === 0 // 第一个mescroll传入true,列表自动加载
      return {
        auto: isAuto,
        callback: this.downCallback
      }
    },
    getMescrollUp (tabType) {
      const emptyWarpId = 'dataList' + tabType
      return {
        auto: false,
        isBounce: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          warpId: emptyWarpId, // 父布局的id;
          icon: require('~/assets/img/common/noData.png'), // 图标,默认null
          tip: '暂无相关数据~' // 提示
        },
        toTop: { // 配置回到顶部按钮
          src: 'http://www.mescroll.com/img/mescroll-totop.png' // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
        }
      }
    },
    /* 下拉刷新的回调 */
    downCallback (mescroll) {
      // 这里加载你想下拉刷新的数据, 比如刷新tab1的轮播数据
      if (mescroll.tabType === 0) {
        // loadSwiper();
      } else if (mescroll.tabType === 1) {
        // ....
      } else if (mescroll.tabType === 2) {
        // ....
      }
      mescroll.resetUpScroll()// 触发下拉刷新的回调,加载第一页的数据
    },
    /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    upCallback (page, mescroll) {
      const pageNum = page.num - 1
      if (mescroll.tabType === 0) {
        // 全部
        this.tab0.isListInit = true// 标记列表已初始化,保证列表只初始化一次
        this.$axios.$post(getUserCoupon, { userId: this.user.userId, couponFlag: mescroll.tabType, pageNum: pageNum }).then(res => {
          if (res.code === 10000) {
            this.couponUnusedCount = res.couponUnusedCount
            mescroll.endSuccess(res.data.length)
            if (pageNum === 0) this.tab0.list = [] // 如果是第一页需手动制空列表
            this.tab0.list = this.tab0.list.concat(res.data)
          } else {
            mescroll.endErr()// 联网失败的回调,隐藏下拉刷新的状态
          }
        })
      } else if (mescroll.tabType === 1) {
        // 奶粉
        this.tab1.isListInit = true// 标记列表已初始化,保证列表只初始化一次
        this.$axios.$post(getUserCoupon, { userId: this.user.userId, couponFlag: mescroll.tabType, pageNum: pageNum }).then(res => {
          if (res.code === 10000) {
            mescroll.endSuccess(res.data.length)
            if (pageNum === 0) this.tab1.list = [] // 如果是第一页需手动制空列表
            this.tab1.list = this.tab1.list.concat(res.data)
          } else {
            mescroll.endErr()// 联网失败的回调,隐藏下拉刷新的状态
          }
        })
      } else if (mescroll.tabType === 2) {
        // 面膜
        this.tab2.isListInit = true// 标记列表已初始化,保证列表只初始化一次
        this.$axios.$post(getUserCoupon, { userId: this.user.userId, couponFlag: mescroll.tabType, pageNum: pageNum }).then(res => {
          if (res.code === 10000) {
            mescroll.endSuccess(res.data.length)
            if (pageNum === 0) this.tab2.list = [] // 如果是第一页需手动制空列表
            this.tab2.list = this.tab2.list.concat(res.data)
          } else {
            mescroll.endErr()// 联网失败的回调,隐藏下拉刷新的状态
          }
        })
      }
    },

    // 切换菜单
    changeTab (type) {
      const curTab = this.getTabData(this.tabType)// 当前列表
      const newTab = this.getTabData(type)// 新转换的列表
      curTab.mescroll.hideTopBtn() // 隐藏当前列表的回到顶部按钮
      this.tabType = type // 切换菜单
      if (!newTab.isListInit) {
        newTab.mescroll.triggerDownScroll() // 加载列表
      } else {
        setTimeout(() => {
          // 检查新转换的列表是否需要显示回到到顶按钮
          var curScrollTop = newTab.mescroll.getScrollTop()
          if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
            newTab.mescroll.showTopBtn()
          } else {
            newTab.mescroll.hideTopBtn()
          }
        }, 30)
      }
    },
    // 获取菜单对应的数据
    getTabData (tabType) {
      if (tabType == null) tabType = this.tabType
      if (tabType === 0) {
        return this.tab0
      } else if (tabType === 1) {
        return this.tab1
      } else if (tabType === 2) {
        return this.tab2
      }
    }
  },
  beforeDestroy () {
    this.tab0.mescroll.setBounce(true)
    this.tab1.mescroll.setBounce(true)
    this.tab2.mescroll.setBounce(true)
    this.tab0.mescroll.destroy()
    this.tab1.mescroll.destroy()
    this.tab2.mescroll.destroy()
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
/*以fixed的方式固定mescroll的高度*/
.mescroll {
  position: fixed;
  top: 88px;
  bottom: 0;
  height: auto;
  background: #f2f2f2;
  font-weight: normal;
}
.top-warp {
  z-index: 9990;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 88px;
  font-weight: normal;
  .head {
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #333;
    .btn-left {
      position: absolute;
      top: 0;
      left: 0;
      padding: 12px;
      line-height: 22px;
    }
  }
  .tip {
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }
  .nav {
    margin-top: 48px;
    text-align: center;
    height: 40px;
    & > div {
      display: inline-block;
      width: 28%;
      line-height: 36px;
      font-size: 14px;
      &.active {
        color: #333;
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
}
/*展示上拉加载的数据列表*/
.data-li {
  position: relative;
  height: 80px;
  padding: 10px 8px 10px 120px;
  border-bottom: 1px solid #eee;
  .pd-img {
    position: absolute;
    left: 18px;
    top: 10px;
    width: 80px;
    height: 80px;
  }
  .pd-name {
    font-size: 13px;
    line-height: 20px;
    height: 40px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .pd-price {
    font-size: 13px;
    color: red;
  }
  .pd-sold {
    font-size: 12px;
    margin-top: 8px;
    color: gray;
  }
}
</style>
