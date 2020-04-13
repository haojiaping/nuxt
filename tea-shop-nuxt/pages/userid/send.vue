<template>
   <div class="senddisWraper">
    <backbar title="发帖"/>
    <div class="sub">

      <div class="fieldWraper">
        <van-field class="van-hairline--surround"
          v-model="postContent"
          type="textarea"
          placeholder="写点什么，分享您的茶生活"
          rows="1"
          :autosize = "{ minHeight: 120 }"
        />
      </div>
      <div class="videoWraper">
        <div class="imgWraper" v-for="(item,index) in postImage" :key="index">
          <img :src="item.imageUrl" >
          <div class="delbtn" @click="delImg(index)"></div>
        </div>
        <div class="upTip">
          <UpImage @imgUrl="imgUrl" type="post"></UpImage>
        </div>
      </div>
      <div class="btn-wrap f18 cf tac" @click="send">发表</div>
    </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'
import backbar from '~/components/backbar'
import UpImage from '~/components/upimage/UpImage'
import { save } from '~/api/post'
export default {
  data() {
    return {
      postContent: '',
      postImage: []
    }
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    imgUrl(e) {
      this.postImage.push(e)
    },
    delImg(index) {
      this.postImage.splice(index, 1)
    },
    send() {
      let postImage = this.postImage.map(item => {return item.data})
      let option = {
        userId: this.user.userId,
        postContent: this.postContent,
        videoUrl: "",
        postImage: postImage.join(','),
        frameImage: ""
      }
      this.$axios.$post(save,option).then(res => {
        if (res.code === 10000) {
          this.$toast.success('发表成功')
          this.$router.back();
        } else {
          this.$toast.fail('评价成功')
        }
      })
    }
  },
  computed: {
    // player() {
    //   return this.$refs.videoPlayer.player
    // },
    ...mapGetters([
      'user'])
  },
  components: {
    backbar,
    UpImage
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.sub{
  padding-top: 55px;
}
.fieldWraper /deep/ .van-field__control::placeholder {
  line-height: 20px;
}
.fieldWraper, .videoWraper {
  background: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.videoWraper {
  display: flex;
  flex-wrap: wrap;
  .upTip {
    width: 105px;
    height: 105px;
    overflow: hidden;
    background-size: cover;
    @include bg-image('tiezi/upimge');

    margin: 10px 10px 10px 0;
  }
  // .upvideo {
  //   width: 105px;
  //   height: 105px;
  //   overflow: hidden;
  //   background-size: cover;
  //   @include bg-image('upvideo');

  //   margin: 10px 10px 10px 0;
  //   .palyer {
  //     width: 100%;
  //     height: 100%;
  //     position: relative;
  //     .btn {
  //       position: absolute;
  //       width: 12px;
  //       height: 12px;
  //       top: 50%;
  //       left: 50%;
  //       transform: translate(-50%, -50%);
  //       @include bg-image('btnplayer');
  //       background-size: cover;
  //     }
  //   }
  // }
  .imgWraper {
    position: relative;
    margin: 10px 0;
    margin: 10px 10px 10px 0;
    img {
      width: 105px;
      height: 105px;
    }
    .delbtn {
      position: absolute;
      top: 0;
      right: 0;
      width: 15px;
      height: 15px;
      background-size: cover;
      @include bg-image('tiezi/delbtn');
    }
  }
  :nth-child(3n+0) {
    margin-right: 0;
  }
}
.setDef {
  margin: 0 15px;
  padding-left: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 40px;
  .left {
    display: flex;
    align-items: center;
    .checkicon {
      box-sizing: border-box;
      width: 15px;
      height: 15px;
      @include bg-image('tiezi/check');
      background-size: cover;
      margin-right: 5px;
    }
    .active {
      @include bg-image('tiezi/check-active');
    }
  }
  .right {
    color: #999;
  }
}
.btn-wrap {
  width:270px;
  height:44px;
  line-height:44px;
  margin: 30px auto;
  background:rgba(212,89,73,1);
}
</style>
