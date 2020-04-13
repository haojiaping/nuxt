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
             :title='title'
             class='back' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/midAutumn/sub1@2x.png')"
                 alt="">
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/midAutumn/title4@2x.png')"
                 alt="">
            <goodList :dataList='dataList'
                      specialType='37'
                      :color='color'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/midAutumn/title5@2x.png')"
                 alt="">
            <goodList :dataList='dataList1'
                      specialType='37'
                      :color='color'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/midAutumn/title6@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'
                      specialType='37'
                      :color='color'></goodList>
          </div>
          <div class='guize-title'>
            <img :src="require('~/assets/img/activity/midAutumn/guize-title@2x.png')"
                 alt="">
          </div>
          <div class='guize'>
            <p>
              1. 100元优惠券仅限购买本活动专区内商品可用，专区外 其他商品不适用。
            </p>
            <p>
              2. 优惠券一经使用不予退回。
            </p>
            <p>
              3. 如使用优惠券支付，产生退款的，按用户实际支付金 额退款。
            </p>
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
import goodList from '~/components/activity/midAutumn/goodList'

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
        const len = [11, 22, 37]
        arr.map((item, index) => {
          item.discountsPrice = parseInt(item.discountsPrice - 100)
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
          title: '超值福利专区', // 分享标题
          desc: '买好茶喝好茶，横扫市场价!', // 分享描述
          link: `${URL}/about/welfare`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#333',
      rightIconColor: '',
      title: ''
    }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata(37)
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
  },
  watch: {
  },
  methods: {
    async getSpecialdata (specialType) {
      await this.$axios.$post(getSpecial, {
        specialType: specialType,
        lastId: 0,
        userId: ''
      }).then(res => {
        // console.log(Promise.resolved)
        this.dataList = []
        this.dataList1 = []
        this.dataList2 = []
        const arr = res.data
        const len = [11, 22, 37]
        arr.map((item, index) => {
          item.discountsPrice = parseInt(item.discountsPrice - 100)
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
        this.title = '超值福利专区'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
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
      @include bg-image('activity/midAutumn/bg');
      position: relative;
      padding-bottom: 45px;
      .top-bg {
        background: #f2f7f9;
      }
      .white {
        /deep/ .van-icon-arrow-left {
          color: #fff !important;
        }
      }
      .black {
        /deep/ .van-icon-arrow-left {
          color: rgba(116, 161, 196, 1) !important;
        }
      }
      .top-img {
        img {
          width: 100%;
          font-size: 0;
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
      .guize-title {
        width: 114px;
        height: 26px;
        margin: 40px auto 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .guize {
        margin: 0 10px;
        padding: 0 10px;
        padding-top: 20px;
        margin-top: -27.5px;
        position: relative;
        padding-bottom: 10px;
        p {
          font-size: 14px;
          color: #a57220;
          line-height: 18px;
          margin-bottom: 10px;
          // opacity: 0.8;
        }
      }
    }
  }
}
</style>
