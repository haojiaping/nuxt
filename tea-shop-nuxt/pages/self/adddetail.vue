<template>
  <div class="appendadd-wrap">
    <backbar :title="isEdit?'修改地址':'添加地址'"
    :rightText="isEdit?'删除':''"
    @onClickRight="delAdd"/>
    <div class="wrap">
      <div class="item border-bottom">
          <van-field
            v-model="add.recipientName"
            clearable
            label="联系人"
            placeholder="用于接收快递时对您的称呼"
            @blur="inputBlur"
          />
        <!-- </div> -->
      </div>
      <div class="item sex border-bottom">
        <span>性别</span>
        <div class="inp">
          <van-radio-group v-model="add.recipientSex" style="display:flex;">
            <van-radio :name="1" checked-color="#D45949">男</van-radio>
            <van-radio :name="2" checked-color="#D45949">女</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="item border-bottom">
        <van-field
            v-model="add.recipientMobile"
            clearable
            label="手机号"
            type="tel"
            placeholder="请输入手机号"
            @blur="inputBlur"
          />
      </div>
      <div class="item sex border-bottom">
        <span>地址</span>
        <div class="inp add" @click="areashow=true" v-if="add.recipientAddress===''">请选择您的地址</div>
        <div class="inp" @click="areashow=true" v-else-if="add.recipientAddress!==''">{{add.recipientAddress}}</div>
      </div>
      <div class="item border-bottom">
        <van-field
            v-model="add.addressDetail"
            clearable
            label="门牌号"
            placeholder="例:8号楼201室"
            @blur="inputBlur"
          />
      </div>
      <div class="item sex border-bottom">
        <span>标签</span>
        <div v-for="(tagitem,index) in ['公司','家','学校']" :key="index"
          @click="handleChangeTag(tagitem)">
          <tag
          :content="tagitem" :color="tagitem!==add.addressTag"
          :bgcolor="tagitem==add.addressTag"></tag>
        </div>
      </div>
    </div>
    <div class="setDefAdd">
      <i class="checkicon" :class="add.defaultStatus===1?'active':''" @click="setdef"></i>
      <span>设为默认地址</span>
    </div>
    <div class="btn-wrap" @click="save">
      <!-- <Btn content="保存"></Btn> -->
    </div>
    <div class="btn-wrap mauto" @click="save">
      <van-button size="large" style="background-color:#333;color:#fff;">保存</van-button>
    </div>
    <transition name="van-slide-up">
      <div class="area-wrap" v-show="areashow">
        <van-area
        :area-list="areaList"
        v-if="areashow"
        @cancel="areashow=false"
        @confirm="confirm"
        />
      </div>
  </transition>
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import areaList from '~/assets/js/area' // 省份列表
import { mapGetters } from 'vuex'
import { setAppendAdd, upDateAdd, deleteAdd } from '~/api/self'
import { mobileReg } from '~/utils/validate'
import tag from '~/components/tag'
const defultAdd = {
  addressDetail: '',
  addressId: '',
  addressTag: '',
  defaultStatus: 1,
  recipientAddress: '',
  recipientMobile: '',
  recipientName: '',
  recipientSex: 1
}
export default {
  components: {
    backbar,
    tag
  },
  data () {
    return {
      // name: '',
      // sex: '1',
      // phone: '',
      address: '',
      // houseNum: '',
      // tag: '', // 0公司 1家 2学校
      areaList: areaList,
      areashow: false,
      check: 0, // 0 不默认 1 默认
      // topTitle: '添加地址',
      add: {}
    }
  },
  mounted () {
    if (this.isEdit) {
      this.add = Object.assign({}, this.$route.params.add)
    } else {
      this.add = Object.assign({}, defultAdd)
    }
  },
  methods: {
    // 地址选择确认框
    confirm(selArr) {
      this.add.recipientAddress = ''
      selArr.forEach(element => {
        this.add.recipientAddress += element.name + ' '
      })
      this.areashow = false
    },
    // 是否设置为默认地址
    setdef() {
      this.add.defaultStatus === 0 ? this.add.defaultStatus = 1 : this.add.defaultStatus = 0
    },
    handleChangeTag(tag) {
      console.log(tag)
      this.add.addressTag = tag
    },
    // 给tag标签赋值
    selTag(e) {
      this.tag = e
    },
    delAdd() {
      if (this.isEdit) {
        console.log(this.add)
        const option = {
          userId: this.userId,
          token: this.token,
          addressId: this.add.addressId
        }
        this.$axios.$post(deleteAdd, option).then(res => {
          if (res.code === 10000) {
            this.$toast('地址删除成功')
            let add = sessionStorage.getItem('__teaAdd__')
            if (add) {
              add = JSON.parse(add)
              if (this.add.addressId === add.addressId) sessionStorage.removeItem('__teaAdd__')
            }
            setTimeout(() => {
              this.$router.back()
            }, 100)
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    save() {
      const option = {
        userId: this.user.userId,
        recipientName: this.add.recipientName,
        recipientSex: this.add.recipientSex,
        recipientMobile: this.add.recipientMobile,
        recipientAddress: this.add.recipientAddress,
        addressDetail: this.add.addressDetail,
        addressTag: this.add.addressTag,
        defaultStatus: this.add.defaultStatus // 0 不默认 1 默认
      }
      if (!mobileReg.test(option.recipientMobile)) {
        this.$toast('请输入正确的手机号')
        return
      }
      if (option.recipientName === '' || option.addressDetail === '') {
        this.$toast('请填写完整信息')
        return
      }
      // 如果从上级页面传过来地址 则调用更新地址接口 否则的话是新增地址接口
      if (!this.isEdit) {
        this.$axios.$post(setAppendAdd, option).then(res => {
          console.log(res)
          if (res.code === 10000) {
            this.$toast('地址保存成功')
            this.$router.go(-1)
          } else {
            this.$toast(res.message)
          }
        })
      } else {
        option.addressId = this.add.addressId
        this.$axios.$post(upDateAdd, option).then(res => {
          console.log(res)
          if (res.code === 10000) {
            this.$toast('地址更新成功')
            this.$router.back()
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    inputBlur () {
      window.scrollTo(0, 0)
    }
  },
  computed: {
    ...mapGetters(['user']),
    isEdit() {
      return !!(this.$route.params.add && this.$route.params.add.addressId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.appendadd-wrap {
  padding-top: 44px;
  background-color: #f2f2f2;
  .wrap {
    margin: 10px;
    background: #fff;
    box-sizing: border-box;
    .border-bottom {
      border-color: #E8E8E8;
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
      .inp{
        flex: 1;
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
  }
  .setDefAdd {
    margin: 0 15px;
    padding-left: 5px;
    display: flex;
    align-items: center;
    line-height: 20px;
    .checkicon {
      box-sizing: border-box;
      width: 15px;
      height: 15px;
      @include bg-image('self/check');
      background-size: cover;
      margin-right: 5px;
    }
    .active {
      @include bg-image('self/check-active');
    }
  }
}
.area-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.btn-wrap {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  width: 270px;
  height: 44px;
}
@media screen and (max-height: 360px) {
  .btn-wrap {
    display: none;
  }
  .area-wrap {
    display: none;
  }
}
</style>
