<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <backbar :bgColor="backBar"
             @setHeight='getHeight'
             :fixed='true'
             :title='title'
             class='back' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon1.jpg')"
                 alt="">
            <img :src="require('~/assets/img/activity/newkezhuce/icon11@2x.png')"
                 alt="">
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon6@2x.png')"
                 alt="">
            <goodList :dataList='dataList'
                      :price='100'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon7@2x.png')"
                 alt="">
            <goodList :dataList='dataList1'
                      :price='100'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon8@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'
                      :price='100'></goodList>
          </div>
          <p class='guize'>
            活动规则: <br>
            1、新人活动时间：2019年9.20-2019.10.31，优惠券有效期为2019年9.20-2019.10.31 <br>
            2、活动期间，新用户(无历史付款成功的用户)可
            登陆此页面领取优惠券，优惠券每日限量1000张，
            领完即止。<br>
            3、新人100元优惠券仅限购买活动专区内商品使用，
            专区外其他商品不适用，结算时选择新人100元优
            惠券，即可使用。<br>
            4、一个新用户仅能领取一张优惠券，购买本专区商
            品仅限使用一张优惠券。<br>
            5、优惠券一经使用不予退回。<br>
            6、如使用优惠券支付，产生退款的订单。金额按比
            例分摊，退款金额不超过支付金额。<br>
            7、特别约定:同一收货地址、同一收货人、同一手
            机号下单满足以上任条件，视为同一用户，同一用
            户重复领券下单视为恶意刷单。平台有权拒绝发货，
            退回实际付款并封停用户账户，用户在本页面领取
            优惠券视为认同此约定。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { activityList } from '~/api/activity'
import backbar from '~/components/backbar'
import goodList from '~/components/activity/newkezhuce'
import { URL } from '~/config/constant.js'
import { IOS, ANDROID } from '~/environment/esm'
export default {
  async asyncData ({ $axios }) {
    const option = {
      activityId: '2019080711035817024000018'
    }
    const dataList = []
    const dataList1 = []
    const dataList2 = []
    await $axios.$post(activityList, option).then(res => {
      const arr = res.data
      if (res.code === 10000) {
        const len = [12, 20, 24]
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
      backBar: 'transparent',
      dataList: [],
      dataList1: [],
      dataList2: [],
      title: ''
    }
  },
  created () {
  },
  mounted () {
    this.getSpecialdata()
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    getSpecialdata () {
      const option = {
        activityId: '2019080711035817024000018'
      }
      this.$axios.$post(activityList, option).then(res => {
        const arr = res.data
        this.dataList = []
        this.dataList1 = []
        this.dataList2 = []
        if (res.code === 10000) {
          const len = [12, 20, 24]
          arr.map((item, index) => {
            if (index < len[0]) {
              this.dataList.push(item)
            } else if (index < len[1] && index >= len[0]) {
              this.dataList1.push(item)
            } else if (index < len[2] && index >= len[1]) {
              this.dataList2.push(item)
            }
          })
        } else {
          this.$toast(res.message)
        }
      })
    },
    getHeight (data) {
      this.isFlag = data
      this.style.height = data + 'px'
    },
    handelCancel () {
      this.isShow = false
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
        this.backBar = '#fff'
        this.leftColor = '#333'
        this.title = '新人专区'
        this.rightIconColor = '#333'
      } else {
        this.backBar = 'transparent'
        this.title = ''
      }
    }
  },
  components: {
    goodList,
    backbar
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    shareBtn () {
      // return (IOS || ANDROID) ? 'share' : ''
      return 'share'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
@mixin title {
  padding-top: 10px;
  height: 35px;
  line-height: 17.5px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.semWraper {
  padding-bottom: 25px;
  position: relative;
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    background: #f2f2f2;
    .listWrap {
      position: relative;
      .top-bg {
        background: #f2f7f9;
      }
      .top-img {
        font-size: 0;
        img {
          width: 100%;
        }
      }
      .data-content {
        margin-top: 10px;
        font-size: 0;
        img {
          width: 100%;
        }
      }
      .guize {
        font-size: 15px;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        padding: 10px;
      }
    }
    /deep/ .mescroll-upwarp {
      min-height: 0;
    }
  }
}
</style>
