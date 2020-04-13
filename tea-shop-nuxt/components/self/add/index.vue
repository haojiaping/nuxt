<template>
  <div class="add-wrap f14" >
    <backbar title="我的地址"/>
    <div class="wrap" v-if="!addnone">
      <div class="content">
        <div class="item border-bottom"  @click="selectAdd(item)"
        v-for="(item,index) in addressData" :key="index">
          <div class="left">
            <p>{{item.recipientAddress}}  {{item.addressDetail}}</p>
            <div class="detail">
              <div class="tag ctea">
                <tag :color="false" content="默认" :bgcolor="true" v-if="item.defaultStatus===1"></tag>
                <tag :content="item.addressTag" v-if="item.addressTag!==''"></tag>
                <!-- <van-tag color="#FFDAD5" plain style="color:#D45949;">默认</van-tag> -->
              </div>
              <span class="name">{{item.recipientName}}</span>
              <span>{{item.recipientMobile}}</span>
            </div>
          </div>
          <div class="right-wrap" @click.stop="edit(item)">
            <div class="right"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="none-wrap" v-if="addnone">
      <div class="none">
        <i class="noneicon"></i>
        <p>您还没有收货地址</p>
      </div>
    </div>
    <div @click="edit()" class="btn-wrap" tag="div">
      <!-- <Btn bgcolor="bgcolor-black" content="添加地址" v-if="!addnone"></Btn>
      <Btn bgcolor="bgcolor-white" content="添加地址" :addicon="true" v-else-if="addnone"></Btn> -->
      <div class="btn bgcolor-white border">
        <i class="add"></i>
        添加地址
      </div>
    </div>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import tag from '~/components/tag'
import { getAddress } from '~/api/self'
import { mapGetters } from 'vuex'
export default {
  name: 'add',
  components: {
    backbar,
    tag
  },
  data () {
    return {
      addnone: false,
      addressData: {}
    }
  },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.Address()
  },
  methods: {
    Address() {
      const option = {
        userId: this.user.userId
      }
      this.$axios.$post(getAddress, option).then(res => {
        if (res.code === 10000) {
          this.addressData = [...res.addressData]
          if (this.addressData.length === 0) {
            this.addnone = true
            sessionStorage.removeItem('__teaAdd__')
          } else {
            this.addnone = false
            let add = sessionStorage.getItem('__teaAdd__')
            if (add) {
              add = JSON.parse(add)
              console.log(add.addressId)
              const adds = []

              this.addressData.map(addId => { adds.push(addId.addressId) })
              if (!adds.includes(add)) sessionStorage.removeItem('__teaAdd__')
            }
          }
        } else {
          this.$toast(res.message)
        }
      })
    },
    edit(item) {
      console.log(item)
      this.$router.push({ name: 'self-adddetail', params: { add: item } })
    },
    selectAdd(item) {
      if (this.isSelect) {
        sessionStorage.setItem('__teaAdd__', JSON.stringify(item))
        this.$router.back()
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';
.add-wrap {
  padding-top: 44px;
  padding-bottom: 80px;
  background-color: #f2f2f2;
  .wrap {
    margin: 10px;
    box-sizing: border-box;
    z-index: 1;
    height: 100%;
    .content {

      background: #fff;
      .border-bottom:before {
        border-color: #E8E8E8;
      }
      .item {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333;
        .left {
          p {
            margin-bottom: 10px;
          }
          .detail {
            display: flex;
            align-items: center;
            .name {
              margin-right: 15px;
            }
          }
        }
        .right-wrap {
          padding: 10px;
          box-sizing: border-box;
          .right {
            width: 16px;
            height: 16px;
            @include bg-image('self/edit');
            background-size: cover;
          }
        }
      }
    }
  }
  .btn-wrap {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 20;
    .btn {
      width: 270px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .add {
        width: 15px;
        height: 15px;
        @include bg-image('self/add');
        margin-right: 10px;
        background-size: cover;
      }
      &.bgcolor-black {
        background: #333;
      }
      &.bgcolor-red {
        background: #D45949;
      }
      &.bgcolor-white {
        color: #333;
        background: #f2f2f2;
        &.border:before{
          border: 1px solid #999;
        }
      }
    }
  }
  .none-wrap {
    .noneicon {
      display: block;
      width: 120px;
      height: 150px;
      @include bg-image('self/none');
      background-size: cover;
    }
    .none {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -120%);
      p {
        margin-top: 15px;
      }
    }
  }
}
</style>
