<template>
  <div class="priceWraper">
    <backbar bgColor="transparent"
             :rightIcon="gobackMyback?'share':''"
             :shartOption="shartOption"
             leftColor="#fff"
             rightIconColor='#fff' />
    <div class="headerImg"
         ref="headerImg">

    </div>
    <div ref="mescroll"
         class="mescroll">
      <div>
        <div class="top">
          <!-- <div class="headertop">
          <div class="headercont"></div>
        </div> -->
          <div class="headergood df"
               v-if="special&&special.productPrice">
            <img :src="special.image"
                 alt="">
            <div class="good df">
              <div>
                <p class="f15 fw600"
                   style="line-height: 18px;">{{special.productName}}</p>
                <!-- <p class="f12 fw400" style="margin-top:10px;">镇店生茶 白莺山 野生古树</p> -->
              </div>
              <div class="df price">
                <div class="df toppriwrap">
                  <span class="f18 fw400 toppri"></span>
                  <span class="f18 fw600">特价: ¥ {{special.productPrice}}</span>
                </div>
                <div class="f12 fw400 btn tac"
                     @click="jumpToDetail(special)">马上抢</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <p class="f18 fw400 center" style="margin:15px 0;">/ 每日更新 · 好茶不贵 /</p> -->
        <div id="listWraper">
          <div class="sub"
               v-for="(datas,index) in centerData"
               :key="index"
               @click="jumpToDetail(datas)">
            <img :src="datas.image||' '"
                 class="mainimg">
            <div class="subinfo">
              <div class="subtitle">{{datas.productName}}</div>
              <div class="df subbottom">
                <div class="price df">
                  <span class="pri1"></span>
                  <span>特价: ¥ {{datas.discountsPrice||datas.productPrice}}</span>
                </div>
                <span class="btn f12 fw400">马上抢</span>
              </div>
            </div>
            <div class="center"></div>
          </div>
          <div class="block">
            <div class="blockhead df">
              <div class="blocklabel"></div>
              <div class="blocktitle">
                <p class="f18 fw600"
                   style="margin:5px 0;">精挑细选</p>
                <p class="f12 fw400">臻选普洱、绿茶、白茶...</p>
              </div>
            </div>
            <div class="blocksub df"
                 v-if="blockData.length>0">
              <div class="blockItem df"
                   v-for="(item,index) in blockData"
                   :key="index"
                   @click="jumpToDetail(item)">
                <img :src="item.image"
                     alt="">
                <p class="border-top itemtitle f12 fw400">{{item.productName}}</p>
                <p class="itemprice df">
                  <span class="f12 fw400">特价: ¥ {{item.discountsPrice||item.productPrice}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="bottomimg center fw600 f18"
               v-if="dataList.length>0">
            猜你喜欢
          </div>
          <div class="bottom df"
               v-if="dataList.length>0">
            <div class="bottomItem"
                 v-for="(item,index) in dataList"
                 :key="index"
                 :class="(index%2===0)?'border-rightbottom':'border-bottom'"
                 @click="jumpToDetail(item)">
              <img :src="item.image"
                   alt="">
              <p class="f15 fw400 border-top bottomtitle">{{item.productName}}</p>
              <div class="tagWraper">
                <!-- <van-tag color="#62B34D" plain>新品</van-tag>
              <van-tag color="#D45949" plain>满减</van-tag>
              <van-tag color="#D1B081" plain>无忧品鉴</van-tag> -->
              </div>
              <p class="itemprice df">
                <span class="f12 fw400">特价: ¥ {{item.discountsPrice||item.productPrice}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import { mapGetters, mapActions } from 'vuex'
import { operate, getSpecialtype } from '~/api/special'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
export default {
  name: 'goodprice',
  data () {
    return {
      special: {},
      centerData: [],
      blockData: [],
      bottomData: [],
      mescroll: null,
      dataList: [], // 列表数据
      operationId: '2019080118134473912000113',
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/activity/newcomers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      }
    }
  },
  mounted () {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    jumpToDetail (item) {
      this.$router.push({ path: `/${item.productId}`, query: { specialId: item.specialId, gobackMyback: this.gobackMyback } })
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit (mescroll) {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          callback: this.getdisList,
          isBounce: false,
          lazyLoad: {
            use: true
          },
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 // 每页数据条数,默认10
          }
        }
      })
    },
    getdisList (page, mescroll) {
      if (!this.operationId) {
        mescroll.endErr()
        this.$toast('ID不能为空')
        return
      }
      const option = {
        // specialType: 10,
        // // lastId: 0,
        // lastId: page.num === 1 ? 0 : this.dataList[this.dataList.length - 1].pkSid,
        // userId: '',
        pageNum: page.num - 1,
        // operationId: this.operationId
        specialType: 58
        // lastId: 0
      }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              const isLogin = true
              this.saveLogin({ userId, token, isLogin })
            }
            option.userId = userId
            this.getSpecialdata(page, mescroll, option)
          })
        })
      } else if (ANDROID) {
        const userId = window.android.getUserId()
        const token = window.android.getToken()
        const isLogin = true
        this.saveLogin({ userId, token, isLogin })
        option.userId = userId
        this.getSpecialdata(page, mescroll, option)
      } else {
        option.userId = this.userId
        this.getSpecialdata(page, mescroll, option)
      }
    },
    getSpecialdata (page, mescroll, option) {
      this.$axios.$post(getSpecialtype, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = JSON.parse(JSON.stringify(res.data))
        if (res.code === 10000) {
          if (page.num === 1) {
            try {
              this.special = {}
              this.blockData = []
              this.centerData = []
              this.bottomData = []
              this.special = res.data[0]
              // arr.splice(0, 1)
              this.centerData.push(res.data[1])
              this.centerData.push(res.data[2])
              for (let i = 3; i < 9 && i < res.data.length; i++) {
                this.blockData.push(res.data[i])
              }
              arr.splice(0, 9)
              this.dataList = []
            } catch (error) {

            }
          }
          this.dataList = [...this.dataList, ...arr]
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.length)
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    ...mapActions(['saveLogin'])
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  computed: {
    ...mapGetters([
      'user']),
    gobackMyback () {
      return IOS || ANDROID
    }
  },
  components: {
    backbar
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.priceWraper /deep/ .back-wrap {
  i {
    color: #fff;
  }
}
.priceWraper /deep/ .mescroll {
  position: fixed;
  top: 100px;
  bottom: 0;
  width: 100%;
  height: auto;
}
.priceWraper /deep/ .downwarp-progress {
  border: 1px solid #fff;
  border-bottom-color: transparent;
}
.priceWraper /deep/ .downwarp-progres {
  color: #fff;
  border-color: #fff;
}
.priceWraper /deep/ .downwarp-tip {
  color: #fff;
}
.priceWraper /deep/ .mescroll-empty {
  top: 60%;
}
.headerImg {
  @include bg-image('~assets/img/activity/goodprice/bg');
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 200px;
  background-size: cover;
}
.top {
  // padding-top: 0.8rem;
  // height: 3.35rem;
  // .headertop {
  //   width: 355px;
  //   height: 0.76rem;
  //   margin: 0 auto;
  //   .headercont {
  //     width: 3rem;
  //     height: 0.76rem;
  //     background-size: cover;
  //     @include bg-image('~assets/img/activity/goodprice/goodtitle');
  //   }
  // }
  .headergood {
    width: 375px;
    height: 130px;
    background-size: cover;
    @include bg-image('~assets/img/activity/goodprice/goodbg');
    margin: 0 auto;
    padding: 15px 20px 20px;
    box-sizing: border-box;
    color: #fff;
    img {
      flex: 0 0 95px;
      height: 95px;
      margin-right: 15px;
    }
    .good {
      flex: 1;
      padding-top: 5px;
      flex-direction: column;
      justify-content: space-between;
      .price {
        .toppriwrap {
          align-items: center;
          .toppri {
            width: 17px;
            height: 17px;
            margin-right: 5px;
            background-size: cover;
            @include bg-image('~assets/img/activity/goodprice/pri');
          }
        }
        justify-content: space-between;
        .btn {
          width: 75px;
          height: 22px;
          line-height: 22px;
          @include bg-image('~assets/img/activity/goodprice/btn');
          background-size: cover;
          color: #d45949;
        }
      }
    }
  }
}
.sub {
  margin: 0 10px 10px;
  padding: 10px;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  .subinfo {
    flex: 1;
    padding: 10px 0 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .subtitle {
      font-weight: 400;
      font-size: 15px;
      line-height: 18px;
    }
    .price {
      margin-left: 5px;
      font-size: 15px;
      font-weight: 400;
      color: #d45949;
    }
    .pingfen {
      margin: 10px 0;
      .new {
        min-width: 84px;
        background: #d45949;
        padding: 3px 5px;
        color: #fff;
        box-sizing: border-box;
      }
    }
    .subbottom {
      justify-content: space-between;
      align-items: center;
      .price {
        align-items: center;
        .pri1 {
          width: 17px;
          height: 17px;
          margin-right: 5px;
          background-size: cover;
          @include bg-image('~assets/img/activity/goodprice/pri1');
        }
      }
      .btn {
        background: #d45949;
        width: 75px;
        height: 22px;
        color: #fff;
        border-radius: 25px;
        text-align: center;
        line-height: 22px;
      }
    }
  }
  .mainimg {
    width: 95px;
    height: 95px;
    flex: 0 0 95px;
    margin-right: 10px;
  }
}
.block {
  // @include bg-image('~assets/img/activity/goodprice/goodbgc');
  // background-size: cover;

  width: 355px;
  margin: 0 auto;
  box-sizing: border-box;
  background: #fc796f;
  .blockhead {
    .blocklabel {
      width: 57px;
      height: 57px;
      background-size: cover;
      @include bg-image('~assets/img/activity/goodprice/label');
    }
    .blocktitle {
      color: #fff;
      align-self: center;
    }
  }
  .blocksub {
    flex-wrap: wrap;
    justify-content: space-between;
    // padding: 5px 0;
    padding: 0 13px 13px;
    .blockItem {
      width: 105px;

      flex-direction: column;
      align-items: center;
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
      margin: 5px 0;
      img {
        width: 85px;
        height: 85px;
      }
      .itemtitle {
        padding: 10px 0;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .itemprice {
        color: #fff;
        // align-self: flex-start;
        @include bg-image('~assets/img/activity/goodprice/pribg');
        width: 90px;
        height: 18px;
        // line-height: 18px;
        align-items: center;
        background-size: cover;
        text-align: right;
        justify-content: center;
        span {
          // margin-right: 5px;
        }
      }
    }
  }
}
.bottomimg {
  width: 355px;
  height: 44px;
  line-height: 44px;
  color: #fc796f;
  @include bg-image('~assets/img/activity/goodprice/bottomimg');
  background-size: cover;
  margin: 10px auto 1px;
  text-align: center;
}
.bottom {
  margin: 0 10px 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  .bottomItem {
    width: 50%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 14px;
    box-sizing: border-box;
    img {
      width: 150px;
      height: 150px;
    }
    .bottomtitle {
      padding-top: 10px;
      // height: 0.65rem;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tagWraper {
      margin: 10px 0;
      font-size: 10px;
      /deep/ .van-tag {
        padding: 0.5px 5px;
        border-radius: 0;
        font-size: 10px;
      }
      /deep/ .van-tag::after {
        border-radius: 0;
      }
    }
    .itemprice {
      color: #fff;
      align-self: flex-start;
      @include bg-image('~assets/img/activity/goodprice/pribg');
      width: 90px;
      height: 18px;
      // line-height: 18px;
      align-items: center;
      background-size: cover;
      text-align: right;
      justify-content: flex-end;
      span {
        margin-right: 13px;
      }
    }
  }
}
</style>
