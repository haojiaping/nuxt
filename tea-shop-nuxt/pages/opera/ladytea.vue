<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <backbar :bgColor="bgColor"
             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :shartOption="shartOption"
             :rightIconColor='rightIconColor'
             :leftColor='leftColor'
             :title='title' />
    <div ref="mescroll"
         class="mescroll subWrap pf">
      <div class='listWrap'>
        <div class='top-img'>
          <img :src="require('~/assets/img/activity/sex/top1@2x.png')"
               alt="">
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>女神套装</p>
            <p class='text'>女神的选择 大家一致好评</p>
          </div>
          <goodList :dataList='dataList'
                    :color='color'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>养颜护肤</p>
            <p class='text'>越喝越年轻 永远18岁</p>
          </div>
          <goodList :dataList='dataList1'
                    :color='color'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>颜值好茶</p>
            <p class='text'>茶中颜值担当 人见人爱花见花开</p>
          </div>
          <goodList :dataList='dataList2'
                    :color='color'></goodList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import backbar from '~/components/backbar'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant'
import goodList from '~/components/activity/sex/goodList'
import { mapActions } from 'vuex'
export default {
  name: 'ladyTea',
  data () {
    return {
      topDataList: {},
      dataList: [],
      dataList1: [],
      dataList2: [],
      userId: '',
      isFlag: '',
      changeColor: 'white',
      color: 'woman',
      isShow: false,
      mescroll: '',
      shartOption: {
        type: 'url',
        data: {
          title: '淑女之茶，如微风般优雅', // 分享标题
          desc: '把人生走得愉愉快快，把生活过得轻轻松松，喝一杯好茶，留一份惬意。', // 分享描述
          link: `${URL}/opera/ladytea`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/44203b4c-4001-4af4-8378-809f4430b88f.jpg'
        }
      },
      title: '',
      bgColor: 'transparent',
      leftColor: '#fff',
      rightIconColor: '#fff'
    }
  },
  mounted () {
    this.getSpecialdata(27)
    this.getSpecialdata(28)
    this.getSpecialdata(29)
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    async getSpecialdata (specialType) {
      await this.$axios.$post(getSpecial, {
        specialType: specialType,
        lastId: 0,
        userId: ''
      }).then(res => {
        // console.log(Promise.resolved)
        if (specialType === 27) {
          this.dataList = res.data
        } else if (specialType === 28) {
          this.dataList1 = res.data
        } else {
          this.dataList2 = res.data
        }
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
        this.title = '淑女茶'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
      }
    },
    handelCancel () {
      this.isShow = false
    },
    ...mapActions(['getShareWxArg'])
  },
  components: {
    goodList,
    backbar
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
@mixin icon-change($url) {
  background-image: url('~assets/img/activity/sex/'+$url+'.png');
  @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
    background-image: url('~assets/img/activity/sex/'+$url+'@2x.png');
  }
}
$color: #fee5ed;
.semWraper {
  /deep/ .mescroll-upwarp {
    display: none;
  }
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      background: $color;
      padding-bottom: 25px;
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
          color: rgba(215, 139, 163, 1) !important;
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
        .products-title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .name {
            width: 105px;
            height: 24px;
            @include icon-change('icon2');
            background-size: cover;
            font-size: 15px;
            font-weight: 600;
            text-align: right;
            line-height: 24px;
            color: #fff;
            padding-right: 10px;
            box-sizing: border-box;
          }
          .text {
            height: 30px;
            line-height: 30px;
            color: rgba(215, 139, 163, 1);
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
