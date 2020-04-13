<template>
<div>
	<div  class="box" :style="{'margin-top':topp,'width':height,'height':jiaonang}">
		<view  class="mp-search-box" :style="{'width':height ,'height':jiaonang}" @click="btnClick1">
				<view class="ser-input" @click="jumpToPage('/pages/search/search')">
				 <van-icon name="search" color="#999" size="15" custom-style="position: relative;top:2px;margin-left:10px;"/>
					<text class="ser-text">老茶头</text>
				</view>
			</view>
	</div>
	<div class="content-warp"  :style="{'margin-top':'10px'}">
		<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.categoryId" class="f-item b-b" :class="{active: item.categoryId === currentId}" @click="tabtap(item)">
				{{item.categoryName}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<div class="rightimg" @click="imgclick(jumpType,jumpContent)">
				<img :src="img" alt="" class="image">
			</div>
			<view v-for="item in flist" :key="item.categoryId" :id="'main-'+item.categoryId" >
				<text class="f15 c3 fw500">{{item.categoryName}}</text>
				<view class="s-list-wrap van-hairline--bottom">
					<view v-for="(elem,index) in item.categoryList" :key="index" class="s-list" @click="navToList(item,elem)">
						<img :src="elem.categoryLogo" style="width:45px;height:45px;">
						<text class="s-item f14">{{elem.categoryName}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
	</div>
</div>
</template>

<script>
import {list} from '../../api/index.js'
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: '000',
				flist: [],
				slist: [],
				tlist: [],
				hjp:null,
				top:null,
				topp:null,
				height:'260px',
				width:'32px',
				jiaonang:null,
				img:null,
				jumpContent:null,
				jumpType:null
			}
		},
		onLoad(){
			this.loadData();
			this.btnClick1();
		},
		methods: {
			async loadData(){
        let lists = await list()
				console.log(lists);
				this.flist = lists.data
				this.img=lists.image
				console.log(this.img)
				this.jumpType=lists.jumpType
				this.jumpContent=lists.jumpContent
				this.flist.forEach((item,index)=>{
					item.categoryId = `00${index}`
				})
				this.$nextTick(()=>{
					this.calcSize();
				})
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				
				this.currentId = item.categoryId;
				let index = this.flist.findIndex(sitem=>sitem.categoryId === item.categoryId);
				this.tabScrollTop = this.flist[index].top;
			},
				jumpToPage(path){
				uni.navigateTo({
						url: `${path}`
					});
					 

			},
					 btnClick1(options){

    this.hjp = wx.getMenuButtonBoundingClientRect()
    console.log('菜单按键宽度：',this.hjp.width)
    console.log('菜单按键高度：',this.hjp.height)
    console.log('菜单按键上边界坐标：',this.hjp.top)
    console.log('菜单按键右边界坐标：',this.hjp.right)
    console.log('菜单按键下边界坐标：',this.hjp.bottom)
    console.log('菜单按键左边界坐标：',this.hjp.left)
   this.top = this.hjp.bottom + 'px'
   this.topp= this.hjp.top + 'px'
   this.jiaonang = this.hjp.height + 'px'
  },
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
        let tabs = this.flist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].categoryId;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.flist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.categoryId);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(fitem,item){
				//000跳转品牌列表 fitem.categoryId
				let option = {
					categoryName: item.categoryName,
					categoryId:fitem.categoryId,
					categoryLogo:item.categoryLogo,
					nodeCategoryId:item.nodeCategoryId
				}
				uni.navigateTo({
					url: `/pages/type/list?categoryData=${JSON.stringify(option)}`
				})
			},

imgclick(jumpType,jumpContent){
	console.log('111')
	console.log(jumpType,jumpContent)
	
		let url = ''
		  const orginUrl = JSON.parse(jumpContent).url
        const arrUrl = orginUrl.split('//')
        const start = arrUrl[1].indexOf('/')
		url = arrUrl[1].substring(start)
	
	

 console.log(url)
//  uni.redirectTo({
// 					url:  url
// 				})
}

		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #fff;
		// position: relative;
		// top:-45px
	}
	.image{
		width: 100%;
		height: 100%;
	}
	.rightimg{
		 width:255px;
        height:90px;
        margin: 15px;
	}
.box{
border:1rpx solid #ccc;
border-radius: 16px;
margin-left:10px;
box-sizing: border-box;
border-radius: 16px;
border: 1px solid #ccc;
}
	.mp-search-box{
		flex: 1;
		// padding: 0 20upx;
		// margin-top: -3upx;
		// height: 64upx;
		border-radius: 16px;
	
			
		.ser-input{
			flex:1;
			height: 32px;
			line-height: 32px;
			font-size: 28upx;
		// margin:104upx 0 164upx 0;
			color:$uni-text-color;
			border-radius: 16px;
			// background: rgba(255,255,255,1);
			.ser-text{
				margin-left: 10upx;
				color: #bbb
				
			}
		}
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #f2f2f2;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 60px;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: #D45949;
			background: #fff;
			&:before{
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				height: 1upx;
				width: 100%;
				background-color: #D45949;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding: 20upx;
		background: #fff;
		.s-list-wrap{
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 20upx;
			.s-list{
				width: 33.33%;
				display: flex;
				margin: 20upx 0;
				flex-direction: column;
				align-items: center;
				.s-item{
					@include text-over(1)

				}
			}
		}
	}
</style>
