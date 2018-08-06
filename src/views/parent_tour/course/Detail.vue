<template>
  <div class="course-detail">
    <TopCover :cover="course.cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name"></TopCover>

    <div class="courseinfo">
      <ModuleWrap :hideHeader="true">
        <div slot="body">
          <div class="info">
            <p class="flow">基本信息</p>
            <hr>
            <div class="info_item" v-for="item in infoList">
              <p>【{{ item[0] }}】</p>
              <p>{{ item[1] }}</p>
            </div>
          </div>
          <div class="content vHtml">
            <p class="flow">游学营内容</p>
            <hr>
            <div v-html="material.desc"></div>
          </div>
          <div class="declare" v-if="course.userId==1">
            <p>※ 声明：</p>
            <p>本课程由心迹家庭成长社 家长教育研究实验室设计、研发。</p>
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
      }
    }
  },
  computed: {
    time() {
      try {
        var timeLabel = this.course.lesson_time + ' 至 ' + this.course.lesson_time_end
        return timeLabel
//      var originTime = this.course.lesson_time || '2017-10-10'
//      var a = originTime.split(/[^0-9]/)
//      var time = new Date(a[0], a[1] - 1, a[2], a[3], a[4])
//      var date = originTime.split(' ')[0]
//      var timeStart = originTime.split(' ')[1].slice(0, 5)
//      var minuteEnd = new Date(Date.parse(time) + 7200000).getMinutes()
//      if (minuteEnd === 0) {
//        minuteEnd = '00'
//      }
//      var hourEnd = new Date(Date.parse(time) + 7200000).getHours()
//      var dayMap = ['（周日）', '（周一）', '（周二）', '（周三）', '（周四）', '（周五）', '（周六）']
//      var dayNumber = new Date(time).getDay()
//      return date + dayMap[dayNumber] + timeStart + '-' + hourEnd + ':' + minuteEnd
      } catch (error) {
        return ''
      }
    },
    infoList() {
      return [
        ['主题', this.course.title],
        ['机构', this.course.thirdPartyName],
        ['时间', this.countTimeLabel(this.course.lesson_time, this.course.lesson_time_end)],
        ['目的地', this.course.lesson_location]
      ]
    }
  },
  created () {
    this.$user.hasChildren(this)
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    var statId = common.getShareParamter('statId')
    if (statId && id && this.$route.path.indexOf('report') === -1) {
      StatModel.activityAddStat(statId, id)
    }
    this.id = id
    this.$axios.all([this.getThirdPartyList()])
      .then(() => {
        this.$api.courseTour.getDetail(id).then((course) => {
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
    countTimeLabel (sTime, eTime) {
      if (!sTime || !eTime) {
        return
      }
      return sTime.substring(0, 16) + ' 至 ' + eTime.substring(0, 16)
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
  margin-top: 30px;
}
.declare{
  margin-top: 30px;
  color: #ccc;
}
</style>
