<template>
	  <div class="f15">
	  <div v-if="detailData.postFlag===0||detailData.postFlag===1">
	    <div class="orderdetail-wrap" :class="detailData.orderStatus===0?'bottom':''" ref="detail">
	    <div >
	      <div class="header-wrap" :class="{'bgcolor-size':detailData.orderStatus===0}">
	        <div class="header-title">
	          <div class="header-left" v-if="detailData.orderStatus===0">
	            <span>等待付款</span>
	            <span>剩余:</span>
	            <span>{{showTime}}</span>
	          </div>
	          <div class="header-left" v-else>
	            <span>{{detailData.orderStatus|formatStatus}}</span>
	          </div>
	          <!-- <div class="header-left" v-else-if="detailData.orderStatus===2">
	            <span>待收货</span>
	          </div>
	          <div class="header-left" v-else-if="detailData.orderStatus===3||detailData.orderStatus===4||detailData.orderStatus===6">
	            <span>待评价</span>
	          </div>
	          <div class="header-left" v-else-if="detailData.orderStatus===5||detailData.orderStatus===11">
	            <span>交易关闭</span>
	          </div> -->
	          <div class="header-right" :class="detailData.orderStatus===0?'waitPay':'Payed'"></div>
	        </div>
	        <div class="header-log" @click="jumpToEx"
	        v-if="![0,4,5,6,11].includes(detailData.orderStatus)">
	          <div class="log-add" v-if="detailData.postageContent&&detailData.postFlag===0">{{detailData.postageContent|formatContent}}</div>
	          <div class="log-add" v-else-if="detailData.postageContent&&detailData.postFlag===1">{{detailData.postageContent}}</div>
	          <div class="log-add" v-else>等待揽件</div>
	          <!-- <div class="log-time">{{logisticsInfo.AcceptTime}}</div> -->
	        </div>
			<div class="header-content" v-if="detailData">
								<div class="cont-name">
									<span>{{detailData.nickName}}</span>
			    <span>{{detailData.userMobile}}</span>
			  </div>
			  <div class="cont-add">
			    <span>地址:</span>
			    <span>{{detailData.recipientAddress}}</span>
			  </div>
			</div>
			</div>
	      <div class="sub-wrap">
	        <!-- <div class="sub-title">商品信息</div> -->
	        <div class="sub-content" v-if="detailData">
	          <div class="good" v-for="(item,index) in detailData.products" :key="index" @click="jumpToDetail(item)">
	            <div class="good-sub">
	              <div class="good-img">
											  
	                <img :src="item.productImage" style ="width:100%;" mode="widthFix">
	              </div>
	              <div class="good-text">
	                <p class="good-name">{{item.productName}}</p>
	                <div class="good-num f12 c9">
	                  <span>规格:</span>
	                  <span>{{item.productStyle}}</span>
	                  <span>&nbsp;&nbsp;</span>
	                  <span>数量:</span>
	                  <span>{{item.productCount}}</span>
	                </div>
	                <p class="good-pri">¥ {{item.unitPrice}}</p>
	              </div>
	            </div>
	            <!-- <div class="good-num">
	              X {{item.productCount}}
	            </div> -->
	          </div>
	          <div class="sub-text">
	            <span>商品总价</span>
	            <span>¥{{detailData.orderPrice}}</span>
	          </div>
	          <!-- <div class="sub-text">
	            <span>活动优惠</span>
	            <span>暂无</span>
	          </div> -->
	          <div class="sub-text">
	            <span>运费</span>
	            <span>¥{{detailData.transportPrice}}</span>
	          </div>
	          <div class="sub-text">
	            <span>优惠券</span>
	            <span class="active" v-if="detailData.discountCoupon!=='0'">-¥{{detailData.discountCoupon}}</span>
	            <span class="active" v-if="detailData.discountCoupon==='0'">暂无</span>
	          </div>
	          <div class="sub-text">
	            <span>茶银</span>
	            <span class="active">-¥{{detailData.counteractPrice}}</span>
	          </div>
	          <div class="sub-text">
	            <span>留言内容</span>
	            <span>{{detailData.leaveMessage}}</span>
	          </div>
	        </div>
	        <div class="sub-foot">
	          <div class="foot-text">
	            <div>
	              <span>订单编号:</span>
	              <span>{{detailData.productOrderId}}</span>
	            </div>
	            <!-- <div class="copy border" ref="orderCopy" :data-clipboard-text="this.productOrderId">复制</div> -->
	            <div class="copy van-hairline--surround" @click="copyData">复制</div>
	          </div>
	          <div class="foot-text">
	            <div>
	              <span>提交时间:</span>
	              <span>{{detailData.createTime}}</span>
	            </div>
	          </div>
	          <div class="foot-text">
	            <span>支付方式: 在线支付</span>
	          </div>
	          <div class="foot-text" v-if="detailData.remark&&detailData.remark!=='-'"  style="line-height: 0.35rem;align-items: flex-start;">
	            <span style="width:57px;">订单备注: </span>
	            <span style="color:#D45949;">{{detailData.remark}}</span>
	          </div>
	        </div>
	        <div class="sub-foot">
	          <div class="foot-pin df" @click="jumpToPin">
	            <div class="pinyin df">
	              <i class="pin"></i>
	              <span class="f15 fw400">品饮指南</span>
	            </div>
	            <van-icon name="arrow" color="#999" size="20px"/>
	          </div>
	        </div>
	      </div>
	    </div>
	    </div>
	    <div class="footer f15" v-if="detailData.orderStatus===0">
	      <div class="footer-txt">
	        <span>应付金额</span>
	        <span>¥ {{detailData.orderPrice}}</span>
	      </div>
	      <span class="footer-btn close" @click="closeOrder">取消订单</span>
	      <div tag="span" class="footer-btn pay" @click="payAgain">立即付款</div>
	    </div>
	    <div class="customWraper" @click="jumpTocustom"></div>
	    <div class="paying-wrap">
	      <van-action-sheet v-model="show" :close-on-click-overlay="false"
	      title="请选择支付方式" @cancel="onCancel">
	        <ul>
	          <li class="item border-bottom">
	            <div class="left">
	              <i class="icon weixin"></i>
	              <span class="text">微信</span>
	            </div>
	            <div class="right">
	              <i class="icon" :class="select==='wx'?'active':''" @click="select='wx'"></i>
	            </div>
	          </li>
	          <li class="item border-bottom" v-if="!isWx">
	            <div class="left">
	              <i class="icon zfb"></i>
	              <span class="text">支付宝</span>
	            </div>
	            <div class="right">
	              <i class="icon" :class="select==='zfb'?'active':''" @click="select='zfb'"></i>
	            </div>
	          </li>
	          <li class="btn" @click="choosePay">
	            <p>确定</p>
	          </li>
	        </ul>
	      </van-action-sheet>
	    </div>
	  </div>
	  </div>
