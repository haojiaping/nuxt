<template>
  <div class="discussWrap"
       v-if="datas">
    <div class="top">
      <div class="name" @click="jumpToUser">
        <img :src="datas.userImage"
             v-if="datas.userImage&&datas.userImage!=='-'">
        <img :src="require('~/assets/img/self/self@2x.png')"
             alt=""
             v-else>
        <div>
          <p class="username">{{datas.userName}}</p>
          <p class="time">{{datas.createTime|setTimeAgo}}</p>
        </div>
      </div>
      <div class="dianzanWraper"
           @click="handClickDianzan">
        <i class="dianzan"
           v-if="!datas.fabulousFlag"></i>
        <i class="dianzanactive"
           v-if="datas.fabulousFlag"></i>
        <span class="f15 c3">{{datas.fabulousCount}}</span>
      </div>
    </div>
    <p class="text"
       @click="replayone(datas)">{{datas.content}}</p>
    <!-- <div class="photo" v-if="datas.videoPath||datas.imageList">
       <img :src="item" v-for="(item,index) in imageList" @click="onClickImg(index)" :key="`${index}`">
       <div class="palyer needsclick" @click="onClickPlay" v-if="datas.videoPath">
         <video-player
          class="video-player-box"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="false"
          customEventName="customstatechangedeventname"
          @play="onPlayerPlay($event)">
         </video-player>
         <div class="btn"></div>
       </div>
     </div> -->
    <div class="reply"
         v-if="datas.childCommentList&&datas.childCommentList.length">
      <div class="xiaosanjiao"></div>
      <p class="replytext"
         @click="replayone(reply)"
         v-for="(reply,index) in datas.childCommentList"
         :key="index">
        <span style="color:#999;">{{reply.userName}}</span> 回复 <span style="color:#999;">{{reply.toUserName}}</span>:
        {{reply.content}}</p>
    </div>
    <div v-if="lineShow"
         class="lineWraper">
      <!-- <OneLine></OneLine> -->
    </div>
  </div>
</template>

<script>
// 单个评论组件---资讯评论
// import { ImagePreview } from 'vant'
import { formatTime } from '~/utils'
import { sup } from '~/api/post'
import { mapGetters, mapActions } from 'vuex'
import { IOS, ANDROID } from '~/environment/esm'
export default {
  name: 'DiscussPost',
  data () {
    return {
      datas: {}
    }
  },
  props: {
    lineShow: {
      type: Boolean,
      default: false
    },
    itemdata: {}
  },
  mounted () {
    this.datas = this.itemdata
  },
  watch: {
    itemdata: {
      handler: function (val, oldVal) {
        this.datas = val
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  filters: {
    setTimeAgo (val) {
      return formatTime(val)
    }
  },
  methods: {
    handClickDianzan () {
      const option = {
        userId: this.user.userId,
        serviceId: this.datas.commentId,
        serviceType: 1, // 0是内容  1是评论
        userType: 0
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              option.userId = userId
              this.upDianzan(option)
            } else {
              window.callback(ios => {
                ios.callHandler('goLogin', null, res => {
                  this.$toast('去登录')
                })
              })
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          option.userId = userId
          this.upDianzan(option)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.upDianzan(option)
        } else {
          this.$router.push('/login')
        }
      }
    },
    upDianzan (option) {
      this.$axios.$post(sup, option).then(res => {
        if (res.code === 10000) {
          if (this.datas.fabulousFlag) {
            this.$toast('已取消点赞')
            this.datas.fabulousCount--
          } else {
            this.$toast('点赞成功')
            this.datas.fabulousCount++
          }
          this.datas.fabulousFlag = !this.datas.fabulousFlag
        }
      })
    },
    replayone (val) {
      this.$emit('replayone', val)
    },
    jumpToUser(){
      const option = { userId: this.datas.userId}
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('goDiscussionUserPage', JSON.stringify(option), res => {

          })
        })
      } else if(ANDROID){
        window.android.goDiscussionUserPage(JSON.stringify(option))
      } else {
        this.$router.push(`/userid/${option.userId}`)
      }
    },
    ...mapActions(['saveLogin'])
  },
  components: {
    // OneLine
    // videoPlayer
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.discussWrap {
  background: #fff;
  padding: 0 15px 10px 15px;
  font-weight: normal;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name {
      display: flex;
      align-items: center;
      margin: 10px 0;
      img {
        width: 33px;
        height: 33px;
        border: none;
        margin-right: 10px;
        border-radius: 50%;
      }
      .username {
        color: #333;
        font-size: 15px;

        margin-bottom: 2px;
      }
      .time {
        color: #999;
        font-size: 12px;
      }
    }
  }
  .dianzanWraper {
    display: flex;
    align-items: center;
    font-size: 12px;

    // padding: 2px 10px;
    .dianzan {
      width: 16px;
      height: 16px;
      @include bg-image('common/dian');
      background-size: cover;
      margin-right: 5px;
    }
    .dianzanactive {
      width: 20px;
      height: 20px;
      @include bg-image('common/dianzanactive');
      background-size: cover;
      margin-right: 5px;
    }
    .name {
      color: #333;
    }
  }
  .text {
    color: #333;
    font-size: 15px;
    line-height: 18px;
    margin: 10px 0 10px 43px;
  }
  .photo {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 15px;
    img {
      width: 60px;
      height: 60px;
      overflow: hidden;
      margin: 0 10px 10px 0;
    }
    .palyer {
      width: 60px;
      height: 60px;
      overflow: hidden;
      position: relative;
      .btn {
        position: absolute;
        width: 12px;
        height: 12px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        @include bg-image('common/btnplayer');
        background-size: cover;
      }
    }
  }
  .reply {
    background: #f2f2f2;
    padding: 5px 10px;
    box-sizing: border-box;
    position: relative;
    margin-left: 43px;
    .replytext {
      color: #666;
      line-height: 18px;
      margin: 5px 0;
    }
    .xiaosanjiao {
      position: absolute;
      top: -15px;
      left: 8px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: #f2f2f2;
    }
  }
  .lineWraper {
    margin-top: 15px;
  }
}
</style>
