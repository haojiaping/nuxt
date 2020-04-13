<template>
  <section>
    <div class="wrap">
      <div class="item border-bottom">
        <van-field v-model="add.recipientName"
                   clearable
                   label="联系人"
                   placeholder="用于接收快递时对您的称呼"
                   @blur="inputBlur" />
      </div>
      <div class="item border-bottom">
        <van-field v-model="add.recipientMobile"
                   clearable
                   label="手机号"
                   type="tel"
                   placeholder="请输入手机号"
                   @blur="inputBlur" />
      </div>
      <div class="item sex border-bottom">
        <span>地址</span>
        <div class="inp add"
             @click="areashow=true"
             v-if="add.recipientAddress===''">请选择您的地址</div>
        <div class="inp"
             @click="areashow=true"
             v-else-if="add.recipientAddress!==''">{{add.recipientAddress}}</div>
      </div>
      <div class="item border-bottom">
        <van-field v-model="add.addressDetail"
                   clearable
                   label="门牌号"
                   placeholder="例:8号楼201室"
                   @blur="inputBlur" />
      </div>
      <div class="item">
        <van-cell title="设为默认地址">
          <van-switch v-model="switchStatus"
                      slot="right-icon"
                      size="18px"
                      active-color="#fff"
                      inactive-color="#fff"
                      @change="InitUpdate" />
        </van-cell>
      </div>
    </div>
    <!-- <transition name="van-slide-up">
      <div class="area-wrap" v-show="areashow">
        <van-area
        :area-list="areaList"
        v-if="areashow"
        @cancel="areashow=false"
        @confirm="confirm"
        />
      </div>
  </transition> -->
    <van-popup v-model="areashow"
               position="bottom"
               get-container="body">
      <van-area :area-list="areaList"
                v-if="areashow"
                @cancel="areashow=false"
                @confirm="confirm" />
    </van-popup>
  </section>
</template>

<script>
import areaList from '@/utils/area' // 省份列表
export default {
  data () {
    return {
      add: {
        addressDetail: '',
        addressId: '',
        addressTag: '',
        defaultStatus: 1,
        recipientAddress: '',
        recipientMobile: '',
        recipientName: '',
        recipientSex: 1
      },
      areaList: areaList,
      switchStatus: false,
      areashow: false
    }
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    // 地址选择确认框
    confirm (selArr) {
      this.add.recipientAddress = ''
      selArr.forEach(element => {
        this.add.recipientAddress += element.name + ' '
      })
      this.areashow = false
    },
    InitUpdate () {
      this.add.defaultStatus === 1 ? this.add.defaultStatus = 0 : this.add.defaultStatus = 1
    },
    inputBlur () {
      window.scrollTo(0, 0)
    }
  },
  computed: {
  }
}
</script>

<style scoped lang='scss'>
.wrap {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  .border-bottom {
    border-color: #e8e8e8;
  }
  .item {
    display: flex;
    align-items: center;
    padding: 2px 5px;
    font-size: 14px;
    span {
      flex: 1;
      max-width: 60px;
      color: #333;
    }
    .add {
      color: #999;
    }
    .inp {
      flex: 1;
    }
    &.adddefault {
      justify-content: space-between;
      .text {
        flex: 0 0 1;
      }
    }
  }
  .item /deep/ .van-field__label {
    max-width: 60px;
    color: #333;
  }
  .sex {
    padding: 13px 20px;
  }
  .item /deep/ .van-radio {
    // display: inline-block;
    margin-right: 25px;
  }
  .item /deep/ .van-field__control {
    color: #333;
  }
  .item /deep/ .van-field__control::placeholder {
    color: #999;
  }
  /deep/ .van-switch__node {
    background-color: #d55847;
  }
  /deep/ .van-switch--on > .van-switch__node {
    background-color: #999;
  }
}

.area-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 9999;
}
</style>
