<template>
   <div>
     <backbar title="我的用户"></backbar>
     <div ref="mescroll" class="mescroll">
       <div id="listWraper" class="sub">
        <div class="subitem df border-bottom" v-for="item in dataList" :key="item.pkSid">
          <img :src="item.avatarPath||'static/images/self@2x.png'" alt="" class="subitemimg">
          <div class="subitemtext df">
            <p class="f15">{{item.nickName}}</p>
            <p class="f12">注册时间 {{parseTime(item.createTime)}}</p>
          </div>
        </div>
       </div>
    </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import { getUserList } from '~/api/market'
import { parseTime } from '~/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'myuser',
  data() {
    return {
      mescroll: null, // mescroll实例对象
      dataList: []// 列表数据
    }
  },
  mounted() {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    parseTime,
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit () {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: { // 上拉加载的配置.
          callback: this.getList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          isBounce: false,
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 // 每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
          noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
          // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          // 这就是为什么无更多数据有时候不显示的原因
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'listWraper', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: '../../../static/mescroll/noData.png', // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      }) // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    getList(page, mescroll) {
      var pageIndex = page.num - 1
      const option = {
        userId: this.user.userId,
        pageNum: pageIndex
      }
      this.$axios.$post(getUserList, option).then(res => {
        const arr = res.list || []
        if (res.code === 10000) {
          if (pageIndex === 0) this.dataList = []
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            setTimeout(() => {
              mescroll.endSuccess(arr.length)
            }, 500)
            // mescroll.endSuccess(0)
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    }
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  components: {
    backbar
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.mescroll {
  position: fixed;
  top: 44px;
  bottom: 0;
  height: auto;
}
.sub {
  margin: 10px;
  .subitem {
    padding: 13.5px 15px;
    box-sizing: border-box;
    background: #fff;
    .subitemimg {
      width: 33px;
      height: 33px;
      margin-right: 10px;
    }
    .subitemtext {
      font-weight: normal;
      flex-direction: column;
      justify-content: space-between;
      :first-child {
        color: #333;
      }
      :last-child {
        color: #999;
      }
    }
  }
}
</style>
