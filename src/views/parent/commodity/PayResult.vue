<template>
  <div class="wrap" v-if="show">
    <!--<msg :title="title" :description="description" :icon="icon"></msg>-->
    <msg :title="title" :description="description" :buttons="buttons" :icon="icon" v-if="type"></msg>
    <!--<msg :title="title" :description="description[type]" :buttons="type=='subscribe'?buttons:''" :icon="icon"></msg>-->
    <div class="liscence" :class="[isSubscribe ? 'hasmargin' : '']">
      <div class="wrap-img">
        <img src="/static/img/qrcode.png" alt="" v-if="!isSubscribe">
      </div>
      <p class="title">心迹家庭成长社</p>
      <p class="content">XINJI © 2016-2017 xinjijiaoyu.com</p>
    </div>
  </div>
</template>

<script>
import { Loading, Msg, Divider, XButton } from 'vux'
// import Vue from 'vue'

export default {
  components: {
    Msg,
    Divider,
    XButton,
    Loading
  },
  created () {
    this.type = this.$route.params.type
    if (this.type === 'free') {
      this.typeText = '领取'
      this.typeControl()
    } else if (this.type === 'pay') {
      this.typeText = '支付'
      this.showLoading()
    }
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
        if (!res) {
          this.buttons = [{}]
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
      typeText: '支付',
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
  computed: {
    title () {
      return this.typeText + '成功'
    },
    description () {
      return this.isSubscribe ? `您已经成功${this.typeText}了心迹家庭成长社课程` : '请关注 心迹教育公众号进入课程'
    }
  },
  watch: {
    '$route' (to, from) {
      this.typeControl()
    }
  }
}
</script>
<style scoped lang='scss'>
  .wrap{
    background-color: #fff;
    height: 100%;
  }
  .liscence{
    background-color: #fff;
    padding-bottom: 13px;
    text-align: center;
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