</template>

<script>
	import {getOrderdetail} from "../../api/order.js"
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				productOrderId: '',
				detailData: {},
				isEnd: false,
				endTime: '',
				showTime: '',
				logisticsInfo: {},
				show: false,
				select: 'wx',
				downBtn: false
			};
		},
		onLoad(option) {
			this.productOrderId = option.productOrderId
			this.orderDetail()
		},
		methods:{
			orderDetail () {
				const option = {
					productOrderId: this.productOrderId,
					userId: this.user.userId
				}
				getOrderdetail(option).then(res=>{
					if (res.code == 10000) {
						this.detailData = res.data
						this.productOrderId = res.data.productOrderId
						this.orderStatus = res.data.orderStatus
						this.nickName = res.data.nickName
						this.recipientAddress = res.data.recipientAddress
						this.products = res.data.products
						if (this.detailData.orderStatus === 0) {
							this.endTime = res.data.createTime.replace(/-/g, '/')
							this.setEndTime()
						}
					}
				})
			},
			payAgain() {
			      const arg = {
			        productOrderId: this.productOrderId,
			        orderPrice: this.detailData.orderPrice
			      }
				  
			    },
			copyData() {
			      uni.setClipboardData({
							data: this.productOrderId,
							success: function () {
									console.log('success');
							}
					});
			    },
			    choosePay() {
			      
			    },
			    onCancel() {
			      this.show = false
			    },
			    closeOrder() {
			        const option = {
			          productOrderId: this.productOrderId,
			          userId: this.user.userId
			        }
			        delOrder(option).then(res => {
			          if (res.code === 10000) {
			            uni.showToast({
										title:'取消成功',
									})
			            this.orderDetail()
			          }
			        })
			      
			    },
			    jumpToEx() {
						if (this.detailData.postFlag === 0) {
							uni.navigateTo({
									url: `/pages/express/express?productOrderId=${this.detailData.productOrderId}&postageId=${this.detailData.postageId}`
								});} else {
							uni.navigateTo({
									url: `/pages/express/middle?productOrderId=${this.detailData.productOrderId}&postageId=${this.detailData.postageId}`
							});
						}
			    },
			    jumpToPin() {
			      uni.navigateTo({
							url: `/pages/activity/activity?url=https:m.chazhenxuan.com/introduce/drinkinfo`
						});
			    },
			    jumpTocustom() {
			      
			    },
			    setEndTime() {
			      this.timestampToTime()
			      this.interval = setInterval(() => {
			        this.timestampToTime()
			      }, 1000)
			    },
			    timestampToTime() {
			      const time = {
			        m: '',
			        s: ''
			      }
			      var date = (Date.parse(new Date(this.endTime)) + 3600000) - (Date.parse(new Date())) // 计算剩余的毫秒数
			      if (date <= 0) {
			        this.detailData.orderStatus = 11
			        clearInterval(this.interval)
			      } else {
			        time.m = parseInt(date / 1000 / 60 % 60, 10)// 计算剩余的分钟
			        if (time.m < 10) {
			          time.m = '0' + time.m
			        }
			        time.s = parseInt(date / 1000 % 60, 10)// 计算剩余的秒数
			        if (time.s < 10) {
			          time.s = '0' + time.s
			        }
			        this.showTime = `${time.m}分${time.s}秒`
			      }
			    },
			    setHeight(height) {
			      this.IOSHeight = height
			      this.$refs.detail.style.paddingTop = `${(height + 42) / 37.5}rem`
			      // alert(height)
			    },
			    jumpToDetail(item) {
			      if (item.productSaleFlag === 0) {
			        uni.navigateTo({
									url: `/pages/detail/detail?id=${item.productId}`
							});
			      } else {
			        this.$toast('该商品已下架')
			      }
			    }
			  },
		computed: {
			...mapGetters(['user','hasLogin'])
		},
		filters: {
		    formatStatus(value) {
		      if (value === 0) {
		        return '待付款'
		      } else if (value === 1) {
		        return '待发货'
		      } else if (value === 2) {
		        return '待收货'
		      } else if (value === 3) {
		        return '待评价'
		      } else if (value === 4) {
		        return '已评价'
		      } else if (value === 5) {
		        return '已过期'
		      } else if (value === 6) {
		        return '已完成'
		      } else if (value === 7) {
		        return '申请订单退货'
		      } else if (value === 8) {
		        return '待退货'
		      } else if (value === 9) {
		        return '待确认'
		      } else if (value === 10) {
		        return '确认退货'
		      } else if (value === 11) {
		        return '订单取消'
		      } else {
		        return '待付款'
		      }
		    },
		    formatContent(val) {
				let str = ''
				if(val){
				 str = JSON.parse(val)[0].AcceptStation
				} else {
					str = ''
				}
		      return str
		    }
		  }
	}
