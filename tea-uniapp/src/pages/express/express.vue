<template>
	<view>
		<div>
			<div class="express">
				<div class="express-wrap" ref="detailex">
					<div class="express-header">
						<div class="goodimg" v-if="datas.productList&&datas.productList[0]">
							<image style="width: 70px; height: 70px; background-color: #eeeeee;" :mode="aspectFill" :src="datas.productList[0].productImage"
							 @error="imageError"></image>
							<span class="goosNum">共{{datas.productList.length}}件商品</span>
						</div>
						<div class="expressInfo f12">
							<div class="name" v-if="datas.postageName&&datas.postageName!=='-'">
								<span>配送企业:</span>
								<span>{{datas.postageName}}</span>
							</div>
							<div class="orderNum">
								<span >快递单号:</span>
								<span >{{datas.postageId?datas.postageId:'暂无'}}</span>
							</div>
							<div class="orderNum" v-if="postageId&&expressPhone&&postageId!=='-'">
								<div>
									<span>联系电话:</span>
									<a :href="`tel:${expressPhone}`" style="color:#fff;">
										<span>{{expressPhone}}</span>
									</a>
								</div>
							</div>
							<div class="name" v-else>
								{{datas.state}}
							</div>
						</div>
					</div>
					<div class="text f12">物流信息</div>
					<div class="express-sub f12"  v-if="datas.postageContent">
						<div class="listWrap">
							<div class="tipsTop">
								<span class="ballTop"></span>
								<span>{{datas.state}}</span>
							</div>
							<div class="list-sub" :class="index===0?'one':''" v-for="(item,index) in datas.postageContent" :key="index">
								<div class="tips" v-if="index!==0">
									<span class="ball"></span>
								</div>
								<div class="list-text">
									<div class="conttext" v-if="item.AcceptStation">
										{{item.AcceptStation}}
									</div>
									<div class="time" v-if="item.AcceptTime">
										{{item.AcceptTime}}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="express-none" v-if="!datas.postageContent">
						<!-- <noData></noData> -->
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	// import { getOrderPro } from '@/api/order'
	import {
		getpostdetail,
		getOrderPro,
		getOrderdetail
	} from "../../api/order.js"
	//import { IOS, ANDROID } from '~/environment/esm'
	import {
		EXPRESS
	} from '@/utils/express'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'express',
		data() {
			return {
				// logisticsInfo: {},
				products: {},
				// expressPhone: '',
				product: {},
				postageId: '',
				datas: {},
				postFlag: '',
				detailData: {},
				downBtn: false
				// showType: false // false 详情  true 中间页
				// company: ''// 配送企业
			}
		},
		onLoad(option) {
			console.log(option)
			this.productOrderId = option.productOrderId
			this.postageId = option.postageId
			this.getExpress(option.postageId)
			
			if (this.detailData.postFlag === 0) {
				this.postFlag = 0
				this.getExpress(this.detailData.products[0].postageId)
			} else {
				this.postFlag = 1
				//  this.getDetail()
			}
		},
		computed: {
			expressPhone() {
				for (let i = 0; i < EXPRESS.length; i++) {
					if (EXPRESS[i].expressname === this.datas.postageName) {
						return EXPRESS[i].expresstelephone
					}
				}
				return ''
			},
			showType: {
				get() {
					return this.detailData.postFlag
				}
			},
			...mapGetters([
				'user'
			])
		},
		watch: {
			showType(val) {
				if (this.detailData.postFlag === 0) {
					this.getExpress(this.detailData.products[0].postageId)
				}
				this.postFlag = val
			}
		},
		methods: {
			orderDetaildata() {
				const option = {
					productOrderId: this.productOrderId,
					userId: this.user.userId
				}
				getOrderdetail(option).then(res => {
					if (res.code === 10000) {
						this.detailData = res.data
					}
				})
			},
			// 物流页请求
			orderDetail(userId, postageId) {
				const option = {
					productOrderId: this.productOrderId,
					userId: userId,
					postageId: postageId
				}
				getpostdetail(option).then(res => {
					if (res.code === 10000) {
						this.datas = res.data
						try {
							if (res.data.postageContent && res.data.postageContent !== '-') {
								this.datas.postageContent = JSON.parse(res.data.postageContent)
							}
						} catch (error) {
							console.log(error)
						}
					}
				})
			},
			getExpress(postageId) {
				this.orderDetail(this.user.userId, postageId)
				// }
			},
			// 中间页请求
			getDetail() {
				getOrderPro({
					productOrderId: this.productOrderId
				}).then(res => {
					if (res.code === 10000) {
						this.postageNumContent = res.data.postageNumContent
						this.postageInfo = [...res.data.postageInfo]
					} else {
						this.$toast(res.message)
					}
				})
			},
			jumpToEx(item) {
				this.postFlag = 0
				// console.log(this.postFlag)
				this.getExpress(item.postageId)
				// if (item.postageId !== '-') {
				// this.$router.push({name: 'Express', query: {productOrderId: this.productOrderId, postageId: item.postageId}})
				// }
			}
		},
		filters: {
			setstate(e) { // 快递状态 0-无轨迹 1-已揽收 2-在途中 3-签收'
				switch (e) {
					case 0:
						return '暂无物流信息'
					case 1:
						return '已揽收'
					case 2:
						return '在途中'
					case 3:
						return '已签收'
					default:
						return '运输中'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.express /deep/ .header-icon {
		z-index: 20;
	}

	.express {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 20;
		user-select: text;

		.downBtnWrap {
			width: 90px;
			height: 46px;
			@include bg-image('common/downbtn');
			right: 0;
			top: 30%;
			transform: translateY(-50%);
			z-index: 999;
		}

		.express-wrap {
			position: fixed;
			left: 0;
			right: 0;
			top: 0px;
			bottom: 0;
			overflow: hidden;
			z-index: 12;
			background-color: #f2f2f2;

			.express-header {
				background: #d45949;
				padding: 15px 20px;
				display: flex;
				height: 90px;
				align-items: center;
				color: #fff;

				.goodimg {
					width: 65px;
					height: 65px;
					margin: 0 25px 0 15px;
					position: relative;

					.goosNum {
						font-size: 12px;
						background: #000;
						color: #fff;
						position: absolute;
						bottom: -1px;
						left: 0;
						right: 0;
						text-align: center;
						line-height: 15px;
					}
				}

				.expressInfo {
					height: 60px;

					.name {
						font-size: 14px;
						margin: 5px 0 12px 0;
					}

					.orderNum {
						font-size: 12px;

						div {
							line-height: 15px;
						}
					}
				
				}
			}

			.text {
				margin: 15px;
			}

			.express-none {
				height: 250px;
				position: absolute;
				top: 125px;
				left: 0;
				right: 0;
				margin: 100px 10px;
			}

			.express-sub {
				margin: 0 10px;
				overflow-y: scroll;

				position: absolute;
				top: 160px;
				left: 0;
				right: 0;
				bottom: 0;

				.listWrap {
					background: #fff;
					padding: 30px;

					.list-sub {
						margin: 30px 0;
						border-left: 1px solid #ccc;
						padding: 0 10px 0 10px;
						box-sizing: border-box;
						position: relative;

						color: #999;

						&.one {
							color: #333;

							.list-text {
								top: -2px;
								left: 24px;
							}
						}

						.tips {
							font-size: 12px;
							position: absolute;
							top: -15px;
							left: -5px;
							border-radius: 25px;
							padding: 2px;
							box-sizing: border-box;
							display: flex;
							align-items: center;
							justify-content: space-between;
							background: #e8e8e8;
							color: #999999;

							.ball {
								width: 5px;
								height: 5px;
								border-radius: 25px;
								background: #cccccc;
							}
						}

						.list-text {
							.conttext {
								line-height: 20px;
							}

							.time {
								margin-top: 5px;
							}
						}
					}
				}

				.tipsTop {
					background: #ffe4e0;
					color: #d45949;
					position: absolute;
					top: 21px;
					left: 22px;
					padding: 3px 7px 3px 3px;
					box-sizing: border-box;
					border-radius: 9px;
					font-size: 12px;

					.ballTop {
						display: inline-block;
						width: 12px;
						height: 12px;
						border-radius: 25px;
						background: #d45949;
					}
				}
			}
		}
	}
</style>
