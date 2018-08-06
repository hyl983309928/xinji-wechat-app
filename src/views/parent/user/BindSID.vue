<template>
  <div class="sid-page">
    <div class="title">绑定学号</div>

    <group label-margin-right="2em" label-align="left">
      <x-input title="请输入学号" placeholder="请输入14位数字" v-model="sid"  @on-focus="errorStatus=0" @on-blur="checkSID" :max="14" placeholder-align="right" text-align="right"></x-input>
    </group>

    <div class="error">
      {{ errorTextMap[errorStatus] }}
    </div>

    <div class="button" :style="{opacity: isDisabled?'0.5':'1'}">
      <x-button type="primary"  @click.native="confirm">确定</x-button>
    </div>
  </div>
</template>

<script>
import { XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'

export default {
  components: { XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch },
  data () {
    return {
      sid: '',
      errorStatus: 0,
      errorTextMap: ['', '请输入14位数字，无需输入“-”或空格。', '未找到对应学号的绑定号码']
    }
  },
  computed: {
    isDisabled() {
      return !this.sid
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
      this.user = userInfo
    })
  },
  methods: {
    checkSID() {
      if (!this.sid.match(/\d{14}$/)) {
        this.errorStatus = 1
        return false
      }
      return true
    },
    confirm() {
      if (this.isDisabled) return
      if (!this.checkSID()) return
      this.$api.user.checkSID(this.sid).then(res => {
        this.$router.push('/parent/user/bind_phone/' + this.sid + '/' + res)
      }).catch(() => {
        this.errorStatus = 2
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .title{
    text-align: center;
    margin-top: 10px;
    margin-bottom: -15px;
  }
  .error{
    margin-top: 10px;
    margin-bottom: -15px;
    height: 25px;
    text-align: center;
    color: #f00;
  }
  .button{
    margin: 0 auto;
    border-radius: 20px;
    width: 200px;
    margin-top: 30px;
    background: #4bd3e7;
  }
</style>
