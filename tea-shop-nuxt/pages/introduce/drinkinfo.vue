<template>
  <div class="drinkWraper pr mescroll-touch">
    <Backbar :bgColor="bgColor"
             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :shartOption="shartOption"
             :rightIconColor='rightIconColor'
             :leftColor='leftColor'
             :title='title' />
    <div ref="mescroll"
         class="mescroll subWrap pf">
      <div class="sub listWrap">
        <div class="icon pr"></div>
        <div class="menu">
          <div class="tag-wrapper df"
               v-if="tagList.length>0"
               v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper">
              <div v-for="(item , index) in tagList"
                   class="swiper-slide"
                   :key="`tag_${index}`">
                <div class="swiper-item"
                     @click="handelChangeTab(item)"
                     :class="[activetab.labelId===item.labelId?'active':'',item.labelbg]">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dirWr">
          <div class="dir">
            <div class="palyer pr needsclick"
                 v-if="activetab.videoSrc&&activetab.videoPoster">
              <video :src="activetab.videoSrc"
                     :controls="MyVideoControls"
                     :webkit-playsinline="true"
                     playsinline
                     :preload="true"
                     ref="MyVideo"
                     :poster="activetab.videoPoster" />
              <div class="playerWraper"
                   @click="onClickPlay"
                   v-show="playerBtnShow">
                <van-icon name="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/7/4785fa13-a1b5-4f39-932d-45d94d689f04.jpg"
                          size="55"
                          color="#fff" />
              </div>
            </div>
            <!-- <p class="dirtitle f48 fw400">{{activetab.name}}</p> -->
            <div class="dirMenu df">
              <div class="menuItem"
                   :class="activedir.value===0?'active':''"
                   @click="changeDirActive(0)"
                   v-show="activetab.office">
                <div class="office"
                     :class="activedir.value===0?'officeA':''"></div>
              </div>
              <div class="menuItem"
                   :class="activedir.value===1?'active':''"
                   @click="changeDirActive(1)"
                   v-show="activetab.friends">
                <div class="friends"
                     :class="activedir.value===1?'friendsA':''">

                </div>
              </div>
              <div class="menuItem"
                   :class="activedir.value===2?'active':''"
                   @click="changeDirActive(2)"
                   v-show="activetab.leisure">
                <div class="leisure"
                     :class="activedir.value===2?'leisureA':''">

                </div>
              </div>
              <div class="menuItem"
                   :class="activedir.value===3?'active':''"
                   @click="changeDirActive(3)"
                   v-show="activetab.business">
                <div class="business"
                     :class="activedir.value===3?'businessA':''">

                </div>
              </div>
            </div>
            <div class="menuCon">
              <div class="menuContent"
                   v-html="activedir.dir"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Backbar from '~/components/backbar'
