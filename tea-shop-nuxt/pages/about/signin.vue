<template>
<client-only>
   <section class="signin-wrap" id="sigin">
     <Backbar :fixed='true' bgColor="transparent" leftColor="#fff">
       <div slot="title" class="bartitle f17 fw400">签到领钱</div>
     </Backbar>
     <div class="topbg pf"></div>
     <div ref="mescroll" class='mescroll'>
      <div class="content">
        <div class="day-wrap">
          <div class="day-toptips"></div>
          <div class="day-top df">
            <div class="day-top-left">已经连续签到{{signInTime}}天</div>
            <div class="day-top-right df">
              <span>开启提醒</span>
              <span class="switch" :class="{'switch-active':signRemind}" @click="initGetUserId('remind')"></span>
            </div>
          </div>

          <div class="day-list df">
            <div class="day-list-item" v-for="(item,index) in 6" :key="index">
              <div class="day-icon" :class="index<signInTime?'active':''">

              </div>
              <p class="f12 day-text" :class="index<signInTime?'text-active':''">{{index+1}}天</p>
            </div>
            <div class="day-list-7 df">
              <div class="tips"></div>
              <div class="day-icon">

              </div>
              <p class="f12 day-text">7天</p>
            </div>
          </div>

          <div class="day-btn" @click="initGetUserId('sigin')" v-if="signFlag===0">

          </div>
          <div class="day-btn-ed"  v-if="signFlag===1">

          </div>

        </div>

        <div class="goods-wrap">
          <div class="goods-top df">
            <p class="tac f17 fw500">本期茶盒礼物</p>
            <div class="title-top df">
              <p class="line"></p>
              <p class="text f12">每天一开，7天必中实物</p>
              <p class="line"></p>
            </div>
          </div>
          <div class="goods-items df">
            <div class="goods-item" v-for="index in 6" :key="index">
              <img :src="require(`~/assets/img/about/signin/${index}.png`)" alt="" class="item-img">
            </div>
          </div>
        </div>
        <div class="list-title df">
          <p class="title-icon left"></p>
          <p class="title-text f17 fw500">今日值得买</p>
          <p class="title-icon right"></p>
        </div>
        <div class="pro-list">
          <productList :dataList="dataList"></productList>
        </div>

      </div>
     </div>
    <van-popup v-model="show"
               get-container="#sigin">
      <div class="pop pr tac" v-if="datas">
        <div v-if="datas.type===0">
          <p class="tac f18 fw400 text"
            style="color:##AA7843;">恭喜您获得{{datas.teaSilver}}茶银</p>
          <img :src="require('~/assets/img/about/signin/chayin.png')"
              width="103px" height="59px" style="max-height:118px;margin:10px 0;">
          <p class="text tac f12 fw400 hiddentext">可在“我的-茶银”中查看</p>
          <div class="popbtn tac f16" @click="jumpToPage">知道了</div>
        </div>
        <div v-if="datas.type===1">
          <p class="tac f18 fw400 text"
            style="color:##AA7843;">恭喜您获得</p>
          <div class="couponbg df">
            <div class="cou-left">
              <span class="fw400 f18 cf">￥</span><span class="fw600 f36 cf">{{datas.coupon.discountAmount}}</span>
            </div>
            <div class="cou-right">
              <p class="f15 cf">{{datas.coupon.couponContent}}</p>
              <p class="line"></p>
              <p class="f12 cf">满{{datas.coupon.favourableCondition}}可用</p>
              <p class="f12 cf">{{datas.coupon.startTime}}-{{datas.coupon.endTime}}</p>
            </div>
          </div>
          <div class="popbtn tac f16" @click="jumpToPage">知道了</div>
        </div>
        <div v-if="datas.type===2">
          <p class="tac f18 fw400 text"
            style="color:##AA7843;">恭喜您获得{{datas.product.productName}}茶银</p>
          <img :src="datas.product.productImage"
              width="105px" height="105px" style="margin-bottom:10px;">
          <div class="popbtn tac f16" @click="jumpToPage">马上领取</div>
        </div>

        <div class="close pa" @click="show=false"></div>
      </div>
    </van-popup>
   </section>
</client-only>
</template>

