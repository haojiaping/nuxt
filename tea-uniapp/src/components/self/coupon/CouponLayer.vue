<template>
  <div class="detail-layer"
       v-show="couponLayerShow">
    <transition name="toggle">
      <div class="content"
           @click.stop
           v-show="couponLayerShow">
        <div class="header df">
          <div class="tab pr"
               :class="type===0?'active':''"
               @click="CheckType(0)">
            可用优惠券({{availableList.length}})
          </div>
          <div class="tab pr"
               :class="type===1?'active':''"
               @click="CheckType(1)">
            不可用优惠券({{unavailableList.length}})
          </div>
        </div>
        <ul class="list pr">
          <li v-for="(datas,index) in list"
              :key="index"
              @click="Checkselect(datas)">
            <couponItem :datas="datas"
                        :typeColor='typeColor'
                        :select='select.couponUserId'
                        :type="type"></couponItem>
          </li>
          <div class="empty pa"
               v-if="list.length===0">
            <!-- <img class="empty-icon"
                 :src="require('~/assets/img/common/noData.png')"> -->
            <p class="empty-tip">暂无相关数据~</p>
          </div>
        </ul>
        <div class="btns f18 cash"
             @click="sureCouponSelect">确定</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import couponItem from '../couponItem'
export default {
  data () {
    return {
      type: 0,
      list: [],
      typeColor: '',
      select: {}
    }
  },
  props: {
    couponLayerShow: {
      type: Boolean,
      default: false
    },
    availableList: {
      type: Array
    },
    unavailableList: {
      type: Array
    }
  },
  mounted () {
    this.list = this.availableList
  },
  activated () {
    this.select = {}
  },
  watch: {
    availableList (val) {
      this.list = val
    }
  },
  methods: {
    close () {
      this.$emit('update:couponLayerShow', false)
      this.type = 0
    },
    Checkselect (item) {
      if (this.type === 0) {
        if (this.select.couponUserId === item.couponUserId) {
          this.select = {}
        } else {
          this.select = item
        }
      }
    },
    sureCouponSelect () {
      this.$emit('sureCouponSelect', this.select)
      // this.select = {}
    },
    CheckType (val) {
      // val===0?this.list=this.availableList:this.list = unavailableList
      this.list = val === 0 ? this.availableList : this.unavailableList
      this.typeColor = val === 0 ? '' : 'black'
      this.type = val
    }
  },
  components: {
    couponItem
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>

.detail-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 22;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f2f2f2;
    &.toggle-enter-active,
    &.toggle-leave-active {
      transition: all 0.5s;
    }
    &.toggle-enter,
    &.toggle-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    .header {
      padding: 15px 0 10px;
      .tab {
        flex: 1;
        text-align: center;
        padding: 0 15px 5px;
        font-size: 16px;
        &.active {
          color: #333;
          font-weight: 700;
          font-size: 18px;
        }
      }
    }
    .list {
      height: 325px;
      overflow: scroll;
      .empty {
        top: 50%;
        transform: translate(0, -50%);
        width: 100%;
        padding-top: 20px;
        text-align: center;
        .empty-icon {
          width: 45%;
        }
        .empty-tip {
          color: #666;
          margin-top: 5px;
        }
      }
    }
    .btns {
      width: 270px;
      height: 44px;
      line-height: 44px;
      margin: 20px auto;
      text-align: center;
      &.cash {
        color: #fff;
        background-color: #d45949;
      }
    }
  }
}
</style>
