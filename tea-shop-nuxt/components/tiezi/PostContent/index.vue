<template>
  <div class="postdetailWraper">
    <!-- 头部返回 开始 -->
    <van-nav-bar :class="navOption.bgcolor"
                 style="display:flex;"
                 :fixed="navOption.fixed"
                 :border="false"
                 :zIndex="99"
                 ref="navBar"
                 @click-left="handleClickBack">
      <div slot="left"
           class="left df">
        <van-icon :name="navOption.name"
                  :size="navOption.leftSize"
                  :color="navOption.color" />
        <div style="display: flex;align-items: center;"
             v-if="navOption.left">
          <img :src="datas.userImage"
               alt=""
               v-if="datas.userImage&&datas.userImage!=='-'">
          <img :src="require('~/assets/img/self/self@2x.png')"
               alt=""
               v-else>
          <span>{{datas.nickName}}</span>
        </div>
      </div>
      <div slot="right"
           class="right"
           v-if="navOption.right">
        <!-- <van-tag plain
                 v-if="datas.followFlag"
                 @click="initGet(2)">已关注</van-tag>
        <van-tag v-if="!datas.followFlag"
                 color="#D45949"
                 @click="initGet(2)">
          <div class="guanzhu">
            <van-icon name="plus"
                      color="#fff" /><span style="margin-left:5px;">关注</span>
          </div>
        </van-tag> -->
        <div class="follow cf tac f15" @click="initGet(2)" :class="{'followactive border':datas.followFlag}">{{datas.followFlag | followStatus}}</div>
      </div>
    </van-nav-bar>
    <!-- 头部返回结束 -->
    <!-- <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit"> -->
    <div class="mescroll"
         ref="mescroll">
      <div>
        <div class="loading"
             v-show="loading">
          <van-loading type="spinner" />
        </div>
        <div v-show="!loading">
          <div class="sub" v-if="datas">
            <div class="img-wrpper pr"
                 ref="top">
              <div class="palyer needsclick"
                   v-if="videoSrc&&videoPoster">
                <video :src="videoSrc"
                       :controls="MyVideoControls"
                       :webkit-playsinline="true"
                       playsinline
                       :preload="true"
                       ref="MyVideo"
                       :poster="videoPoster" />
                <div class="playerWraper"
                     @click="onClickPlay"
                     v-show="playerBtnShow">
                  <van-icon name="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/7/4785fa13-a1b5-4f39-932d-45d94d689f04.jpg"
                            size="70"
                            color="#fff" />
                </div>
              </div>
              <div v-swiper:mySwiper="swiperOption" v-else>
                <div class="swiper-wrapper">
                  <div class="swiper-slide"
                       v-for="(image,index) in datas.image"
                       :key="index">
                    <img :src="image.imageUrl"
                         width="100%"
                         class="banner-img" />
                  </div>
                </div>
                <!-- <div class="custom-indicator" v-if="datas.image&&datas.image.length>0">
                <div class="swiper-pagination swiper-pagination-bullets"></div>
              </div> -->
                <!-- <div class="swiper-pagination custom-indicator"></div> -->
              </div>
              <div class="custom-indicator"
                   v-if="datas.image&&datas.image.length>0">
                <div class="swiper-pagination"></div>
              </div>
            </div>
            <div class="autWraper df ">
              <div class="autleft df" @click="jumpToUser">
                <img :src="datas.userImage"
                     alt=""
                     v-if="datas.userImage&&datas.userImage!=='-'">
                <img :src="require('~/assets/img/self/self@2x.png')"
                     alt=""
                     v-else>
                <div class="autinfo df">
                  <p class="f15 fw600">{{datas.nickName}}</p>
                  <p class="f12 fw400">{{datas.time}}</p>
                </div>
              </div>
              <div class="autright">
                <div class="follow cf tac f15" @click="initGet(2)" :class="{'followactive border':datas.followFlag}">{{datas.followFlag | followStatus}}</div>
              </div>
            </div>
            <div class="textWraper f15 fw400"
                 :class="{'unimgtextWraper':unImgAndVideo}">{{datas.content}}</div>
            <!-- <div class="eye df">
              <van-icon name="eye-o"
                        size="20px"
                        color="#999999" />
              <span>{{datas.visitCount}}</span>
            </div> -->
            <div class="dissWraper">
              <div class="titleWraper df">
                <p>
                  <span class="c3">评论</span>
                  <span class="c6">({{datas.commentCount}})</span>
                </p>
                <p class="f14 c6" @click="disPop = true">全部评论</p>
              </div>
              <!-- <DiscussInput :userimage="datas.currentUserImage"
                            @sendDis='getMessage'
                            ref="disInput"
                            :placeholder="placeholder"></DiscussInput> -->
              <div class="zhanwei tac c9 f15" v-show="!datas.commentVo||datas.commentVo.length===0">
                暂无评论,快来抢沙发吧~
              </div>
              <DiscussPost v-for="(item,index) in datas.commentVo"
                           :key="`dis_${index}`"
                           :itemdata='item'
                           @replayone="replayone"></DiscussPost>
            </div>
            <div class="goodsWraper"
                 v-if="datas.productList&&datas.productList.length>0">
              <p class="title">相关商品</p>
              <div class="good"
                   :class="index===datas.productList.length?'':'border-bottom'"
                   v-for="(item,index) in datas.productList"
                   :key="index">
                <img :src="item.productImage"
                     alt="">
                <div class="goodInfo">
                  <p class="name">{{item.productName}}</p>
                  <div class="price">
                    <span>¥</span>
                    <span>{{item.productPrice}}</span>
                  </div>
                  <div class="btn"
                       @click="jumpToDetail(item)">
                    <span>查看</span>
                  </div>
                </div>
              </div>
              <p class="bottom">已经到底了</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer df pf"
         v-show="!loading&&!keyShow">
      <div class="inp" @click="handelKeyShow">
        <span class="f15 c9">说点什么...</span>
      </div>
      <div class="fitems df">
        <div :class="datas.postArticleFlag?'zanactive':'zan'" @click="initGet(1)"></div>
        <div class="zhuan" @click="share"></div>
      </div>
    </div>
    <div class="foot pf df" v-show="keyShow">
      <div class="foll">
        <van-field v-model="message" :placeholder="placeholder" @focus="keyShow = true" @blur="handelKeyBlur" ref="vantInp"/>
      </div>
      <div  class="fbtn tac f15" :class="message!==''?'active':''" @click="getMessage">发送</div>
    </div>
    <DiscussPopPost v-if="disPop"
                    @close="disPop = false"
                    :serviceId='serviceId'
                    :currentUserImage="datas.currentUserImage"></DiscussPopPost>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import DiscussInput from '~/components/tiezi/DiscussInput'
