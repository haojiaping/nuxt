<template>
  <div class="DiscussPopWraper">
    <div class="opactiy"
         @click="handClickclose"></div>
    <div class="subWraper df">
      <div class="titleWraper df">
        <p>
          <span class="disstitle">评论</span>
          <span class="dissnum">({{totalCount}})</span>
        </p>
        <van-icon name="cross" color="#999" @click="handClickclose"/>
      </div>
      <div ref="mescroll"
           class="mescroll DiscussItemsWrap">
        <div class="DiscussItems">
          <div id="listWraperLivePop">
            <DiscussPost v-for="(item,index) in dataList"
                         :itemdata="item"
                         :key="index"
                         :lineShow="true"
                         @replayone="replayone"></DiscussPost>
          </div>
        </div>
      </div>
      <div class="foot pf df">
        <div class="foll">
          <van-field v-model="message" :placeholder="placeholder" @focus="keyShow = true" @blur="handelKeyBlur" ref="vantInpPop"/>
        </div>
        <div  class="fbtn tac f15" :class="message!==''?'active':''" @click="getMessage">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import DiscussPost from '~/components/tiezi/DiscussPost'
import DiscussInput from '~/components/tiezi/DiscussInput'
import { list, reply } from '~/api/post'
import { mapGetters, mapActions } from 'vuex'
import { IOS, ANDROID } from '~/environment/esm'
export default {
  data () {
    return {
      mescroll: null, // mescroll实例对象
      dataList: [], // 列表数据
      totalCount: 0,
      placeholder: '说点什么',
      message: ''
    }
  },
  props: {
    serviceId: {
      type: String,
      default: ''
    },
    currentUserImage: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    handClickclose () {
      this.$emit('close')
    },
    mescrollInit () {
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
    handelKeyBlur(){
      if (this.message==='') {
        this.keyShow = false
      } else {
        this.keyShow = true
      }
    },
    getListData (page, mescroll) {
      this.initGet(0, page, mescroll)
    },
    getList (userId, page, mescroll) {
      const option = {
        // authorUserId: this.user.userId,
        userId: userId,
        postId: this.serviceId,
        pageNum: page.num - 1
      }
      this.$axios.$post(list, option).then(res => {
        if (res.code === 10000) {
          if (page.num === 1) this.dataList = []
          const arr = res.data
          this.totalCount = res.totalCount
          this.dataList = this.dataList.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    replayone (val) {
      if (this.commentId === val.commentId) {
        this.placeholder = '说点什么'
        this.commentId = ''
      } else {
        this.placeholder = `回复 ${val.userName}:`
        this.commentId = val.commentId
      }
      this.$nextTick(()=>{
        this.$refs.vantInpPop.focus()
      })
    },

    getMessage () {
      this.initGet(3)
    },
    // 发送评论
    sendDis (userId) {
      const option = {
        commentId: this.commentId || '',
        postId: this.serviceId,
        userId: userId,
        content: this.message
      }
      this.$axios.$post(reply, option).then(res => {
        if (res.code === 10000) {
          this.message = ''
          this.$toast('发表成功')
          this.placeholder = '填写评论'
          this.commentId = ''
          this.mescroll.resetUpScroll(false)
          // this.mescroll.triggerDownScroll()
        } else {
          this.$toast(res.message)
        }
      })
    },
    // 需要获取userId的函数前置操作 // 0是获取评论列表  1 点赞  2 关注
    initGet (type, page, mescroll) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              this.storing(type, userId, page, mescroll)
            } else if (type !== 0) {
              window.callback(ios => {
                ios.callHandler('goLogin', null, res => {
                  this.$toast('去登录')
                })
              })
            } else {
              this.storing(type, '', page, mescroll)
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          this.storing(type, userId, page, mescroll)
        } else if (type !== 0) {
          window.android.isLoginFinishWeb(true, ' ')
        } else {
          this.storing(type, '', page, mescroll)
        }
      } else {
        if (this.user.isLogin) {
          this.storing(type, this.user.userId, page, mescroll)
        } else if (type !== 0) {
          this.$router.push('/login')
        } else {
          this.storing(type, '', page, mescroll)
        }
      }
    },
    // 获取到userId后按照type分配执行的函数 // 0是获取文章详情  1 点赞  2 关注 3 发表评论
    storing (type, userId, page, mescroll) {
      switch (type) {
        case 0:
          this.getList(userId, page, mescroll)
          break
        case 1:
          // this.upDianzan(userId)
          break
        case 2:
          // this.followUser(userId)
          break
        case 3:
          this.sendDis(userId)
          break
      }
    },
    ...mapActions(['saveLogin'])
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  components: {
    DiscussPost,
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
  z-index: 105;
  .opactiy {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.5;
  }
  .foot{

    bottom: 0;
    right: 0;
    left: 0;
    height: 49px;
    background: #fff;
    align-items: center;
    padding: 8px 15px;
    box-sizing: border-box;
    .foll{
      flex: 0 0 265px;
      width:265px;
      height:33px;
      line-height:33px;
      background:rgba(242,242,242,1);
      border-radius:17px;
      /deep/ .van-cell{
        background: #f2f2f2;
        border-radius: 25px;
        padding:4px 14px;
      }
    }

    .fbtn{
      width:70px;
      height:33px;
      line-height:33px;
      border-radius:17px;
      margin-left: 10px;
      background: #f2f2f2;
      color: #ccc;
      &.active{
        color: #fff;
        background:linear-gradient(-45deg,rgba(245,109,104,1) 0%,rgba(240,125,110,1) 100%);
      }
    }
  }
}
.subWraper {
  position: absolute;
  background: #fff;
  top: 110px;
  left: 0;
  right: 0;
  bottom: 48px;
  flex-direction: column;
  .titleWraper {
    padding: 20px 15px 5px 15px;
    font-weight: normal;
    font-size: 18px;
    align-items: center;
    justify-content: space-between;
    .disstitle {
      color: #333;
    }
    .dissnum {
      color: #666;
    }
  }
}
.DiscussItemsWrap{
  background: #fff;
  float: 1;
}
</style>