</script>




<style lang="scss">
.orderdetail-wrap {
  // position: fixed;
  // top: 44px;
  // left: 0;
  // right: 0;
  // bottom: 10px;
  // z-index: 10;
  padding: 0px 0 10px;
  overflow-y: scroll;
  background-color: #f2f2f2;
  .downBtnWrap{
    width: 90px;
    height: 46px;
    @include bg-image('common/downbtn');
    right: 0;
    top: 30%;
    transform: translateY(-50%);
    z-index: 999;
  }
  &.bottom{
    padding-bottom: 50px;
  }
  .header-wrap {
    width: 100%;

    background: linear-gradient(0deg, rgba(255, 72, 48, 0) 0%, rgba(255, 72, 48, 1) 100%);
    &.bgcolor-size {
      background-size: 100% 50%;
      background-repeat: no-repeat;
    }
    .header-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 17px;
	  color: #fff;
      .header-right {
        width: 40px;
        height: 40px;
        background-size: cover;
        &.waitPay {
          @include bg-image('order/money');
        }
        &.Payed {
          @include bg-image('order/money');
        }
      }
    }
	.header-content {
	  margin: 0 auto;
	  width: 95%;
	  border-radius: 0 0 5px 5px;
	  background: #fff;
	  padding: 15px;
	  box-sizing: border-box;
	  .cont-name {
	    font-size: 15px;
	    font-weight: 500;
	    margin-bottom: 10px;
	  }
	  .cont-add {
	    font-weight: 400;
	    font-size: 12px;
	    line-height: 15px;
	  }
	}
    .header-log {
      margin: 0 auto 0 auto;
      width: 95%;
      background: #fff;
	  opacity:0.5;
      padding: 10px;
      box-sizing: border-box;
	  border-radius: 5px 5px 0 0;
      .log-add {
        font-size: 15px;
        // margin-bottom: 10px;
        line-height: 19px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .log-time {
        font-size: 12px;
      }
    }
 
  }
  .sub-wrap {
    margin: 10px;
    font-size: 13px;
    // .sub-title {
    //   margin-bottom: 15px;
    // }
    .sub-content {
      background: #fff;
	  border-radius: 5px;
      .border-bottom:before {
        border-color: #E8E8E8;
      }
      .good {
        margin: 10px;
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
		border-bottom: 1upx solid #e8e8e8;
        .good-sub {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .good-img {
            width: 75px;
            height: 75px;
            margin-right: 10px;
          }
          .good-text {
            .good-name {

              line-height: 20px;
            }
            .good-pri {
              color: #D45949;
            }
          }
        }
        .good-num {
          flex: 0 0 auto;
        }
      }
    }
    .sub-text {
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      :first-child {
        flex: 0 0 57px;
      }
      .active {
        color: #d45949;
      }
    }
    .sub-foot {
      margin-top: 10px;
      padding: 7px 10px;
      background: #fff;
	  border-radius: 5px;
      .foot-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        .copy {
          font-size: 12px;
          padding: 0.50px 10px;
          box-sizing: border-box;
          margin-right: 0.50px;
        }
        .border:before {
          border-color: #ccc;
        }
      }
      .foot-pin{
        justify-content: space-between;
        padding: 0.50px 0;
        .pinyin{
          align-items: center;
          .pin{
            width: 18px;
            height: 18px;
            background-size: cover;
            margin-right: 10px;
            @include bg-image('order/pin');
          }
        }
      }
    }
  
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  z-index: 11;
  display: flex;
  align-items: center;
  background: #fff;
  .footer-txt {
    color: #333;
    flex: 1;
    text-align: center;
  }
  .footer-btn {
    flex: 0 0 110px;
    width: 110px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 18px;
    color: #fff;
    &.close {
      background: #ccc;
    }
    &.pay {
      background: #D45949;
    }
  }
}
.customWraper {
  position: fixed;
  bottom: 56px;
  right: 15px;
  width: 60px;
  height: 60px;
  z-index: 15;
  @include bg-image('order/kefu');
  background-size: cover;
}

.paying-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 20;
  ul {
    margin-top: 15px;
    background-color: #fff;
    .btn {
      margin: 10px;
      padding: 0 5px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
    }
    .item {
      margin: 0 10px;
      padding: 0 5px;
      height: 44px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      &:before {
        border: 0;
      }
      .left {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          display: block;
          width: 15px;
          height: 15px;
          &.weixin {
            @include bg-image('pay/weixinlogo');
            background-size: cover;
          }
          &.zfb {
            @include bg-image('pay/zfb');
            background-size: cover;
          }
        }
      }
      .right {
        .icon {
          display: block;
          width: 15px;
          height: 15px;

          border-radius: 100%;
          @include bg-image("pay/select");
          background-size: cover;
          &.active {
            @include bg-image('pay/selected');
          }
        }
      }
    }
  }
}
</style>
