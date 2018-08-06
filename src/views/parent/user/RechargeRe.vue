<template>
  <div class="wrap" v-if="show">
    <div class="alert_info">
      <icon type="success" is-msg></icon>
      <p>充值成功</p>
    </div>
    <div class="liscence" :class="[isSubscribe ? 'hasmargin' : '']">
      <p class="attention">特别提醒</p>
      <p>请关注 心迹教育 公众号，查看账户余额↓</p>
      <div class="wrap-img">
        <img src="/static/img/qrcode.png" alt="" v-if="!isSubscribe">
      </div>
      <p class="title">心迹教育</p>
      <p class="content">LazyMom © 2017-2018 xinjijiaoyu.com</p>
    </div>
  </div>
</template>

<script>
import { Loading, XButton, Icon } from 'vux'
// import Vue from 'vue'

export default {
  components: {
    XButton,
    Icon,
    Loading
  },
  created () {
    this.showLoading()
  },
  methods: {
    showLoading () {
      this.$vux.loading.show({
        text: '支付结果确认中...'
      })
      setTimeout(() => {
        this.typeControl()
      }, 2000)
    },
    typeControl () {
      this.$api.user.isSubscribe().then(res => {
        this.isSubscribe = res
        if (res) {
          this.showSuccess('充值成功')
          this.$router.push('/parent/user/account')
        }
        this.$vux.loading.hide()
        this.show = true
      })
    },
    follow () {
      window.open('https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4MDQzNjI4MA==&scene=124#wechat_redirect')
    }
  },
  data () {
    return {
      show: false,
      isSubscribe: true,
      typeText: '充值',
      icon: 'success',
      buttons: [{
        type: 'primary',
        text: '管理课程',
        link: '/parent/course/manage/7'
        // onClick: this.follow.bind(this)
      }
      // , {
      //   type: 'default',
      //   text: '我的账户',
      //   link: '/parent/course/manage'
      // }
      ]
    }
  },
  computed: {},
  watch: {
    '$route' (to, from) {
      this.showLoading()
    }
  }
}
</script>
<style scoped lang='scss'>
  .alert_info{
    text-align: center;
    border-bottom: 1px solid #ccc;
    padding: 20px;
    p{
      margin-top: 20px;
      font-size: 22px;
    }
  }
  .wrap{
    background-color: #fff;
    height: 100%;
    padding: 0 20px
  }
  .liscence{
    background-color: #fff;
    padding-bottom: 13px;
    text-align: center;
    .attention{
      margin-top: 20px;
      margin-bottom: 10px;
      color: #33cccc;
      font-size: 22px;
      font-weight: bold;
    }
    .wrap-img{
      height: 19rem;
    }
    .title{
      color: #576b95;
    }
    .content{
      font-size: 10px;
      color: #b2b2b2;
    }
    img{
      width: 100%;
    }
  }
  .hasmargin{
    margin-top: -40px;
  }
</style>
