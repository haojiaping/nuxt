<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <Backbar :bgColor="bgColor"
             :leftColor='leftColor'
             :fixed='true'
             :shartOption="shartOption"
             myshareType='myshare'
             ref='topBar'
             @setHeight='getHeight'
             :myshare='myshare'
             :rightColor='rightColor'
             :title='title'>
    </Backbar>
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap content">
        <div class='top-list'
             :class="isHai?'all-bg':''">
          <!-- <img :src="require(`~/assets/img/opera/limittime/top@2x.png`)"
               class='all-bg'
               v-if='!isHai'
               alt="">
          <img :src="require(`~/assets/img/opera/limittime/top1@2x.png`)"
               class='all-bg'
               v-else
               alt=""> -->
          <p class='title'><img :src="require(`~/assets/img/opera/limittime/title@2x.png`)"
                 alt=""></p>
          <!-- <ul class='time-list'>
            <li class='time-content'
                v-for='(item,index) in timeList'
                :class="item.saleFlag==='抢购中'?'active':''"
                :key='`id_${index}`'>
              <p>{{item.startTime}}</p>
              <p>{{item.saleFlag}}</p>
            </li>
          </ul> -->
          <div class="tag-wrapper df time-list"
               v-if="timeList.length>0"
               v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper">
              <div v-for="(item , index) in timeList"
                   class="swiper-slide"
                   @click="changeData(item)"
                   :key="`tag_${index}`">
                <div class="swiper-item time-content"
                     :class="activetab.endTime===item.endTime?'active':''">
                  <p class='timer'>{{item.startTime}}</p>
                  <p>{{item.saleFlag}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='time'>
          <p class='left'>库存有限,抢完即止</p>
          <div class='right'>
            <van-count-down millisecond
                            @finish='handelfinish'
                            :time="remainingTime || 0">
              <template v-slot="timeData">
                <span class="item">{{ timeData.hours  |changeTime}}:</span>
                <span class="item">{{ timeData.minutes |changeTime}}:</span>
                <span class="item">{{ timeData.seconds |changeTime}}:</span>
                <span class="item">{{ parseInt(timeData.milliseconds/10)|changeTime }}</span>
              </template>
            </van-count-down>
          </div>
        </div>
        <!-- 列表 -->
        <div class="bottom df"
             v-if="dataList">
          <div class='top-product'
               v-for='(item,index) in dataList'
               :key="index">
            <img :src="item.productImage"
                 alt=""
                 @click="jumpDetail(item.productId)"
                 class='product-img'>
            <div class='product-msg'>
              <p class='product-title'
                 @click="jumpDetail(item.productId)">{{item.productName}}</p>
              <div class='progress-content'>
                <p class='progress'>
                  <transition appear>
                    <span :style='{width:`${parseInt(item.percentage*100)}%`}'></span>
                  </transition>
                </p>
                <p class='num'>已售{{parseInt(item.percentage*100)}}%</p>
              </div>
              <div class='product-bottom'>
                <p class='product-desc'>
                  <span class='newPrice'>¥{{item.discountPrice}}</span>
                  <span class='oldPrice'>¥{{item.virtualPrice}}</span>
                </p>

                <p class='btn1'
                   v-if='item.pushFlag===0'
                   @click="remind(item)">开抢提醒</p>
                <p class='btn2'
                   v-else-if='item.pushFlag===1'
                   @click="reminded()">已提醒</p>
                <p class='btn3'
                   v-else
                   @click="immediately(item)">马上抢</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Backbar from '~/components/backbar'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import { limitTime, limitTimeReminde } from '~/api/activity'
import { parseTime } from '~/utils'
import { wxreURL } from '~/config/constant'
import { setStore } from '~/utils/tool'
import { mapGetters } from 'vuex'
export default {
  data () {
    var that = this
    return {
      shartOption: {
        type: 'url',
        data: {
          title: '小臻邀请您参与限时秒杀', // 分享标题
          desc: '10点开抢，爆品低价，1元，1折，大牌0利润。', // 分享描述
          link: `${URL}/opera/limitedtime`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#fff',
      title: '',
      myshare: '#fff',
      timeList: [],
      dataList: [],
      rightColor: '#fff',
      date: new Date().getTime() + 1000,
      activetab: {},
      limitedId: '',
      isGrap: true,
      isHai: false,
      swiperOption: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 13,
        on: {
          init () {
            // swiper 初始化时获取所需数据
            that.swiperWidth = this.$el[0].clientWidth
            that.maxTranslate = this.maxTranslate()
            that.maxWidth = -that.maxTranslate + that.swiperWidth / 2
          },
          tap () {
            // 点击时  处理
            if (that.activetab === that.timeList[this.clickedIndex]) {
              return
            }
            that.activetab = that.timeList[this.clickedIndex]
            // that.dataList = that.timeList[this.clickedIndex].productList
            var slide, slideLeft, slideWidth, slideCenter, nowTlanslate
            slide = this.slides[this.clickedIndex]
            slideLeft = slide.offsetLeft
            slideWidth = slide.clientWidth
            slideCenter = slideLeft + slideWidth / 2

            this.setTransition(300)
            if (slideCenter < that.swiperWidth / 2) {
              this.setTranslate(0)
            } else if (slideCenter > that.maxWidth) {
              this.setTranslate(that.maxTranslate)
            } else {
              nowTlanslate = slideCenter - that.swiperWidth / 2
              this.setTranslate(-nowTlanslate)
            }
          }
        }
      }
    }
  },
  created () {
  },
  mounted () {
    // window.addEventListener('scroll', this.handleScroll, true)
    this.init()
    if (!(IOS || ANDROID)) {
      setTimeout(() => {
        window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
      }, 20)
    }
    this.mescrollInit()
  },
  watch: {
  },
  methods: {
    init (item) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              this.getDataList(userId)
            } else {
              this.getDataList('')
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          this.getDataList(userId)
        } else {
          this.getDataList('')
        }
      } else {
        this.getDataList(this.user.userId)
      }
    },
    async getDataList (userId) {
      await this.$axios.$post(limitTime, { userId: userId }).then((res) => {
        if (res.code === 10000) {
          this.timeList = res.data
          // this.timeList.sort((a, b) => {
          //   return a.startTime < b.startTime
          // })
          this.timeList.map((item) => {
            if (item.saleFlag === 0) {
              //   item.saleFlag = '即将开枪'
              const startTime = parseTime(item.startTime, '{y}-{m}-{d}').split('-')[2]
              const newTime = parseTime(new Date().getTime(), '{y}-{m}-{d}').split('-')[2]
              const flagDate = Number(startTime) - Number(newTime)
              if (flagDate === 1) {
                item.saleFlag = '明天开抢'
              } else if (flagDate > 1) {
                const arr = parseTime(item.startTime, '{m}-{d}').split('-')
                item.saleFlag = `${arr[0]}月${arr[1]}日`
              } else {
                item.saleFlag = '即将开抢'
              }
            } else if (item.saleFlag === 1) {
              item.saleFlag = '抢购中'
              this.dataList = item.productList
              this.date = item.endTime
              this.activetab = item
              this.limitedId = item.limitedId
            }
            item.productList.map((items) => {
              if (items.percentage > 1) {
                items.percentage = 1
              }
            })
            item.startTime = parseTime(item.startTime, '{h}:{i}')
          })
        }
      })
    },
    getHeight (data) {
      if (data > 20) {
        this.isHai = true
      }
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
    handelfinish () {
      this.init()
    },
    handleScroll () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 20) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '限时购'
        this.myshare = '#333'
        this.rightColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.myshare = '#fff'
        this.rightColor = '#fff'
      }
    },
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 20) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '限时购'
        this.myshare = '#333'
        this.rightColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.myshare = '#fff'
        this.rightColor = '#fff'
      }
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    immediately (item) {
      this.$router.push({ path: `/${item.productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    changeData (item) {
      this.dataList = item.productList
      this.limitedId = item.limitedId
    },
    reminded () {

    },
    remind (item) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              // 领券方法
              this.userId = userId
              const params = {
                userId: userId,
                productId: item.productId
              }
              this.remindMe(params, item)
            } else {
              // 登陆方法
              ios.callHandler('goLogin', null, res => {
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
          this.userId = userId
          const params = {
            userId: userId,
            productId: item.productId
          }
          this.remindMe(params, item)
        } else {
          // 登陆方法
          window.android.goLogin()
        }
      } else {
        if (this.user.isLogin) {
          const params = {
            userId: this.user.userId,
            productId: item.productId
          }
          this.remindMe(params, item)
        } else {
          // 如果没有登录保存当前页面拉取授权后再返回当前页面
          setStore('__redirectUrl__', this.$route.fullPath)
          if (WX) {
            window.location.href = `${wxreURL}`
          } else {
            this.$router.push('/login')
          }
        }
      }
    },
    remindMe (params, item) {
      params.limitedId = this.limitedId
      this.$axios.$post(limitTimeReminde, params).then((res) => {
        if (res.code === 10000) {
          this.$toast.success('设置提醒成功')
          item.pushFlag = 1
        }
      })
    }
  },
  destroyed () {
    // window.removeEventListener('scroll', this.handleScroll)
  },
  components: {
    Backbar
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    ...mapGetters(['user']),
    remainingTime () {
      return this.date - new Date().getTime()
    }
  },
  filters: {
    changeTime (time) {
      if (time < 10) {
        return `0${time}`
      } else {
        return time
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.semWraper {
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      padding-bottom: 18px;
      position: relative;
      background: #f2f2f2;

      .top-list {
        width: 100%;
        height: 145px;
        @include bg-image-size('opera/limittime/top');
        background-size: 100% 100%;
        position: relative;
        .title {
          padding-top: 20px;
          img {
            width: 53px;
            height: 17px;
            display: block;
            margin: 0 auto;
          }
        }
        .swiper-slide {
          text-align: center;
          font-size: 14px;
          font-weight: normal;
          width: auto;
          .swiper-item {
            box-sizing: border-box;
            width: 90px;
            height: 60px;
          }
        }
        .time-list {
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-top: 34px;
          padding: 0 12px;
          box-sizing: border-box;
          .time-content {
            text-align: center;
            width: 70px;
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            p {
              color: rgba(255, 255, 255, 0.5);
            }
            &.active {
              background: rgba(230, 98, 93, 1);
              border-radius: 5px;
              p {
                color: #fff;
              }
              .timer {
                font-size: 21px;
                font-weight: bold;
              }
            }
          }
        }
      }
      .all-bg {
        @include bg-image-size('opera/limittime/top');
        padding-top: 40px;
      }
      .time {
        display: flex;
        justify-content: space-between;
        margin: 0 10px;
        box-sizing: border-box;
        height: 30px;
        background: rgba(248, 248, 248, 1);
        padding-left: 10px;
        margin-top: 10px;
        .left {
          font-size: 15px;
          color: #333;
          height: 100%;
          line-height: 30px;
        }
        .right {
          height: 100%;
          background: #fff;
          width: 105px;
          /deep/ .van-count-down {
            height: 100%;
            line-height: 30px;
            color: rgba(195, 96, 79, 1);
            font-size: 15px;
            width: 100%;
            text-align: center;
            /deep/ .item {
              width: 18px;
              display: inline-block;
            }
          }
        }
      }
      .bottom {
        margin: 10px;
        position: relative;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 0;
        .top-product {
          background: #fff;
          display: flex;
          align-items: center;
          width: 100%;
          margin-top: 10px;
          .product-img {
            width: 95px;
            height: 95px;
            margin: 15px;
          }
          .progress-content {
            display: flex;
            align-items: center;
            height: 35px;
            .progress {
              width: 120px;
              height: 8px;
              background: rgba(255, 218, 215, 1);
              border-radius: 4px;
              font-size: 0;
              span {
                height: 8px;
                background: rgba(245, 109, 104, 1);
                border-radius: 4px;
                display: inline-block;
                transition: width 500ms;
              }
            }
            .num {
              color: #999;
              font-size: 10px;
              margin-left: 10px;
            }
          }
          .product-msg {
            flex: 1;
            padding-right: 15px;
            .product-title {
              height: 35px;
              line-height: 17.5px;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              color: #333333;
              font-weight: 500;
              margin-top: 18px;
            }
            .product-bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 13px;
              .product-desc {
                font-size: 13px;
                color: rgba(166, 106, 70, 1);
                .newPrice {
                  color: rgba(245, 109, 104, 1);
                  display: inline-block;
                  font-weight: 600;
                  font-size: 18px;
                }
                .oldPrice {
                  text-decoration: line-through;
                  color: rgba(153, 153, 153, 1);
                  font-size: 15px;
                  display: inline-block;
                  margin-left: 10px;
                }
              }
              .btn1,
              .btn2,
              .btn3 {
                width: 75px;
                height: 22px;
                border-radius: 11px;
                text-align: center;
                line-height: 22px;
                font-size: 12px;
              }
              .btn1 {
                background: rgba(242, 191, 102, 1);
                color: #fff;
              }
              .btn2 {
                background: rgba(255, 240, 214, 1);
                color: #f2bf66;
              }
              .btn3 {
                @include bg-image('opera/limittime/grap-btn');
                color: #fff;
              }
              .product-none {
                background: #ccc;
              }
            }
          }
        }
      }
    }
    /deep/ .mescroll-upwarp {
      min-height: 0;
    }
  }
}
</style>
