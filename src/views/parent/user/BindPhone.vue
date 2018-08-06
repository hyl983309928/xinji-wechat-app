<template>
  <div class="phone-page">
    <div class="title">验证身份</div>

    <div class="sid">
      学号【{{ sidFormated }}】绑定的手机号码是<span class="color">{{ originPhone }}</span>
    </div>

    <div class="promt">
      请输入完整的手机号码，完成身份验证：
    </div>
    
    <div class="input">
      <input type="text" v-model="phone" placeholder="请输入11位手机号码" @focus="errorStatus=0" @blur="checkPhone">
    </div>

    <div class="error">
      {{ errorTextMap[errorStatus] }}
    </div>

    <div class="button" :style="{opacity: isDisabled?'0.5':'1'}">
      <x-button type="primary"  @click.native="confirm">验证并绑定</x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'

export default {
  components: { XButton },
  data () {
    return {
      sid: '',
      originPhone: '',
      phone: '',
      errorStatus: 0,
      errorTextMap: ['', '输入有误，请检查。', '手机号码验证失败，请重新输入', '该微信号已绑定学号']
    }
  },
  computed: {
    isDisabled() {
      return !this.phone
    },
    sidFormated() {
      return this.sid.replace(/\d{10}/, '$&-').replace(/\d{6}/, '$&-')
    }
  },
  created () {
    this.sid = this.$route.params.sid
    this.originPhone = this.$route.params.phone
  },
  methods: {
    checkPhone() {
      if (!String(this.phone).match(/1[345789]\d{9}$/)) {
        this.errorStatus = 1
        return false
      }
      return true
    },
    confirm() {
      if (this.isDisabled) return
      if (!this.checkPhone()) return
      this.$api.user.bindChildren(this.sid, this.phone).then(res => {
        this.showSuccess('通过验证，绑定成功！')
        this.$router.push('/parent/user/info')
      }).catch((error) => {
        if (error.msg.match('ER_HAS_BIND_CHILDREN')) {
          this.errorStatus = 3
        } else {
          this.errorStatus = 2
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .phone-page{
    margin: 0 20px;
  }
  .title{
    text-align: center;
    margin-top: 10px;
    margin-bottom: 15px;
  }
  .sid{
    margin: 15px;
  }
  .promt{
    margin: 15px;
  }
  .input{
    margin: 15px;
    text-align: center;
    input{
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      -webkit-appearance: none;
    }
  }
  .error{
    margin-top: 10px;
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
