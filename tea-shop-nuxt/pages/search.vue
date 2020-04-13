<template>
   <section class="searchWrap">
     <van-nav-bar>
       <van-icon name="arrow-left" slot="left" color="#333" size="0.5rem" @click="backbarLeft"/>
       <div slot="title" class="searchCenter df">
         <div class="searchField df">
          <van-icon name="search" color="#999"/>
          <van-field v-model="productName" :placeholder="autoSearch" />
         </div>
       </div>
       <span slot="right" class="c3" @click="getList">搜索</span>
      </van-nav-bar>
      <div class="searchSelWrap" v-show="!listShow">

        <!-- <div class="history van-hairline--bottom">
          <p class="histitle df ">
            <span class="f15">搜索历史</span>
            <span class="del"></span>
          </p>
          <div class="hisWrap df">
            <div class="hisitem f15">树大根深分公司</div>
            <div class="hisitem f15">树大根深分公司</div>
            <div class="hisitem f15">树大根深分公司</div>
            <div class="hisitem f15">树大根深分公司</div>
          </div>
        </div> -->
        <div class="history">
          <p class="histitle df ">
            <span class="f15">热门搜索</span>
          </p>
          <div class="hisWrap df">
            <div class="hisitem f15" v-for="(item , index) in hotSearchData" :key="`hot_${index}`"
            @click="hotsearchList(item.keyWord)">{{item.keyWord}}</div>
          </div>
        </div>
      </div>
      <div class="listWrap mescroll" v-show="listShow" ref="mescroll">
        <div class="subWrap" id="listWraper">
          <productList :dataList="dataList"></productList>
        </div>
      </div>
   </section>
</template>

<script>
import { hotSearch, searchList } from '~/api/index'
import productList from '~/components/productList'
export default {
  data() {
    return {
      productName: '',
      autoSearch: '',
      hotSearchData: [],
      listShow: false,
      mescroll: null,
      dataList: []
    }
  },
  mounted() {
    this.searchInit()
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    searchInit() {
      this.$axios.$post(hotSearch).then(res => {
        this.hotSearchData = res.data
        this.autoSearch = res.data[0].keyWord
      })
    },
    mescrollInit () {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getsearchList,
          auto: false,
          lazyLoad: {
            use: true
          },
          noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
          // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          // 这就是为什么无更多数据有时候不显示的原因
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'listWraper', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    getList() {
      this.listShow = true
      this.mescroll.resetUpScroll(false)
    },
    hotsearchList(name) {
      this.listShow = true
      this.productName = name
      this.mescroll.resetUpScroll(false)
    },
    getsearchList(page, mescroll) {
      if (!this.productName) this.productName = this.autoSearch
      const pageNum = page.num - 1
      const option = {
        productName: this.productName,
        pageNum: pageNum,
        orderSortType: 0
      }
      this.$axios.$post(searchList, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.data.productList
        this.dataList = [...this.dataList, ...arr]
        this.$nextTick(() => {
          this.mescroll.endSuccess(arr.length)
        })
      }).catch(() => {
        this.mescroll.endErr()
      })
    },
    backbarLeft() {
      if (this.listShow) {
        this.listShow = false
      } else {
        this.$router.back()
      }
    }
  },
  components: {
    productList
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.searchWrap{
    background: #fff;
  .searchCenter{
    height: 46px;
    background: #fff;
    align-items: center;
    .searchField{
      width: 260px;
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
  /deep/ .van-nav-bar__title{
    max-width: 75%;
  }
  .searchSelWrap{
    .history{
      margin: 10px;
      padding: 10px;
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
    position: fixed;
    top: 46px;
    left: 0;
    bottom: 0;
    height: auto;
    background: #f2f2f2;
    .subWrap{
      margin: 10px;
      background: #fff;
    }
  }
}
</style>
