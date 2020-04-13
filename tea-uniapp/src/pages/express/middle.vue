<template>
	<view>
		<div class="middleWraper">
			<div class="contWraper" ref="detailmd">
				<div class="tipsWraper">
					<span>{{postageNumContent}}</span>
				</div>
				<div class="subWraper">
					<div class="subItem df" v-for="(item,index) in postageInfo" :key="index" @click="jumpToEx(item)">
						<div class="itemhd df">
							<span class="f15 fw400" style="color:#D45949;">{{item.state}}</span>
							<span class="f12 fw400" style="color:#999;" v-if="item.postageName!=='-'">{{item.postageName}}:{{item.postageId}}</span>
						</div>
						<div class="subText f14 fw400">{{item.postageContent|formatPost}}</div>
						<div class="van-hairline--top">
							<div class="subpro df" v-for="(elem,index) in item.productList" :key="index">
								<img :src="elem.productImage" alt="">
								<div class="goods df">
									<div class="goodInfo df">
										<p class="f15 fw400 goodname">{{elem.productName}}</p>
										<p style="color:#D45949;">¥ {{elem.actualPrice}}</p>
									</div>
									<div class="num">X{{elem.productCount}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer f12" @click="popshow = true">
					为什么是多个包裹?
				</div>

			</div>
			<van-popup v-model="popshow" :close-on-click-overlay="false">
				<div class="popSub df">
					<p class="f15 fw400">尊敬的用户，茶臻选商城选择在原产地直采建仓，所以不同产地的茶会分多个包裹邮寄。</p>
					<div class="popbtn van-hairline--surround" @click="popshow = false">
						<span class="f15 fw400">知道了</span>
					</div>
				</div>
			</van-popup>
		</div>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrderPro } from "@/api/order.js"

export default {
  name: 'middle',
  data() {
    return { 
      postageNumContent: '',
      postageInfo: [],
      popshow: false
    }
  },
 onLoad(option) {
 	console.log(option)
	this.productOrderId = option.productOrderId
	this.getDetail()
  },
  mounted() {
    // this.productOrderId = this.$route.query.productOrderId
    // this.getDetail()
  },
  watch: {

  },
  methods: {
    setHeight (height) {
      this.$refs.detailmd.style.top = `${(height + 42) / 37.5}rem`
    },
    // 中间页请求
    getDetail () {
      getOrderPro({ productOrderId: this.productOrderId }).then(res => {
        if (res.code === 10000) {
          this.postageNumContent = res.data.postageNumContent
          this.postageInfo = [...res.data.postageInfo]
        } else {
          this.$toast(res.message)
        }
      })
    },
    jumpToEx (item) {
      this.postFlag = 0
      //this.$router.push({ path: '/order/express', query: { productOrderId: this.productOrderId, postageId: item.postageId } })
      // console.log(this.postFlag)
      // this.getExpress(item.postageId)
      // if (item.postageId !== '-') {
      // this.$router.push({name: 'Express', query: {productOrderId: this.productOrderId, postageId: item.postageId}})
      // }
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['user'])
  },
  filters: {
    formatPost (val) {
      if (!val || val === '-') {
        return '等待揽收'
      } else {
        let text = ''
        const arr = JSON.parse(val)
        text = arr[arr.length - 1].AcceptStation
        return text
      }
    }
  }
}
</script>

<style scoped lang='scss'>

.middleWraper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  background: #f2f2f2;
  .contWraper {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .tipsWraper {
      background: #ffdcd8;
      left: 0;
      right: 0;
      top: 46px;
      height: 46px;
      line-height: 46px;
      span {
        margin-left: 15px;
        color: #d45949;
      }
    }
    .subWraper {
      // position: absolute;
      flex: 1;
      top: 100px;
      left: 0;
      right: 0;
      bottom: 46px;
      overflow-x: scroll;
      .subItem {
        background: #fff;
        flex-direction: column;
        margin: 10px;
        padding: 10px;
        .itemhd {
          justify-content: space-between;
          padding: 10px 0;
        }
        .subText {
          margin: 10px 0;
          color: #333;
          // max-height: 25px;
          line-height: 17px;
          overflow: hidden;
          box-sizing: border-box;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .subpro {
          padding: 10px;
          width: 100%;
          box-sizing: border-box;
          img {
            // width: 45px;
            height: 45px;
            flex: 0 0 45px;
          }
          .goods {
            height: auto;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            .goodInfo {
              padding: 5px 10px 5px;
              box-sizing: border-box;
              height: 100%;
              // flex: 0 1 80%;
              flex-direction: column;
              justify-content: space-between;
              .goodname {
                width: 100%;
                max-width: 225px;
                color: #333;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
    .footer {
      // position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 46px;
      line-height: 46px;
      text-align: center;
    }
  }
  .popSub {
    width: 5.6rem;
    height: 150px;
    padding: 10px;
    justify-content: space-between;
    flex-direction: column;
    p {
      padding: 25px;
      line-height: 17px;
    }
    .popbtn {
      width: 150px;
      height: 33px;
      line-height: 33px;
      margin: 0 auto;
      text-align: center;
      &.van-hairline--surround:after {
        border-color: #ccc;
      }
    }
  }
}
</style>
