<template>
<client-only>
   <section class="registerWrap">
     <backbar bgColor="#fff" leftColor="#333" @setHeight="setHeight" title="邀请好友"
     />
     <div class="content" ref="content">
        <div class="imgwrap pr">
          <img :src="require('~/assets/img/activity/newregister/top.png')" width="100%">
          <div class="inputWrap pa">
            <div class="vaninpWrpa">

              <van-field v-model="mobile" @blur="inputBlur" label="手机号" placeholder="请输入用户名" />
            </div>
            <div class="vaninpWrpa">

              <van-field v-model="code" @blur="inputBlur" label="验证码" placeholder="请输入验证码" >
                <div slot="button" class="getcode f14 fw400" @click="getcode" v-if="!codeInp">
                  获取验证码
                </div>
                <div slot="button" class="getcode f14 fw400" @click="getcode" v-if="codeInp">
                  {{down}}s
                </div>
              </van-field>
            </div>
              <div class="btn f17 fw500 cf" @click="sure">一键领取</div>
          </div>
        </div>
        <div class="title df">
          <p class="line"></p>
          <p class="text">活动规则</p>
          <p class="line"></p>
        </div>
        <div class="ruleWrap f13">
          <p class="duanluo df">
            <span class="left">活动时间：</span>
            <span>2019年10月17日10:00:00 至2019年12月30日23:59:59止； </span>
          </p>
          <p class="duanluo df">
            <span class="left">活动说明：</span>
            <span>好友通过茶臻选用户分享的邀请页面，首次完成茶臻选APP账号注册，可获得1元购茶资格：</span>
          </p>
          <p class="duan">1.在此界面注册，并且使用注册的手机号登录app</p>
          <p class="duan">2.在app内首页-新客活动专区，选择1元的茶下单（包邮）</p>

          <p class="duanluo df">
            <span class="left">特别约定：</span>
            <span>同一帐户、收货人姓名、收货地址、手机号、IP位置来源、设备号等与用户身份相关信息仅可以参与一次，若多次参与，茶臻选app有权不予发货。</span>
          </p>
        </div>
     </div>
      <pop ref="popRef" bgImage="newreg" :btnShow="false" @popClick="popClick"></pop>
   </section>
   </client-only>
</template>

<script>
import backbar from '~/components/backbar'
import { getCheckCode, collCheckCode } from '~/api/login'
import { mobileReg } from '~/utils/validate'
import pop from '~/components/pay/pop'
import { JUMPTOAPPURL } from '~/config/downapp'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      down: 60,
      codeInp: false,
      timer: null,
      resData: {}
    }
  },
  mounted() {

  },
  methods: {
    setHeight(height) {
      this.$refs.content.style.paddingTop = `${(height + 46) / 37.5}rem`
    },
    inputBlur () {
      window.scrollTo(0, 0)
    },
    popClick() {
      window.location.href = `${JUMPTOAPPURL}`
    },
    getcode () {
      if (mobileReg.test(this.mobile)) {
        this.getCodefun()
      } else {
        this.$toast('请输入正确的手机号')
      }
    },
    getCodefun () {
      const option = {
        mobile: this.mobile
      }
      this.$axios.$post(getCheckCode, option).then(res => {
        if (res.code === 10000) {
          this.$toast('获取验证码成功')
          this.resData = res.data
          this.codeInp = true
          this.timer = setInterval(() => {
            this.down--
            if (this.down <= 0) {
              this.down = 60
              this.codeInp = false
              clearInterval(this.timer)
            }
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      })
    },
    sure () {
      const option = {
        mobile: this.mobile,
        checkCode: this.code,
        smsId: this.resData.smsId,
        shareId: this.$route.query.shareId ? this.$route.query.shareId : ''
      }
      this.$axios.$post(collCheckCode, option).then(res => {
        if (res.code === 10000) {
          this.code = ''
          this.mobile = ''
          this.down = 60
          this.codeInp = false
          clearInterval(this.timer)

          this.$refs.popRef.show = true
        } else {
          this.$toast(res.message)
        }
      })
    }
  },

  beforeDestroy () {
    this.down = 60
    this.codeInp = false
    clearInterval(this.timer)
    clearInterval(this.timer)
  },
  watch: {
    code (val, old) {
      if (val.length > 4) {
        this.code = old
      }
    }
  },
  components: {
    backbar,
    pop
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.registerWrap{
  background: #06273B;
  min-height: 100%;
  .content{
    padding-top: 46px;
    .imgwrap{
      font-size: 0;
    }
    .inputWrap{
      width: 300px;
      // height: 45px;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      .btn{
        width:300px;
        height:45px;
        line-height:45px;
        background:rgba(201,30,25,1);
        border-radius:23px;
        text-align: center;
        margin: 15px auto 26px;
      }
      .vaninpWrpa{
        margin: 10px 0;
        .getcode{
          color: #CF4232;
        }
        /deep/ .van-cell{
          background-color: #FFEFE3;
        }
      }
    }
    .ruleWrap{
      background: #06273B;
      color: #8A9EAA;
      padding: 0 17px 50px 17px;
      .duan{
        margin: 25px 0;
      }
      .duanluo{
        margin: 25px 0;
        .left{
          flex: 0 0 70px;
        }
      }
    }
    .title{
      color: #8A9EAA;
      padding-top: 20px;
      align-items: center;
      justify-content: center;
      .line{
        width:33px;
        height:1px;
        background:rgba(138,158,170,1);
      }
      .text{
        margin: 0 5px;
      }
    }
  }
}
</style>
