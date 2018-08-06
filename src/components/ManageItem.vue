<template>
  <div class="manage-item">
    <div :class="'cl-module c-detail-info type-' + tab">
      <div class="cl-m-body">
        <div class="apply-detail">
          <div class="course-num">{{ course.number }}</div>
          <div class="course-title">
            {{ course.title }}
          </div>
          <ul class="label-list">
            <li>{{ course.ageLabel }}</li>
            <li>{{ course.themeLabel }}</li>
            <li>{{ course.targetLabel }}</li>
            <li>{{ course.sceneLabel }}</li>
          </ul>
          <!--<div class="clear field-con">-->
            <!--<span class="label">报名时间</span>
            <span class="info">{{ course.sign_up_time }}</span>-->
            <!--<div class="right-field">
              <span class="label">价格</span>
              <span class="info">{{ course.price }}</span>
            </div>-->
          <!--</div>-->
          <div class="field-con clear">
            <span class="label">上课机构</span>
            <span class="info">{{ course.thirdPartyName }}</span>
          </div>
          <div class="clear field-con">
            <span class="label">上课时间</span>
            <span class="info">{{course.materialType==2? TimeModel.editStTime(course.lesson_time,course.lesson_time_end):TimeModel.editTime(course.lesson_time, course.duration)}}</span>
            <!--<div class="right-field">
              <span class="label">分成</span>
              <span class="info">{{ course.divide_rate }}</span>
            </div>-->
          </div>
          <div class="field-con">
            <span class="label">上课地点</span>
            <span class="info">{{ course.lesson_location }}</span>
          </div>
        </div>
        <div class="sign">
          <flexbox v-if="tab === 1">
            <flexbox-item class="manage-wrap">
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/qrcode/' + course.id">
                <span class="manage-btn">签到码</span>
              </router-link>
            </flexbox-item>
            <flexbox-item class="manage-wrap" @click.native="classBegin(course.id, '/agency' + (course.materialType=='2'?'_tour':'') + '/course_intro/' + course.id)">
              <span class="manage-btn">开始上课</span>
            </flexbox-item>
            <flexbox-item class="manage-wrap">
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/preview/' + course.id">
                <span class="manage-btn">预览课程</span>
              </router-link>
            </flexbox-item>
          </flexbox>
          <flexbox class="btn-list" v-if="tab === 2">
            <flexbox-item class="manage-wrap">
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/qrcode/' + course.id">
                <span class="manage-btn">签到码</span>
              </router-link>
            </flexbox-item>
            <flexbox-item class="manage-wrap" @click.native="classBegin(course.id, '/agency' + (course.materialType=='2'?'_tour':'') + '/course_intro/' + course.id)">
              <span class="manage-btn">继续上课</span>
            </flexbox-item>
            <flexbox-item class="manage-wrap">
              <!--<router-link :to="'/agency/preview/' + course.material_id">-->
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/preview/' + course.id">
                <span class="manage-btn">预览课程</span>
              </router-link>
            </flexbox-item>
          </flexbox>
          <flexbox class="btn-list" v-if="tab === 3">
            <flexbox-item class="manage-wrap">
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/preview/' + course.id">
                <span class="manage-btn">查看回顾</span>
              </router-link>
            </flexbox-item>
            <flexbox-item class="manage-wrap">
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/comment/' + course.id">
                <span class="manage-btn">写点评</span>
              </router-link>
            </flexbox-item>
          </flexbox>
          <flexbox class="btn-list" v-if="tab === 4">
            <flexbox-item class="manage-wrap">
              <router-link :to="'/agency' + (course.materialType=='2'?'_tour':'') + '/preview/' + course.id">
                <span class="manage-btn">查看回顾</span>
              </router-link>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="confirm-btn" @click="confirm(course.id)" v-if="tab === 5">
          确认
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import TimeModel from 'lanmaLib/time'
export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      TimeModel
    }
  },
  props: {
    course: {},
    tab: {
      type: Number,
      default: false
    },
    confirmCallback: {
      type: Function
    }
  },
  methods: {
    confirm (id) {
      this.$api.course.confirm(id)
        .then(() => {
          this.confirmCallback()
        })
        .catch((e) => {
          this.$vux.toast.show({
            text: e.message,
            type: 'warn'
          })
        })
    },
    jumpToSign (id) {
      this.$router.push('/agency/user/' + id)
    },
    classBegin (id, url) {
      if (!url.match('_tour')) {
        // this.$router.push(url)
        this.courseStart('agency')
      } else {
        this.courseStart('agency_tour')
      }
    },
    courseStart(routerName) {
      if (this.course.status >= 8) {
        if (routerName === 'agency_tour') {
          var courseExtra = JSON.parse(this.course.courseExtra)
          var coursePushState = courseExtra.coursePushState
          if (coursePushState) {
            var temp = 0
            for (var i = 0; i < coursePushState.length; i++) {
              if (parseInt(coursePushState[i]) === 1) {
                temp++
              }
            }
            this.$router.push('/' + routerName + '/course_control/' + this.course.id + '/' + temp)
          } else {
            this.$router.push('/' + routerName + '/course_control/' + this.course.id + '/0')
          }
        } else {
          this.$router.push('/' + routerName + '/course_control/' + this.course.id + '/0')
        }
        return
      }
      var _this = this
      var a = this.course.lesson_time.split(/[^0-9]/)
      var time = new Date(a[0], a[1] - 1, a[2], a[3], a[4])
      var remain = time - new Date()
      var apiName = String(this.course.labelScene) === '62' ? 'course' : 'courseTour'
      if (remain < 3600000) {
        this.$vux.confirm.show({
          title: '确认开始上课？',
          content: this.$t('点击确认，家长将收到开课提醒，正式进入上课流程。<br><br>确认开始上课？'),
          confirmText: '确认开始',
          onConfirm () {
            _this.$api[apiName].classBegin(_this.course.id).then((res) => {
              var url = '/' + routerName + '/course_control/' + _this.course.id + '/0'
              _this.$router.push(url)
            }).catch((e) => {
              _this.$vux.toast.show({
                text: e.message,
                type: 'warn'
              })
            })
          }
        })
      } else {
        this.$vux.alert.show({
          title: '还没到上课时间哟',
          content: this.$t('距离预定上课时间还有很久，请耐心等待。如有问题，请联系工作人员。')
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.manage-item{
  font-size: 13px;
  color: #6c7b8a;
}
.course-title{
  font-size: 17px;
  color:#353535;
  line-height: 24px;
  font-weight: 300;
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

/*div.c-detail-info{
  background-color: #00a6ac;
}*/
/*.manage-item .type-4{
  background-color:#c8d2dc;
}
.manage-item .type-3{
  background-color:#323b46;
}*/
.apply-detail{
  padding-bottom: 20px;
  border-bottom: 1px solid #efeff4;
}
.cl-m-body {
  margin-left: 6px;
  padding-left: 14px;
  background-color: #fff;
  padding-bottom: 0;
  .field-con {
    margin-top: 5px;
    .info{
      color:#323b46;
    }
    .label {
      margin-right: 10px;
    }
    .right-field{
      position: absolute;
      right:0px;
      top: 0px;
      span{
        display: inline-block;
        float: left;
      }
      .info{
        width:50px;
        overflow: hidden;
        text-align: right;
      }
    }
  }
}
.sign {
  margin: 20px 0;
}
.manage-wrap{
  border-right: 1px solid #ccc;
  text-align: center;
  box-sizing: border-box;
  margin-left: 0px !important;
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
.confirm-btn {
    text-align: center;
    margin-top: 20px;
    color: #00a6ac;
}
</style>
