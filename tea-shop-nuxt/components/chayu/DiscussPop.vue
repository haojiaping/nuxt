<template>
   <div class="DiscussPopWraper">
     <div class="opactiy" @click="handClickclose"></div>
     <div class="subWraper">
     <div class="titleWraper">
      <span class="disstitle">评论</span>
      <span class="dissnum">({{totalCount}})</span>
      </div>
    <div ref="mescroll" class="mescroll">
      <div class="DiscussItems">
        <div id="listWraperLivePop">
          <LiveDiscuss v-for="(item,index) in dataList" :itemdata="item" :key="index" :lineShow="true"></LiveDiscuss>
        </div>
      </div>
     </div>
     <div class="inputWraper">
      <DiscussInput @sendDis="sendDis" :userimage="currentUserImage" ref="disInput"></DiscussInput>
     </div>
     </div>
   </div>
</template>

<script>
import LiveDiscuss from '~/components/chayu/LiveDiscuss'
import DiscussInput from '~/components/tiezi/DiscussInput'
import { chayuComment, commentSave } from '~/api/chayu'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      mescroll: null, // mescroll实例对象
      dataList: [], // 列表数据
      totalCount: 0
    }
  },
  props: {
    articleId: {
      type: String,
      default: ''
    },
    currentUserImage: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    handClickclose() {
      this.$emit('close')
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: { // 上拉加载的配置.
          callback: this.getListData, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
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
            warpId: 'listWraperLivePop', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    getListData(page, mescroll) {
      const option = {
        authorUserId: this.user.userId,
        articleId: this.articleId,
        pageNum: 0
      }
      this.$axios.$post(chayuComment, option).then(res => {
        if (res.code === 10000) {
          if (page.num === 1) this.dataList = []
          const arr = res.list
          this.totalCount = res.totalCount
          this.dataList = this.dataList.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
          })
        } else {
          this.$toast('res.message')
          mescroll.endErr()
        }
      })
    },
    sendDis(message) {
      const option = {
        articleId: this.articleId,
        userId: this.user.userId,
        content: message
      }
      this.$axios.$post(commentSave, option).then(res => {
        if (res.code === 10000) {
          this.$toast('发表成功')
          this.$refs.disInput.message = ''
          this.mescroll.triggerDownScroll()
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  components: {
    LiveDiscuss,
    DiscussInput
  }
}
</script>

<style lang="scss" scoped>
.DiscussPopWraper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 33;
  .opactiy {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.5;
  }
  .inputWraper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 10px 0 15px 0;
    box-sizing: border-box;
  }
}
.subWraper {
  position: absolute;
  background: #fff;
  top: 20%;
  left: 0;
  right: 0;
  bottom: 50px;
  .titleWraper {
    padding: 15px 10px 0;
    font-weight: normal;
    font-size: 18px;
    .disstitle {
      color: #333;
    }
    .dissnum {
      color: #666;
    }
  }
}
.DiscussPopWraper /deep/ .mescroll {
  position: absolute;
  background: #fff;
  top: 45px;
  bottom: 0;
  width: 100%;
  height: auto;
}
</style>