import { IOS, WX, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant'
import { mapActions } from 'vuex'
export default {
  name: 'drinkinfo',
  data () {
    var that = this
    return {
      activetab: {
        labelId: 0,
        labelbg: 'lv',
        videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/6dbf4016-7da6-4be0-b575-81ef5eeafdc2.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
        videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/6dbf4016-7da6-4be0-b575-81ef5eeafdc2.mp4',
        name: '绿茶',
        office: '茶具：快客杯<br>投茶量：4g<br>水温：85-90℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 绿茶可不用洗茶<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡3-4次</p>',
        friends: '茶具：玻璃杯<br>投茶量：4g<br>水温：85-90℃<br>注水量：200ml<br>静置时间：30s<br><p class="text">注: 玻璃杯可以观察茶叶在水中上下起舞<br>可冲泡3-4次<br>每次客人杯中留水量约1/4时进行续水</p>',
        leisure: '',
        business: ''
      },
      dirValue: 0,
      activedir: {
        value: 0,
        dir: '茶具：快客杯<br>投茶量：4g<br>水温：85-90℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 绿茶可不用洗茶<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡3-4次</p>'
      },
      tagList: [
        {
          labelId: 0,
          labelbg: 'lv',
          videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/6dbf4016-7da6-4be0-b575-81ef5eeafdc2.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/6dbf4016-7da6-4be0-b575-81ef5eeafdc2.mp4',
          name: '绿茶',
          office: '茶具：快客杯<br>投茶量：4g<br>水温：85-90℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 绿茶可不用洗茶<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡3-4次</p>',
          friends: '茶具：玻璃杯<br>投茶量：4g<br>水温：85-90℃<br>注水量：200ml<br>静置时间：30s<br><p class="text">注: 玻璃杯可以观察茶叶在水中上下起舞<br>可冲泡3-4次<br>每次客人杯中留水量约1/4时进行续水</p>',
          leisure: '',
          business: ''
        },
        {
          labelId: 1,
          labelbg: 'hong',
          videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/9f041c3f-2de8-4be7-ac42-1fd594485a25.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/9f041c3f-2de8-4be7-ac42-1fd594485a25.mp4',
          name: '红茶',
          office: '茶具：快客杯<br>投茶量：4g<br>水温：90-95℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>嫩芽头、一芽一叶、一芽二叶可冲泡3-4次<br>滇红、古树红等可冲泡5-6次</p>',
          friends: '茶具：盖碗<br>温杯：用热水冲洗一次盖碗<br>投茶量：4g<br>水温：90-95℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 温杯，为了更好地激发茶香<br>投茶入盖碗，盖上碗盖，摇晃盖碗，可闻干茶香气<br>洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>盖碗出汤倒入公道杯中，用公道杯为客人分茶<br>嫩芽头、一芽一叶、一芽二叶可冲泡3-4次<br>滇红、古树红等可冲泡5-6次</p>',
          leisure: '1<br>奶茶DIY<br>选择茶品：袋泡红茶<br>壶中加入2-3个茶包，大火煮开。调至小火，慢煮。<br>2-3min取出茶包，一边搅拌一边慢慢加入牛奶。<br>牛奶加好后，开始加糖，放2-3小勺糖，搅拌均匀。<br>继续小火煮至80℃左右即可。<br>可根据个人喜好增减奶量和糖量<br>也可选用祁门红茶、无烟小种等红茶进行煮制<br>2<br>冰红茶<br>选择茶品：袋泡红茶<br>1) 在茶壶中注入110毫升滚烫的热开水。<br>2) 放入红茶茶包，盖上壶盖，闷置5分钟。<br>3) 取出茶包。<br>4) 加入60g的冰块，4-5颗冰糖，就可以享用一杯色泽晶莹又好喝的冰红茶了。<br>可根据个人喜好增添冰块、冰糖。',
          business: ''
        },
        {
          labelId: 2,
          labelbg: 'bai',
          videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/6395aade-d9bd-423b-919e-0a5b8bdd0876.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/6395aade-d9bd-423b-919e-0a5b8bdd0876.mp4',
          name: '白茶',
          office: '茶具：快客杯<br>投茶量：6g<br>水温：90-95℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>白毫银针、白牡丹、寿眉冲泡水温可依次增加<br>可冲泡5-6次<br>根据个人口感调整注水量及静置时间<br>',
          friends: '1<br>茶具：盖碗<br>温杯：用热水冲洗一次盖碗<br>投茶量：6g<br>水温：90-95℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 温杯，为了更好地激发茶香<br>投茶入盖碗，盖上碗盖，摇晃盖碗，可闻干茶香气<br>洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>盖碗出汤倒入公道杯中，用公道杯为客人分茶<br>可冲泡5-6次<br></p>2<br>茶具：紫砂壶<br>投茶量：6g<br>水温：90-95℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡5-6次<br></p>3<br>茶具：煮茶壶<br>投茶量：6g<br>注水量：1500ml<br><p class="text">注: 煮茶前可先进行洗茶<br>水煮沸后，倒入公道杯，用公道杯为客人分茶<br>可煮2-3次<br>煮茶也可选用已经冲泡3-4次后的白茶，更好地发挥茶的价值</p>',
          leisure: '',
          business: '冷泡法：选用一瓶矿泉水<br>投茶量：3g或者袋泡茶<br>把茶叶置入矿泉水中，不必考虑水温。'
        },
        {
          labelId: 3,
          labelbg: 'pu',
          videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/84102dc3-f3f8-4cb9-8a13-f7bcb96d43ac.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/84102dc3-f3f8-4cb9-8a13-f7bcb96d43ac.mp4',
          name: '生普',
          office: '茶具：快客杯<br>投茶量：6g<br>水温：100℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可冲泡6-8次<br>根据个人口感调整注水量及静置时间<br></p>',
          friends: '1<br>茶具：盖碗<br>温杯：用热水冲洗一次盖碗<br>投茶量：6g<br>水温：100℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 温杯，为了更好地激发茶香<br>投茶入盖碗，盖上碗盖，摇晃盖碗，可闻干茶香气<br>洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>盖碗出汤倒入公道杯中，用公道杯为客人分茶<br>可冲泡6-8次<br></p>2<br>茶具：紫砂壶<br>投茶量：6g<br>水温：100℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡6-8次<br></p>',
          leisure: '',
          business: ''
        },
        {
          labelId: 4,
          labelbg: 'wulong',
          videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/afd50873-64be-46a7-a2be-0a8b8f0eaa32.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/afd50873-64be-46a7-a2be-0a8b8f0eaa32.mp4',
          name: '乌龙茶',
          office: '茶具：快客杯<br>投茶量：6g<br>水温：100℃<br>注水量：200ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡6-8次<br></p>',
          friends: '1<br>茶具：盖碗<br>温杯：用热水冲洗一次盖碗<br>投茶量：6g<br>水温：100℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 温杯，为了更好地激发茶香<br>投茶入盖碗，盖上碗盖，摇晃盖碗，可闻干茶香气<br>洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>盖碗出汤倒入公道杯中，用公道杯为客人分茶<br>可冲泡6-8次<br></p>2<br>茶具：紫砂壶<br>投茶量：6g<br>水温：90-95℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡6-8次<br></p>',
          leisure: '',
          business: ''
        },
        {
          labelId: 5,
          labelbg: 'hei',
          name: '黑茶',
          videoPoster: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/5fbb6770-238b-4918-87de-7b4a9dda9ae2.mp4?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/video/2019/11/5fbb6770-238b-4918-87de-7b4a9dda9ae2.mp4',
          office: '茶具：快客杯<br>投茶量：6g<br>水温：100℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡6-8次<br></p>',
          friends: '1<br>茶具：盖碗<br>温杯：用热水冲洗一次盖碗<br>投茶量：6g<br>水温：100℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 温杯，为了更好地激发茶香<br>投茶入盖碗，盖上碗盖，摇晃盖碗，可闻干茶香气<br>洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>盖碗出汤倒入公道杯中，用公道杯为客人分茶<br>可冲泡6-8次<br></p>2<br>茶具：紫砂壶<br>投茶量：6g<br>水温：100℃<br>注水量：150ml<br>静置时间：15s<br><p class="text">注: 洗茶5s快速出汤<br>第二次注水正式冲泡<br>可根据个人口感适当增减注水量及静置时间<br>可冲泡6-8次<br></p>3<br>茶具：煮茶壶<br>投茶量：6g<br>注水量：1500ml<br><p class="text">注: 煮之前需要进行洗茶<br>水煮沸后，倒入公道杯，用公道杯为客人分茶<br>可煮2-3次<br></p>',
          leisure: '',
          business: '茶具：保温杯<br>投茶量：5g黑茶(熟普为佳)<br>黑茶不怕闷泡，闷后口感稍微柔和顺滑'
        },
        {
          labelId: 6,
          labelbg: 'hua',
          videoPoster: '?x-oss-process=video/snapshot,t_10000,m_fast',
          videoSrc: '',
          name: '花草茶',
          office: '茶具：快客杯<br>投茶量：4g<br>水温：95℃<br>注水量：150ml<br>静置时间：30s<br><p class="text">注: 可根据个人口感适当增减注水量及静置时间<br>可冲泡6-8次</p>',
          friends: '',
          leisure: '',
          business: ''
        }
      ],
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
            if (that.activetab === that.tagList[this.clickedIndex].labelId) {
              return
            }
            that.activetab = that.tagList[this.clickedIndex]
            that.activedir.dir = that.activetab.office
            that.playerBtnShow = true
            that.MyVideoControls = false
            that.activedir.value = 0
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
      },
      playerBtnShow: true,
      MyVideoControls: false,
      shartOption: {
        type: 'url',
        data: {
          title: '视频冲泡指南', // 分享标题
          desc: '美女茶艺师婧婧，教你如何泡茶。', // 分享描述
          link: `${URL}/introduce/drinkinfo`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/27e35f49-09a8-4eac-8bf5-f7a4ea1bea76.jpg'
        }
      },
      mescroll: '',
      title: '',
      bgColor: 'transparent',
      leftColor: '#fff',
      rightIconColor: '#fff'
    }
  },
  mounted () {
    setTimeout(() => {
      this.shareFun()
    }, 50)
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    setHeight (height) {
      // this.$refs.headerImg.style.height = `${(height / 60) + 4.88}rem`
      // this.$refs.mescroll.$el.style.top = `${height + 56}px`
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
        this.title = '品饮指南'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
      }
    },
    handelChangeTab () {

    },
    shareFun () {
      if (WX) {
        this.getShareWxArg(this.shartOption)
      }
    },
    changeDirActive (val) {
      this.dirValue = val
      switch (val) {
        case 0:
          this.activedir.value = val
          this.activedir.dir = this.activetab.office
          break
        case 1:
          this.activedir.value = val
          this.activedir.dir = this.activetab.friends
          break
        case 2:
          this.activedir.value = val
          this.activedir.dir = this.activetab.leisure
          break
        case 3:
          this.activedir.value = val
          this.activedir.dir = this.activetab.business
          break
      }
    },
    onClickPlay () {
      this.playerBtnShow = false // 播放安宁
      this.$refs.MyVideo.play()
      this.MyVideoControls = true // 显示默认的控制栏
      this.$refs.MyVideo.onended = () => {
        this.playerBtnShow = true
        this.MyVideoControls = false
      }
    },
    ...mapActions(['getShareWxArg'])
  },
  components: {
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
.drinkWraper {
  /deep/ .mescroll-upwarp {
    display: none;
  }
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .sub {
      @include bg-image-jpg('drink/drinkbg');
      background-size: cover;
      width: 100%;
      box-sizing: border-box;
      top: 125px;
      width: 100%;
      padding-top: 125px;
      left: 0;
      right: 0;
      padding-bottom: 40px;
      .icon {
        @include bg-image('drink/icon');
        background-size: cover;
        width: 192px;
        height: 122px;
        bottom: -28px;
        z-index: 9;
        right: -165px;
      }
      .menu {
        width: 82%;
        height: 100px;
        margin: 0 auto;
        background: #13554e;
        border-radius: 5px;
        padding: 0 10px;
        box-shadow: 0px 3px 20px 0px rgba(5, 46, 42, 0.3);
        .swiper-slide {
          text-align: center;
          font-size: 14px;
          font-weight: normal;
          height: 100px;
          width: auto;
          .swiper-item {
            border-radius: 5px;
            box-sizing: border-box;
            color: #81693f;
            width: 74px;
            height: 40px;
            margin-top: 30px;
            background-size: cover;
            opacity: 0.8;
            &.lv {
              @include bg-image('drink/lv');
            }
            &.hong {
              @include bg-image('drink/hong');
            }
            &.bai {
              @include bg-image('drink/bai');
            }
            &.pu {
              @include bg-image('drink/pu');
            }
            &.wulong {
              @include bg-image('drink/wulong');
            }
            &.hei {
              @include bg-image('drink/hei');
            }
            &.hua {
              @include bg-image('drink/hua');
            }
            &.active {
              opacity: 1;
              position: relative;
              width: 85px;
              height: 45px;
              margin-top: 28px;
              &:after {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border: solid transparent;
                pointer-events: none;
                content: '';
                border-color: rgba(136, 183, 213, 0);
              }
              &:after {
                border-bottom-color: #fff;
                border-width: 10px;
                left: 50%;
                margin-left: -10px;
                top: 50px;
              }
            }
          }
        }
      }
      .dirWr {
        // background: #006257;
        .dir {
          background: #fff;
          padding: 0 20px 5px;
          box-sizing: border-box;
          margin: -5px 25px 0;
          border-radius: 4px;
          box-shadow: 0px 3px 20px 0px rgba(5, 46, 42, 0.3);
          .dirtitle {
            line-height: 75px;
            color: #227e74;
            text-align: center;
          }
          .dirMenu {
            justify-content: center;
            align-items: center;
            padding-top: 15px;
            .menuItem {
              width: 25%;
              height: 50px;
              padding: 10px 0;
              border-bottom: 2px solid #ccc;
              &.active {
                border-bottom: 2px solid #227e74;
              }
              .office {
                width: 39px;
                height: 45px;
                @include bg-image('drink/1');
                background-size: cover;
                margin: 0 auto;
                &.officeA {
                  @include bg-image('drink/1a');
                }
              }
              .friends {
                width: 53px;
                height: 47px;
                @include bg-image('drink/2');
                background-size: cover;
                margin: 0 auto;
                &.friendsA {
                  @include bg-image('drink/2a');
                }
              }
              .leisure {
                width: 53px;
                height: 47px;
                @include bg-image('drink/3');
                background-size: cover;
                margin: 0 auto;
                &.leisureA {
                  @include bg-image('drink/3a');
                }
              }
              .business {
                width: 36px;
                height: 44px;
                @include bg-image('drink/4');
                background-size: cover;
                margin: 0 auto;
                &.businessA {
                  @include bg-image('drink/4a');
                }
              }
            }
          }
          .menuCon {
            margin: 20px 0;
            height: 200px;
            overflow: scroll;
            .menuContent {
              background: #fff;
              line-height: 20px;
              /deep/ .text {
                color: #666;
                font-size: 13px;
              }
            }
          }
          .palyer {
            padding-top: 20px;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            video {
              width: 100%;
              height: 100%;
              border-radius: 5px;
              object-fit: cover;
            }
            .playerWraper {
              position: absolute;
              top: 55%;
              z-index: 1;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
  }
}
</style>
