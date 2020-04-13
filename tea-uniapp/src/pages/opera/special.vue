<template>
   <view>
     <view class="prolist-wrpa">
					<productList :dataList="dataList" width="48.75%" bgcolor="#f2f2f2"></productList>
				</view>
   </view>
</template>

<script>
import productList from "@/components/productList";
import { getSpecial } from '@/api/special'
export default {
  data() {
    return {
      dataList:[],
      option:{}
    }
  },
  onLoad(option) {
    console.log(option);
    this.option = option
    this.option.name = decodeURIComponent(option.name)
    uni.setNavigationBarTitle({
        title: this.option.name
    });
    uni.showLoading({});
    this.getData()
  },
  methods: {
    getData() {
      const option = {
        specialType: this.option.type,
        lastId: 0
      }
      getSpecial(option).then(res => {
        this.dataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.dataList = arr
          uni.hideLoading();
        }
      }).catch(err=>{
        uni.hideLoading();
      })
    },
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
.prolist-wrpa{
  margin: 20upx;
  background: #f2f2f2;
  border-radius: 10upx;
}
</style>
