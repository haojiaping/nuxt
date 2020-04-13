<template>
   <div class="discussWrap">
     <div class="top">
       <div class="name">
         <img :src="datas.avatarPath||'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2020/1/edc4eeda-6f00-4778-a686-89c583f826b2.jpg'" v-if="datas.isAnonymity===0&&datas.avatarPath&&datas.avatarPath!=='-'">
         <img :src="require('https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2020/1/edc4eeda-6f00-4778-a686-89c583f826b2.jpg')" v-else>
         <div class="df userInfo">
           <p class="username" v-if="datas.isAnonymity===0">{{datas.userName}}</p>
           <p class="username" v-if="datas.isAnonymity===1">茶臻选VIP</p>
           <p class="time">{{datas.createTime|setTimeAgo}}</p>
         </div>
       </div>
       <div class="dianzanWraper border" @click="handClickDianzan">
          <i class="dianzan" v-if="!datas.isLiked" ></i>
          <i class="dianzanactive" v-if="datas.isLiked"></i>
          <span class="num">{{datas.likeNum}}</span>
       </div>
     </div>
     <p class="text">{{datas.content}}</p>
     <div class="photo" v-if="(datas.videoPath&&datas.videoPath!=='-')||(datas.imagePath&&datas.imagePath!=='-')">
       <div class="palyer"  v-if="datas.videoPath&&datas.videoPath!=='-'&&datas.frameImage&&datas.frameImage!=='-'">
        <img :src="datas.frameImage">
        <div class="btn" @click="onClickPlay"></div>
       </div>
       <img :src="item" v-for="(item,index) in imageList" @click="onClickImg(index)" :key="`${index}`">
     </div>
     <div class="reply" v-for="(reply,index) in datas.replyList" :key="index">
       <div class="xiaosanjiao"></div>
       <p class="replytext">{{reply.userName}}：{{reply.content}}</p>
     </div>
     <div v-if="lineShow" class="lineWraper">
        <div class="line van-hairline--top" style="width:100%;height:0;"></div>
     </div>
   </div>
</template>

<script>
// import OneLine from 'base/OneLine/OneLine'
import { mapGetters, mapActions } from 'vuex'
// 单个评论组件---商品评论
import { ImagePreview } from 'vant'
import { formatTime } from '../../utils'
import { isLike } from '../../api/product'
// import { IOS, ANDROID } from '../../environment/esm'
export default {
  name: 'Discuss',
  data() {
    return {
      datas: {},
      playerBtnShow: true,
      popupVideo: false,
      MyVideoControls: false
    }
  },
  props: {
    lineShow: {
      type: Boolean,
      default: false
    },
    itemdata: {}
  },
  mounted() {
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
    imageList() {
      if (this.datas.imagePath && this.datas.imagePath !== '-' && this.datas.imagePath.indexOf(',') !== -1) {
        return this.datas.imagePath.split(',')
      } else {
        return [this.datas.imagePath]
      }
    },
    ...mapGetters([
      'user'])
  },
  filters: {
    setTimeAgo(val) {
      return formatTime(val)
    }
  },
  methods: {
    onClickPlay() {
      // this.popupVideo = true // 设置弹出层
      // this.playerBtnShow = false // 退出按钮
      // this.$refs.MyVideo.play()
      // this.MyVideoControls = true // 显示默认的控制栏
      const option = {
        videoPath: this.datas.videoPath,
        frameImage: this.datas.frameImage
      }
      this.$emit('videoPlay', option)
    },
    exitVideo() {
      // this.popupVideo = false
      // this.playerBtnShow = true
      // this.$refs.MyVideo.pause()
      // this.MyVideoControls = false
      this.$emit('videoExit')
    },
    handClickDianzan() {
      const option = {
        userId: '',
        commentId: this.datas.commentId,
        isLike: 0 // 0点赞  1取消点赞
      }
      if (true) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.saveLogin({
                userId: userId,
                token: token,
                isLogin: true,
                mobileFlag: true
              })
              option.userId = userId
              this.upLike(option)
            } else {
              window.callback(ios => {
                ios.callHandler('goLogin', null, res => {
                  this.$toast('去登录')
                })
              })
            }
          })
        })
      } else if (true) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({
            userId: userId,
            token: token,
            isLogin: true,
            mobileFlag: true
          })
          option.userId = userId
          this.upLike(option)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          option.userId = this.user.userId
          this.upLike(option)
        } else {
          this.$router.push('/login')
        }
      }
    },
    upLike(option) {
      if (this.datas.isLiked) {
        option.isLike = 1
        this.datas.likeNum = Number(this.datas.likeNum) - 1
      } else {
        this.datas.likeNum = Number(this.datas.likeNum) + 1
      }
      this.datas.isLiked = !this.datas.isLiked
      this.$axios.$post(isLike, option).then(res => {
        console.log(res)
        if (res.code === 10000) {

        }
      })
    },
    onClickImg(index) {
      ImagePreview({
        images: this.imageList,
        startPosition: index,
        onClose() {
          // do something
        }
      })
    },
    ...mapActions(['saveLogin'])
  },
  components: {
    // OneLine
  }
}
</script>

<style lang="scss" scoped>
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
      .userInfo {
        flex-direction: column;
        justify-content: space-between;
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
  }
  .dianzanWraper {
    display: flex;
    align-items: center;
    font-size: 12px;
    // margin-right: 10px;
    padding: 0.05rem 10px;
    z-index: 30;
    position: relative;
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
    margin: 10px 0;
  }
  .photo {
    display: flex;
    flex-wrap: wrap;

    z-index: 30;
    position: relative;
    :nth-child(3n) {
      margin-right: 0;
    }
    img {
      width: 105px;
      height: 105px;
      overflow: hidden;
      margin: 0 10px 10px 0;
      object-fit: cover;
    }
    .palyer {
      width: 105px;
      height: 105px;
      overflow: hidden;
      position: relative;

      z-index: 30;
      margin: 0 10px 10px 0;
      background: rgba(0, 0, 0, 0.8);
      text-align: center;
      .btn {
        position: absolute;
        width: 17px;
        height: 20px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        @include bg-image('common/btnplayer');
        background-size: cover;
      }
      video {
        width: 100%;
      }
    }
    .videofixed {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      video {
        width: 90%;
        height: 90%;
      }
      .exitBtn {
        margin: 0 auto;
        width: 80px;
        text-align: center;
        margin-top: 15px;
        font-size: 15px;
        color: #333;
        letter-spacing: 0;
        padding: 10px 15px;
        background: hsla(0, 0%, 100%, 0.8);
        box-shadow: 0 2.5px 5px 0 rgba(0, 0, 0, 0.05);
        border-radius: 15px;
      }
    }
  }
  .reply {
    width: 100%;
    background: #F2F2F2;
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
      border-bottom-color: #F2F2F2;
    }
  }
  .lineWraper {
    margin-top: 15px;
  }
}
</style>
