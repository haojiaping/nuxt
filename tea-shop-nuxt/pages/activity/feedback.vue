<template>
   <section>
     <backbar bgColor="#fff"
             title="回馈老茶友"
             :rightIcon="gobackMyback?'share':''"
             :shartOption="shartOption"
             @setHeight="setHeight" />
      <div class="content" ref="content">
        <img :src="require(`~/assets/img/activity/feedback/${item}.png`)" @click="jumpToPage(item)" width="100%" v-for="item in 4" :key="item">
        <p class="tips">*温馨提示：点击支付跳出到三方收款界面后请勿支付，需客服调价。如有疑问请联系<span style="text-decoration:underline;" @click="jumpTocustom">在线客服</span></p>
      </div>
   </section>
</template>

<script>
import backbar from '~/components/backbar'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
export default {
  data() {
    return {
      shartOption: {
        type: 'url',
        data: {
          title: '回馈老茶友， 珍稀老茶馆与严选口粮茶7折优惠', // 分享标题
          desc: '老茶虽好，一泡难求，一起来围观下能喝的古董吧！', // 分享描述
          link: `${URL}/activity/feedback`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      }
    }
  },
  mounted() {
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
  },
  watch: {

  },
  methods: {
    setHeight (height) {
      this.$refs.content.style.paddingTop = `${height + 46}px`
    },
    jumpToPage(e) {
      if (e === 2) {
        this.$router.push({ path: '/opera/special', query: { type: 57, name: '严选口粮茶', gobackMyback: this.gobackMyback } })
      } else if (e === 3) {
        this.$router.push({ path: '/opera/oldtea', query: { gobackMyback: this.gobackMyback } })
      }
    },
    jumpTocustom() {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('goCustomerService', null, res => {
          })
        })
      } else if (ANDROID) {
        window.android.goCustomerService()
      } else {
        this.$router.push('/custom')
      }
    }
  },
  components: {
    backbar
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    }
  }
}
</script>

<style scoped lang='scss'>
.content{
  font-size: 0;
  padding-top: 46px;
  background: #632E04;
  .tips{
    font-size:12px;
    font-weight:300;
    color:rgba(255,203,161,1);
    line-height:18px;
    padding: 10px 23px 50px 23px;
  }
}
</style>
