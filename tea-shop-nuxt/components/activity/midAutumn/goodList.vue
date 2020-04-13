<template>
  <div class="bottom">
    <div class="good van-hairline--bottom"
         id='top-good'
         v-for="item in topData"
         :key="item.productId"
         @click="jumpDetail(item.productId)">
      <div class='good-img'>
        <img :src="item.image"
             class='good-content'
             alt='' />
      </div>
      <div class="goodInfo">
        <p class="name">{{item.productDescription}}</p>
        <p class="dec">{{item.productName}}</p>
        <div class='center'>
          <p class='daily-price'>市场价:{{item.productPrice}}</p>
          <div class="price">
            <span class='left'>券后价:</span>
            <span class='right'>{{item.discountsPrice}}元</span>
          </div>
          <p class='grab'
             v-if="color==='First'">现在就抢</p>
          <p class='grab2 grab'
             v-else>现在就抢</p>
        </div>
      </div>
    </div>
    <div class="good van-hairline--bottom"
         v-for="item in bottomData"
         :key="item.productId"
         @click="jumpDetail(item.productId)">
      <div class='good-img'>
        <img :src="item.image"
             class='good-content'
             alt='' />
      </div>
      <div class="goodInfo">
        <p class="name">{{item.productDescription}}</p>
        <p class="dec">{{item.productName}}</p>
        <div class='center'>
          <div class="price">
            <span class='left'>券后价:</span>
            <span class='right'>{{item.discountsPrice}}元</span>
            <p class='daily-price'>市场价:{{item.productPrice}}</p>
          </div>
          <p class='grab'
             v-if="color==='First'">抢</p>
          <p class='grab1 grab'
             v-else>抢</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  data () {
    return {
      showRank: ''
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    color: {
      type: String
    },
    specialType: {
      type: String
    }
  },
  created () {
  },
  mounted () {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    topData () {
      let arr = []
      arr = this.dataList.filter((item, index) => {
        return index < 1
      })
      return arr
    },
    bottomData () {
      let arr = []
      arr = this.dataList.filter((item, index) => {
        return index > 0
      })
      return arr
    }
  },
  methods: {
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
      const params = {
        specialType: Number(this.specialType),
        shopId: this.$route.query.shopId
      }
      sessionStorage.setItem('_shopId_', JSON.stringify(params))
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.bottom {
  margin: 0 auto;
  position: relative;
  margin-top: 0;
  width: 355px;
  #top-good {
    display: flex;
    flex-direction: column;
    .good-img {
      width: 335px;
      height: 335px;
      box-sizing: border-box;
      .good-content {
        width: 100%;
        height: 100%;
      }
    }
    .goodInfo {
      margin-top: 17px;
      padding-left: 0;
      .dec {
        margin-top: 0;
      }
      .center {
        align-items: flex-end;
        .daily-price {
          font-size: 12px;
          text-decoration: line-through;
          color: #333;
          line-height: 15px;
          text-decoration: line-through;
        }
        .price {
          margin-left: 8px;
        }
        .grab {
          width: 110px;
          height: 36px;
          background: linear-gradient(
            132deg,
            rgba(240, 87, 75, 1),
            rgba(224, 57, 44, 1)
          );
          box-shadow: 0px 2px 8px 0px rgba(224, 57, 44, 0.47);
          border-radius: 18px;
        }
        .grab2 {
          color: #fff;
          text-align: center;
          line-height: 36px;
          width: 110px;
          height: 36px;
          background: rgba(207, 85, 75, 1);
          box-shadow: 0px 2px 8px 0px rgba(224, 57, 44, 0.47);
          border-radius: 18px;
        }
      }
    }
  }
  .good {
    padding: 10px;
    display: flex;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 15px;
    .good-img {
      width: 150px;
      height: 150px;
      font-size: 0;
      position: relative;
      border: 1px solid #e5b76e;
      .good-content {
        height: 150px;
        width: 150px;
        background: #ccc;
      }
    }
    .goodInfo {
      position: relative;
      padding-left: 13px;
      flex: 1;
      .name {
        height: 44px;
        font-size: 16px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        color: #333;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .dec {
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
        margin-top: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .center {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        .price {
          margin-top: 12px;
          flex: 1;
          .left {
            height: 12px;
            font-size: 12px;
            color: #e0392c;
            line-height: 15px;
          }
          .right {
            font-size: 24px;
            font-weight: 600;
            color: rgba(224, 57, 44, 1);
            display: inline-block;
            margin-left: 5px;
          }
        }
        .daily-price {
          height: 15px;
          font-size: 12px;
          text-decoration: line-through;
          color: #333333;
          line-height: 15px;
          display: inline-block;
          text-decoration: line-through;
        }
        .grab {
          line-height: 36px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(
            132deg,
            rgba(240, 87, 75, 1),
            rgba(224, 57, 44, 1)
          );
          box-shadow: 0px 2px 8px 0px rgba(224, 57, 44, 0.47);
          border-radius: 50%;
        }
        .grab1 {
          line-height: 36px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          width: 36px;
          height: 36px;
          background: rgba(207, 85, 75, 1);
          box-shadow: 0px 2px 8px 0px rgba(224, 57, 44, 0.47);
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
