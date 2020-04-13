<template>
   <div class="chatWrap">
     <div class="chatapp">
       <div class="xw-header">
        <backbar title="客服"></backbar>
       </div>
       <van-pull-refresh v-model="isLoading"
       pulling-text="下拉加载更多"
       loosing-text="释放加载更多"
       class="xw-content" ref="content"
       @refresh="onRefresh">
       <div>
         <div class="chatWrapli" v-if="msgListAll[0]&&msgListAll[0].customerContent!==''">
            <!-- <div class="xw-chat-time">{{messageList.time}}</div> -->
            <div class="xw-chat-servicer">
              <div class="xw-servicer-avantar-wrap">
                <img :src="require('~/assets/img/common/logo.png')" class="xw-servicer-avantar" width="100%">
              </div>
              <div class="xw-chat-msg customer-msg">
                <!-- <span v-html="replaceFace(messageList.content)"></span> -->
                <span class="msg-selice"></span>
                <span v-html="msgListAll[0].customerContent"></span>
              </div>
            </div>
          </div>
         <div class="chatWrapli" v-if="msgListAll[0]&&msgListAll[0].autoLeaveMessages.length!==0">
            <!-- <div class="xw-chat-time">{{messageList.time}}</div> -->
            <div class="xw-chat-servicer">
              <div class="xw-servicer-avantar-wrap">
                <img :src="require('~/assets/img/common/logo.png')" class="xw-servicer-avantar" width="100%">
              </div>
              <div class="xw-chat-msg customer-msg system-msg">
                <!-- <span v-html="replaceFace(messageList.content)"></span> -->
                <span class="msg-selice"></span>
                <span class="system-chats">如您遇到以下问题,请点击</span>
                <span class="border-bottom system-chats"  @click="autoMsgSend(autoMsg)"
                v-html="`·  ${autoMsg.questionContent}`" v-for="(autoMsg,index) in msgListAll[0].autoLeaveMessages" :key="`auto_${index}`"></span>
                <!-- <span class="system-chats">客服微信:tdzc01</span> -->
              </div>
            </div>
          </div>
         <div class="xw-chat-wrap" v-for="(item,index) in msgListAll" :key="index">
          <div class="chatWrapli" v-if="item.userType===2&&item.content!==''">
            <!-- <div class="xw-chat-time">{{messageList.time}}</div> -->
            <div class="xw-chat-servicer">
              <div class="xw-servicer-avantar-wrap">
                <img :src="require('~/assets/img/common/logo.png')" class="xw-servicer-avantar" width="100%">
              </div>
              <div class="xw-chat-msg customer-msg">
                <!-- <span v-html="replaceFace(messageList.content)"></span> -->
                <span class="msg-selice"></span>
                <span v-html="item.content"></span>
              </div>
            </div>
          </div>

          <!-- 用户发送的消息模板-->
          <div class="chatWrapright" v-if="item.userType===1&&item.messageType===0">
            <!-- <div class="xw-chat-time">{{messageList.time}}</div> -->
            <div class="xw-chat-customer">
              <div class="xw-customer-avantar-wrap">
                <img class="xw-customer-avantar" :src="userInfo.avatarPath">
              </div>
              <div class="xw-chat-msg user-msg" style="display:inline-block">
                <!-- <span v-html="replaceFace(messageList.content)"></span> -->
                <span class="msg-selice-right"></span>
                <span v-if="item.content!==''">{{item.content}}</span>
                <img :src="item.imageUrl" v-if="item.imageUrl" width="100%">
              </div>
            </div>
          </div>
          <div class="fromDetail" v-if="item.messageType===3">
            <div class="good">
              <div class="good-left">
                <div class="good-img">
                  <img :src="item.messageContent.imageUrl" width="100%">
                </div>
                <div class="good-del">
                  <p class="good-name">{{item.messageContent.productName}}</p>
                  <p class="good-pri">¥ {{item.messageContent.price}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="fromDetail" v-if="item.messageType===2">
            <div class="fromorder border-bottom">
              <span>订单编号:</span>
              <span>{{item.messageContent.productOrderId}}</span>
            </div>
            <div class="good">
              <div class="good-left">
                <div class="good-img">
                  <img :src="item.messageContent.imageUrl" width="100%">
                </div>
                <div class="good-del">
                  <p class="good-name">{{item.messageContent.productName}}</p>
                  <p class="good-pri">¥ {{item.messageContent.price}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 来源信息展示 -->
        <!-- <div class="fromDetail" v-if="sendData">
          <div class="good">
            <div class="good-left">
              <div class="good-img">
                <img :src="sendData.imageUrl" width="100%">
              </div>
              <div class="good-del">
                <p class="good-name">{{sendData.productName}}</p>
                <p class="good-pri">¥ {{sendData.price}}</p>
              </div>
            </div>
          </div>
          <div class="sendToCustom border-top" @click="sendGoodToCustom">发送给客服</div>
        </div> -->
       </div>

        </van-pull-refresh>
       <div class="xw-footer-wrap">
         <div class="foot-cool">
           <div class="order" @click="customOrderPop=true"></div>
           <div class="image">
            <UpImage @imgUrl="msgUserSend"></UpImage>
           </div>
         </div>
         <div class="foot-input">
           <van-field
            v-model="userMsg"
            type="textarea"
            rows="1"
            :autosize="{ maxHeight: 100, minHeight: 27 }"
            border
            @blur='inputBlur'
          />
         </div>
         <div class="footsendbtn" @click="msgUserSend()">
           发送
         </div>
       </div>
     </div>
     <transition name="van-slide-up">
      <div class="customOrderWraper" v-show="customOrderPop">
        <div class="cowTitle border-bottom">
          <div>请选择你要咨询的订单</div>
          <div class="closebtn" @click="customOrderPop=false"></div>
        </div>
        <CustomOrder @sendOrder="sendOrder"></CustomOrder>
      </div>
      </transition>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
import CustomOrder from '~/components/custom/CustomOrder'
import UpImage from '~/components/upimage/UpImage'
import { userSend, getCoustom, getMsgList } from '~/api/custom'
import { mapGetters } from 'vuex'
import { getUserData } from '~/api/self'
import { getFormatDate } from '~/utils'
export default {
  name: 'custom',
  data() {
    return {
      userInfo: {},
      userMsg: '',
      msgListAll: [],
      timer: null,
      customOrderPop: false,
      sendData: {},
      orderData: {},
      fromshow: true,
      isEnd: 1,
      isLoading: false
    }
  },
  mounted () {
    this.getUser()
    clearInterval(this.timer)
    setTimeout(() => {
      // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
    })
    this.timer = setInterval(() => {
      this.msgCustom()
    }, 5000)
    this.msgListAll = []
    this.sendData = {}
    this.orderData = {}
    this.msgList(getFormatDate(new Date()))
    this.sendData = sessionStorage.getItem('__teacustom__') ? JSON.parse(sessionStorage.getItem('__teacustom__')) : ''
    this.orderData = sessionStorage.getItem('__teacustomorder__') ? JSON.parse(sessionStorage.getItem('__teacustomorder__')) : ''
    setTimeout(() => {
      if (this.sendData.productId) {
        this.sendGoodToCustom()
        sessionStorage.removeItem('__teacustom__')
        setTimeout(() => {
          this.sendData = {}
        }, 1000)
      }
      if (this.orderData.productOrderId) {
        this.sendOrder(this.orderData)
        sessionStorage.removeItem('__teacustomorder__')
        setTimeout(() => {
          this.sendData = {}
        }, 1000)
      }
    }, 200)
  },
  watch: {

  },
  methods: {
    onRefresh() {
      if (this.isEnd === 1) {
        this.msgList(this.msgListAll[0].createTime)
      } else {
        setTimeout(() => {
          this.isLoading = false
        }, 10)
      }
    },
    getUser() {
      if (this.user.isLogin) {
        const option = {
          userId: this.user.userId,
          token: this.token
        }
        this.$axios.$post(getUserData, option).then(res => {
          if (res.code === 10000) {
            this.userInfo = res.data
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    sendGoodToCustom() {
      const option = {
        userId: this.userInfo.userId,
        content: this.sendData.productId,
        messageType: 3,
        mobile: this.userInfo.mobile,
        nickName: this.userInfo.nickName,
        userType: 1
      }
      this.$axios.$post(userSend, option).then(res => {
        if (res.code === 10000) {
          // this.msgListAll.push(option)
          this.userMsg = ''
          this.fromshow = false
          setTimeout(() => {
            // this.$refs.content.scrollTop = this.$refs.content.scrollHeight
            // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
            this.$refs.content.scrollEl.scrollTo({
              top: this.$refs.content.scrollEl.scrollHeight,
              behavior: 'smooth'
            })
          }, 100)
        } else {
          this.$toast(res.message)
        }
      })
    },
    sendOrder(e) {
      const option = {
        userId: this.userInfo.userId,
        content: e.productOrderId,
        messageType: 2,
        mobile: this.userInfo.mobile,
        nickName: this.userInfo.nickName,
        userType: 1
      }
      console.log(e)
      this.$axios.$post(userSend, option).then(res => {
        if (res.code === 10000) {
          const temp = {
            autoLeaveMessages: [],
            content: '',
            createTime: '',
            customerContent: '',
            imageProperty: null,
            imageUrl: '',
            messageContent: {
              imageUrl: e.products[0].productImage,
              price: e.products[0].unitPrice,
              productCount: e.products[0].productCount,
              productId: null,
              productName: e.products[0].productName,
              productOrderId: e.productOrderId
            },
            messageType: 2,
            readFlag: 1,
            userId: this.userInfo.userId,
            userType: 1
          }
          this.msgListAll.push(temp)
          this.userMsg = ''
          this.customOrderPop = false
          setTimeout(() => {
            // this.$refs.content.scrollTop = this.$refs.content.scrollHeight
            // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
            this.$refs.content.scrollEl.scrollTo({
              top: this.$refs.content.scrollEl.scrollHeight,
              behavior: 'smooth'
            })
          }, 100)
        } else {
          this.$toast(res.message)
        }
      })
    },
    // 自动回复消息发送
    autoMsgSend(item) {
      const option = {
        userId: this.userInfo.userId,
        content: `<font color='#018ecf'> ${item.questionContent} </font></div><div><font color='#666666'>${item.questionAnswer}</font>`,
        messageType: 0,
        mobile: this.userInfo.mobile,
        nickName: this.userInfo.nickName,
        userType: 2
      }
      this.$axios.$post(userSend, option).then(res => {
        if (res.code === 10000) {
          this.msgListAll.push(option)
          this.userMsg = ''
          setTimeout(() => {
            // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
            this.$refs.content.scrollEl.scrollTo({
              top: this.$refs.content.scrollEl.scrollHeight,
              behavior: 'smooth'
            })
          }, 100)
        } else {
          this.$toast(res.message)
        }
      })
    },
    inputBlur () {
      window.scrollTo(0, 0)
    },
    // 用户发出的消息
    msgUserSend(imageUrl) {
      const option = {
        userId: this.userInfo.userId,
        imageUrl: imageUrl,
        content: this.userMsg,
        messageType: 0,
        mobile: this.userInfo.mobile,
        nickName: this.userInfo.nickName,
        userType: 1
      }
      console.log(option)
      this.$axios.$post(userSend, option).then(res => {
        if (res.code === 10000) {
          this.msgListAll.push(option)
          this.userMsg = ''
          setTimeout(() => {
            // this.$refs.content.scrollTop = this.$refs.content.scrollHeight
            // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
            this.$refs.content.scrollEl.scrollTo({
              top: this.$refs.content.scrollEl.scrollHeight,
              behavior: 'smooth'
            })
          }, 100)
        } else {
          this.$toast(res.message)
        }
      })
    },
    sengImg() {

    },
    // 客服发送的消息
    msgCustom() {
      const option = {
        userId: this.user.userId
      }
      this.$axios.$post(getCoustom, option).then(res => {
        if (res.code === 10000) {
          if (res.userMessageList.length !== 0) {
            res.userMessageList.forEach(item => {
              this.msgListAll.push(item)
            })
            setTimeout(() => {
              // this.$refs.content.scrollTop = this.$refs.content.scrollHeight
              // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
              this.$refs.content.scrollEl.scrollTo({
                top: this.$refs.content.scrollEl.scrollHeight,
                behavior: 'smooth'
              })
            }, 100)
          }
        } else {
          this.$toast(res.message)
        }
      })
    },
    msgList(time) {
      const option = {
        userId: this.user.userId,
        beginTime: time
      }
      this.$axios.$post(getMsgList, option).then(res => {
        if (res.code === 10000) {
          this.isEnd = res.isEnd
          this.isLoading = false
          if (res.userMessageList.length !== 0) {
            // res.userMessageList.forEach(item => {
            //   this.msgListAll.unshift(item)
            // })
            if (this.msgListAll.length === 0 || this.msgListAll[0].createTime !== time) {
              this.msgListAll = [...res.userMessageList]
              setTimeout(() => {
                // this.$refs.content.scrollTop = this.$refs.content.scrollHeight
                // this.$refs.content.scrollEl.scrollTop = this.$refs.content.scrollEl.scrollHeight
                this.$refs.content.scrollEl.scrollTo({
                  top: this.$refs.content.scrollEl.scrollHeight,
                  behavior: 'smooth'
                })
              }, 50)
            } else {
              const temp = this.$refs.content.$el.children[0].children[1].children[this.msgListAll.length - 1]
              this.msgListAll = [...res.userMessageList, ...this.msgListAll]
              temp.scrollIntoView()
            }
          }
        } else {
          this.$toast(res.message)
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {
    ...mapGetters([
      'user'])
  },
  components: {
    backbar,
    CustomOrder,
    UpImage
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.chatWrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 16;
  background: #f2f2f2;
  font-weight: normal;
  .chatapp {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .xw-header {
      height: 44px;
    }
    .xw-content {
      flex: 1;
      position: relative;
      overflow-y: scroll;
      transition: height 0.8s;
      padding: 25px 0;
      box-sizing: border-box;
      .xw-chat-msg {
        -webkit-font-smoothing: antialiased;
        hyphens: auto;
        word-wrap: break-word;
        word-break: normal;
        position: relative;
        padding: 8px 15px;
        border: 1px solid transparent;
        width: 80%;
        min-width: 50px;
        min-height: 22px;
        line-height: 1.6em;
        margin-left: 10px;
        box-sizing: border-box;
        &.customer-msg {
          margin-left: 14px;
        }
        &.user-msg {
          margin-right: 42px;
        }
        .msg-selice {
          position: absolute;
          display: inline-block;
          top: -1px;
          left: -16px;
          width: 0;
          height: 0;
          border-top: 15px solid #fff;
          border-left: 15px solid transparent;
        }
        .msg-selice-right {
          position: absolute;
          display: inline-block;
          top: -1px;
          right: -16px;
          width: 0;
          height: 0;
          border-top: 15px solid #d45949;
          border-right: 15px solid transparent;
        }
      }
      .chatWrapli {
        padding-left: 20px;
        margin-bottom: 25px;
        .system-msg {
          .system-chats {
            display: block;
            line-height: 35px;
          }
        }
      }
      .fromDetail {
        .fromorder {
          margin: 0 20px;
          padding: 10px 15px;
          background-color: #fff;
        }
        .good {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 20px;
          padding: 10px 15px;
          background-color: #fff;
          .good-left {
            display: flex;
            align-items: center;
            .good-img {
              width: 40px;
              height: 40px;

              margin-right: 10px;
            }
            .good-del {
              .good-pri {
                margin-top: 0.16rem;
                color: #D45949;
              }
            }
          }
        }
        .sendToCustom {
          margin: 0 20px;
          padding: 0.25rem;
          background-color: #fff;
          text-align: center;
          color: #666;
        }
      }
      .chatWrapright {
        padding-right: 20px;
        margin-bottom: 25px;
      }
      .xw-chat-servicer .xw-chat-msg {
        background: #fff;
      }
      .xw-chat-servicer,
      .xw-chat-customer  {
        position: relative;
        margin-bottom: 16px;
        padding: 0 10px 0 45px;
      }
      .xw-servicer-avantar-wrap {
        position: absolute;
        left: 0;
        line-height: 0;
      }
      .xw-customer-avantar-wrap {
        position: absolute;
        right: 0;
        line-height: 0;
        @include bg-image('self/self');
        background-size: cover;
      }
    }
    .xw-chat-msg :last-child  {
      margin-bottom: 0;
    }
    .xw-chat-msg span {
      white-space: pre-line;
    }
    .xw-servicer-avantar, .xw-customer-avantar {
      width: 33px;
      height: 33px;
      border: 0;
      border-radius: 50%;
    }
    .xw-chat-customer  {
      position: relative;
      margin-bottom: 16px;
      padding: 0 10px 0 45px;
    }

    .xw-chat-customer  {
      text-align: right;
    }

    .xw-chat-customer .xw-chat-msg  {

      text-align: left;
      background: #D45949;

      color: #fff;
      margin-right: 45px;
    }
    .xw-chat-msg :last-child  {
      margin-bottom: 0;
    }

    .xw-chat-wrap .xw-system-info-time
    .xw-chat-wrap time  {
      line-height: 1;
      text-align: center;
      display: block;
      margin-bottom: 8px;
      font-size: 12px;
      color: #999;
      text-shadow: 1px 1px 1px hsla(0, 0%, 100%, 0.6);
    }

    .xw-system-info {
      margin-bottom: 8px;
    }

    .xw-chat-wrap>:last-child  {
      margin-bottom: 16px;
    }

    .xw-system-info  {
      text-align: center;
      font-size: 12px;
    }

    .xw-system-info span  {
      display: inline-block;
      background: rgba(0, 0, 0, 0.08);
      padding: 4px 8px;
      line-height: 1;
      color: #7c7c7c;
      border-radius: 2px;
      text-shadow: 1px 1px 1px hsla(0, 0%, 100%, 0.6);
    }
  }
  .xw-footer-wrap {

    background: #fff;
    display: flex;
    align-items: center;
    .foot-cool {
      display: flex;
      align-items: center;
      padding-left: 15px;
      .order {
        width: 20px;
        height: 0.42rem;
        @include bg-image('custom/order');
        background-size: cover;
        margin-right: 10px;
      }
      .image {
        width: 0.45rem;
        height: 0.45rem;
        @include bg-image('custom/photo');
        background-size: cover;
        overflow: hidden;
      }
    }
    .foot-input {
      flex: 1;
    }
    .foot-input /deep/ .van-field__control {
      border: 1px solid #999;
      border-radius: 0;
      -webkit-appearance: none;
    }
    .footsendbtn {
      width: 1.2rem;
      height: 0.54rem;
      background: #D45949;
      line-height: 0.54rem;
      text-align: center;
      color: #fff;
      margin-right: 15px;
      font-size: 0.24rem;
    }
  }
}
.customOrderWraper {
  position: absolute;

  height: 8rem;
  left: 0;
  right: 0;
  bottom: 0.1rem;
  background: #fff;
  .cowTitle {
    padding: 0 15px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .closebtn {
      @include bg-image('custom/closebtn');
      background-size: cover;
      width: 15px;
      height: 15px;
    }
  }
}
</style>
