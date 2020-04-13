<template>
<div class="listWraper">
   <ul class="list-content df">
      <li class="list border-rightbottom pr" v-for="(item,index) of datas" :key="`item_${index}`" @click="jumpDetail(item.productId)">
        <div class="img-wrapper">
          <img class="img" :src="item.productImage||item.image" alt="">
        </div>
        <div class="desc-wrapper border-top">
          <div class="desc">
            <span class="text">{{item.productName||item.title}}</span>
          </div>
          <!-- <p class="exp">{{item.productDescription}}</p> -->
          <div class="sign-wrapper">
            <span class="sign border" v-for="(tag,index) in splitTag(item.productTitle)" :key="index">{{tag}}</span>
            <!-- <span class="sign border">1年以下</span> -->
          </div>
        </div>
        <div class="pri pa">
          <span class="price"><i>&yen;</i>{{item.productPrice}}</span>
        </div>
        <div class="tag pa">
          <span class="f12 fw400">{{item.productYear}}年</span>
        </div>
      </li>
    </ul>
</div>
</template>

<script>
export default {
  name: 'OldTeaItem',
  data() {
    return {
      jumpDetail(productId) {
        this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
      },
      splitTag(tags) {
        if (tags) {
          return tags.split(',')
        }
      }
    }
  },
  props: {
    datas: {
      type: Array
    },
    gobackMyback: {
      type: Boolean,
      default: false
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.listWraper {
  padding: 0 10px;
  font-weight: normal;
  .list-content {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    .list {
      width: 50%;
      padding-bottom: 29px;
      box-sizing: border-box;

      background-color: #fff;
      padding: 13px 13px 23px 13px;
      &:nth-child(2n) {
        &:before {
          border: 0;
        }
      }
      .img-wrapper {

        width: 150px;
        height: 150px;
        margin: 0 auto;
        padding-bottom: 10px;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .desc-wrapper {
        &:before {
          border-color: #cccccc;
        }
        .desc {
          padding: 10px 0 7px;
          overflow: hidden;
          font-size: 15px;
          line-height: 15px;
          .text {

            display: inline-block;
            // max-width: 2rem;
            //超出2行显示省略号
            line-height: 17px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .exp {
          margin-bottom: 8px;
          font-size: 11px;
          height: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #666;
        }
        .sign-wrapper {
          height: 25px;
          overflow: hidden;
          font-size: 12px;
          margin-bottom: 5px;
          .sign {
            padding: 2px 10px;
            float: left;
            margin-right: 5px;
            color: #D45949;
            &.border:before {
              border-color: #D45949;
            }
          }
        }
      }
      .pri{
        bottom: 10px;
        left:15px;
        .price {
          text-align: right;
          color: #D45949;
          font-weight: bold;
          i {
            font-size: 12px;
            margin-right: 3px;
          }
        }
      }
      .tag{
        bottom:10px;
        right: 0;
        padding: 2px 7px 2px 12px;
        background: #EA6F5F;
        border-radius: 25px 0 0 25px;
        span{
          color: #fff;
        }
      }
    }
  }
}
</style>
