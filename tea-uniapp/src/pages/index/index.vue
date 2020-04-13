<template>
	<view class="content" >
		<nav-bar :back="false" type="transparent">
			<view slot="left" class="mp-search-box" style="width: 100%;height:32px;" @click="btnClick1">
				<view class="ser-input" @click="jumpToPage('/pages/search/search')">
				 <van-icon name="search" color="#999" size="15" custom-style="position: relative;top:2px;margin-left:10px;"/>
					<text class="ser-text">老茶头</text>
				</view>
			</view>
		</nav-bar>
		<view class="topbg pf" :style="{height: haojp}" ></view>
		<view class="sub-wrap">
			<view class="tabs-wrap" :style="{paddingTop: (statusBarHeight + 40) + 'px'}">
				<van-tabs :active="active"
					:border="false"
					:z-index="10"
					line-height="0"
					line-width="0"
					@change="changeTab">
					<van-tab :title="item.categoryName" v-for="item in homeTopData" :key="item.categoryId"></van-tab>
				</van-tabs>
			</view>
			<view  :style="{marginTop: (statusBarHeight + 80) + 'px'}">
				<view class="uni-padding-wrap" v-if="active===0">
					<view class="page-section swiper">
							<view class="page-section-spacing">
									<swiper class="swiper hao" :indicator-dots="bannerOption.indicatorDots" :autoplay="bannerOption.autoplay" :interval="bannerOption.interval">
											<swiper-item v-for="img in bannerList" :key="img.bannerId">
													<image :src="img.imageUrl" style="width: 100%; height: 100%;border-radius:3px;"></image>
											</swiper-item>
									</swiper>
							</view>
					</view>
					<view class="opera-wrap">
						<view class="uni-swiper-msg">
							<view class="uni-swiper-msg-icon">
								<image src="/static/home/notice@2x.png" mode="widthFix"></image>
							</view>
							<swiper vertical="true" autoplay="true" circular="true" interval="5000">
								<swiper-item v-for="(horse, index) in horseData" :key="index">
									<navigator>{{horse.content}}</navigator>
								</swiper-item>
							</swiper>
						</view>
						<view class="opera df">
							<view class="operaitem df" v-for="menu in menuData" :key="menu.categoryId" @click="jumpToH5(menu)">
								<image :src="menu.categoryLogo" style="width:42px;height:42px;"></image>
								<text>{{menu.categoryName}}</text>
							</view>
						</view>
					</view>
				</view>
				<div class="operaWrap df">
            <div class="operaItem one df border-rightbottom" v-if="operaData&&operaData[0]"  @click="qianggou1(operaData[0].jumpType,operaData[0].jumpContent)">
              <div class="title df f15">
                <span>{{operaData[0].labelName}}</span>
                <!-- <van-count-down :time="(operaData[0].endTime - new Date().getTime())" class="countDownWrap cf f10">
                  <template v-slot="timeData">
                  <van-tag round color="#EA6F5F">
                    <span class="item f10">{{ timeData.this.h | formatTime }}</span>
                    <span class="item f10">:</span>
                    <span class="item f10">{{ timeData.this.m | formatTime }}</span>
                    <span class="item f10">:</span>
                    <span class="item f10">{{ timeData.this.s | formatTime }}</span>
                    </van-tag>
                  </template>
                </van-count-down> -->
				<!-- <van-count-down :time="(operaData[0].endTime - new Date().getTime())" class="countDownWrap cf f10">
 <van-tag round color="#EA6F5F" >
                    <span class="item f10">{{h}}</span>
                    <span class="item f10">:</span>
                    <span class="item f10">{{m}}</span>
                    <span class="item f10">:</span>
                    <span class="item f10">{{s}}</span>
                    </van-tag>
				</van-count-down> -->
			
	<!-- <div><span>{{countdown}}</span></div> -->

              </div>
              <div class="operaGoods df">
                <div class="operaGood df" v-for="pro in operaData[0].productList" :key="`gou_${pro.productId}`">
                  <img :src="pro.productImage" :alt="pro.productName" width="100%">
                  <p class="price tac">
                    <span class="f14 ctea">¥ {{pro.discountPrice}}</span>
                    <!-- <span class="f11 c9" style="text-decoration:line-through;">¥ {{pro.virtualPrice}}</span> -->
                  </p>
                </div>
              </div>
            </div>

            <div class="operaItem one df border-bottom" v-if="operaData&&operaData[1]" @click="tejia(operaData[1].jumpType,operaData[1].jumpContent)">
              <div class="title df f15">
                <span>{{operaData[1].labelName}}</span>
                <span></span>
              </div>
              <div class="operaGoods df">
                <div class="operaGood df" v-for="(pro, index) in operaData[1].productList" :key="`tian_${index}`">
                  <img :src="pro.productImage" :alt="pro.productName" width="100%">
                  <p class="price tac">
                    <span class="f14 ctea">¥ {{pro.productPrice}}</span>
                    <span class="f11"></span>
                  </p>
                </div>
              </div>
            </div>

            <div class="operaItem two border-right" v-if="operaData&&operaData[2]" @click="dapai(operaData[1].jumpType,operaData[1].jumpContent)">
              <p class="titletext c3 f15">{{operaData[2].labelName}}</p>
              <p class="titletips c9 f12">{{operaData[2].operationTitle}}</p>
              <div class="operaImg df ">
                <img :src="proItem.productImage" :alt="proItem.productName" v-for="(proItem, index ) in operaData[2].productList" :key="`proItem_${index}`" v-if="index<2">
              </div>
            </div>

            <div class="operaItem two" v-if="operaData&&operaData[3]" @click="chaju(operaData[1].jumpType,operaData[1].jumpContent)">
              <p class="titletext c3 f15">{{operaData[3].labelName}}</p>
              <p class="titletips c9 f12">{{operaData[3].operationTitle}}</p>
              <div class="operaImg df ">
                <img :src="proItem.productImage" :alt="proItem.productName" v-for="(proItem, index ) in operaData[3].productList" :key="`proCha_${index}`" v-if="index<2">
              </div>
            </div>

          </div>
				<div class="navWraper" v-if="active!==0">
          <div class="nav" :style="{paddingTop: (statusBarHeight + 80) + 'px'}">
            <div class="nav-item df" @click="handChange(0)" :class="navActive===0?'active':''">
              <p>综合</p>
            </div>
            <div class="nav-item df" @click="handChange(1)" :class="(navActive===1||navActive===4)?'active':''">
              <p>销量</p>
              <i class="icon" :class="navActive===1?'down':'up'"></i>
            </div>
            <div class="nav-item df" @click="handChange(3)" :class="(navActive===3||navActive===6)?'active':''">
              <p>价格</p>
              <i class="icon" :class="navActive===3?'down':'up'"></i>
            </div>
          </div>
        </div>
				<view class="prolist-wrpa">
					<productList :dataList="likeData" width="48.75%" bgcolor="#f2f2f2"></productList>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from "@/components/navBar";
