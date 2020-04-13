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
            <img :src="require('~/assets/img/activity/bigstraight/top@2x.png')"
                 alt="">
          </div>
          <div class='get-voucher'>
            <img :src="require('~/assets/img/activity/bigstraight/top1@2x.png')"
                 class='bg'
                 alt="">
            <span class='btn'></span>
            <span class='btn1'></span>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/bigstraight/title1@2x.png')"
                 alt="">
            <goodList :dataList='dataList'
                      voucher='20'
                      :isCenter='false'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/bigstraight/title2@2x.png')"
                 alt="">
            <goodList :dataList='dataList1'
                      voucher='50'
                      :isCenter='true'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/bigstraight/title3@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'
                      voucher='100'
                      :isCenter='false'></goodList>
          </div>
          <!-- 规则说明 -->
          <div class='guize'>
            <p class='title'>优惠券使用规则</p>
            <p>
              1、活动时间：2019.9.11-2019.10.11。
            </p>
            <p>
              2、每张优惠券仅限购买对应专区商品可用，购买对应专区外商品不可使用。
            </p>
            <p>
              3、每个用户每天可领取3次优惠券，每张优惠券有效期3天。
            </p>
            <p>
              4、优惠券一经使用不予退回。
            </p>
            <p>
              5、如使用优惠券支付，产生退款的订单，金额按比例分摊，退款金额不超过实际支付金额。
            </p>
            <p>
              6、特别约定：同一收货地址、同一收货人、同一手机号下单满足以上任一条件，视为同一用户，同一用户重复领券下单视为恶意刷单，平台有权拒绝发货，退回实际付款并封停用户账户，用户在本页面领取优惠券视为认同此约定。
            </p>
            <p>
              7、如需大批量采购，请加客服微信：
            </p>
            <p class='wechat'>客服微信:&nbsp;&nbsp;&nbsp;chazhenxuan888</p>
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
import { getSpecial } from '~/api/special'
import Backbar from '~/components/backbar'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import goodList from '~/components/activity/bigstraight'

export default {
  async asyncData ({ $axios }) {
    const option = {
      specialType: 37,
      lastId: 0,
      userId: ''
    }
    const dataList = []; const dataList1 = []; const dataList2 = []
    await $axios.$post(getSpecial, option).then(res => {
      const arr = res.data
      if (res.code === 10000) {
        const len = [6, 11, 16]
        arr.map((item, index) => {
          if (index < len[0]) {
            dataList.push(item)
          } else if (index < len[1] && index >= len[0]) {
            dataList1.push(item)
          } else if (index < len[2] && index >= len[1]) {
            dataList2.push(item)
          }
        })
      } else {
        this.$toast(res.message)
      }
    })
    return {
      dataList: dataList,
      dataList1: dataList1,
      dataList2: dataList2
    }
  },
  data () {
    return {
      topDataList: {},
      dataList: [],
      dataList1: [],
      dataList2: [],
      backBar: 'transparent',
      changeColor: 'white',
      color: 'Second',
      shartOption: {
        type: 'url',
        data: {
          title: '中秋礼品专区', // 分享标题
          desc: '买好茶喝好茶，横扫市场价!', // 分享描述
          link: `${URL}/about/downapp`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#fff',
      rightIconColor: '#fff',
      title: '',
      showWindow: true
    }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata(37)
  },
  watch: {
  },
  methods: {
    getSpecialdata (specialType) {
      console.log('tag', '11111')
      this.$axios.$post(getSpecial, {
        specialType: specialType,
        lastId: 0,
        userId: ''
      }).then(res => {
        this.dataList = []
        this.dataList1 = []
        this.dataList2 = []
        const arr = res.data
        const len = [6, 11, 16]
        arr.map((item, index) => {
          if (index < len[0]) {
            this.dataList.push(item)
          } else if (index < len[1] && index >= len[0]) {
            this.dataList1.push(item)
          } else if (index < len[2] && index >= len[1]) {
            this.dataList2.push(item)
          }
        })
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
        this.title = '中秋礼盒'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
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
    }
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
      background: #f7d6a6;
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
          background: rgba(148, 71, 10, 1);
          border-radius: 3px;
          color: #feefdc;
          font-size: 14px;
          line-height: 26px;
          font-weight: bold;
          text-align: center;
          top: -13px;
          left: 0;
          z-index: 10;
        }
        &::after {
          content: '';
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid rgba(148, 71, 10, 1);
          border-radius: 5px;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: top left;
        }
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
