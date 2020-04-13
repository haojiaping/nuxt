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
            <img :src="require('~/assets/img/activity/midAutumn/sub@2x.png')"
                 alt="">
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/midAutumn/title1@2x.png')"
                 alt="">
            <goodList :dataList='dataList'
                      :color='color'
                      specialType='36'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/midAutumn/title2@2x.png')"
                 alt="">
            <goodList :dataList='dataList1'
                      specialType='36'
                      :color='color'></goodList>
          </div>
          <div class='data-content'>
            <img :src="require('~/assets/img/activity/midAutumn/title3@2x.png')"
                 alt="">
            <goodList :dataList='dataList2'
                      specialType='36'
                      :color='color'></goodList>
          </div>
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/midAutumn/bottom@2x.png')"
                 alt="">
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
      specialType: 36,
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
      rightIconColor: '',
      title: ''
    }
  },
  created () {

  },
  mounted () {
    this.mescrollInit()
    this.getSpecialdata(36)
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
        this.rightIconColor = '#1B6177'
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
  /deep/ .van-nav-bar__left {
    display: none;
  }
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    /deep/ .mescroll-upwarp {
      display: none;
    }
    .listWrap {
      background: $color;
      position: relative;
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
          width: 100%;
        }
        font-size: 0;
      }
    }
  }
}
</style>
