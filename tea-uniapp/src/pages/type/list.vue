<template>
   <section class="typedetail">
     <div class="headimg pr" v-if="categoryId==='000'">
        <div class="img">
          <img :src="categoryLogo" alt="" style="width:75px;height:75px;border-radius:5px;" mode="widthFix">
        </div>
        <span class="text">{{categoryName}}</span>
      </div>
        <div class="navWraper">
            <div class="nav">
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
     <div class="listWrap">
        <productList :dataList="dataList" width="48.75%" bgcolor="#f2f2f2"></productList>
    </div>
   </section>
</template>

<script>
import productList from '@/components/productList'
import { getProductList,getBrandList } from '@/api/product'
export default {
  data() {
    return {
      mescroll: null,
      navActive: 0,
      pageNum: 0,
      endFlag: 1,
      categoryName: '',
      categoryId:'',
      categoryLogo:'',
      nodeCategoryId:'',
      dataList:[]
    }
  },
  onLoad(option){
    let arg = JSON.parse(option.categoryData)
      this.categoryName = arg.categoryName
      this.categoryId = arg.categoryId
      this.categoryLogo = arg.categoryLogo
      this.nodeCategoryId = arg.nodeCategoryId
      uni.setNavigationBarTitle({
          title: this.categoryName
      });
      if (this.categoryId === '000') {
        this.productBrandList()
      } else {
        this.productList()
      }
  },
  watch: {

  },
  onPullDownRefresh(){
    this.pageNum = 0
    if (this.categoryId === '000') {
        this.productBrandList()
      } else {
        this.productList()
      }
  },
  onReachBottom(){
    if (this.endFlag===0) {
      if (this.categoryId === '000') {
        this.productBrandList()
      } else {
        this.productList()
      }
    }
  },
  methods: {
    productList() {
      const option = {
        categoryId: this.nodeCategoryId,
        pageNum: this.pageNum,
        orderSortType: this.navActive
      }
      getProductList(option).then(res => {
        if (this.pageNum === 0) this.dataList = []
        const arr = res.data.productList
        if (res.code === 10000) {
          this.categoryName = res.data.categoryName
          this.endFlag = res.data.endFlag
          if(this.endFlag===0) this.pageNum++
          this.dataList = this.dataList.concat(arr)
          uni.stopPullDownRefresh();
        }
      })
    },
    productBrandList() {
      const option = {
        brandId: this.nodeCategoryId,
        pageNum: this.pageNum,
        orderSortType: this.navActive
      }
      getBrandList(option).then(res => {
        if (this.pageNum === 0) this.dataList = []
        const arr = res.data.productList
        if (res.code === 10000) {
          this.categoryName = res.data.categoryName
          this.endFlag = res.data.endFlag
          if(this.endFlag===0) this.pageNum++
          this.dataList = this.dataList.concat(arr)
          uni.stopPullDownRefresh();
        }
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
      this.pageNum = 0
      if (this.categoryId === '000') {
        this.productBrandList()
      } else {
        this.productList()
      }
    }
  },
  components: {
    productList
  }
}
</script>

<style>
page{
  background: #f2f2f2;
}
</style>
<style scoped lang='scss'>
.typedetail{
    /deep/ .van-sticky-wrap{
      left: 0;
      right: 0;
    }
    .headimg {
      width: 100%;
      height: 200upx;
      background: linear-gradient(#D45949 0 50%, #F2F2F2 50% 100%);
      .img {
        position: absolute;
        width: 75px;
        height: 75px;
        left: 10px;
        bottom: 10px;
        background: #fff;
        border-radius:5px;
      }
      .text {
        position: absolute;
        left: 100px;
        bottom: 10px;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
    .navWraper {
      padding: 0 10px;
      background: #fff;
      box-sizing: border-box;
      z-index: 10;
      width: 100%;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      .nav {
        display: flex;
        background: #fff;
        .nav-item {
          position: relative;
          width: 33.33%;
          text-align: center;
          margin: 0 6px;
          padding: 10px;
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

    .listWrap{
      margin: 20upx;
    }
}
</style>
