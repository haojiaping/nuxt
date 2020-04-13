<template>
   <section class="pingjiaItem">
     <nuxt-link :to="`/pingjia/${datas.serviceId}`">
      <div class="imgType pr" >
          <img :src="datas.image[0].imageUrl" alt="" width="100%" height="100%" v-if="datas.image&&datas.image[0]&&datas.image[0].imageUrl">
          <div class="play pa" v-if="datas.frameImage&&datas.frameImage.length>0"></div>
      </div>
      <p class="text f15 c3">{{datas.content}}</p>
     </nuxt-link>
     <div class="auter df">
       <div class="left df">
          <img :src="datas.userImage||require('~/assets/img/self/self@2x.png')" alt="">
          <span class="f12 c6">{{datas.nickName}}</span>
       </div>
       <div class="right df" @click="zanIsLogin">
         <span class="zan" :class="datas.postArticleFlag?'zanactive':'zan'"></span>
         <span class="f15 c9">{{datas.fabulous}}</span>
       </div>
     </div>
   </section>
</template>

<script>
import { sup } from '~/api/post'
import { mapGetters } from 'vuex'
import { WX } from "~/environment/esm";
import { setStore } from '~/utils/tool'
import { wxreURL } from '~/config/constant'
export default {
  name: 'pingjiaItem',
  data() {
    return {

    }
  },
  props: {
    datas: {
      type: Object
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    upDianzan () {
      const option = {
        userId: this.user.userId,
        serviceId: this.datas.serviceId,
        serviceType: 0, // 0是内容  1是评论
        userType: 0,
        attentionType: this.datas.postArticleFlag ? 0 : 1
      }
      this.$axios.$post(sup, option).then(res => {
        if (res.code === 10000) {
          if (this.datas.postArticleFlag) {
            this.$toast('已取消点赞')
            this.datas.fabulous--
          } else {
            this.$toast('点赞成功')
            this.datas.fabulous++
          }
          this.datas.postArticleFlag = !this.datas.postArticleFlag
        }
      })
    },
    zanIsLogin(){
      if (this.user.isLogin) {
        this.upDianzan()
      } else if(WX){
        setStore('__redirectUrl__', this.$route.fullPath)
        window.location.href = `${wxreURL}`
      } else {
        setStore('__redirectUrl__', this.$route.fullPath)
        this.$router.push('/login')
      }
    },
  },
  components: {

  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.pingjiaItem{
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  overflow: hidden;
  .imgType{
    width: 173px;
    height: 173px;
    margin: 0 auto;
    img{
      object-fit: cover;
    }
    .play{
      width: 25px;
      height: 25px;
      left: 10px;
      top: 10px;
      @include bg-image('common/play');
    }
  }
  .text{
    margin: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .auter{
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    overflow: hidden;
    .left{
      align-items: center;
      img{
        width: 15px;
        height: 15px;
        border-radius: 15px;
        margin-right: 5px;
      }
      span{
        width: 80px;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
      }
    }
    .right{
      flex:  0 0 1;
      .zan{
        width: 15px;
        height: 15px;
        @include bg-image('common/dian');
        margin-right: 5px;
        &.zanactive {
          @include bg-image('common/dianzanactive');
        }
      }
    }
  }
}
</style>
