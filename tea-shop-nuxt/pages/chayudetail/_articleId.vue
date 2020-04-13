<template>
   <section class="chayudetailWrap">
     <backbar bgColor="#fff" leftColor="#333" @setHeight="setHeight" :shartOption="shartOption" :rightImg="shareshow?'share-line':''"/>

     <div class="mescroll pf" ref="mescroll">
       <div class="div" id="LiveDetailWraper">
       <div class="sub">

         <p class="title">{{datas.title}}</p>
         <div class="name">
          <img :src="datas.userImage||' '">
          <span>{{datas.userName}}</span>
         </div>

        <!-- 文章内容 -->
        <div class="newconent" v-html="datas.content"></div>
        <div class="footer">
          <div class="number">
            <i class="eye"></i>
            <!-- <span class="num">{{datas.readCount}}</span> -->
            <span class="text">{{datas.readCount}}人看过</span>
          </div>
          <div class="right border" @click="handClickDianzan">
            <i class="dianzan" v-if="datas.thumbUpFlag===0" ></i>
            <i class="dianzanactive" v-if="datas.thumbUpFlag===1"></i>
            <span class="num">{{datas.thumbUpCount}}</span>
          </div>
        </div>

       </div>
       </div>
       <div class="dissWraper">
         <div class="titleWraper">
           <span class="disstitle">评论</span>
           <span class="dissnum">({{datas.commentCount}})</span>
         </div>
         <DiscussInput :userimage="datas.currentUserImage" @sendDis='sendDis' ref="disInput"></DiscussInput>
         <div class="lineWraper">
         </div>
        <LiveDiscuss :itemdata='item' :lineShow="index===(datas.comment.length-1)?false:true" v-for="(item,index) in datas.comment" :key="index"></LiveDiscuss>
        <p class="showAll" @click="disPop = true">查看全部{{datas.commentCount}}条评论</p>
       </div>
       <div class="goodsWraper" v-if="datas.productList&&datas.productList.length>0">
         <p class="title">茶品</p>
         <div class="good" :class="index===datas.productList.length?'':'border-bottom'" v-for="(item,index) in datas.productList" :key="index">
           <img :src="item.productImage" alt="">
           <div class="goodInfo">
             <p class="name">{{item.productName}}</p>
             <div class="price">
               <span>¥</span>
               <span>{{item.productPrice}}</span>
             </div>
             <nuxt-link class="btn" :to="{path:`/${item.productId}`}">
               <span>查看</span>
             </nuxt-link>
           </div>
         </div>
         <p class="bottom">已经到底了</p>
       </div>

       <!-- <a :href="`aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${jumpContent}`">asdasdasdasdasd</a> -->
     </div>
     <DiscussPop v-if="disPop" @close ="disPop = false" :articleId='articleId' :currentUserImage="datas.currentUserImage"></DiscussPop>
   </section>
</template>

