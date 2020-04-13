<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <backbar :bgColor="backBar"
             :fixed='true'
             :title='title'
             class='back' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class="subWrap pr"
             ref="subWrap">
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon1@2x.png')"
                 alt="">
            <img :src="require('~/assets/img/activity/newkezhuce/icon10@2x.png')"
                 v-if='isNewKe'
                 @click='initGet'
                 alt="">
            <img :src="require('~/assets/img/activity/newkezhuce/icon5@2x.png')"
                 v-else
                 alt="">
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon6@2x.png')"
                 alt="">
            <goodList :dataList='dataList'
                      :price='88'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon7@2x.png')"
                 alt="">
            <goodList :dataList='dataList1'
                      :price='88'></goodList>
          </div>
          <!-- <div class='data-content'>
            <img :src="require('~/assets/img/activity/newkezhuce/icon8@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'></goodList>
          </div> -->
          <p class='guize'>
            活动规则: <br>
            1、本活动新用户（未购买的用户）可参与，优惠券每日限量1000张，领完即止。 <br>
            2、88元优惠券仅限购买活动专区内商品使用，专区外其他商品不适用，结算时选择“88福利专区券”，即可使用。<br>
            3、每位用户能领取一张优惠券，购买本专区商品仅限使用一张优惠券。<br>
            4、优惠券一经使用不予退回。<br>
            5、如使用优惠券支付，产生退款的，退款金额不超过实际支付金额。<br>
            6、特别约定：同一收货地址、同一收货人、同一手机号下单满足以上任一条件，视为同一用户，同一用户重复领券下单视为恶意刷单，平台有权拒绝发货，退回实际付款并封停用户账户，用户在本页面领取优惠券视为认同此约定。<br>
          </p>
        </div>
      </div>
    </div>
    <van-dialog v-model="isShow"
                :show-confirm-button='false'
                :show-cancel-button='false'
                message-align='center'
                class='show-content'>
      <p class='show-text'>亲爱的茶友<br>
        本优惠券仅限新用户领取<br>
        您可以去看看其他优惠活动</p>
      <div class='show-btn'>
        <van-button type="primary"
                    class='cancel'
                    @click='handelCancel'>取消</van-button>
        <van-button type="primary"
                    class='sure'
                    @click='handelJump'>去看看</van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { activityList, Coupon } from '~/api/activity'
import backbar from '~/components/backbar'
import goodList from '~/components/activity/newkezhuce'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
import { mapGetters } from 'vuex'
// import { URL } from '~/config/constant.js'
export default {
  data () {
    return {
      backBar: 'transparent',
      dataList: [],
      dataList1: [],
      dataList2: [],
      title: '',
      isShow: false,
      isNewKe: true
      // shartOption: {
      //   type: 'url',
      //   data: {
      //     title: '小臻邀请您参与限时秒杀', // 分享标题
      //     desc: '10点开抢，爆品低价，1元，1折，大牌0利润。', // 分享描述
      //     link: `${URL}/opera/limitedtime`, // 分享链接
      //     imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
      //   }
      // }
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
        activityId: '2019080711035817024000018',
        userId: this.user.userId || ''
      }
      this.$axios.$post(activityList, option).then(res => {
        const arr = res.data
        this.dataList = []
        this.dataList1 = []
        this.dataList2 = []
        if (res.code === 10000) {
          this.isNewKe = res.userFlag
          const len = [10, 50, 36]
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
    initGet () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              // 领券方法
              this.user.userId = userId
              this.$dialog.confirm({
                title: '提示',
                message: '是否确认领取?',
                beforeClose: this.beforeClose
              })
            } else {
              // 登陆方法
              ios.callHandler('getAppVersion', null, res => {
                const version = Number(res.slice(0, 1))
                if (version < 2) {
                  ios.callHandler('goLogin', null, res => {
                  })
                } else {
                  ios.callHandler('goLoginActivity', null, res => {
                  })
                }
              })
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          // let token = window.android.getToken()
          // let isLogin = true
          // 领券方法
          this.user.userId = userId
          this.$dialog.confirm({
            title: '提示',
            message: '是否确认领取?',
            beforeClose: this.beforeClose
          })
        } else {
          // 登陆方法
          const version = Number(window.android.getAppVersion().slice(0, 1))
          if (version < 2) {
            window.android.goLogin()
          } else {
            window.android.goLoginActivity()
          }
        }
      } else {
        if (this.user.isLogin) {
          this.$dialog.confirm({
            title: '提示',
            message: '是否确认领取?',
            beforeClose: this.beforeClose
          })
        } else {
          // 如果没有登录保存当前页面拉取授权后再返回当前页面
          setStore('__redirectUrl__', this.$route.fullPath)
          if (WX) {
            window.location.href = `${wxreURL}`
          } else {
            this.$router.push({
              path: '/login',
              query: { shopId: this.$route.query.shopId ? this.$route.query.shopId : '' }
            })
          }
        }
      }
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        const params = {
          couponType: '3',
          userId: this.user.userId,
          activityId: '2019080711035817024000018'
        }
        const close = done
        this.$axios.$post(Coupon, params).then((res) => {
          if (res.code === 10000) {
            close()
            if (res.data === '0') {
              this.$toast({ message: '领取成功!本页面商品下单用券减88元', duration: 2000 })
            } else if (res.data === '1') {
              this.isShow = true
            } else {
              this.$toast({ message: '您已经领过此券,本页面商品下单用券减88元', duration: 2000 })
            }
            this.isNewKe = false
          }
        }).catch(() => {
          close()
        })
      } else {
        done()
      }
    },
    handelJump () {
      this.isShow = false
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
        this.title = '超值福利专区'
        this.rightIconColor = '#333'
      } else {
        this.backBar = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
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
    },
    ...mapGetters(['user'])
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
    /deep/ .van-dialog {
      padding: 20px;
      width: 72%;
      .show-text {
        font-size: 15px;
        line-height: 20px;
        color: rgba(51, 51, 51, 1);
        margin: 0 auto;
      }
      .show-btn {
        margin-top: 25px;
        text-align: center;
        .cancel {
          background: #ccc;
          width: 100px;
        }
        .sure {
          background: #333;
          width: 100px;
          margin-left: 30px;
        }
      }
    }
  }
}
</style>
