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
          <img :src="require('~/assets/img/activity/sex/sub@2x.png')"
               alt="">
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>男神套装</p>
            <p class='text'>很多品茶行家都会拥有的套装</p>
          </div>
          <goodList :dataList='dataList'
                    :color='color'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>“肝”当大任</p>
            <p class='text'>护肝养胃 解酒养生</p>
          </div>
          <goodList :dataList='dataList1'
                    :color='color'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>“肾”是持久</p>
            <p class='text'>超长续航 精力充沛</p>
          </div>
          <goodList :dataList='dataList2'
                    :color='color'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <p class='name'>“肠”见常新</p>
            <p class='text'>潇洒大叔 拒绝油腻</p>
          </div>
          <goodList :dataList='dataList3'
                    :color='color'></goodList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import backbar from '~/components/backbar'
import { IOS, WX, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant'
import goodList from '~/components/activity/sex/goodList'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      topDataList: {},
      dataList: [],
      dataList1: [],
      dataList2: [],
      dataList3: [],
      response: [],
      userId: '',
      isFlag: '',
      style: {
        position: 'absolute',
        top: 0
      },
      changeColor: 'white',
      color: 'man',
      isShow: false,
      mescroll: '',
      shartOption: {
        type: 'url',
        data: {
          title: '君子之茶，品茶如品人生', // 分享标题
          desc: '一杯清茶品人生，半杯浊酒交挚友', // 分享描述
          link: `${URL}/opera/gentlemantea`, // 分享链接
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
    this.getSpecialdata(23)
    this.getSpecialdata(24)
    this.getSpecialdata(25)
    this.getSpecialdata(26)
    this.mescrollInit()
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
        if (specialType === 23) {
          this.dataList = res.data
        } else if (specialType === 24) {
          this.dataList1 = res.data
        } else if (specialType === 25) {
          this.dataList2 = res.data
        } else {
          this.dataList3 = res.data
        }
      })
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    shareFun () {
      if (WX) {
        const option = {
          type: 'url',
          title: '君子之茶，品茶如品人生', // 分享标题
          desc: '一杯清茶品人生，半杯浊酒交挚友', // 分享描述
          link: `${URL}/opera/ladyTea`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/44203b4c-4001-4af4-8378-809f4430b88f.jpg'
        }
        this.getShareWxArg(option)
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
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 50) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '君子茶'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
      }
    },
    share () {
      const option = {
        type: 'url',
        data: {
          title: '君子之茶，品茶如品人生', // 分享标题
          desc: '一杯清茶品人生，半杯浊酒交挚友', // 分享描述
          link: `${URL}/opera/ladyTea`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/44203b4c-4001-4af4-8378-809f4430b88f.jpg'
        }
      }
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goShareType', JSON.stringify(option), res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goShareType(JSON.stringify(option))
      }
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
$color: #dff7ff;
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
      .top-bg {
        background: #f2f7f9;
      }
      .top-img {
        img {
          width: 100%;
          font-size: 0;
        }
      }
      .data-content {
        margin-top: 5px;
        padding-bottom: 25px;
        position: relative;
        .products-title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .name {
            width: 118px;
            height: 24px;
            @include icon-change('title');
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
            color: rgba(116, 161, 196, 1);
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
