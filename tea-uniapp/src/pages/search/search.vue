<template>
   <section class="searchWrap">
     <nav-bar :back="false" title="搜索">
       <view  slot="left" class="leftbar" @click="backbarLeft">
         <van-icon name="arrow-left" />
       </view>
      </nav-bar>
     <view class="searchtop df pf f15" :style="{paddingTop: (statusBarHeight+45) + 'px'}">
       <span></span>
       <div class="searchCenter df">
         <div class="searchField df">
          <van-icon name="search" color="#999" custom-style="top:1px"/>
          <van-field :value="productName" :placeholder="autoSearch" :border="false" @change="onChange"/>
         </div>
       </div>
       <span class="right c3" @click="getList">搜索</span>
      </view>
      <div class="searchSelWrap" v-show="!listShow" :style="{paddingTop: '44px'}">

        <div class="history">
          <p class="histitle df ">
            <span class="f15">热门搜索</span>
          </p>
          <div class="hisWrap df">
            <div class="hisitem f15" v-for="(item , index) in hotSearchData" :key="index"
            @click="hotsearchList(item.keyWord)">{{item.keyWord}}</div>
          </div>
        </div>
      </div>
      <div class="listWrap" v-show="listShow" :style="{paddingTop:'44px'}">
        <div class="subWrap">
          <productList :dataList="dataList" width="48.75%" bgcolor="#f2f2f2"></productList>
        </div>
      </div>
   </section>
</template>

<script>
import navBar from "@/components/navBar";
import { hotSearch, searchList } from '@/api/index'
import productList from '@/components/productList'
export default {
  data() {
    return {
      productName: '',
      autoSearch: '',
      hotSearchData: [],
      listShow: false,
      pageNum:0,
      endFlag:1,
      dataList: [],
      statusBarHeight:0
    }
  },
  onLoad() {
    this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
    this.searchInit()
  },
  onReachBottom(){
    if (this.endFlag===0) {
      this.getsearchList()
    }
  },
  methods: {
    searchInit() {
      hotSearch().then(res => {
        this.hotSearchData = res.data
        this.autoSearch = res.data[0].keyWord
      })
    },
     onChange(event) {
        // event.detail 为当前输入的值
        this.productName = event.detail
      },
    getList() {
      this.listShow = true
      this.getsearchList()
    },
    hotsearchList(name) {
      this.listShow = true
      this.productName = name
      this.getsearchList()
    },
    getsearchList() {
      if (!this.productName) this.productName = this.autoSearch
      const option = {
        productName: this.productName,
        pageNum: this.pageNum,
        orderSortType: 0
      }
      searchList(option).then(res => {
        if (this.pagNum === 0) this.dataList = []
        const arr = res.data.productList
        this.dataList = [...this.dataList, ...arr]
        this.endFlag = res.data.endFlag
        // this.pageNum = res.data.pageNum
        if (this.endFlag===0) {
          this.pageNum++
        }
      }).catch(() => {
      })
    },
    backbarLeft() {
      if (this.listShow) {
        this.listShow = false
      } else {
        uni.navigateBack({});
      }
    }
  },
  components: {
    productList,
    navBar
  }
}
</script>
<style>
page{
  background: #f2f2f2;
}
</style>
<style scoped lang='scss'>
.searchWrap{
    background: #fff;
    .searchtop{
      align-items: center;
      padding: 0 10px;
      justify-content: center;
      top:0;
      left: 0;
      right: 0;
      background: #fff;
      z-index: 99;
    }
    .leftbar{
      padding: 10px 10px 0 10px;
    }
  .searchCenter{
    width: 80%;
    height: 46px;
    background: #fff;
    align-items: center;
    .searchField{
      width: 100%;
      height: 33px;
      background: #F2F2F2;
      border-radius:17px;
      align-items: center;
      padding: 2px 10px;
      box-sizing: border-box;
    }
    /deep/ .van-cell{
      background: transparent;
    }
    /deep/ .van-nav-bar {
      .van-icon{
        color: #999;
      }
    }
  }
  .right{
    margin: 0 10px;
  }
  /deep/ .van-nav-bar__title{
    max-width: 75%;
  }
  .searchSelWrap{
    .history{
      margin: 10px;
      padding: 0 10px;
      background: #fff;
      .histitle{
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .del{
          width: 15px;
          height: 15px;
          @include bg-image('common/del')
        }
      }
      .hisWrap{
        flex-wrap: wrap;
        .hisitem{
          margin: 0 10px 10px 0;
          background:rgba(242,242,242,1);
          border-radius:25px;
          padding: 5px 15px;
        }
      }
    }
  }
  .listWrap{
    background: #f2f2f2;
    .subWrap{
      margin: 10px;
      background: #fff;
    }
  }
}
</style>
