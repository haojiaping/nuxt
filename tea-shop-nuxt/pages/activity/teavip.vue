<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <Backbar :bgColor="bgColor"
             @setHeight='getHeight'
             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :fixed='true'
             :shartOption="shartOption"
             ref='topBar'
             :rightIconColor='rightIconColor'
             :leftColor='leftColor'
             :title='title' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/teavip/bg@2x.png')"
                 alt="">
          </div>
          <div class='data-content'>
            <goodList :dataList='dataList'
                      :dataTopList='dataTopList'
                      voucher='20'
                      :isCenter='false'></goodList>
          </div>
          <!-- 规则说明 -->
          <div class='guize'>
            <p class='title'>优惠券使用规则</p>

            <p>1、超值满99减50专区券和超值满39减20专区券仅限购买本专区内商品可用，专区外其他商品不适用。</p>

            <p>2、一个用户仅能领取一次优惠券，购买本专区商品每笔订单仅限使用一张优惠券。</p>

            <p>3、优惠券一经使用不予退回。</p>

            <p>4、如使用优惠券支付，产生退款的订单，金额按比例分摊，退款金额不超过支付金额。</p>

            <p>5、特别约定：同一收货地址、同一收货人、同一手机号下单满足以上任一条件，视为同一用户，同一用户重复领券下单视为恶意刷单，平台有权拒绝发货，退回实际付款并封停用户账户，用户在本页面领取优惠券视为认同此约定。</p>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="showWindow"
               :get-container="getContainer">
      <div class='my-container'>
        <img :src="require('~/assets/img/activity/bigstraight/bg@2x.png')"
             alt=""
             class='content'>
        <img :src="require('~/assets/img/activity/bigstraight/btn@2x.png')"
             alt=""
             @click="close"
             class='btn'>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { activityList } from '~/api/activity'
import Backbar from '~/components/backbar'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import goodList from '~/components/activity/teavip'
import { mapGetters } from 'vuex'

export default {
  async asyncData ({ $axios }) {
    const option = {
      activityId: '2019101516023125211001109',
      userId: ''
    }
    let dataList = []; const dataTopList = []
    await $axios.$post(activityList, option).then(res => {
      if (res.code === 10000) {
        const arr = res.data
        dataTopList.push(arr[0])
        dataList = arr
      } else {
        this.$toast(res.message)
      }
    })
    return {
      dataList: dataList,
      dataTopList: dataTopList
    }
  },
  data () {
    return {
      topDataList: {},
      dataList: [],
      dataTopList: [],
      backBar: 'transparent',
      changeColor: 'white',
      color: 'Second',
      shartOption: {
        type: 'url',
        data: {
          title: '会员专享专区', // 分享标题
          desc: '买好茶喝好茶，横扫市场价!', // 分享描述
          link: `${URL}/about/downapp`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#333',
      rightIconColor: '#333',
      title: '',
      showWindow: false
    }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata()
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
  },
  watch: {
  },
  methods: {
    getSpecialdata () {
      console.log('tag', '11111')
      this.$axios.$post(activityList, {
        activityId: '2019101516023125211001109',
        userId: this.user.userId || ''
      }).then(res => {
        this.dataList = []
        this.dataTopList = []
        const arr = res.data
        this.dataTopList.push(arr[0])
        this.dataList = arr
      })
    },
    getContainer () {
      return document.querySelector('.semWraper')
    },
    close () {
      this.showWindow = false
    },
    getHeight (data) {
    },
    mescrollInit () {
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
          }
        }
      })
      this.mescroll.optUp.onScroll = this.meScorllScroll
    },
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 50) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '会员专享'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#333'
        this.rightIconColor = '#333'
      }
    }
  },
  beforeDestroy () {
    // this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  components: {
    goodList,
    Backbar
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
$color: #2f00d1;
.semWraper {
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    /deep/ .mescroll-upwarp {
      display: none;
    }
    .listWrap {
      background: #FBECD6;
      position: relative;
      padding-bottom: 45px;
      .top-bg {
        background: #f2f7f9;
      }
      .top-img {
        img {
          width: 100%;
          font-size: 0;
        }
      }
      .get-voucher {
        position: relative;
        img {
          width: 100%;
        }
        .btn,
        .btn1 {
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          bottom: 65px;
          width: 240px;
          height: 56px;
        }
        .btn {
          @include bg-image('activity/bigstraight/icon');
        }
        .btn {
          @include bg-image('activity/bigstraight/icon1');
        }
      }
      .data-content {
        margin-top: 5px;
        img {
          width: 355px;
          display: block;
          margin: auto;
        }
        font-size: 0;
      }
      .guize {
        margin: 0 10px;
        border-top: none;
        padding: 0 10px;
        padding-top: 20px;
        position: relative;
        padding-bottom: 10px;
        margin-top: 40px;
        .title {
          position: absolute;
          width: 121px;
          height: 26px;
          // background: rgba(148, 71, 10, 1);
          border-radius: 3px;
          color: #914900;
          font-size: 14px;
          line-height: 26px;
          font-weight: bold;
          text-align: center;
          top: -13px;
          left: 0;
          z-index: 10;
        }
        // &::after {
        //   content: '';
        //   width: 200%;
        //   height: 200%;
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   border: 1px solid rgba(148, 71, 10, 1);
        //   border-radius: 5px;
        //   -webkit-transform: scale(0.5, 0.5);
        //   transform: scale(0.5, 0.5);
        //   -webkit-transform-origin: top left;
        // }
        p {
          font-size: 14px;
          color: #94470a;
          line-height: 18px;
          margin-bottom: 10px;
          // opacity: 0.8;
        }
        .wechat {
          width: 295px;
          height: 35px;
          background: rgba(148, 71, 10, 1);
          border-radius: 5px;
          color: rgba(255, 239, 221, 1);
          font-size: 18px;
          text-align: center;
          line-height: 35px;
          font-weight: bold;
          margin: 0 auto;
        }
      }
    }
  }
  .van-popup {
    background: transparent;
    width: 330px;
  }
  .my-container {
    background: transparent;
    position: relative;
    .content {
      width: 100%;
    }
    .btn {
      position: absolute;
      width: 175px;
      height: 49px;
      left: 0;
      right: 0;
      margin: auto;
      top: 90px;
    }
  }
}
</style>
