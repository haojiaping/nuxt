<template>
  <div class="semWraper"
       id="clickDownsem">
    <Backbar :bgColor="bgColor"
             @setHeight='getHeight'
             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :fixed='true'
             :shartOption="shartOption"
             ref='topBar'
             :title='title'
             :rightIconColor='rightIconColor'
             :leftColor='leftColor'
             class='back' />
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap">
        <div class='top-img'>
          <img :src="require('~/assets/img/activity/midAutumn/top-bg1@2x.png')"
               alt="">
        </div>
        <div class='top-good'>
          <img :src="require('~/assets/img/activity/midAutumn/top-bg2@2x.png')"
               alt="">
          <div id='top-good'
               v-for="item in topGood"
               :key="item.productId">
            <div class='good-img'>
              <img class='good-content'
                   @click="jumpDetail(item.productId)"
                   :src="item.image"
                   alt=""
                   width="100%">
            </div>
            <div class="goodInfo">
              <p class="name">{{item.productDescription}}</p>
              <p class="dec">{{item.productName}}</p>
              <div class='center'>
                <p class='daily-price'>市场价:{{item.productPrice}}元</p>
                <div class="price">
                  <span class='left'>今日超值:</span>
                  <span class='right'>{{item.discountsPrice}}元</span>
                </div>
              </div>
              <p class='grab'
                 @click="topProduct(item)">加入购物车</p>
            </div>
          </div>
        </div>
        <div class='data-content'>
          <img :src="require('~/assets/img/activity/midAutumn/title7@2x.png')"
               alt="">
          <goodList :dataList='dataList'
                    ref='mychild'
                    @changeProduct='getProductList'></goodList>
        </div>
        <div class='data-content'>
          <img :src="require('~/assets/img/activity/midAutumn/title8@2x.png')"
               alt="">
          <goodList :dataList='dataList1'
                    @changeProduct='getProductList'></goodList>
        </div>
        <div class='data-content'>
          <img :src="require('~/assets/img/activity/midAutumn/title9@2x.png')"
               alt="">
          <goodList :dataList='dataList2'
                    @changeProduct='getProductList'></goodList>
        </div>
        <div class='top-img'>
          <img :src="require('~/assets/img/activity/midAutumn/title10@2x.png')"
               alt="">
        </div>

      </div>
    </div>
    <localCart :cartList.sync='carList'
               carName='_midAutumnCar_'
               @cartListChange='cartListChange'></localCart>
  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import Backbar from '~/components/backbar'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import goodList from '~/components/activity/midAutumn/midGoodList'
import { setStore, getStore } from '~/utils/tool'
import localCart from '~/components/localCart'

