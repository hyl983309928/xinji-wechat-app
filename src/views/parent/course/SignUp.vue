<template>
  <div class="sign-up-page">
    <CourseItem :course="course" :linkDisabel="true"></CourseItem>
    <div class="cl-module">
      <div class="cl-m-header">
        报名基本信息
      </div>
      <div class="cl-m-body">
        <x-input placeholder="请输入您的联系方式" class="textarea" v-model="phone"></x-input>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-body">
        <div class="explain" v-if="course.channel_id !== 0">
          免费申请报名后等待联系确认，被成功确认后将获得免费参与课程的权利
        </div>
        <div class="explain" v-else>
          点击报名生成订单，支付完成即可成功报名
        </div>
      </div>
    </div>
    <button class="page-submit-btn" @click="sign">报名</button>
  </div>
</template>

<script>
import CourseItem from 'components/CourseItem'

import { XInput } from 'vux'

export default {
  components: {
    CourseItem,
    XInput
  },
  data () {
    return {
      course: {
        count_data: {},
        material: {
          labels: []
        }
      },
      material: {},
      signInfo: {},
      channelId: 0,
      phone: ''
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    var channelId = parseInt(this.$route.params.channelId)
    if (isNaN(channelId) || channelId < 0) {
      channelId = 0
    }
    this.id = id
    this.channelId = channelId

    this.$api.course.find(id)
        .then((course) => {
          course = this.$course.formatCourse(course)
          this.course = course
          this.material = course.material
        })
    this.$api.course.signInfo(id)
        .then((signInfo) => {
          if (signInfo) {
            this.signInfo = signInfo
          }
        })
  },
  methods: {
    sign () {
      if (this.phone === '') {
        this.$vux.toast.show({
          text: '请输入联系方式',
          type: 'warn'
        })
        return
      }
      // var res = this.phone.match(/1[3578]\d{9}/)
      // console.log(res)
      if (!this.phone.match(/1[3578]\d{9}/)) {
        this.$vux.toast.show({
          text: '请输入正确的手机号',
          type: 'warn'
        })
        return
      }
      this.$api.course.sign(this.course.id, this.phone)
          .then((order) => {
            // this.$vux.toast.show({
            //   text: '报名成功',
            //   type: 'success'
            // })
            if (order.channel_id) {
              this.$router.push('/parent/course/sign_up_success')
            } else {
              window.location.href = 'http://wx.xinjijiaoyu.com/#/parent/course/pay/' + order.id
              // this.$router.push('/parent/course/pay/' + order.id)
            }
          }).catch((error) => {
            this.$vux.toast.show({
              text: error.message,
              type: 'warn'
            })
          })
    }
  }
}
</script>

<style scoped>
.sign-up-page{
  margin-bottom: 60px;
}
.explain{
  color:#323b46;
}
.textarea{
  height: auto;
}
.sign{
  margin-left: 60%;
}
.apply{
  height: 50px;
  line-height: 50px;
}
.weui_icon.weui_icon_warn::before{
  display: none;
}
</style>
