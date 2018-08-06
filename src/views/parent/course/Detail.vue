<template>
  <div class="course-detail">
    <TopCover :cover="course.cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name"></TopCover>

    <div class="courseinfo">
      <ModuleWrap :hideHeader="true">
        <div slot="body">
          <div class="info">
            <p class="flow">开课信息</p>
            <hr>
            <div class="info_item" v-for="item in infoList">
              <p>【{{ item[0] }}】</p>
              <p>{{ item[1] }}</p>
            </div>
          </div>
          <div class="content vHtml">
            <p class="flow">课程内容</p>
            <hr>
            <div v-html="material.desc"></div>
          </div>
          <div class="declare" v-if="course.userId==1">
            <p>※ 声明：</p>
            <p>本课程由心迹家庭成长社 家长教育研究实验室设计、研发，授权{{ course.channelName }}执行。</p>
          </div>
        </div>
      </ModuleWrap>
    </div>
  </div>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import TopCover from 'components/TopCover'
import StatModel from 'lanmaLib/modules/statistics'
import common from 'src/common'

export default {
  components: {
    TopCover,
    ModuleWrap
  },
  data () {
    return {
      buttonType: '',
      course: {
        count_data: {},
        material: {
          subject: '',
          labels: []
        },
        content: ''
      },
      material: {
        subject: ''
      },
      thirdPartyList: {}
    }
  },
  computed: {
    time() {
      try {
        var originTime = this.course.lesson_time || '2017-10-10'
        var a = originTime.split(/[^0-9]/)
        var time = new Date(a[0], a[1] - 1, a[2], a[3], a[4])
        var date = originTime.split(' ')[0]
        var timeStart = originTime.split(' ')[1].slice(0, 5)
        var duration = parseInt(this.course.duration) * 60 * 1000
        var minuteEnd = new Date(Date.parse(time) + duration).getMinutes()
        if (minuteEnd === 0) {
          minuteEnd = '00'
        }
        var hourEnd = new Date(Date.parse(time) + duration).getHours()
        var dayMap = ['（周日）', '（周一）', '（周二）', '（周三）', '（周四）', '（周五）', '（周六）']
        var dayNumber = new Date(time).getDay()
        return date + dayMap[dayNumber] + timeStart + '-' + hourEnd + ':' + minuteEnd
      } catch (error) {
        return ''
      }
    },
    infoList() {
      return [
        ['课程', this.course.title],
        ['机构', this.course.thirdPartyName],
        ['时间', this.time],
        ['地址', this.backCourseSite(this.course.channelName, this.course.lesson_location)]
      ]
    }
  },
  created () {
    this.$user.hasChildren(this)
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    var statId = common.getShareParamter('statId')
    if (statId && id && this.$route.path.indexOf('report') === -1) {
      StatModel.activityAddStat(statId, id)
    }
    this.$axios.all([this.getThirdPartyList()])
      .then(() => {
        this.$api.course.getDetail(id).then((course) => {
          course = this.$course.formatCourse(course)
          this.course = course
          this.course.thirdPartyName = this.thirdPartyList[course.userId].name
          this.material = course.material
        })
      })
  },
  methods: {
    signUp () {
      this.$router.push('/parent/course/sign_up/' + this.course.id)
    },
    backCourseSite (channelName, location) {
      var temp
      if (!channelName) {
        return location
      }
      try {
        temp = '心迹家庭成长社·' + channelName + '校区（' + location + '）'
      } catch (e) {
        temp = location
        console.log(e)
      }
      return temp
    },
    getThirdPartyList () {
      var params = {
        offset: 0,
        length: 0
      }
      return this.$api.thirdParty.getThirdPartyList(params)
        .then((data) => {
          var temp = {}
          for (var i = 0; i < data.list.length; i++) {
            temp[data.list[i].user_id] = data.list[i]
          }
          this.thirdPartyList = temp
        })
    }
//  editTime (time) {
//    if (!time) {
//      return
//    }
//    console.log(time)
//    var d = new Date(time)
//    var week = d.getDay()
//    var weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
//    var temp = time.split(' ')
//    return temp[0] + '（' + weekMap[week] + '）' + temp[1].substring(0, 5)
//  }
  }
}
</script>

<style scoped lang="scss">
.courseinfo{
  margin-top: -25px;
  span{
    margin-right: 10px;
  }
}
.flow {
  font-family: helvetica;
  color: #00a6ac;
  font-size: 17px;
  text-align: center;
  font-weight: bold;
}
hr {
  opacity: 0.3;
  margin: 15px 0;
}
.course-detail{
  margin-bottom: 60px;
  font-size: 16px;
}
.info_item{
  margin-bottom: 10px;
}
.content{
  width:100%;
  margin-top: 30px;
}
.content{
  width:100%;
}
.declare{
  margin-top: 30px;
  color: #ccc;
}
</style>
