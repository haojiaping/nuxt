<template>
   <div class="senddisWraper">
    <backbar title="发表茶评"/>
    <div class="sub">

      <div class="title">
        <span class="titleleft">品评分</span>
        <div class="titleright">
          <van-rate v-model="value" :size="18"/>
          <span>{{value*2}}分</span>
        </div>
      </div>
      <div class="fieldWraper">
        <van-field class="van-hairline--surround"
          v-model="message"
          type="textarea"
          placeholder="本款茶满足你的期待吗？您可以从干茶、汤色、香气、滋味和叶底等方面描述您的感受。"
          rows="1"
          :autosize = "{ minHeight: 120 }"
        />
      </div>
      <div class="videoWraper">
        <div class="imgWraper" v-for="(item,index) in userimgList" :key="index">
          <img :src="item" >
          <div class="delbtn" @click="delImg(index)"></div>
        </div>
        <div class="upTip">
          <UpImage @imgUrl="imgUrl"></UpImage>
        </div>
      </div>
      <div class="setDef">
        <div class="left">
          <i class="checkicon" :class="check===1?'active':''" @click="setdef"></i>
          <span>匿名</span>
        </div>
        <span class="right">你的评价能帮助其他茶友呦</span>
      </div>
      <div class="btn-wrap" @click="send">
      </div>
    </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'
import backbar from '~/components/backbar'
import UpImage from '~/components/upimage/UpImage'
import { senddis } from '~/api/order'
export default {
  data() {
    return {
      value: 5,
      check: 1,
      message: '',
      userimgList: []
    }
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    imgUrl(e) {
      this.userimgList.push(e)
    },
    delImg(index) {
      this.userimgList.splice(index, 1)
    },
    // 是否设置为匿名
    setdef() {
      this.check === 0 ? this.check = 1 : this.check = 0
    },
    send() {
      let option = {
        productId: this.$route.query.productId,
        userId: this.userId,
        imagePath: '',
        videoPath: '',
        content: this.message,
        grade: this.value,
        productOrderId: this.$route.query.productOrderId
      }
      this.userimgList.forEach(item => {
        option.imagePath += item + ','
      })
      option.imagePath = option.imagePath.replace(/,$/gi, '')
      senddis(option).then(res => {
        if (res.code === 10000) {
          this.$router.push({name: 'OrderAss'})
        } else {
          this.$toast('评价成功')
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
  padding-top: 50px;
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  font-weight: normal;
  .titleleft {
    font-size: 15px;
  }
  .titleright {
    display: flex;
    align-items: center;
    font-size: 15px;
    span {
      margin-left: 5px;
      width: 0.68rem;
    }
  }
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
  margin-top: 15px;
}
</style>