<script>
import backbar from '~/components/backbar'
import { chayuDetail, chayuThmbup, chayuCancelThumbup, commentSave } from '~/api/chayu'
import { mapGetters, mapActions } from 'vuex'
import LiveDiscuss from '~/components/chayu/LiveDiscuss'
import DiscussInput from '~/components/tiezi/DiscussInput'
import DiscussPop from '~/components/chayu/DiscussPop'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant'
export default {
  async asyncData ({ $axios, store, route }) {
    const articleId = route.params.articleId
    const tagArr = ['y', 'r', 'g', 'b', 'z']
    const urlOne = articleId.substring(0, 1)
    const isSEO = tagArr.includes(urlOne)
    const datas = await ($axios.$post(chayuDetail, {
      userId: store.getters.user.userId || '',
      articleId: isSEO ? route.params.articleId.substring(1) : route.params.articleId
    }))
    return { datas: datas.detail }
  },
  data() {
    return {
      disPop: false,
      shartOption: {}
    }
  },
  mounted() {
    const articleId = this.$route.params.articleId
    const tagArr = ['y', 'r', 'g', 'b', 'z']
    const urlOne = articleId.substring(0, 1)
    const isSEO = tagArr.includes(urlOne)
    this.articleId = isSEO ? this.$route.params.articleId.substring(1) : this.$route.params.articleId
    this.getDetail()
    this.mescrollInit()
  },
  watch: {

  },
  methods: {

    sendDis(message) {
      const option = {
        articleId: this.articleId,
        userId: this.user.userId,
        content: message
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              option.userId = userId
              this.comment(option)
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
          this.comment(option)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.comment(option)
        } else {
          // 存储登录后跳转页面
          this.$router.push('/login')
        }
      }
    },
    // 文章点赞
    thmbup(option) {
      if (this.datas.thumbUpFlag === 0) {
        this.datas.thumbUpFlag = 1
        this.datas.thumbUpCount++
        this.$axios.$post(chayuThmbup, option).then(res => {

        })
      } else {
        this.datas.thumbUpFlag = 0
        this.datas.thumbUpCount--
        this.$axios.$post(chayuCancelThumbup, option).then(res => {

        })
      }
    },
    // 发表评论
    comment(option) {
      this.$axios.$post(commentSave, option).then(res => {
        if (res.code === 10000) {
          this.$toast('发表成功')
          this.$refs.disInput.message = ''
          this.getDetail()
        } else {
          this.$toast(res.message)
        }
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          isBounce: false,
          auto: false,
          lazyLoad: {
            use: true
          },
          toTop: { // 配置回到顶部按钮
            warpId: 'LiveDetailWraper',
            // warpClass: 'myMescrollTotop',
            src: require('~/assets/img/common/toTop.png') // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
          }
        }
      })
    },

    share() {
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goShareType', JSON.stringify(this.shartOption), res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goShareType(JSON.stringify(this.shartOption))
      }
    },

    handClickDianzan() {
      const option = {
        userId: this.user.userId,
        articleId: this.datas.articleId
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              option.userId = userId
              this.thmbup(option)
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
          this.thmbup(option)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          this.thmbup(option)
        } else {
          this.$router.push('/login')
        }
      }
    },
    getDetail() {
      this.$axios.$post(chayuDetail, {
        userId: this.user.userId || '',
        articleId: this.articleId
      }).then(res => {
        this.datas = res.detail
        this.shartOption = {
          type: 'url',
          data: {
            title: this.datas.title, // 分享标题
            desc: this.datas.userName, // 分享描述
            link: `${URL}/chayudetail/${this.articleId}`, // 分享链接
            imgUrl: this.datas.titleImage
          }
        }
        this.getShareWxArg(this.shartOption)
      })
    },
    setHeight(height) {
      this.$refs.mescroll.style.top = `${height + 46}px`
    },
    ...mapActions(['saveLogin', 'getShareWxArg'])
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  head() {
    return {
      title: `${this.datas.title}-茶臻选`,
      meta: [
        { hid: 'article-description', name: 'description', content: this.datas.content.replace(/<\/?.+?>/g, '').replace(/↵/g, '').replace(/[\r\n]/g, '').substring(0, 120) }
      ]
    }
  },
  components: {
    backbar,
    LiveDiscuss,
    DiscussInput,
    DiscussPop
  },
  computed: {
    ...mapGetters(['user']),
    shareshow () {
      return IOS || ANDROID
    }
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.chayudetailWrap{
  .mescroll{
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
  }

  .sub {
    background: #fff;
    font-weight: normal;
    padding: 15px;
    box-sizing: border-box;
    .title {
      font-size: 21px;
      font-weight: bold;
      color: #333;
      line-height: 25px;
    }
    .name {
      display: flex;
      align-items: center;
      margin: 10px 0;
      img {
        width: 20px;
        height: 20px;
        @include bg-image('self/self');
        background-size: cover;
        border: none;
        margin-right: 5px;
        border-radius: 50%;
      }
      span {
        color: #666;
        font-size: 14px;
      }
    }
    .itemimg {
      width: 100%;

      background: #ccc;
      margin: 10px 0;
    }
    .text {
      font-size: 15px;
      line-height: 20px;
      color: #333;
    }
    .newconent {
      width: 100%;
      white-space: pre-wrap;
      /deep/ img {
        max-width: 100%;
      }
      /deep/ i {
        font-style: italic;
      }
      /deep/ b, /deep/ strong, /deep/ h1, /deep/ h2, /deep/ h3, /deep/ h4, /deep/ h5, /deep/ h6 {
        font-weight: bold;
      }
    }
    .footer {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .number {
        display: flex;
        align-items: center;
        font-size: 12px;
        .eye {
          width: 16px;
          height: 16px;
          @include bg-image('common/eye');
          background-size: cover;
          margin-right: 5px;
        }
        .num {
          color: #333;
          margin-right: 5px;
        }
        .text {
          color: #999;
          font-size: 12px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        font-size: 12px;

        padding: 0.05rem 10px;
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
    }
  }

.dissWraper {
  margin-top: 15px;
  background: #fff;
  .titleWraper {
    padding: 15px 10px;
    font-weight: normal;
    font-size: 18px;
    .disstitle {
      color: #333;
    }
    .dissnum {
      color: #666;
    }
  }
  .showAll {
    text-align: center;
    color: #666;
    font-size: 14px;
    background: #fff;
    padding: 10px 0 15px;
    box-sizing: border-box;
    font-weight: normal;
  }
}
.lineWraper {
  padding: 15px;
}
.goodsWraper {
  margin: 10px;
  font-weight: normal;
  .title {
    font-size: 18px;
    margin: 15px 0 10px 0;
  }
  .good {
    display: flex;
    padding: 10px;
    background: #fff;
    position: relative;
    img {
      flex: 0 0 95px;
      height: 95px;
      background: #ccc;
    }
    .name {
      font-size: 15px;
      margin: 5px 0 15px 15px;
    }
    .price {
      margin-left: 20px;
      color: #D45949;
      :first-child {
        font-size: 12px;
      }
      :last-child {
        font-size: 15px;
      }
    }
    .btn {
      position: absolute;
      right: 15px;
      bottom: 10px;
      width: 60px;
      text-align: center;
      background: #D45949;
      color: #fff;
      padding: 5px 10px;
      box-sizing: border-box;
    }
  }
  .bottom {
    margin: 10px 0;
    text-align: center;
    color: #999;
    font-size: 12px;
  }
}

}
</style>
