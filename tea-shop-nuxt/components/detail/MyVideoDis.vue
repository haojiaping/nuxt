<template>
   <div>
     <div class="videofixed needsclick">
        <video :src="videoOption.videoPath"
        x5-video-player-type="h5"
        :controls="true"
        :webkit-playsinline="true"
        playsinline
        :preload="true"
        autoplay
        ref="MyVideo"/>
        <div class="exitBtn" @click="exitVideo">退出播放</div>
      </div>
   </div>
</template>

<script>
export default {
  name: 'MyVideoDis',
  data() {
    return {
      popupVideo: false,
      playerBtnShow: false
    }
  },
  props: {
    videoOption: {
      type: Object
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.MyVideo.play()
    }, 50)
  },
  watch: {
    videoOption(val) {
      console.log(val)
    }
  },
  methods: {
    onClickPlay() {
      // this.popupVideo = true // 设置弹出层
      // this.playerBtnShow = false // 退出按钮
      // this.$refs.MyVideo.play()
      this.$emit('videoPlay')
    },
    exitVideo() {
      // this.popupVideo = false
      // this.playerBtnShow = true
      // this.$refs.MyVideo.pause()
      this.$emit('videoExit')
    }
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
.videofixed {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  text-align: center;
  background: rgba(0,0,0,0.8);
  video {
    width: 90%;
    height: 90%;
  }
  .exitBtn {
    margin: 0 auto;
    width: 1.6rem;
    text-align: center;
    margin-top: 0.3rem;
    font-size: 0.3rem;
    color: #333;
    letter-spacing: 0;
    padding: 0.2rem 0.3rem;
    background: hsla(0, 0%, 100%, 0.8);
    box-shadow: 0 2.5px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 15px;
  }
}
</style>
