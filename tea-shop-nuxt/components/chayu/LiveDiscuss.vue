<template>
  <div class="discussWrap"
       v-if="datas">
    <div class="top">
      <div class="name">
        <img :src="datas.authorUserImage"
             v-if="datas.authorUserImage&&datas.authorUserImage!=='-'">
        <img :src="require('~/assets/img/self/self@2x.png')"
             alt=""
             v-else>
        <div>
          <p class="username">{{datas.authorUserName}}</p>
          <p class="time">{{datas.createTime|setTimeAgo}}</p>
        </div>
      </div>
      <div class="dianzanWraper border"
           @click="handClickDianzan">
        <i class="dianzan"
           v-if="datas.thumbupFlag===0"></i>
        <i class="dianzanactive"
           v-if="datas.thumbupFlag===1"></i>
        <span class="num">{{datas.thumbupCount}}</span>
      </div>
    </div>
    <p class="text">{{datas.content}}</p>
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
    <!-- <div class="reply" v-if="datas.replyList" v-for="(reply,index) in datas.replyList" :key="index">
       <div class="xiaosanjiao"></div>
       <p class="replytext">{{reply.userName}}：{{reply.content}}</p>
     </div> -->
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
import { commentCancelThumbup } from '~/api/chayu'
import { mapGetters, mapActions } from 'vuex'
import { IOS, ANDROID } from '~/environment/esm'
export default {
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
    // console.log('this is current player instance object', this.player)
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
        commentId: this.datas.commentId
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
      if (this.datas.thumbupFlag === 0) {
        this.datas.thumbupFlag = 1
        this.datas.thumbupCount++
        this.$axios.$post(commentCancelThumbup, option).then(res => {
          if (res.code === 10000) {

          }
        })
      } else {
        this.datas.thumbupFlag = 0
        this.datas.thumbupCount--
        this.$axios.$post(commentCancelThumbup, option).then(res => {

        })
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

        margin-bottom: 5px;
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

    padding: 2px 10px;
    .dianzan {
      width: 16px;
      height: 16px;
      @include bg-image('common/dianzan');
      background-size: cover;
      margin-right: 5px;
    }
    .dianzanactive {
      width: 16px;
      height: 16px;
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
    margin-top: 10px;
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
    width: 100%;
    background: #f2f2f2;
    padding: 10px 15px;
    box-sizing: border-box;
    position: relative;
    .replytext {
      color: #666;
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
