<template>
  <div class="add-wrap f14" >
    <div class="wrap" v-if="!addnone">
      <div class="content">
        <div class="item" :class="index+1!==addressData.length?'border':''"  @click="selectAdd(item)"
        v-for="(item,index) in addressData" :key="index">
          <div class="left">
            <p>{{item.recipientAddress}}  {{item.addressDetail}}</p>
            <div class="detail">
              <div class="tag ctea">
                <tag :color="false" content="默认" :bgcolor="true" v-if="item.defaultStatus===1"></tag>
                <tag :content="item.addressTag" v-if="item.addressTag!==''"></tag>
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
      <div class="btn">
        <i class="add"></i>
        添加地址
      </div>
    </div>
  </div>
</template>

<script>
import { getAddress } from '@/api/self'
import { mapGetters } from 'vuex'
import tag from '@/components/tag'
export default {
  name: 'add',
  components: {
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
  methods: {
    Address() {
      const option = {
        userId: this.user.userId
      }
      getAddress(option).then(res => {
        if (res.code === 10000) {
          this.addressData = [...res.addressData]
          if (this.addressData.length === 0) {
            this.addnone = true
          } else {
            this.addnone = false
            
          }
        } else {
          this.$toast(res.message)
        }
      })
    },
    edit(item) {
      if (item) {
        uni.navigateTo({
          url: `/pages/self/adddetail?type=edit&adddata=${JSON.stringify(item)}`
        });
      } else{
        uni.navigateTo({
          url: `/pages/self/adddetail?type=add`
        });
      }
    },
    selectAdd(item) {
      if (this.isSelect) {
        uni.setStorageSync('userSelectAdd', item)
        //  sessionStorage.setItem('__teaAdd__', JSON.stringify(item))
        uni.navigateBack({})
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
.add-wrap {
  background-color: #f2f2f2;
  .wrap {
    margin: 10px;
    box-sizing: border-box;
    z-index: 1;
    .content {
      border-radius: 5px;
      background: #fff;
      .item {
        padding: 10px 0;
        margin: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333;
        &.border{
          border-bottom: 1upx solid #e8e8e8;
        }
        .left {
          p {
            margin-bottom: 5px;
          }
          .detail {
            display: flex;
            align-items: center;
            .name {
              margin-right: 15px;
              max-width: 150px;
              @include text-over(1)
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
      color: #333;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border:1upx solid rgba(153,153,153,1);
      border-radius:22px;
      .add {
        width: 15px;
        height: 15px;
        @include bg-image('self/add');
        margin-right: 10px;
        background-size: cover;
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
