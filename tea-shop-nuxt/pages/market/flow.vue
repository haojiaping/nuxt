<template>
   <div>
     <backbar title="佣金流水"></backbar>
     <div ref="mescroll" class="mescroll">
      <div class="sub" id="listWraper">
        <div class="content" v-for="(elem,index) in dataList" :key="elem.key">
          <div class="time" >
            <div class="timecont active"
            v-if="dataList[index-1]?(elem.dateStr===dataList[index-1].dateStr?false:true):true">
              <span class="timedate"
              >{{elem.dateStr|showdate}}</span>
            </div>
            <div class="timecont" v-else>
              <span class="timedate"></span>
            </div>
          </div>
          <div class="contitem f24">
            <!-- <div class="itemlg">
              <div class="lgfill" :class="dataList[index-1]?(elem.showtime===dataList[index-1].showtime?'lgpul':''):''"></div>
            </div> -->
            <div class="itembg">
              <div class="itemlf">
                <p class="f15">{{elem.message}}</p>
                <div class="itemtext f12">
                  <span>{{elem.createTime|showtime}}</span>
                </div>
              </div>
              <span class="itemrf pos">+{{elem.price.toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
     </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import { getUserdisList } from '@/api/market'
import { mapGetters } from 'vuex'
export default {
  name: 'flow',
  data() {
    return {
      mescroll: null, // mescroll实例对象
      dataList: []
    }
  },
  mounted() {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
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
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      }) // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    getList(page, mescroll) {
      var pageIndex = page.num - 1
      const option = {
        pageNum: pageIndex,
        userId: this.user.userId
      }
      this.$axios.$post(getUserdisList, option).then(res => {
        const arr = res.list
        if (res.code === 10000) {
          if (page.num === 1) this.dataList = []
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
    }
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  filters: {
    showdate: function(val) {
      if (val) {
        return val.substr(5, 6)
      } else {
        return val
      }
    },
    showtime: function(val) {
      if (val) {
        return val.substr(10)
      } else {
        return val
      }
    }
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
  margin: 0.2rem 0.3rem;
  .content {

    display: flex;
    .contitem {
      flex: 1;
      padding: 10px 0 0 10px;
      border-left: 1px solid #e8e8e8;
      display: flex;
      .itemlg {
        background-color: #f2f2f2;
        width: 0.2rem;
        height: auto;
        .lgfill {
          border-top-right-radius: 25px;
          background-color: #fff;
          width: 100%;
          height: 100%;
        }
        .lgpul {
          border-top-right-radius: 0;
        }
      }
      .itembg {
        flex: 1;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 0.2rem;
        .itemlf {
          padding: 0.2rem 0 0.2rem 0.2rem;
          flex: 1;
          p {
            font-weight: 400;
            margin-bottom: 0.2rem;
          }
          .itemtext {
            color: #999;
            padding-right: 0.2rem;
            display: flex;
            justify-content: space-between;
          }
        }
        .itemrf {
          font-size: 16px;
          flex: 0.5;
          text-align: center;
        }
        .pos  {
          color: #f21c0f;
        }
        .neg  {
          color: #000;
        }
      }
    }
    .time {
      width: 18%;
      position: relative;
      .timecont {
        @include bg-image('market/time');
        width: 0.2rem;
        height: 0.2rem;
        line-height: 0.4rem;
        background-size: cover;
        position: absolute;
        top: 0.2rem;
        right: -0.1rem;
        text-align: center;
        &.active {
          @include bg-image('market/timeactive');
          width: 1.5rem;
          height: 0.36rem;
          left: -0.1rem;
        }
        .timedate {

          position: relative;
          margin-right: 0.2rem;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
