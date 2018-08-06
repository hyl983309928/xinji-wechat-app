<template>
  <div class="course-detail">
    <CourseItem :course="course" :linkDisabel="true"></CourseItem>
    <div class="cl-module">
      <div class="cl-m-header">
        课程目标
      </div>
      <div class="cl-m-body">
        {{ material.subject }}
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        费用说明
      </div>
      <div class="cl-m-body">
        {{ course.content }}
      </div>
    </div>

    <button class="page-submit-btn" v-if="signInfo.id === undefined && course.count_data.sign_up_num < course.total" @click="signUp">报名</button>
    <button class="page-submit-btn" v-else @click="share">分享</button>

  </div>
</template>

<script>
import CourseItem from 'components/CourseItem'

export default {
  components: {
    CourseItem
  },
  data () {
    return {
      buttonType: '',
      course: {
        count_data: {},
        material: {
          labels: []
        }
      },
      material: {},
      signInfo: {}
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.course.find(id)
        .then((course) => {
          course = this.$course.formatCourse(course)
          this.course = course
          this.material = course.material
          this.setShare()
        })
    this.$api.course.signInfo(id)
        .then((signInfo) => {
          if (signInfo) {
            this.signInfo = signInfo
          }
        })
  },
  methods: {
    signUp () {
      this.$router.push('/parent/course/sign_up/' + this.course.id)
    },
    share () {
      this.$vux.toast.show({
        text: '请点击微信右上角分享按钮进行分享',
        type: 'text'
      })
    },
    setShare () {
      var option = {
        title: this.course.title,
        desc: 'from心迹家庭成长社',
        link: 'http://wx.xinjijiaoyu.com/#/parent/course/detail/' + this.course.id,
        imgUrl: this.material.cover
      }
      this.$wechat.onMenuShareAppMessage(option)
      this.$wechat.onMenuShareTimeline(option)
    }
  }
}
</script>

<style scoped lang="scss">
.course-detail{
  margin-bottom: 60px;
}
</style>