import DiscussPopPost from '~/components/tiezi/DiscussPopPost'
import DiscussPost from '~/components/tiezi/DiscussPost'
import { IOS, ANDROID, WX } from '~/environment/esm'
import { URL } from '~/config/constant'
import { detail, reply, sup, follow } from '~/api/post'
const defaultNav = { color: '#fff', bgcolor: 'transparent', left: false, right: false, fixed: true, name: require('~/components/backbar/images/back.png'), leftSize: '28px' }
const activeNav = { color: '#333', bgcolor: '#fff', left: true, right: true, fixed: true, name: 'arrow-left', leftSize: '18px' }
const unNav = { color: '#333', bgcolor: '#fff', left: false, right: false, fixed: false, name: 'arrow-left', leftSize: '18px' }
export default {
  data () {
    return {
      navOption: Object.assign({}, defaultNav),
      mescroll: null, // mescroll实例对象
      swiperOption: {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        autoHeight: true
      },
      loading: false,
      disPop: false, // 评论弹出框
      datas: {},
      serviceId: '', // 帖子id
      fitIos: false,
      IOSHeight: 0,
      message: '',
      MyVideoControls: false,
      videoSrc: '',
      videoPoster: '',
      playerBtnShow: true,
      placeholder: '说点什么...',
      commentId: '',
      shartOption: {},
      keyShow: false
    }
  },
  props: {
    pageDatas: {
      type: Object
    }
  },
  created () {
    this.datas = this.pageDatas
  },
  mounted () {
    this.mescrollInit()
    this.serviceId = this.$route.params.postId
    this.loading = true
    this.initGet(0) // 0是获取文章详情  1 点赞  2 关注
  },
  watch: {
    // 苹果设备调整顶部  位置
    unImgAndVideo (val) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getStatusBarH', null, res => {
            this.IOSHeight = res
            this.computHeight(val, res)
            // this.$refs.navBar.style.paddindTop = `${res/37.5}rem`
          })
        })
      } else {
        this.computHeight(val, 0)
      }
    }
  },
  methods: {
    computHeight (val, res) {
      if (val) {
        this.$refs.navBar.style.top = 0
        this.navOption = Object.assign({}, unNav)
        this.$refs.navBar.style.paddingTop = `${res / 37.5}rem`
        this.$refs.mescroll.style.top = `${(res + 46) / 37.5}rem`
      } else {
        this.$refs.navBar.style.top = 0
        this.navOption = Object.assign({}, defaultNav)
        this.$refs.navBar.style.paddingTop = `${res / 37.5}rem`
        this.$refs.mescroll.style.top = '0'

        // this.$refs.mescroll.$el.style.top = `${this.IOSHeight + 46}px`
      }
    },
    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        }, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        up: { // 上拉加载的配置.
          // isBounce: false,
          onScroll: this.meScorllScroll,
          lazyLoad: {
            use: true
          }
        }
      })
    },
    shareFun () {
      if (this.datas.content) {
        let content = this.datas.content.slice(0, 18)
        content = content.lenght < 18 ? `${content}...` : content
        let url = ''
        if (this.datas.userType === 0) {
          url = `${URL}/user/${this.serviceId}`
        } else if (this.datas.userType === 3) {
          url = `${URL}/pingjia/${this.serviceId}`
        }
        this.shartOption = {
          type: 'url',
          data: {
            title: `${this.datas.nickName}的一条茶说，快来围观`, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl: this.unImgAndVideo ? '' : (this.videoPoster || this.datas.image[0].imageUrl)
          }
        }
        this.getShareWxArg(this.shartOption)
      }
    },
    share () {
      if (this.datas.content) {
        if (IOS) {
          setTimeout(() => {
            window.callback(ios => {
              ios.callHandler('goShareType', JSON.stringify(this.shartOption), res => {
              })
            })
          }, 20)
        } else if (ANDROID) {
          window.android.goShareType(JSON.stringify(this.shartOption))
        }
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
    formatTime,
    getDetail (userId) {
      this.$axios.$post(detail, {
        userId: userId,
        serviceId: this.serviceId,
        userType: 0
      }).then(res => {
        if (res.code === 10000) {
          this.datas = res.data
          setTimeout(() => {
            this.shareFun()
          }, 50)
          this.$nextTick(() => {
            this.loading = false
          })
          // 获取视频预览图和地址
          this.videoPoster = res.data.frameImage
          this.videoSrc = res.data.videoUrl
          // if (this.unImgAndVideo) {
          //   this.navOption = Object.assign({}, unNav)
          //   this.$refs.mescroll.$el.style.top = '46px'
          // }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 需要获取userId的函数前置操作 // 0是获取文章详情  1 点赞  2 关注
    initGet (type) {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if ((userId && token)) {
              this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
              this.storing(type, userId)
            } else if (type !== 0) {
              window.callback(ios => {
                ios.callHandler('goLogin', null, res => {
                  this.$toast('去登录')
                })
              })
            } else {
              this.storing(type, '')
            }
          })
        })
      } else if (ANDROID) {
        if (window.android.getIsLogin()) {
          const userId = window.android.getUserId()
          const token = window.android.getToken()
          this.saveLogin({ userId: userId, token: token, isLogin: true, mobileFlag: true })
          this.storing(type, userId)
        } else if (type !== 0) {
          window.android.isLoginFinishWeb(true, ' ')
        } else {
          this.storing(type, '')
        }
      } else {
        if (this.user.isLogin) {
          this.storing(type, this.user.userId)
        } else if (type !== 0) {
          this.$router.push('/login')
        } else {
          this.storing(type, '')
        }
      }
    },
    // 关注用户
    followUser (userId) {
      this.$axios.$post(follow, {
        userId: userId,
        followId: this.datas.userId
      }).then(res => {
        if (res.code === 10000) {
          if (this.datas.followFlag) {
            this.$toast('已取消关注')
          } else {
            this.$toast('关注成功')
          }
          this.datas.followFlag = !this.datas.followFlag
        }
      })
    },

    jumpToUser() {
      const option = { userId: this.datas.userId }
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('goDiscussionUserPage', JSON.stringify(option), res => {

          })
        })
      } else if (ANDROID) {
        window.android.goDiscussionUserPage(JSON.stringify(option))
      } else {
        this.$router.push(`/userid/${option.userId}`)
      }
    },
    replayone (val) {
      this.placeholder = `回复 ${val.userName}:`
      this.commentId = val.commentId
      this.keyShow = true
      this.$nextTick(() => {
        this.$refs.vantInp.focus()
      })
    },
    // 获取到userId后按照type分配执行的函数 // 0是获取文章详情  1 点赞  2 关注 3 发表评论
    storing (type, userId) {
      switch (type) {
        case 0:
          this.getDetail(userId)
          break
        case 1:
          this.upDianzan(userId)
          break
        case 2:
          this.followUser(userId)
          break
        case 3:
          this.sendDis(userId)
          break
      }
    },
    getMessage () {
      this.initGet(3)
      this.keyShow = false
    },
    handelKeyShow() {
      this.placeholder = '说点什么...'
      this.commentId = ''
      this.keyShow = true
      this.$nextTick(() => {
        this.$refs.vantInp.focus()
      })
    },
    handelKeyBlur() {
      if (this.message === '') {
        this.keyShow = false
      } else {
        this.keyShow = true
      }
    },
    // 发送评论
    sendDis (userId) {
      const option = {
        commentId: this.commentId || '',
        postId: this.serviceId,
        userId: userId,
        content: this.message
      }
      this.$axios.$post(reply, option).then(res => {
        if (res.code === 10000) {
          this.$toast('发表成功')
          this.message = ''
          this.placeholder = '填写评论'
          this.commentId = ''
          this.initGet(0)
          // this.mescroll.triggerDownScroll()
        } else {
          this.$toast(res.message)
        }
      })
    },
    // 帖子点赞
    upDianzan (userId) {
      const option = {
        userId: userId,
        serviceId: this.serviceId,
        serviceType: 0, // 0是内容  1是评论
        userType: 0,
        attentionType: this.datas.postArticleFlag ? 0 : 1
      }
      this.$axios.$post(sup, option).then(res => {
        if (res.code === 10000) {
          if (this.datas.postArticleFlag) {
            this.$toast('已取消点赞')
            this.datas.fabulous--
          } else {
            this.$toast('点赞成功')
            this.datas.fabulous++
          }
          this.datas.postArticleFlag = !this.datas.postArticleFlag
        }
      })
    },
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 350) {
        this.navOption = Object.assign({}, activeNav)
      } else if (!this.unImgAndVideo) {
        this.navOption = Object.assign({}, defaultNav)
      } else {
        this.navOption = Object.assign({}, unNav)
      }
    },
    handleClickBack () {
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goBack', null, res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goBackH5(true)
      } else if (WX) {
        this.$router.back()
      } else {
        this.$router.back()
      }
    },
    jumpToDetail (item) {
      this.$router.push({ path: `/${item.productId}`, query: { gobackMyback: true } })
    },
    ...mapActions(['saveLogin', 'getShareWxArg'])
  },
  computed: {
    ...mapGetters([
      'user']),
    unImgAndVideo () {
      // 是否纯文字
      return (this.datas.image && this.datas.image.length === 0 && !this.videoSrc && !this.videoPoster)
    }
  },
  filters: {
    followStatus(val) {
      if (val) {
        return '已关注'
      } else {
        return '+ 关注'
      }
    }
  },
  components: {
    DiscussInput,
    DiscussPopPost,
    DiscussPost
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.postdetailWraper {
  .van-nav-bar__left {
    position: static;
    padding: 0 10px;
  }
  .left {
    height: 100%;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
      margin: 0 10px 0 15px;
      border-radius: 50%;
    }
  }
  .van-nav-bar__right{
    right: 10px;
  }
  .right {
    /deep/ .van-tag {
      padding: 2.5px 15px;
      border-radius: 0;
    }
    .guanzhu {
      display: flex;
      align-items: center;
    }

      .follow{
        width: 84px;
        height: 38px;
        line-height: 38px;
        @include bg-image('tiezi/followbg');
        &.followactive{
          background: #fff;
          color: #999;
          width: 75px;
          height: 30px;
          line-height: 30px;
          margin-right: 5px;
          &.border:before{
            border-radius: 50px;
          }
        }
      }
  }
  /deep/ .van-icon {
    font-weight: bold;
  }
  .loading {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.6);
    padding: 15px;
    border-radius: 10px;
  }
  .autWraper {
    padding: 15px 10px 10px 15px;
    justify-content: space-between;
    background: #fff;
    align-items: center;
    .autleft {
      height: 100%;
      align-items: center;
      img {
        width: 33px;
        height: 33px;
        margin-right: 10px;
        border-radius: 50%;
      }
      .autinfo {
        flex-direction: column;
        justify-content: space-between;
        padding-top: 2.5px;
        box-sizing: border-box;
        :first-child {
          color: #333;
        }
        :last-child {
          color: #999;
        }
      }
    }
    .autright {
      .follow{
        width: 84px;
        height: 38px;
        line-height: 38px;
        @include bg-image('tiezi/followbg');
        &.followactive{
          background: #fff;
          color: #999;
          width: 75px;
          height: 30px;
          line-height: 30px;
          margin-right: 5px;
          &.border:before{
            border-radius: 50px;
          }
        }
      }
    }
  }
  .transparent {
    background: transparent;
  }
  .mescroll {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 49px;
    height: auto;
  }
  /deep/ .mescroll-upwarp{
    min-height: 0;
  }
  .sub {
    .img-wrpper {
      width: 100%;
      max-height: 375px;
      // height: 375px;
      // @include bg-image("./images/detailbanner");

      background-position: 50% 50%;
      background-size: 120%;
      img {
        width: 100%;
        height: 375px;
        object-fit: cover;
      }
      .custom-indicator {
        position: absolute;
        right: 50%;
        bottom: 15px;
        z-index: 12;
        padding: 3px 9px;
        box-sizing: border-box;
        transform: translate(50%, 0);
        font-size: 14px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        /deep/ .swiper-pagination {
          position: static;
        }
      }
      .palyer {
        position: relative;
        width: 100%;
        height: 100%;
      }
      video {
        width: 100%;
        object-fit: cover;
        max-height: 375px;
        // width: 375px;
        // height: 375px;
      }
      .playerWraper {
        position: absolute;
        top: 55%;
        z-index: 1;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .textWraper {
      background: #fff;
      padding: 5px 20px 20px;
      line-height: 22px;
      box-sizing: border-box;
      white-space: pre-wrap;
      width: 100%;
      text-align: justify;
      text-justify: newspaper;
      word-break: break-all;
      &.unimgtextWraper {
        padding-top: 5px;
      }
    }
    .eye {
      justify-content: flex-end;
      align-items: center;
      background: #fff;
      padding: 10px 20px;
      color: #999;
      span {
        margin-left: 10px;
      }
    }
    .dissWraper {
      margin-top: 10px;
      background: #fff;
      .titleWraper {
        padding: 15px 15px 5px 15px;
        font-weight: normal;
        font-size: 18px;
        justify-content: space-between;
      }
      .showAll {
        text-align: center;
        color: #666;
        font-size: 14px;
        background: #fff;
        padding: 10px 0 15px;
        box-sizing: border-box;
        font-weight: normal;
      }
      .lineWraper {
        padding: 15px;
      }
      .zhanwei{
        width: 100%;
        height: 120px;
        line-height: 120px;
      }
    }
    .goodsWraper {
      margin: 10px 0;
      font-weight: normal;
      .title {
        font-size: 18px;
        padding: 15px 10px 10px;
        background: #fff;
      }
      .good {
        display: flex;
        padding: 10px;
        background: #fff;
        position: relative;
        img {
          flex: 0 0 95px;
          height: 95px;
          background: #ccc;
        }
        .name {
          font-size: 15px;
          margin: 5px 35px 15px 15px;
        }
        .price {
          margin-left: 20px;
          color: #d45949;
          :first-child {
            font-size: 12px;
          }
          :last-child {
            font-size: 15px;
          }
        }
        .btn {
          position: absolute;
          right: 15px;
          bottom: 10px;
          width:60px;
          height:22px;
          background:linear-gradient(-45deg,rgba(245,109,104,1) 0%,rgba(240,125,110,1) 100%);
          border-radius:11px;
          line-height: 22px;
          text-align: center;
          color: #fff;
        }
      }
      .bottom {
        margin: 10px 0;
        text-align: center;
        color: #999;
        font-size: 12px;
      }
    }
  }
  .footer {
    bottom: 0;
    right: 0;
    left: 0;
    height: 49px;
    background: #fff;
    align-items: center;
    padding: 8px 15px;
    box-sizing: border-box;
    .inp{
      flex: 0 0 240px;
      width:240px;
      height:33px;
      line-height:33px;
      background:rgba(242,242,242,1);
      border-radius:17px;
      span{
        margin-left: 10px;
      }
    }
    .fitems{
      width: 105px;
      justify-content: center;
      align-items: center;
      >div{
        width: 15px;
        height: 15px;
        background-size: cover;
        &.zan {
          @include bg-image('common/dian');
        }
        &.zanactive {
          width: 18px;
          height: 18px;
          @include bg-image('common/dianzanactive');
        }
        &.zhuan {
          margin-left: 30px;
          @include bg-image('common/fen');
        }
      }
    }
  }
  .foot{

    bottom: 0;
    right: 0;
    left: 0;
    height: 49px;
    background: #fff;
    align-items: center;
    padding: 8px 15px;
    box-sizing: border-box;
    .foll{
      flex: 0 0 265px;
      width:265px;
      height:33px;
      line-height:33px;
      background:rgba(242,242,242,1);
      border-radius:17px;
      /deep/ .van-cell{
        background: #f2f2f2;
        border-radius: 25px;
        padding:4px 14px;
      }
    }

    .fbtn{
      width:70px;
      height:33px;
      line-height:33px;
      border-radius:17px;
      margin-left: 10px;
      background: #f2f2f2;
      color: #ccc;
      &.active{
        color: #fff;
        background:linear-gradient(-45deg,rgba(245,109,104,1) 0%,rgba(240,125,110,1) 100%);
      }
    }

  }
}
</style>
