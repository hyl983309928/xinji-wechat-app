<template>
  <div>

    <ModuleWrap>
      <span slot="header">家长姓名</span>
      <div slot="body">
        <input type="text" class="input" placeholder="请输入家长姓名" v-model="name">
      </div>
    </ModuleWrap>

    <ModuleWrap>
      <span slot="header">家长手机</span>
      <div slot="body">
        <input type="text" class="input" placeholder="请输入家长手机号码" v-model="phone">
      </div>
    </ModuleWrap>

    <div class="text">
      提交后将生成签收二维码，请邀请家长打开微信扫一扫，即可签收对应的课程到家长账户当中。
    </div>

    <FooterButton :text="'提交'" @click.native="commit"></FooterButton>
  </div>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import FooterButton from 'components/FooterButton'
export default {
  components: {
    ModuleWrap,
    FooterButton
  },
  data () {
    return {
      id: '',
      name: '',
      phone: ''
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
  },
  methods: {
    getCourseDetail (id) {
      this.$api.course.getDetail(id).then((course) => {
        this.course = course
      })
    },
    checkInput () {
      if (this.name === '') {
        this.$vux.toast.show({
          text: '请输入家长姓名',
          type: 'warn'
        })
        return false
      }
      if (this.phone === '') {
        this.$vux.toast.show({
          text: '请输入家长手机号码',
          type: 'warn'
        })
        return false
      }
      if (!this.phone.match(/1[345789]\d{9}$/)) {
        this.$vux.toast.show({
          text: '请输入正确的手机号码',
          type: 'warn'
        })
        return false
      }
      return true
    },
    commit() {
      if (this.checkInput()) {
        this.$api.seller.createOrder(this.id, this.name, this.phone).then(res => {
          this.$router.push(`/seller/sign_up/${res.orderId}`)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.input {
  width: 90%;
  border: 1px solid #efeff4;
  -webkit-appearance: none;
  padding: 0.6875rem 0.9375rem;
  font-size: 0.8125rem;
}
.text {
  padding: 30px 45px;
  font-size: 13px;
  font-weight: 300;
  text-align: center;
  color: #6c7b8a;
}
</style>
