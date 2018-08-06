<template>
  <div class="sid-page" v-if="show">
    <div class="money">
      <div class="number">¥ {{ rechargeNumber }}</div>
      <span>账户总额</span>
      <div class="btn_recharge" @click="gotoRecharge">
        <span>我要充值</span>
      </div>
    </div>
    <div class="charge">
      <div @click="goto('/parent/user/log/recharge')">
        <img src="/static/img/recharge/recharge.png" alt="">充值记录
      </div>
      <div @click="goto('/parent/user/log/consume')">
        <img src="/static/img/recharge/charge.png" alt="">消费记录
      </div>
    </div>
    <div class="kf-wrap">
      <div class="kf" @click="goto('/parent/user/contact_kf')">
        <img src="/static/img/recharge/service.png" alt="">
        联系客服
      </div>
    </div>
  </div>
</template>

<script>
import { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'

export default {
  components: { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch },
  data () {
    return {
      show: false,
      rechargeNumber: 0
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  computed: {},
  created () {
    this.init()
  },
  methods: {
    init() {
      this.getcharge()
    },
    getcharge () {
      this.$api.user.recharge.getRemainder().then(res => {
        this.rechargeNumber = Number(res.balance) / 100
        this.show = true
      })
    },
    goto(link) {
      this.$router.push(link)
    },
    gotoRecharge() {
      window.location.href = './?#/parent/user/recharge'
      // this.$router.push('/parent/user/recharge')
    }
  }
}
</script>

<style scoped lang="scss">
  .money{
    text-align: center;
    background-color: #40E0D0;
    color: #fff;
    .number{
      padding-top: 38px;
      font-size: 40px;
      margin-bottom: -10px;
    }
    .btn_recharge{
      padding: 25px 0 17px 0;
      /* opacity: 0.7; */
      span{
        font-size: 17px;
        padding: 6px 25px;
        border: 2px solid rgba(255,255,255,1);
        background: #2AD4C3;
        border-radius: 50px;
      }
    }
  }
  .charge{
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    div{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      padding: 20px 0;
      margin: 10px 0;
      img{
        margin-right: 20px;
        width: 20px;
        height: 16px;
      }
    }
    div:nth-of-type(1){
      border-right: 1px solid #eee;
    }
  }
  .kf-wrap{
    position: fixed;
    bottom: 0.9rem;
    left: 0;
    right: 0;
    .kf{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 9rem;
      height: 2.1rem;
      margin: 0 auto;
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 50px;
      img{
        width: 1.18rem;
        margin-right: 1.2rem;
      }
    }
  }
</style>
