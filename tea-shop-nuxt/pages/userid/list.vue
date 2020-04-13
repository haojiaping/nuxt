<template>
   <div>
     <backbar :title="`${listType==='0'?'粉丝':'关注'} (${numAll})`"></backbar>
     <div ref="mescroll" class="mescroll">
       <div id="listWraper" class="sub">
        <div class="subitem df border-bottom" v-for="item in dataList" :key="item.pkSid">
          <div class="left df">
            <img :src="item.avatarPath||require('~/assets/img/self/self@2x.png')" alt="" class="subitemimg">
            <div class="subitemtext df">
              <p class="f15">{{item.nickName}}</p>
              <p class="f12">{{item.personalizedSignature}}</p>
            </div>
          </div>
          <!-- // 需要调换0  1 -->
          <div class="btn" v-if="item.attentionFlag===1">
            <span class="f12">+ 关注</span>
          </div>
          <div class="active van-hairline--surround" v-if="item.attentionFlag===0">
            <span class="f12">已关注</span>
          </div>
        </div>
       </div>
    </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import { userlist } from '~/api/post'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      mescroll: null, // mescroll实例对象
      dataList: [],// 列表数据
      numAll: 0,
      followId: '',
      listType: ''
    }
  },
  mounted() {
    this.followId =  this.$route.query.followId
    this.listType = this.$route.query.listType
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
        userId: this.user.userId,
        followId: this.$route.query.followId,
        listType: this.$route.query.listType,
        pageNum: pageIndex
      }
      this.$axios.$post(userlist, option).then(res => {
        const arr = res.data.userList || []
        this.numAll = res.data.num
        if (res.code === 10000) {
          if (pageIndex === 0) this.dataList = []
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
    justify-content: space-between;
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
    .btn{
      width:60px;
      height:22px;
      line-height:22px;
      color: #fff;
      background:rgba(212,89,73,1);
      text-align: center;

    }
    .active{
      width:60px;
      height:22px;
      line-height:22px;
      color: #999;
      background:#fff;
      text-align: center;

    }
  }
}
</style>
