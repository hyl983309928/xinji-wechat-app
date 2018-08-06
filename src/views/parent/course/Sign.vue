<template>
  <div class="study-page">
    <msg :title="title" :description="description" :buttons="buttons" :icon="icon" v-if="signed"></msg>
  </div>
</template>

<script>
import {
  Msg,
  Tabbar,
  Cell,
  Group,
  Badge
} from 'vux'
// const version = require('../package.json').version
export default {
  components: {
    Msg,
    Tabbar,
    Cell,
    Group,
    Badge
  },
  data () {
    return {
      id: 0,
      signed: false,
      title: '签到成功',
      description: '点击开始上课开启课程资料',
      icon: 'success',
      buttons: [{
        type: 'primary',
        text: '开始上课',
        onClick: this.startClass.bind(this)
      }, {
        type: 'default',
        text: '进入学院',
        link: '/parent/home'
      }]
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.signIn()
  },
  methods: {
    startClass () {
      this.$router.push('/parent/course/course_material/' + this.id)
    },
    signIn () {
      this.$api.course.signIn(this.id).then(() => {
        this.signed = true
      }).catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn',
          time: 60000
        })
        if (e.code === 3011) {
          this.signed = true
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ensure{
  background: #09bb07;
}
.weui_text_area,.weui_icon_area{
  text-align: center;
  margin-top: 50px;
}
.weui_msg_desc{
  color: #888888;
}
.link-list span{
  margin-bottom: 15px;
}
.bottom{
  text-align: center;
  margin-top: 180px;
  p:nth-child(odd){
    color:#576b95;
  }
  p:nth-child(even){
    color:#b2b2b2;
  }
}
</style>