import productList from "@/components/productList";
import { getProductList } from '@/api/product'
import {getIndexBanner,homeTop,homeContent,getLike} from '../../api/index.js'
import { jumpUrl } from "@/utils/jump";
	export default {
		data() {
			return {
				title: 'Hello',
				homeTopData:[
					{
						categoryName:'推荐',
						categoryId:'001'
					}
				],
				active:0,
				categoryId:'',
				statusBarHeight:0,
				navActive:0,
				hjp:null,
				haojp:"192px",
				bannerList:[],
				horseData:[],
				menuData:[],
				likeData:[],
				operaData:[],
				qianggou:null,
				  time: 30 * 60 * 60 * 1000,
    timeData: {},
				h:'',
				m:'',
				s:'',
				 countdown: ''
    , endDate2: 1582560000000,
				bannerOption:{
					indicatorDots:true,
					autoplay:true,
					interval:3000
				},
				pageNum:0,
				endFlag:1
			}
		},
		onLoad() {
			console.log(this.active);
			this.homeInit();
			this.setInit();
			 this.btnClick1();
				this.mytime1()
	
				
		},
	// 	updated(){
	// 		 setInterval(function(){
	// this.mytime1()
	//  },1000)
	// 	},
		methods: {
			jumpUrl,
			
			homeInit(){
				homeTop().then(res=>{
					this.homeTopData = [...this.homeTopData,...res.data]
				})
				getIndexBanner().then(res=>{
					this.bannerList = res.data
				})
				homeContent().then(res=>{
					this.horseData = res.data.horseRaceLampList
					this.menuData = res.data.activityClassify
					this.operaData=res.data.labelList
					this.endDate2=res.data.labelList[0].endTime - new Date().getTime()
					// this.qianggou=res.data.labelList[0].jumpType,operaData[0].jumpContent
	// 								if(this.endDate2>0){
	// // 						console.log('111')
	// 					  this.h = Math.floor(this.endDate2 / 1000 / 60 / 60 % 24);
    //   this.m = Math.floor(this.endDate2 / 1000 / 60 % 60);
	//   this.s = Math.floor(this.endDate2 / 1000 % 60);
	 
	//   this.countdown=this.h + "：" + this.m + "：" + this.s 
	
	
		
	// 			}
				})
				getLike({ productReco: 0 }).then(res=>{
					this.likeData = res.data.productList
				})
			},
		mytime1(){
			this.endDate2=this.endDate2-new Date().getTime()
									if(this.endDate2>0){
							
						  this.h = Math.floor(this.endDate2 / 1000 / 60 / 60 % 24);
      this.m = Math.floor(this.endDate2 / 1000 / 60 % 60);
	  this.s = Math.floor(this.endDate2 / 1000 % 60);
	    this.h >= 0 && this.h <= 9 ? this.h = "0" + this.h : 0;
    this.m >= 0 && this.m <= 9 ? this.m = "0" + this.m : 0;
    this.s >= 0 && this.s <= 9 ? this.s = "0" + this.s : 0;
	  this.countdown=this.h + "：" + this.m + "：" + this.s 
	

	 
	
					}
		},
		onChange(e){
			 this.timeData= e.detail
	
		},
		qianggou1(a,b){
				 uni.navigateTo({
					url:jumpUrl(a,b)+''
				})
			console.log('qianggou')
		},
			tejia(a,b){
				console.log(jumpUrl(a,b)+'')
		
				 uni.navigateTo({
					url:jumpUrl(a,b)+''
				})
		},
			dapai(a,b){
				 uni.navigateTo({
					url:jumpUrl(a,b)+''
				})
		},
			chaju(a,b){
				 uni.navigateTo({
					url:jumpUrl(a,b)
				})
		},

			 onPageScroll(e){
				//  console.log(e)
				const query = wx.createSelectorQuery()
			const aa=	query.select("topbg pf") 
//    console.log(aa)
				 if(e.scrollTop>80){
					//  console.log('111')
				  aa._selectorQuery._defaultComponent.$vm.haojp='100px'
				//   console.log(aa)
				 }else{
					  aa._selectorQuery._defaultComponent.$vm.haojp='192px'
				 }
			},
			changeTab(event,categoryId){
				console.log(event);
				this.active = event.detail.name
				this.categoryId = this.homeTopData[this.active].categoryId
				console.log(this.active);
				this.getListData()
			},
			// wx.getMenuButtonBoundingClientRect(),
			jumpToPage(path){
				uni.navigateTo({
						url: `${path}`
					});
					 

			},
			 btnClick1(options){

    this.hjp = wx.getMenuButtonBoundingClientRect()


  },
			jumpToH5(item){
				console.log(item);
				let url = this.jumpUrl(item.jumpType, item.jumpContent)
				console.log(url);
				let path = url.split('?')[0]
				console.log(path);
				switch (path) {
					//买2得3
					case '/opera/special':
						uni.navigateTo({
							url: `/pages${url}`
						});
						break;

					case '/opera/bangdan':
						uni.navigateTo({
							url: `/pages/opera/special?type=18&name=热销榜`
						});
						break;

					case '/opera/oldtea':
						uni.navigateTo({
							url: `/pages/opera/special?type=1&name=老茶馆`
						});
						break;
						//试饮指南
					case '/introduce/drinkinfo':
						uni.navigateTo({
							url: `/pages/activity/activity?url=https:m.chazhenxuan.com/introduce/drinkinfo`
						});
						break;

					//天天领钱
					case '/opera/vouchers':
						uni.navigateTo({
							url: `/pages${path}`
						});
						break;

					case '/opera/newtea':
						uni.navigateTo({
							url: `/pages/opera/special?type=46&name=每日上新`
						});
						break;

					case '/opera/teapot':
						uni.navigateTo({
							url: `/pages/opera/special?type=34&name=紫砂壶`
						});
						break;

						//礼盒套装
					case '/type/2019072217272313323000332':
						let option = {
							categoryName: '茶礼',
							categoryId:'2019072217272313323000332',
							categoryLogo:'',
							nodeCategoryId:'2019072217272313323000332'
						}
						uni.navigateTo({
							url: `/pages/type/list?categoryData=${JSON.stringify(option)}`
						})
						break;

						//茶器茶具
					case '/opera/teamaker':
						let optionArg = {
							categoryName: '茶器茶具',
							categoryId:'2019061810293981123000005',
							categoryLogo:'',
							nodeCategoryId:'2019061810293981123000005'
						}
						uni.navigateTo({
							url: `/pages/type/list?categoryData=${JSON.stringify(optionArg)}`
						})
						break;

					case '/activity/large':
						uni.navigateTo({
							url: `/pages/opera/special?type=47&name=超值整件`
						});
						break;

					default:
						break;
				}
			},
			getListData(){
				if (this.active===0) {
					getLike({ productReco: 0 }).then(res=>{
						this.likeData = []
						this.likeData = res.data.productList
				})
					return
				}
				getProductList({
            categoryId: this.categoryId,
            pageNum: this.pageNum,
            orderSortType: this.navActive
          }).then(res => {
						console.log(res);
          const arr = res.data.productList
          this.endFlag = res.data.endFlag
					if (this.pageNum === 0) this.likeData = []
					console.log(this.likeData);
					this.likeData = [...this.likeData, ...arr]
					console.log('end',this.likeData);
          
        }).catch(() => {
        })
			},
			
			handChange(val) {
				switch (val) {
					case 0:
						this.navActive = val
						break
					case 1:
						this.navActive === 1 ? this.navActive = 4 : this.navActive = 1
						break
					case 2:
						this.navActive === 2 ? this.navActive = 5 : this.navActive = 2
						break
					case 3:
						this.navActive === 3 ? this.navActive = 6 : this.navActive = 3
						break
				}
				this.getListData()
			},
			setInit(){
				//获取手机状态栏高度
				this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
			}
		},
		components: {navBar,productList}
	}
