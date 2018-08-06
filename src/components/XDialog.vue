<template>
  <div>
    <x-dialog v-model="show" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', 'background-color': 'transparent'}">
      <div class="wrap">
        <h3>温馨提示</h3>
        <p>为了给您和孩子提供真正实用的个性化服务，请先领取学号，完善孩子的小档案。</p>
        <x-button type="primary" class="button" @click.native="getSid">领取学号，完善资料</x-button>
        <x-button type="primary" class="button" @click.native="bindSid">已有学号，立即绑定</x-button>
        <x-button type="primary" class="button disabled" @click.native="noNeed">暂不需要</x-button>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import { XDialog, XButton } from 'vux'
export default {
  components: {
    XDialog,
    XButton
  },
  props: {},
  data () {
    return {
      show: false
    }
  },
  created () {},
  computed: {},
  methods: {
    getSid() {
      this.show = false
      this.$api.user.createChildren().then(res => {
        window.location.hash = '/parent/user/info/create'
      }).catch(error => {
        console.log(error)
        this.showError('创建学号失败')
      })
    },
    bindSid() {
      this.show = false
      window.location.hash = '/parent/user/bind_sid'
    },
    noNeed() {
      this.show = false
      if (window.location.hash.match('#/parent/user/info')) {
        this.$wechat.closeWindow()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  margin: 0 50px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  h3{
    font-weight: 100;
    margin-bottom: 20px;
  }
  p{
    margin-bottom: 20px;
    font-size: 14px;
  }
  .button{
    margin: 0 auto;
    border-radius: 20px;
    width: 170px;
    margin-top: 10px;
    font-size: 14px;
    background: #4bd3e7;
  }
  .disabled{
    background-color: #ccc;
  }
}
</style>