export default {
  async asyncData ({ $axios }) {
    const option = {
      specialType: 38,
      lastId: 0,
      userId: ''
    }
    const dataList = []; const dataList1 = []; const dataList2 = []; let topGood = []
    await $axios.$post(getSpecial, option).then(res => {
      topGood = [res.data[0]]
      const arr = res.data.slice(1)
      if (res.code === 10000) {
        const len = [11, 22, 35]
        arr.map((item, index) => {
          if (index < len[0]) {
            dataList.push(item)
          } else if (index < len[1] && index >= len[0]) {
            dataList1.push(item)
          } else if (index <= len[2] && index >= len[1]) {
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
      dataList2: dataList2,
      topGood: topGood
    }
  },
  data () {
    return {
      dataList: [],
      dataList1: [],
      dataList2: [],
      backBar: 'transparent',
      changeColor: 'white',
      color: 'First',
      isShow: false,
      shartOption: {
        type: 'url',
        data: {
          title: '茶臻选中秋好礼专区', // 分享标题
          desc: '满99送快客杯，满199送精美建盏，满399送紫砂壶一个', // 分享描述
          link: `${URL}/about/downapp`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#333',
      title: '',
      rightIconColor: '',
      topGood: {},
      buyCar: false,
      carList: [],
      btnStatus: true
    }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata(38)
    this.carList = getStore('_midAutumnCar_') ? JSON.parse(getStore('_midAutumnCar_')) : []
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
        this.topGood = [res.data[0]]
        const arr = res.data.slice(1)
        const len = [11, 22, 35]
        arr.map((item, index) => {
          if (index < len[0]) {
            this.dataList.push(item)
          } else if (index < len[1] && index >= len[0]) {
            this.dataList1.push(item)
          } else if (index <= len[2] && index >= len[1]) {
            this.dataList2.push(item)
          }
        })
      })
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
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
        this.leftColor = '#1B6177'
        this.title = '中秋礼盒'
        this.rightIconColor = '#1B6177'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
      }
    },
    getProductList (data) {
      let flag = 0
      this.carList.map((key) => {
        if (key.productId === data.productId) {
          flag = 1
        }
      })
      if (flag === 0) {
        // data.productCount = 1
        this.$set(data, 'productCount', 1)
        this.carList.push(data)
      } else {
        const flagIndex = this.carList.findIndex((key) => {
          return key.productId === data.productId
        })
        this.carList[flagIndex].productCount++
      }
      setStore('_midAutumnCar_', this.carList)
      this.$toast.success('添加购物车成功')
    },
    cartListChange (data) {
      this.carList = data
    },
    topProduct (item) {
      this.$refs.mychild.handleClickAddCart(item)
    }
  },
  beforeDestroy () {
    this.mescroll.setBounce(true)
    this.mescroll.destroy()
  },
  components: {
    goodList,
    Backbar,
    localCart
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
  // @include bg-repeat('activity/midAutumn/bg4', 'activity/midAutumn/bg3');
  // padding-bottom: 25px;
  // position: relative;
  // background-position: 0 0, 0 380px;
  // background-size: 100% 380px, 100% auto;
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      @include bg-repeat('activity/midAutumn/bg4', 'activity/midAutumn/bg3');
      padding-bottom: 25px;
      position: relative;
      background-position: 0 0, 0 380px;
      background-size: 100% 380px, 100% auto;
    }
    /deep/ .mescroll-upwarp {
      min-height: 0;
    }
  }
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
  .top-good {
    margin: 10px;
    img {
      width: 100%;
    }
    #top-good {
      box-sizing: border-box;
      @include bg-image-size('activity/midAutumn/good-bg1');
      background-size: 100% 100%;
      padding-bottom: 22px;
      margin-bottom: 15px;
      margin-top: 20px;
      .good-img {
        font-size: 0;
        width: 325px;
        margin: auto;
        padding-top: 20px;
        position: relative;
        .good-content {
          width: 325px;
          height: 325px;
        }
      }
      .goodInfo {
        position: relative;
        .name {
          height: 22px;
          font-size: 18px;
          font-weight: 500;
          width: 230px;
          margin: auto;
          text-align: center;
          color: rgba(51, 51, 51, 1);
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          color: #fff;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-top: 15px;
        }
        .dec {
          font-size: 14px;
          color: #fff;
          line-height: 18px;
          overflow: hidden;
          width: 230px;
          margin: auto;
          margin-top: 8px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: center;
        }

        .center {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          width: 230px;
          margin: auto;
          margin-top: 12px;
          .daily-price {
            height: 15px;
            font-size: 14px;
            color: #fff;
            line-height: 15px;
            margin-bottom: 1.5px;
          }
          .price {
            margin-left: 10px;
            height: 30px;
            font-size: 0;
            .left {
              font-size: 12px;
              height: 12px;
              color: #ffce98;
              display: inline-block;
              vertical-align: baseline;
            }
            .right {
              font-size: 24px;
              font-weight: 600;
              color: #ffce98;
              height: 24px;
              display: inline-block;
              margin-left: 5px;
              vertical-align: baseline;
            }
          }
        }
        .grab {
          width: 222px;
          height: 44px;
          @include bg-image('activity/midAutumn/grap1');
          margin: auto;
          text-align: center;
          line-height: 44px;
          font-weight: 500;
          color: rgba(158, 24, 35, 1);
          font-size: 20px;
          margin-top: 15px;
        }
      }
    }
  }
  .data-content {
    margin-top: 5px;
    img {
      width: 100%;
      display: block;
      margin: auto;
      margin-bottom: 10px;
    }
    font-size: 0;
  }
}
</style>
