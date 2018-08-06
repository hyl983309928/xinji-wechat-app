<template>
  <div class="edit-page" v-if="show">

    <span class="placeholder">{{ placeholder }}</span>
    <div style="text-align:center;margin-top:20px;">
      <input type="text" class="input" v-model="info.childrenList[0].name" v-if="type == 'babyname'" placeholder="请输入宝贝姓名">
      <input type="text" class="input" v-model="info.name" v-if="type == 'name'" placeholder="请输入您的昵称">
      <input type="text" class="input" v-model="info.telephone" v-if="type == 'phone'" placeholder="请输入您的手机号码">
    </div>

    <div class="error">
      {{ errorTextMap[errorStatus] }}
    </div>

    <div class="button">
      <x-button type="primary"  @click.native="confirm">保存</x-button>
    </div>
  </div>
</template>

<script>
import { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'

export default {
  components: { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch },
  data () {
    return {
      info: {},
      show: false,
      errorStatus: 0,
      errorTextMap: ['', '请输入宝贝的名字', '请输入您的昵称', '请输入手机号码', '请输入正确的手机号码']
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  computed: {
    placeholder() {
      var map = {
        'babyname': '请输入宝贝的名字：',
        'name': '请输入您的昵称：',
        'phone': '请输入手机号码：'
      }
      return map[this.type]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init() {
      this.type = this.$route.params.type
      this.getChildrenInfo()
    },
    getChildrenInfo() {
      this.$api.user.getChildrenInfo().then(data => {
        this.show = true
        this.info = data
      })
    },
    checkInput() {
      if (this.type === 'babyname' && !this.info.childrenList[0].name) {
        this.errorStatus = 1
        return false
      } else if (this.type === 'name' && !this.info.name) {
        this.errorStatus = 2
        return false
      } else if (this.type === 'phone' && !this.info.telephone) {
        this.errorStatus = 3
        return false
      } else if (this.type === 'phone' && !this.info.telephone.match(/1[345789]\d{9}$/)) {
        this.errorStatus = 4
        return false
      }
      this.errorStatus = 0
      return true
    },
    confirm() {
      if (!this.checkInput()) return
      this.$api.user.updateChildrenInfo(this.info).then(res => {
        this.showSuccess('保存成功')
        this.$router.go(-1)
      })
    }
    // unbind() {
    //   this.$api.user.unbindChildren(this.info.childrenList[0].studentId).then(res => {
    //     console.log(res)
    //   })
    // },
  }
}
</script>

<style scoped lang="scss">
  .edit-page{
    padding-top: 20px;
  }
  .placeholder{
    font-size: 0.9rem;
    margin-left: 25px;
  }
  .error{
    margin-top: 15px;
    margin-bottom: -10px;
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
  .input {
    width: 80%;
    border: 1px solid #efeff4;
    -webkit-appearance: none;
    padding: 0.6rem 0.9375rem;
    font-size: 1rem;
  }
</style>