<script>
import productList from '~/components/productList'
import { IOS, ANDROID, WX } from '~/environment/esm'
import Backbar from '~/components/backbar'
import { sign, findSign, remind } from '~/api/self'
import { setStore } from '~/utils/tool'
import { wxreURL, wxreFunPay } from '~/config/constant'
import { mapGetters, mapActions } from 'vuex'
import { getSpecialtype } from '~/api/special'
export default {
  data() {
    return {
      dataList: [],
      mescroll: null,
      show: false,
      signRemind: false,
      datas: {
        coupon: {
          couponFlag: 0,
          couponUserId: null,
          couponId: '2019081515445241818000011',
          couponType: 7,
          favourableCondition: 9.0,
          discountAmount: 8.0,
          deadline: null,
          categoryId: '-',
          couponContent: '随机券',
          startTime: '2019-11-21',
          endTime: '2019-11-22',
          recommendFlag: false,
          jumpType: 'productDetail',
          jumpContent: '{"productId":"2019031411061287514000003"}'
        },
        message: null,
        product: {
          attrId: null,
          content: null,
          inventoryCount: 0,
          productDescription: '布朗王子苏国文亲制古树头春饼  兰香蜜韵  馥郁芬芳',
          productId: '2019031413292588919000025',
          productImage: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/5/5e552b9b-f382-412e-b2e0-0eaf1b417a45.jpg',
          productName: '芒景古树茶饼  布朗茶祖后人亲制 普洱生茶',
          productPrice: null,
          productTitle: '',
          saleNum: null
        },
        teaSilver: '15',
        type: 2// 0 茶音  1优惠券  2商品
      },
      signInTime: 0,
      signFlag: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this.mescrollInit()
      this.initGetUserId()
    }, 20)
  },
  watch: {

  },
  methods: {
    submit(userId) {
      this.$axios.$post(sign, { userId: '2019061813481632019000084' }).then(res => {
        this.datas = res.data
        console.log(res)
        // coupon: null
        // message: null
        // product: null
        // teaSilver: "15"
        // type: 0茶音  1优惠券  2商品
        this.show = true
        this.initGetUserId()
      })
    },
    getSignin(userId) {
      this.$axios.$post(findSign, { userId: '2019061813481632019000084' }).then(res => {
        console.log(res)
        this.signFlag = res.data.signFlag
        this.signInTime = res.data.signInTime
        this.signRemind = res.data.signRemind
        // coupon: null
        // message: null
        // product: null
        // teaSilver: "15"
        // type: 0
      })
    },
    subRemind(userId) {
      this.$axios.$post(remind, { userId: userId }).then(res => {
        if (this.signRemind) {
          this.$toast.success('已关闭提醒')
        } else {
          this.$toast.success('已打开提醒')
        }
        this.signRemind = !this.signRemind
      })
    },
    initGetUserId(arg) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              if (arg === 'sigin') {
                this.submit(userId)
              } else if (arg === 'remind') {
                this.subRemind(userId)
              } else {
                this.getSignin(userId)
              }
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
          if (arg === 'sigin') {
            this.submit(userId)
          } else if (arg === 'remind') {
            this.subRemind(userId)
          } else {
            this.getSignin(userId)
          }
        } else {
          window.android.isLoginFinishWeb(true, ' ')
        }
      } else {
        if (this.user.isLogin) {
          if (arg === 'sigin') {
            this.submit(this.user.userId)
          } else if (arg === 'remind') {
            this.subRemind(this.user.userId)
          } else {
            this.getSignin(this.user.userId)
          }
        } else {
          setStore('__redirectUrl__', this.$route.fullPath)
          // 微信中  先保存当前url  然后进行重定向获取code  提交code   获取到用户信息 后会跳转到之前保存的url中
          if (WX) {
            window.location.replace(wxreURL)
          } else {
            this.$router.push('/login')
          }
        }
      }
    },
    jumpToPage () { // 0茶音  1优惠券  2商品
      // if (this.datas.type === 0) {
      //   this.$router.replace('/activity/welfare')
      // } else
      if (this.datas.type === 2) {
        const sendAPP = {
          productName: this.datas.product.productName,
          productImage: this.datas.product.productImage,
          productId: this.datas.product.productId,
          productCount: 1,
          attrId: this.datas.product.attrId,
          productPrice: this.datas.product.productPrice,
          unitPrice: this.datas.product.productPrice
        }
        if (IOS) {
          window.callback(ios => {
            ios.callHandler('goConfirmPay', JSON.stringify(sendAPP), res => {
            })
          })
        } else if (ANDROID) {
          const sendIAND = {
            productName: this.datas.product.productName,
            productImage: this.datas.product.productImage,
            productId: this.datas.product.productId,
            num: 1,
            attrId: this.datas.product.attrId,
            productPrice: this.datas.product.productPrice,
            unitPrice: this.datas.product.productPrice
          }
          window.android.goPay(JSON.stringify(sendIAND))
        } else {
          const orderData = []
          orderData.push(sendAPP)
          sessionStorage.setItem('__teaOrder__', JSON.stringify(orderData))
          sessionStorage.setItem('__teapayType__', 'detail')
          if (WX) {
            window.location.href = `${wxreFunPay}`
          } else {
            this.$router.replace('/pay/sure')
          }
        }
        this.show = false
      }
    },
    getList(page, mescroll) {
      this.$axios.$post(getSpecialtype, {
        pageNum: page.num - 1,
        specialType: 58
      }).then(res => {
        const arr = res.data
        if (page.num === 1) this.dataList = []
        this.dataList = [...this.dataList, ...arr]
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      }).catch((res) => {
        this.$toast(res.message)
        mescroll.endErr()
      })
    },
    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          isBounce: false,
          lazyLoad: {
            use: true
          },
          callback: this.getList
        }
      })
      // this.mescroll.optUp.onScroll = this.meScorllScroll
    },
    ...mapActions(['saveLogin'])
  },
  beforeDestroy () {
    // this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  components: {
    Backbar,
    productList
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.signin-wrap{
  .bartitle{
    color: #fff;
  }
  .topbg{
    width: 100%;
    height: 260px;
    top: 0;
    left: 0;
    right: 0;
    @include bg-image('about/signin/topbg');
  }
  .mescroll{
    position: fixed;
    top: 46px;
    bottom: 0;
    height: auto;
  }
  .content{
    margin-top: 55px;
    .day-wrap{
      width:355px;
      background:rgba(170,120,67,1);
      border-radius:10px;
      margin: 0 auto;
      padding: 20px 15px;
      box-sizing: border-box;
    }
    .day-toptips{
      width: 256px;
      height: 20px;
      @include bg-image('about/signin/toptips');
      margin: 0 auto 10px;
    }
    .day-top{
      color: #FFE1C2;
      font-size: 14px;
      justify-content: space-between;
      align-items: center;
      .day-top-left{

      }
      .day-top-right{
        align-items: center;
        .switch{
          margin-left: 5px;
          width: 42px;
          height: 20px;
          @include bg-image('about/signin/siwtch-active');
          &.switch-active{
            @include bg-image('about/signin/close');
          }
        }
      }
    }
    .day-list{
      align-items: center;
      padding: 10px 0;
      .day-list-item{
        align-self: flex-end;
        .day-icon{
          width: 26px;
          height: 32px;
          @include bg-image('about/signin/nomal');
          margin: 0 19px 8px 0;
          &.active{
            width: 35px;
            height: 41px;
            margin: 0 10px 2px 0;
            @include bg-image('about/signin/active');
          }
        }
        .day-text{
          color: #DEB891;
          margin-left: 5px;
          &.text-active{
            color: #FFE1C2;
          }
        }
      }
      .day-list-7{
        flex-direction: column;
        align-items: center;
        .tips{
          width: 69px;
          height: 18px;
          @include bg-image('about/signin/tips');
        }
        .day-icon{
          margin: 9px 0;
          width: 26px;
          height: 32px;
          @include bg-image('about/signin/day7');
        }
        .day-text{
          color: #DEB891;
          &.text-active{
            color: #FFE1C2;
          }
        }
      }
    }
    .day-btn{
      width:208px;
      height:48px;
      line-height:48px;
      @include bg-image('about/signin/btn');
      margin: 15px auto 0px;
    }
    .day-btn-ed{
      width:208px;
      height:48px;
      line-height:48px;
      @include bg-image('about/signin/btned');
      margin: 15px auto 0px;
    }

    .goods-wrap{
      margin: 10px;
      .goods-top{
        width: 100%;
        height: 69px;
        @include bg-image('about/signin/centerbg');
        flex-direction: column;
        justify-content: flex-end;
        .title-top{
          align-items: center;
          justify-content: center;
          .line{
            width:54px;
            height:1px;
            background:rgba(170,120,67,1);
          }
          .text{
            margin: 0 5px;
            color: #AA7843;
          }
        }
      }
      .goods-items{
        padding: 15px;
        background: #fff;
        border-radius: 0 0 10px 10px;
        flex-wrap: wrap;
        .goods-item{
          width: 33.33%;
          text-align: center;
          margin-bottom: 10px;
          .item-img{
            width: 90px;
            height: 90px;
          }
        }
      }
    }
    .list-title{
      align-items: center;
      justify-content: center;
      .title-icon{
        width: 8px;
        height: 8px;
        &.left{
          @include bg-image('about/signin/left')
        }
        &.right{
          @include bg-image('about/signin/right')
        }
      }
      .title-text{
        margin: 0 5px;
        color:#AA7843;
      }
    }
    .pro-list{
      margin: 10px;
      background: #fff;
      border-radius: 8px;
    }
  }

.pop {
  // width: 300px;
  // height: 320px;
  padding: 28px;
  .popbtn {
    width:200px;
    height:40px;
    line-height:40px;
    background:rgba(170,120,67,1);
    border-radius:20px;
    color: #FFE1C2;
    margin: 0 auto;
  }
  .text {
    margin-bottom: 10px;
    color: #AA7843;
  }
  .hiddentext{
    @include text-over(1);
    margin: 15px 0;
  }
  .couponbg{
    @include bg-image('about/signin/couponbg');
    width: 254px;
    height: 84px;
    margin: 15px auto;
    align-items: center;
    .cou-left{
      margin: 0 15px;
    }
    .cou-right{
      margin: 10px 0;
      flex: 1;
      .line{
        height: 1px;
        background:rgba(253,159,137,1);
      }
    }
  }
  .close {
    width: 28px;
    height: 28px;
    @include bg-image('activity/cdk/close');
    top: -55px;
    right: 0px;
  }
}
/deep/ .van-popup--center {
  border-radius: 8px;
}
/deep/ .van-popup {
  overflow-y: visible;
  width: 80%;
}
}
</style>
