<template>
   <section class="shareWrap">
     <backbar bgColor="#fff" leftColor="#333" @setHeight="setHeight" :shartOption="shartOption" title="邀请好友"
     />
     <div class="content" ref="content">
        <div class="imgwrap pr">
          <img :src="require('~/assets/img/about/top.png')" width="100%">
          <div class="btn pa" @click="share"></div>
        </div>
        <div class="tips df">
          <div class="text">
            <p class="f20 fw600 tac">{{sharData.shareNum}}</p>
            <p class="f13 fw400 tac margintop">已邀请好友/人</p>
          </div>
          <div class="text">
            <p class="f20 fw600 tac ">{{sharData.shareTeaSilverNum}}</p>
            <p class="f13 fw400 tac margintop">已赚茶银</p>
          </div>
        </div>

        <div class="bottom">
          <img :src="require('~/assets/img/about/bottom@2x.png')" width="100%">
        </div>
     </div>
   </section>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
import backbar from '~/components/backbar'
import { URL } from '~/config/constant.js'
import { mapGetters, mapActions } from 'vuex'
import { shareApi } from '~/api/self'
export default {
  data() {
    return {
      sharData: {
        shareNum: 0,
        shareTeaSilverNum: 0
      },
      shartOption: {
      }
    }
  },
  mounted() {
    this.initGet()
  },
  watch: {

  },
  methods: {
    initGet () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              this.getData(userId)
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
          this.getData(userId)
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      }
    },
    getData(userId) {
      this.$axios.post(shareApi, { userId: userId }).then(res => {
        this.sharData = res.data.data
      })
    },
    setHeight(height) {
      this.$refs.content.style.paddingTop = `${(height + 46) / 37.5}rem`
    },
    share() {
      const option = {
        type: 'url',
        data: {
          title: '我买到一款好茶，1元包邮，一块来薅羊毛呀！', // 分享标题
          desc: '茶臻选商城，超多福利，正品低价，快来看看吧。', // 分享描述
          link: `${URL}/activity/newregister?shareId=${this.user.userId}`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/9a4d7657-9336-4378-9f66-2516fdadc17e.jpg'
        }

      }
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goShareType', JSON.stringify(option), res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goShareType(JSON.stringify(option))
      }
      this.shartOption = Object.assign({}, option)
    },
    ...mapActions(['saveLogin'])
  },
  components: {
    backbar
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.shareWrap{
  background: #06273B;
  height: 100%;
  .content{
    padding-top: 46px;
    .imgwrap{
      font-size: 0;
      .btn{
        bottom: 18px;
        @include bg-image('about/btn');
        width: 280px;
        height: 50px;
        line-height: 50px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .tips{
      @include bg-image('about/tipsbg');
      width: 295px;
      height: 74px;
      margin: 0 auto;
      align-items: center;
      justify-content: space-between;
      color: #F5D1A3;
      padding: 0 38px 0 30px;
      box-sizing: border-box;
      .margintop{
        margin-top: 5px;
      }
    }

    .bottom{
      padding: 15px 18px;
    }
  }
}
</style>
