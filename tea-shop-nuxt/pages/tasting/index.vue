<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <Backbar :bgColor="bgColor"
             :leftColor='leftColor'
             :myshare='myshare'
             :fixed='true'
             :shartOption="shartOption"
             myshareType='myshare'
             ref='topBar'
             :title='title'>
    </Backbar>
    <div class="mescroll subWrap pf"
         ref="mescroll">
      <div class="listWrap content">
        <!-- 我的试饮&&试饮清单 -->
        <div class='top-list'>
          <p class='mine'
             @click='jumpDetailList'>
            我的试饮
          </p>
          <p class='left'>
            <span class="tea"></span>
            <span class='text'>试饮</span>
          </p>
        </div>
        <!-- 列表 -->
        <ul class='product-list'>
          <li class='list-content'>
            <div class='list-title'>
              <p class='title fw800'>品质茶专区</p>
              <span class='dec'>评价返双倍茶银，茶银抵现金</span>
            </div>
            <div class='good-list'>
              <goodList :dataList='dataList'></goodList>
            </div>
          </li>
          <li class='list-content'>
            <div class='list-title'>
              <p class='title'>珍稀茶专区</p>
              <span class='dec'>老茶虽好，一泡难求</span>
            </div>
            <div class='good-list'>
              <goodList :dataList='dataList1'></goodList>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Backbar from '~/components/backbar'
import goodList from '~/components/tasting/goodList'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import { getSpecial } from '~/api/special'
export default {
  name: 'tasting',
  data () {
    return {
      shartOption: {
        type: 'url',
        data: {
          title: '小臻邀您免费试饮10年老茶', // 分享标题
          desc: '10年老茶拆开卖，试饮更送双倍茶银', // 分享描述
          link: `${URL}/tasting`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      bgColor: 'transparent',
      leftColor: '#fff',
      title: '',
      myshare: '#fff',
      dataList: [],
      dataList1: []
    }
  },
  async asyncData ({ $axios }) {
    const data1 = await $axios.$post(getSpecial, {
      specialType: 43,
      lastId: 0,
      userId: ''
    })
    const data2 = await $axios.$post(getSpecial, {
      specialType: 44,
      lastId: 0,
      userId: ''
    })
    return { dataList: data1.data, dataList1: data2.data }
  },
  created () {
  },
  mounted () {
    this.mescrollInit()
    this.getProductList()
  },
  watch: {

  },
  methods: {
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
      if (y >= 20) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '试饮'
        this.myshare = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.myshare = '#fff'
      }
    },
    jumpDetailList () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler(
            'jumpOtherPage',
            {
              jumpType: 'userOrderList',
              jumpContent: '{}'
            },
            () => { }
          )
        })
      } else if (ANDROID) {
        window.android.jumpOtherPage('userOrderList', '{}')
      }
    },
    getProductList () {
      this.$axios.$post(getSpecial, {
        specialType: 43,
        lastId: 0,
        userId: ''
      }).then((res) => {
        if (res.code === 10000) {
          this.dataList = res.data
        }
      })
      this.$axios.$post(getSpecial, {
        specialType: 44,
        lastId: 0,
        userId: ''
      }).then((res) => {
        if (res.code === 10000) {
          this.dataList1 = res.data
        }
      })
    }
  },
  components: {
    Backbar,
    goodList
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
.semWraper {
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      padding-bottom: 18px;
      position: relative;
    }
    /deep/ .mescroll-upwarp {
      min-height: 0;
    }
    .top-list {
      width: 100%;
      height: 180px;
      @include bg-image-size('tasting/icon');
      background-size: 100% 100%;
      position: relative;
      .mine {
        position: absolute;
        width: 95px;
        height: 48px;
        @include bg-image-size('tasting/icon1');
        background-size: 100% 100%;
        text-align: center;
        color: #fff;
        line-height: 48px;
        font-size: 15px;
        bottom: 42px;
        right: 0;
      }
      .left {
        display: flex;
        align-items: flex-end;
        padding-left: 27px;
        position: absolute;
        bottom: 50px;
        .tea {
          width: 42px;
          height: 44px;
          @include bg-image-size('tasting/icon6');
          background-size: 100% 100%;
          display: inline-block;
        }
        .text {
          font-weight: bold;
          color: #fff;
          display: inline-block;
          font-size: 36px;
          line-height: 36px;
          padding-left: 13px;
          margin-bottom: -1px;
        }
      }
    }
    .product-list {
      .list-content {
        position: relative;
        top: -20px;
        @include bg-repeat-png('tasting/icon2', 'tasting/icon3');
        background-position: 0 0, 0 100px;
        background-size: 100% 100px, 100% auto;
        border-radius: 10px 10px 0 0;
        padding: 0 10px;
        .list-title {
          text-align: center;
          padding-bottom: 10px;
          .title {
            font-weight: bold;
            font-size: 18px;
            line-height: 18px;
            padding-top: 10px;
            display: block;
            color: #d45a4a;
          }
          .dec {
            color: #333;
            font-size: 15px;
            line-height: 15px;
            margin-top: 10px;
            display: block;
          }
        }
      }
      & > li:nth-child(n + 2) {
        margin-top: 20px;
      }
    }
  }
}
</style>
