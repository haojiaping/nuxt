<template>
   <div class="chayuItem" >
     <div class="top df">
       <nuxt-link :to="`/userid/${datas.userId}`" class="img">
          <img :src="datas.userImage ? datas.userImage : require('~/assets/img/self/self@2x.png')"
          alt="">
       </nuxt-link>
       <div class="list">
         <nuxt-link :to="`/userid/${datas.userId}`" style="display:block;">
            <p class="f15 c3 fw600">{{datas.nickName}}</p>
         </nuxt-link>
         <p class="f12 c6 fw400">{{datas.time}}</p>
       </div>
     </div>
     <div class="sub" v-if="datas.userType===0">
       <nuxt-link class="c3" style="display:block;" :to="datas.userType===0?`/user/${datas.serviceId}`:`/chayudetail/${datas.textType?datas.textType:''}${datas.serviceId}`">
          <p class="text f17">
            {{datas.content}}
          </p>
          <div class="videoWrap pr" v-if="datas.videoUrl">
            <img :src="`${datas.videoUrl}?x-oss-process=video/snapshot,t_10000,m_fast`" alt="" width="100%" height="100%">
            <div class="playerWraper">
                <van-icon name="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/7/4785fa13-a1b5-4f39-932d-45d94d689f04.jpg" size="60" color="#fff"/>
              </div>
          </div>

          <div class="imageWrap" v-if="datas.image&&datas.image.length>1">
            <img :src="image.imageUrl" alt="" v-for="(image, index) in datas.image" :key="`img_${index}`" @click.stop.prevent="viewImg(index)">
          </div>

            <div class="imageWrapOne" v-else-if="datas.image&&datas.image.length===1" >
            <img @click.stop.prevent="viewImg(0)"
            :src="datas.image[0].imageUrl" alt="" class="oneImg" :class="datas.image[0].width >= (datas.image[0].height - 10) || datas.image[0].width <= (datas.image[0].height + 10)?'':'other'">
            </div>
       </nuxt-link>

        <div class="footer df">
          <div class="fitem df">
            <div class="pin"></div>
            <span>{{datas.commentNum}}</span>
          </div>
          <div class="fitem df" @click="zanIsLogin">
            <div :class="datas.postArticleFlag?'zanactive':'zan'"></div>
            <span>{{datas.fabulous}}</span>
          </div>
          <div class="fitem df">
            <div class="zhuan"></div>
          </div>
        </div>
     </div>
     <nuxt-link class="chashuo df" v-else :to="datas.userType===0?`/user/${datas.serviceId}`:`/chayudetail/${datas.textType?datas.textType:''}${datas.serviceId}`">
       <div class="left">
         <span class="tag">茶语</span>
          <span class="f16 c3">{{datas.title}}</span>
        </div>
        <img :src="datas.image[0].imageUrl" alt="">
     </nuxt-link>
   </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { sup } from '~/api/post'
import { mapGetters } from 'vuex'
import { WX } from '~/environment/esm';
import { setStore } from '~/utils/tool'
import { wxreURL } from '~/config/constant'
// 0 帖子   1 文章
export default {
  name: 'chayuItem',
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
    // 帖子点赞
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
    zanIsLogin() {
      if (this.user.isLogin) {
        this.upDianzan()
      } else if (WX) {
        setStore('__redirectUrl__', this.$route.fullPath)
        window.location.href = `${wxreURL}`
      } else {
        setStore('__redirectUrl__', this.$route.fullPath)
        this.$router.push('/login')
      }
    },
    viewImg(index) {
      const arr = []
      this.datas.image.map(img => {
        arr.push(img.imageUrl)
      })
      ImagePreview({
        images: arr,
        startPosition: index,
        onClose() {
          // do something
        }
      })
    }
  },
  components: {

  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.chayuItem{
  display: block;
  color: #333;
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  .top{
    .img{
      width: 33px;
      height: 33px;
      border-radius:17px;
      margin-right: 10px;
      img{
        width: 33px;
        height: 33px;
        border-radius:17px;
        margin-right: 10px;
      }
    }
  }

  .sub{
    display: block;
    .text{
      margin: 10px 0;
      //超出2行显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .videoWrap{
      width: 325px;
      height: 183px;
      margin: 0 auto;
      img{
        object-fit: cover;
      }
      .playerWraper {
        position: absolute;
        // bottom: 50px;
        z-index: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }

    .imageWrap{
      img{
        width: 105px;
        height: 105px;
        margin: 0 5px 5px 0;
        object-fit: cover;
      }
      :nth-child(3n){
        margin-right:  0;
      }

    }

    .imageWrapOne{
      .oneImg{
        max-width: 80%;
        &.other{
          width: 105px;
          height: 100%;
        }
      }
    }

  .footer {
    margin-top: 15px;
      .fitem {
        width: 33.33%;
        align-items: center;
        justify-content: center;
        > div {
          width: 16px;
          height: 16px;
          background-size: cover;
          &.pin {
            width: 16px;
            height: 16px;
            @include bg-image('tiezi/pin');
          }
          &.zan {
            @include bg-image('common/dianzan');
          }
          &.zanactive {
            @include bg-image('common/dianzanactive');
          }
          &.zhuan {
            @include bg-image('common/fen');
          }
        }
        span {
          margin-left: 5px;
          line-height: 15px;
        }
      }
    }
  }

  .chashuo {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    img {
      width: 100px;
      height: 75px;
      background: #ccc;
      border: none;
      object-fit: cover;
    }
    .left {
      margin-right: 15px;
      flex: 1;
      span{
        line-height: 20px;
      }
      .tag{
        width:36px;
        height:15px;
        background:rgba(212,89,73,1);
        border-radius:8px;
        padding: 2px 6px;
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>