</script>

<style lang="scss" scoped>
.item {
  display: inline-block;
  width: 22px;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #1989fa;
  border-radius: 2px;
}
.hao{
	position: relative;
	z-index: 9;
}
.content{
	background: #f2f2f2;
	/deep/ .left_box{
			width: 100%;
		}
	/deep/ .mp-search-box{
		flex: 1;
		padding: 0 20upx;
		// margin-top: -3upx;
		// height: 64upx;
		
	
			
		.ser-input{
			flex:1;
			height: 32px;
			line-height: 32px;
			font-size: 28upx;
		// margin:104upx 0 164upx 0;
			color:$uni-text-color;
			border-radius: 20px;
			background: rgba(255,255,255,1);
			.ser-text{
				margin-left: 10upx;
				color: #bbb
				
			}
		}
	}
	
	.topbg{
		width: 100%;
		@include bg-image('home/topbg');
		top: 0;
		left: 0;
		z-index: 9;
	}
	.sub-wrap{
		.tabs-wrap{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 12;
			height: 44px;
			right: 0;
		}
		/deep/ .van-tabs__wrap{
			// position: fixed;
			background: transparent;
		}
		/deep/ .van-tabs__nav{
			background: transparent;
		}
		/deep/ .van-tab{
			background: transparent;
			color: #fff;
			font-size: 30upx;
		}
		/deep/ .van-tab--active{
			font-weight: 600;
			position: relative;
			font-size: 36upx;
		}
		/deep/ .van-tab--active:after{
			position: absolute;
			right: 20upx;
			top: 20upx;
			width:6upx;
			height:6upx;
			border:5upx solid rgba(245,109,104,1);
			// background:linear-gradient(90deg,rgba(245,109,104,1) 0%,rgba(240,125,110,1) 100%);
			border-radius:12upx;
			display: block;
			content:' ';
			// width: upx;
			// height: 4upx;
			// position: absolute;
			// top: 0;
			// right: 0upx;
			// background: #D45949;
		}
		.uni-padding-wrap{
			margin: 100px 20upx 20upx;
			.opera-wrap{
				border-radius: 10upx;
				background: #fff;
				
				.uni-swiper-msg{padding:0 40rpx; border-bottom: 1px solid #e8e8e8; font-size: 28upx; flex-wrap:nowrap; display:flex;align-items: center;background: #fff;margin-top: 20upx;}
				.uni-swiper-msg-icon{width:130upx; margin-right:20upx;}
				.uni-swiper-msg-icon image{width:100%; flex-shrink:0;}
				.uni-swiper-msg swiper{width:100%; height:50upx;}
				.uni-swiper-msg swiper-item{line-height:50upx;}
				.opera{
					flex-wrap: wrap;
					padding: 20upx;
					.operaitem{
						width: 20%;
						font-size: 24upx;
						flex-direction: column;
						align-items: center;
						margin: 20upx 0;
					}
				}
			}
		}

			.navWraper {
				box-sizing: border-box;
				padding: 0 10px;
				background: #fff;
				margin: 0 10px;
				height: 44px;
				.nav {
					display: flex;
					background: #fff;
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					height: 44px;
					z-index: 5;
					.nav-item {
						position: relative;
						width: 33.33%;
						text-align: center;
						margin: 0 6px;
						padding: 5px 10px;
						font-size: 15px;
						font-weight: 400;
						justify-content: center;
						align-items: center;
						&.active {
							font-weight: 600;
							font-size: 18px;
						}
						.icon {
							width: 6px;
							height: 14px;
							@include bg-image('home/default');
							background-size: cover;
							margin-left: 10px;
							&.down {
								@include bg-image('home/down');
							}
							&.up {
								@include bg-image('home/up');
							}
						}
					}
				}
			}
		.prolist-wrpa{
			margin: 20upx;
			background: #f2f2f2;
			border-radius: 10upx;
		}
	}
	
}

      .operaWrap{
        flex-wrap: wrap;
        margin: 10px 10px;
        .operaItem{
          height: 132px;
          width: 50%;
          flex-direction: column;
          background: #fff;
          .title{
            align-items: center;
            padding:5px 0 0 15px;
            line-height: 40px;
            .countDownWrap{
              margin-left: 10px;
              padding: 4px 8px;
            }
          }

          .titletext{
            margin-top:10px;
            padding:5px 0 0 15px;

          }
          .titletips{
            padding:5px 0 0 15px;

          }
          .operaImg{
            padding: 0 15px;
            margin-top:10px;
            justify-content: space-between;
            img{
              width: 60px;
              height: 60px;
            }
          }

          .operaGoods{
            flex-wrap: wrap;
            height: 124px;
            overflow: hidden;
            .operaGood{
              width: 50%;
              flex-direction: column;
              align-items: center;
              margin-bottom: 5px;
              img{
                width: 60px;
                height: 60px;
              }
              .price{
                width: 100%;
                line-height: 30px;
                padding: 0 5px;
              }
            }
          }
        }
      }
</style>
