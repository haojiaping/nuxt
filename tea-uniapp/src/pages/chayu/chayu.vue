<template>
<view>

  <!-- tab导航栏 -->
  <!-- <scroll-view scroll-x="true" class="tab-h" scroll-left="{{scrollLeft}}">
    <view class="tab-item {{currentTab == index ? 'tab-active' : ''}}" data-current="{{index}}" @click="switchTab" wx:for="{{ homeTopData}}" vx:key="">{{item.text}}</view>
  </scroll-view> -->

<!-- <tag></tag> -->
</view>
</template>

<script>
import {xhr} from '../../plugins/request/js/core/network';
// import tag from '../chayu/tag';
export default {
data() {
    return {
        homeTopData: [
  {
    id: '2019061911041769116000003',
    name: '',
    path: '/chayu/chashuo',
    text: '热门'
  },
  {
    id: '2019061911003417016000001',
    name: 'chayefuxing',
    path: '/chayu/chashuo/chayefuxing',
    text: '茶叶复兴'
  },
  {
    id: '2019061911043198916000004',
    name: 'chazhishi',
    path: '/chayu/chashuo/chazhishi',
    text: '茶知识'
  },
  {
    id: '2019061915112449414000126',
    name: 'shipin',
    path: '/chayu/chashuo/shipin',
    text: '视频'
  },
  {
    id: '2019061911055891916000007',
    name: 'chongpao',
    path: '/chayu/chashuo/chongpao',
    text: '冲泡'
  },
  {
    id: '2019061911225017918000001',
    name: 'jiankang',
    path: '/chayu/chashuo/jiankang',
    text: '茶与健康'
  },
  {
    id: '2019061911040931516000002',
    name: 'chawenhua',
    path: '/chayu/chashuo/chawenhua',
    text: '茶文化'
  },
  {
    id: '2019061911052133616000006',
    name: 'meiwen',
    path: '/chayu/chashuo/meiwen',
    text: '美文'
  },
  {
    id: '2019081416245052211000093',
    name: 'zishahu',
    path: '/chayu/chashuo/zishahu',
    text: '紫砂壶'
  },
  {
    id: '2019080711585154024000040',
    name: 'kongjian',
    path: '/chayu/chashuo/kongjian',
    text: '茶空间'
  },
  {
    id: '2019061915132564614000127',
    name: 'lvcha',
    path: '/chayu/chashuo/lvcha',
    text: '绿茶'
  },
  {
    id: '2019061915135348414000128',
    name: 'hongcha',
    path: '/chayu/chashuo/hongcha',
    text: '红茶'
  },
  {
    id: '2019061915141728014000129',
    name: 'puer',
    path: '/chayu/chashuo/puer',
    text: '普洱'
  },
  {
    id: '2019061915142820014000130',
    name: 'baicha',
    path: '/chayu/chashuo/baicha',
    text: '白茶'
  },
  {
    id: '2019061915144717914000131',
    name: 'wulongcha',
    path: '/chayu/chashuo/wulongcha',
    text: '乌龙茶'
  },
  {
    id: '2019062409570022114000060',
    name: 'huacaocha',
    path: '/chayu/chashuo/huacaocha',
    text: '花草茶'
  },
  {
    id: '2019061915173140914000133',
    name: 'heicha',
    path: '/chayu/chashuo/heicha',
    text: '黑茶'
  }
],
  winHeight: "", // 窗口高度
    currentTab: 0, // 预设当前项的值
    scrollLeft: 0, // tab标题的滚动条位置
    tabName:[], // tab标题的名字
    choosedTabInformation: "" // 当前选中tab标题的信息

    }
},
  components: {
    // tag
  },
 onLoad: function(options) {
    // this.getWindowHeight(); // 高度自适应（rpx）
    // this.getTabName(); // 获取头部导航栏tab标题的名字
    // this.getInformation(tabNum); //  获取当前选中tab标题的信息
    network()
  },
  created(){
    network()
  },
 mounted(){
    network()
 },
methods:{
 switchTab(event) {
   console.log(event)
    // let current = e.detail.current;
      let current = event.target.dataset.current;
      this.currentTab =current
    
    console.log("当前选中tab标题", current);
    // this.getInformation(current); //  获取当前选中tab标题的信息
  },
  //  getTabName () {
  //   console.log("获取头部导航栏tab标题的名字");
  //   // 假数据
      
  //       this.tabName= this.homeTopData
  //  },

  // 点击tab标题，切换当前页
  // swichNav: function(e) {
  //   console.log("点击tab标题", e.target.dataset.current);
  //   let cur = e.target.dataset.current;
  //   if (this.currentTab == cur) {
  //     return false;
  //   } else {
      
  //       this.currentTab=cur
      
  //   }
  //   console.log("当前选中tab标题", cur);
  //   // this.getInformation(cur); //  获取当前选中tab标题的信息
  // },
  
  network(){
    concole.log('111')
    wx.request({
      method:'POST',
  url: 'https://tea.chazhenxuan.com/v1/info/label',
  
  data: {
   
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success (res) {
    console.log(res.data)
  }
})
  }

}
}
</script>

<style lang="scss" scoped>
.tab-h {
  height: 80rpx;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* 超出部分隐藏 */
  line-height: 80rpx;
  background: #fff;
  border-bottom: 1rpx solid #cecece;
  font-size: 28rpx;
  white-space: nowrap; /* 设置滚动视图容器不换行 *//* 固定在头部 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
}

/* 每个tab标题样式 */
.tab-item {
  padding: 0 36rpx;
  display: inline-block;
}

/* 选中其中一个tab标题时，修改样式 */

.tab-item.tab-active {
   background: #FFDCD8;
        color: #D45949;
  /* box-sizing: border-box; */
  border-color: #D45949;
          border-radius: 25px;
  /* position: relative; */
}

/* 主体内容 预留头部导航栏的高度 */

.tab-content {
  margin-top: 80rpx;
}

/* 主体内容 scroll-view高度 */

.scoll-h {
  height: 100%;
}
</style>