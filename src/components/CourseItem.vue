<template>
  <div v-if="showCourse">
    <TopCover @click.native="courseClick" :cover="course.cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name"></TopCover>
    <div class="cl-module c-detail-info">
      <div class="cl-m-body">
        <div :class="[ tab==9 ? 'hasborder':'' , 'applydetail']"  @click="courseClick">
          <p>
            <span>上课机构</span>
            <span>{{course.thirdPartyName}}</span>
          </p>
          <p>
            <span>上课时间</span>
            <span>{{course.materialType==2? timeModel.editStTime(course.lesson_time,course.lesson_time_end):timeModel.editTime(course.lesson_time,course.duration)}}</span>
          </p>
          <p>
            <span>上课地点</span>
            <span>{{course.materialType==2?course.lesson_location:backCourseSite(course.channelName,course.lesson_location) }}</span>
          </p>
          <div class="course-btn" v-if="course.order_id">
            <div v-if="course.order_status === 0">
              <span class="order-btn" v-if="course.channel_id === 0" @click.stop="pay">支付</span>
              <span v-else>待确认</span>
            </div>
            <div v-if="course.order_status === 1">
              <span class="order-btn" @click.stop="giveUp">放弃</span>
            </div>
            <div v-if="course.order_status === 5">
              <span class="order-btn" @click.stop="openCourse">打开</span>
            </div>
          </div>
        </div>
        <div class="sign" v-if="tab==9">
          <flexbox>
            <flexbox-item class="manage-wrap" v-if="course.showHomework">
              <router-link :to="'/parent/course' + (course.materialType=='2'?'_tour':'') + '/homework/' + course.id">
                <span class="manage-btn">课后作业</span>
              </router-link>
            </flexbox-item>
            <flexbox-item class="manage-wrap">
              <!--<router-link :to="'/agency/preview/' + course.material_id">-->
              <router-link :to="'/parent/course' + (course.materialType=='2'?'_tour':'') + '/report/detail/' + course.id">
                <span class="manage-btn">查看报告</span>
              </router-link>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import TopCover from 'components/TopCover'
import timeModel from 'lanmaLib/time'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    TopCover
  },
  data () {
    return {
      showCourse: true,
      timeModel
    }
  },
  props: {
    course: {},
    linkDisabel: {
      default: false
    },
    tab: ''
  },
  computed: {
    orderTitle () {
      var result = ''
      if (this.course.order_status === 0) {
        result = this.course.channel_id > 0 ? '未确认' : '未支付'
      } else if (this.course.order_status === 0) {
        result = this.course.channel_id > 0 ? '已确认' : '已支付'
      } else {
        result = this.$config.status.order[this.course.order_status]
      }
      return result
    }
  },
  methods: {
    courseClick () {
      if (this.linkDisabel) {
        return
      }
      if (String(this.course.courseStatus) === '9') {
        this.$router.push('/parent/course' + (String(this.course.materialType) === '2' ? '_tour' : '') + '/report/detail/' + this.course.id)
      } else {
        console.log('courseClick')
        var url = this.course.link
        this.$router.push(url)
      }
    },
    pay () {
      window.location.href = 'http://wx.xinjijiaoyu.com/#/parent/course/pay/' + this.course.order_id
      // this.$router.push('/parent/course/pay/' + this.course.order_id)
    },
    giveUp () {
      this.showConfirm('确定放弃课程吗？', () => {
        this.$api.order.giveUp(this.course.order_id).then(() => {
          this.showSuccess('操作成功')
          // this.$router.push('/parent/course/manage/2')
          this.showCourse = false
        }).catch((e) => {
          this.showError(e.message)
        })
      })
    },
    openCourse () {
      // 开始上课
      if (this.course.status < 9) {
        this.$router.push('/parent/course/course_material/' + this.course.id)
      } else {
        this.$router.push('/parent/course/after_class/' + this.course.id)
      }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hasborder {
  padding-bottom: 20px;
  border-bottom: 1px solid #efeff4;
}

.sign {
  margin-top: 20px;
}

.manage-wrap{
  border-right: 1px solid #ccc;
  text-align: center;
}
.manage-wrap:last-of-type{
  border: 0;
}
.manage-btn{
  font-size: 17px;
  font-weight: bold;
  height: 17px;
  line-height: 17px;
  text-align: center;
  width: 60px;
  color: #00a6ac;
}

li {
    list-style: none;
}
.label-list li {
    float: left;
    color: #00a6ac;
    margin-right: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
}

div.c-detail-info{
  margin-top: -15px;
  background-color: #00a6ac;
}
.cl-m-body {
  padding-left: 21px;
  background-color: #fff;
  font-size: 13px;
  padding-top: 25px;
  .apply-detail {
    width: 250px;
  }
  p {
      margin: 5px 0 0 0;
      span {
          margin-right: 10px;
      }
      span:nth-child(odd) {
          color: #6c7b8a;
      }
      span:nth-child(even) {
          color: #323b46;
      }
  }
}
.applydetail{
  position: relative;
}
.course-btn{
  background-color: #00a6ac;
  position: absolute;
  width: 64px;
  right: -74px;
  top: -15px;
  height: 120px;

}
.course-btn span{
  display: inline-block;
  text-align: center;
  color: #fff;
  width: 20px;
  color: #fff;
  font-size: 17px;
  margin: 10px 0 0 20px;
}
.course-btn .order-btn{
  /*box-shadow: 0 -1px 2px 0 #60c9cf;*/
  /*border-radius: 50px;*/
}
</style>
