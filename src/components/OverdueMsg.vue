<template>
  <div>
    <msg :title="title" :description="desc" :buttons="buttons" :icon="icon"></msg>
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
  // props: ['title', 'description', 'buttons', 'icon'],
  methods: {
    changeIcon () {
      if (!this.icon || this.icon === 'success') {
        this.icon = 'warn'
        return
      }
      if (this.icon === 'warn') {
        this.icon = 'info'
        return
      }
      if (this.icon === 'info') {
        this.icon = 'waiting'
        return
      }
      if (this.icon === 'waiting') {
        this.icon = 'success'
      }
    },
    close () {
      this.$wechat.closeWindow()
    }
  },
  data () {
    return {
      description: 'msg description',
      icon: 'warn',
      title: '任务已过期',
      desc: '当前任务已失效过期',
      buttons: [{
        type: 'primary',
        text: '确定',
        onClick: this.close
      }]
      // , {
      //   type: 'default',
      //   text: 'secondary button',
      //   link: '/demo'
      // }
    }
  }
}
</script>