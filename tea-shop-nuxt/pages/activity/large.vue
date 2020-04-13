<template>
   <section class="content">
     <backbar :bgColor="backBarOptions.bgColor"
             :leftImg="backBarOptions.leftImg"
             :rightImg="shareshow?backBarOptions.rightImg:''"
             :title="backBarOptions.title"
             :leftSize="backBarOptions.leftSize"
             :rightSize="backBarOptions.rightSize"
             :shartOption="shartOption"/>
     <div class="mescroll" ref="mescroll">
       <div>
          <div class="header pr" ref="top">
            <img :src="require('~/assets/img/activity/large/header.png')" width="100%">
            <div class="good pa" @click="jumpTo">
              <img :src="require('~/assets/img/activity/large/headergood.png')" width="100%">
            </div>
          </div>
          <div class="tabs df">
            <div class="tab-item" @click="scrollTo(0)">
              <img :src="require('~/assets/img/activity/large/pu.png')" width="79px" height="58px">
            </div>
            <div class="line van-hairline--left"></div>
            <div class="tab-item"  @click="scrollTo(1)">
              <img :src="require('~/assets/img/activity/large/yan.png')" width="74px" height="61px">
            </div>
            <div class="line van-hairline--left"></div>
            <div class="tab-item"  @click="scrollTo(2)">
              <img :src="require('~/assets/img/activity/large/wait.png')" width="56px" height="56px">
            </div>
            <div class="line van-hairline--left"></div>
            <div class="tab-item"  @click="scrollTo(3)">
              <img :src="require('~/assets/img/activity/large/wait.png')" width="56px" height="56px">
            </div>
          </div>
          <div ref="one">
            <div class="titleimg">
              <img :src="require('~/assets/img/activity/large/putitle.png')" width="100%">
            </div>
            <div>
              <goodLarge v-for="(item,index) in dataList" :key="index" :pro="item" :typeText="['单饼','一提']"></goodLarge>
            </div>
            <div class="footimg" @click="$router.push('/tasting')">
              <img :src="require('~/assets/img/activity/large/pufoot.png')" width="100%">
            </div>
            <div class="coutom df">
              <p class="cf f12">* 如需整箱购买请联系客服微信：<span class="f12" style="color:#ECCDA3;">chazhenxuan888</span></p>
              <div class="coutombtn tac" @click="copy">点击复制</div>
            </div>
          </div>
          <div ref="two">
            <div class="titleimg">
              <img :src="require('~/assets/img/activity/large/yantitle.png')" width="100%">
            </div>
            <div>
              <goodLarge v-for="(item,index) in dataList1" :key="index" :pro="item" :typeText="['单品','组合']"></goodLarge>
            </div>
            <div class="footimg" @click="jumpToYan">
              <img :src="require('~/assets/img/activity/large/yanfoot.png')" width="100%">
            </div>
            <div class="coutom df">
              <p class="cf f12">* 如需整箱购买请联系客服微信：<span class="f12" style="color:#ECCDA3;">chazhenxuan888</span></p>
              <div class="coutombtn tac" @click="copy">点击复制</div>
            </div>
          </div>
          <div class="titimg" style="font-size:0;">
            <img :src="require('~/assets/img/activity/large/footer.png')" width="100%">
          </div>
       </div>
     </div>
   </section>
</template>

