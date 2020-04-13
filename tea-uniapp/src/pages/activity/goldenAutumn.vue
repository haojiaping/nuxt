<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <!-- :rightIcon="gobackMyback?'share':''" -->
    <Backbar :bgColor="bgColor"
             @setHeight='getHeight'
             :rightSize="rightSize"
             :rightIcon="rightIcon"
             :rightImgTea='rightImgTea'
             :fixed='true'
             myshareType='myshare'
             :shartOption="shartOption"
             ref='topBar'
             rightIconColor='#333'
             :leftColor='leftColor'
             :title='title' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/bigstraight/top111@2x.png')"
                 alt="">
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/bigstraight/top2@2x.png')"
                 alt="">
            <goodList :dataList='dataList'
                      :voucher='20'
                      :isCenter='false'></goodList>
          </div>
          <!-- <div class='data-content'>
            <img :src="require('~/assets/img/activity/bigstraight/title5@2x.png')"
                 alt="">
            <goodList :dataList='dataList1'
                      :voucher='50'
                      :isCenter='true'></goodList>
          </div> -->
          <!-- <div class='data-content'>
            <img :src="require('~/assets/img/activity/bigstraight/title6@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'
                      :voucher='100'
                      :isCenter='false'></goodList>
          </div> -->
          <!-- 规则说明 -->
          <div class='guize'>
            <p class='title'>优惠券使用规则</p>
            <p>
              1、价格说明
            </p>
            <p>
              ·划线价格
            </p>
            <p>
              指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考。
            </p>
            <p>
              ·未划线价格
            </p>
            <p>
              指商品的实时标价，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。
            </p>
            <p>
              2、如需大批量采购，请加客服微信：
            </p>
            <p class='wechat'>客服微信:&nbsp;&nbsp;&nbsp;chazhenxuan888</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import Backbar from '~/components/backbar'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import goodList from '~/components/activity/bigstraight/goldenAutumn'

export default {
  async asyncData ({ $axios }) {
    const option = {
      specialType: 41,
      lastId: 0,
      userId: ''
    }
    let dataList = []; const dataList1 = []; const dataList2 = []
    await $axios.$post(getSpecial, option).then(res => {
      const arr = res.data
      if (res.code === 10000) {
        // const len = [13, 17, 30]
        dataList = arr
        // arr.map((item, index) => {
        //   if (index < len[0]) {
        //     dataList.push(item)
        //   } else if (index < len[1] && index >= len[0]) {
        //     dataList1.push(item)
        //   } else if (index < len[2] && index >= len[1]) {
        //     dataList2.push(item)
        //   }
        // })
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
      rightIcon: '',
      rightImgTea: 'teafriend',
      color: 'Second',
      shartOption: {
        type: 'url',
        data: {
          title: '金秋收获专场热卖尖货', // 分享标题
          desc: '你也快来看看吧，我在这里买到了特别便宜的好茶!茶臻选是一家只卖真差好茶的商城', // 分享描述
          link: `${URL}/activity/goldenAutumn`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#914900',
      rightIconColor: '#333',
      rightSize: '105px',
      title: ''
    }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata(41)
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
  },
  watch: {
  },
  methods: {
    getSpecialdata (specialType) {
      this.$axios.$post(getSpecial, {
        specialType: specialType,
        lastId: 0,
        userId: ''
      }).then(res => {
        this.dataList = []
        this.dataList1 = []
        this.dataList2 = []
        const arr = res.data
        this.dataList = arr
        // const len = [13, 17, 30]
        // arr.map((item, index) => {
        //   if (index < len[0]) {
        //     this.dataList.push(item)
        //   } else if (index < len[1] && index >= len[0]) {
        //     this.dataList1.push(item)
        //   } else if (index < len[2] && index >= len[1]) {
        //     this.dataList2.push(item)
        //   }
        // })
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
        this.title = '热卖尖货'
        this.rightImgTea = ''
        this.rightIcon = 'share'
        this.rightSize = '20px'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#914900'
        this.rightIcon = ''
        this.rightImgTea = 'teafriend'
        this.rightSize = '105px'
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
          color: #94470a;
          font-size: 18px;
          text-align: center;
          line-height: 35px;
          font-weight: 600;
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
