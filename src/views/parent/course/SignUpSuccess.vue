<template>
  <div>
    <msg :title="title" :description="description" :buttons="buttons" :icon="icon"></msg>
  </div>
</template>

<script>
import { Msg, Divider, XButton } from 'vux'

export default {
  components: {
    Msg,
    Divider,
    XButton
  },
  methods: {
    follow () {
      window.open('https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4MDQzNjI4MA==&scene=124#wechat_redirect')
    }
  },
  data () {
    return {
      title: '报名成功',
      description: '关注心迹教育',
      icon: 'success',
      buttons: [{
        type: 'primary',
        text: '关注公众号',
        onClick: this.follow.bind(this)
      }, {
        type: 'default',
        text: '管理课程',
        link: '/parent/course/manage'
      }]
    }
  }
}
</script>