<script>
import goodLarge from '~/components/activity/large/goodLarge'
import { getSpecial } from '~/api/special'
import { IOS, ANDROID } from '~/environment/esm'
import backbar from '~/components/backbar'
import { mapActions } from 'vuex'
import { URL } from '~/config/constant.js'
const backBarOptionsScroll = {
  bgColor: '#fff',
  leftImg: '',
  rightImg: 'share-line',
  title: '超值整件',
  leftSize: '20px',
  rightSize: '25px'
}
const backBarOptionsOn = {
  bgColor: 'transparent',
  leftImg: 'back',
  rightImg: 'share',
  title: '',
  leftSize: '25px',
  rightSize: '25px'
}
export default {
  data() {
    return {
      backBarOptions: Object.assign({}, backBarOptionsOn),
      shartOption: {
        type: 'url',
        data: {
          title: '买7饼普洱送1饼真实惠!', // 分享标题
          desc: '价格85折，更有收藏价值，你也快来看看吧', // 分享描述
          link: `${URL}/activity/large`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      dataList: [],
      dataList1: []
    }
  },
  mounted() {
    this.mescrollInit()
    this.getdata(47)
    this.getdata(48)
    this.getShareWxArg(this.shartOption)
  },
  watch: {

  },
  methods: {
    mescrollInit (mescroll) {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          auto: false,
          isBounce: false
        },
        down: {
          use: false
        }
      })
      this.mescroll.optUp.onScroll = this.meScorllScroll
    },
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 100) {
        this.backBarOptions = Object.assign({}, backBarOptionsScroll)
      } else {
        this.backBarOptions = Object.assign({}, backBarOptionsOn)
      }
    },
    getdata(type) {
      this.$axios.$post(getSpecial, {
        specialType: type,
        lastId: 0,
        userId: ''
      }).then(res => {
        if (type === 47) {
          this.dataList = res.data
        } else if (type === 48) {
          this.dataList1 = res.data
        }
      })
    },
    jumpTo() {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler(
            'jumpOtherPage',
            { jumpType: 'brandType', jumpContent: '{"brandId":"201907171632521099000184"}' },
            () => { }
          )
        })
      } else if (ANDROID) {
        window.android.jumpOtherPage('brandType', '{"brandId":"201907171632521099000184","imagerUrl":"https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/7/d7334afb-a0ce-4f99-aafa-347758ef2ecf.jpg","title":"文涛壶略"}')
      } else {
        this.$router.push('/pinpai/wentaohulue')
      }
    },
    jumpToYan() {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler(
            'jumpOtherPage',
            { jumpType: 'productList', jumpContent: '{"categoryId":"2019061810515475728000017"}' },
            () => { }
          )
        })
      } else if (ANDROID) {
        window.android.jumpOtherPage('productList', '{"categoryId":"2019061810515475728000017","title":"岩茶"}')
      } else {
        this.$router.push('/type/2019061810515475728000017')
      }
    },
    copy() {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', 'chazhenxuan888')
      document.body.appendChild(input)
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$toast('复制成功')
      }
      document.body.removeChild(input)
    },
    scrollTo(e) {
      const top = this.$refs.top.clientHeight
      const one = this.$refs.one.clientHeight
      if (e === 0) {
        this.mescroll.scrollTo(top - 40)
      } else if (e === 1) {
        this.mescroll.scrollTo(one + top + 100)
      }
    },
    ...mapActions(['getShareWxArg'])
  },
  computed: {
    shareshow () {
      return IOS || ANDROID
    }
  },
  components: {
    goodLarge,
    backbar
  }
}
</script>

<style scoped lang='scss'>
.content{
  background:rgba(20,81,112,1);
  .mescroll{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
    background:rgba(20,81,112,1);
  }
  .header{
    font-size: 0;
    .good{
      bottom: 0;
      margin: 0 10px;
    }
  }
  .tabs{
    height: 81px;
    background:rgba(31,57,80,1);
    box-shadow:0px -2px 15px 0px rgba(31,57,80,0.27);
    align-items: center;
    justify-content: space-between;
    padding: 0 13px;
    .tab-item{
      width: 79px;
      height: 58px;
      text-align: center;
    }
    .line{
      width:1px;
      height:30px;
      margin-left: 5px;
      &.van-hairline--left:after{
        border-color:rgba(247,213,168,1);
        opacity:0.37;
      }
    }
  }
  .titleimg{
    margin: 50px 0 20px;
  }
  .coutom{
    margin: 0 10px;
    align-items: center;
    .coutombtn{
      margin-left: 5px;
      width:71px;
      height:25px;
      line-height:25px;
      color: #F6D2A3;
      border:1px solid rgba(231,180,117,1);
      // background:linear-gradient(90deg,rgba(255,229,193,1),rgba(231,180,117,1));
      border-radius:5px;
    }
  }
  .footimg{
    margin: 10px;
  }
  /deep/ .mescroll-upwarp{
    min-height:0;
    padding: 0;
  }
}
</style>
