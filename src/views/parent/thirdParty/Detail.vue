<template>
  <div class="course-detail">
    <TopCover :cover="course.cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name"></TopCover>

<!--    <courseListCollapse :courseList="courseList"></courseListCollapse>-->

    <div class="courseinfo">
      <ModuleWrap :hideHeader="true" :border="'right'">
        <div slot="body">
          <p>
            <span class="left">上课机构</span>
            <span class="right" v-if="course.userId">{{thirdPartyList[course.userId].name}}</span>
          </p>
          <p>
            <span class="left">上课时间</span>
            <span class="right">{{course.materialType==2? TimeModel.editStTime(course.lesson_time,course.lesson_time_end):TimeModel.editTime(course.lesson_time, course.duration)}}</span>
          </p>
          <p>
            <span class="left">上课地点</span>
            <span class="right">{{course.lesson_location}}</span>
          </p>
        </div>
      </ModuleWrap>
    </div>

    <ModuleWrap>
      <span slot="header">课程简介</span>
      <div slot="body" class="public" v-if="course.content" v-html="course.content.replace(/\n/g, '<br />')"></div>
      <div slot="body" class="public" v-if="course.groupDesc" v-html="course.groupDesc.replace(/\n/g, '<br />')"></div>
    </ModuleWrap>

    <!--<ModuleWrap>
      <span slot="header">基本信息</span>
      <div slot="body" class="public">
        <div class="wrap">
          <input class="info-input" type="text" v-model="name" placeholder="请输入您的姓名">
        </div>
        <div>
          <input class="info-input" type="text" v-model="phone" placeholder="请输入您的联系方式">
        </div>
      </div>
    </ModuleWrap>-->

    <div style="padding: 20px;"></div>
    <div class="footer">
      <span class="commit disabledBtn" v-if="course.status >= 9">
        课程已结束
      </span>
      <span class="commit disabledBtn" v-else-if="course.lesson_time && isStartCourse()">
      已开课，停止报名
      </span>
      <span class="commit disabledBtn" v-else-if="isSignUpNumMax">
      已满员，停止报名
      </span>
      <span class="commit disabledBtn" v-else-if="hasSignUp">
      已报名
      </span>
      <span @click="showDIalog = true" class="commit" v-else>
        立即报名
      </span>
    </div>
    <div v-transfer-dom>
      <confirm
      v-model="showDIalog"
      :close-on-confirm="false"
      :title="'请填写联系信息'"
      :confirm-text="'提交'"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide=""
      >
        <div class="public">
          <div class="wrap">
            <input @focus="" @blur="" class="info-input" type="text" v-model="name" placeholder="请输入您的姓名">
          </div>
          <div>
            <input @focus="" @blur="" class="info-input" type="text" v-model="phone" placeholder="请输入您的联系方式">
          </div>
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import FooterButton from 'components/FooterButton'
import TopCover from 'components/TopCover'
import KeyWordItem from 'components/seller/KeyWordItem'
import courseListCollapse from 'components/course/courseListCollapse'
import { Confirm, TransferDomDirective as TransferDom } from 'vux'
// import _ from 'lodash'
import axios from 'axios'
import TimeModel from 'lanmaLib/time'
export default {
  components: {
    TopCover,
    ModuleWrap,
    FooterButton,
    KeyWordItem,
    courseListCollapse,
    Confirm
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      TimeModel,
      courseId: 0,
      materialsType: 1,
      name: '',
      phone: '',
      course: {},
      thirdPartyList: {},
      showDIalog: false,
      hasSignUp: false,
      isSignUpNumMax: false,
      userInfo: {}
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init() {
      this.courseId = parseInt(this.$route.params.courseId)
      this.materialsType = parseInt(this.$route.params.materialsType)
      axios.all([this.getThirdPartyList(), this.getUserInfo()])
        .then(axios.spread((data) => {
          this.getCourseDetail()
        }))
    },
    getUserInfo () {
      return this.$user.getUserInfo()
        .then((userInfo) => {
          this.userInfo = userInfo
        })
    },
    getCourseDetail () {
      let apiName = 'course'
      if (this.materialsType === 2) {
        apiName = 'courseTour'
      }
      this.$api[apiName].getDetail(this.courseId).then(course => {
        this.course = course
        this.setShare()
        this.getCourseUserCount()
      })
    },
    onShow () {
      var el = document.getElementsByClassName('weui-dialog')[document.getElementsByClassName('weui-dialog').length - 1]
      el.style.position = 'absolute'
      el.style.top = '50%'
      // var docEl = document.documentElement
      // var h = docEl.getBoundingClientRect().height
      // var elBody = document.getElementsByTagName('body')[0]
      // docEl.style.overflow = 'hidden'
      // docEl.style.height = h + 'px'
      // elBody.style.overflow = 'fixed'
      // elBody.style.height = h + 'px'
    },
    onHide () {
      var el = document.getElementsByClassName('weui-dialog')[document.getElementsByClassName('weui-dialog').length - 1]
      el.style.position = 'fixed'
      el.style.top = '50%'
      // var docEl = document.documentElement
      // var elBody = document.getElementsByTagName('body')[0]
      // docEl.style.overflow = 'auto'
      // docEl.style.height = 'auto'
      // elBody.style.overflow = 'auto'
      // elBody.style.height = 'auto'
    },
    getCourseUserCount () {
      this.$api.course.getCourseUserCount(this.courseId)
        .then((data) => {
          this.hasSignUp = data.hasSignUp
          if (data.signUpNum >= this.course.total) {
            this.isSignUpNumMax = true
          }
          if (data.hasSignUp) {
            this.showErrorMsg('您已报名此课程')
          }
        })
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
    },
    onConfirm () {
      if (this.isStartCourse()) {
        this.showErrorMsg('课程已超时，无法报名')
        return
      }
      let apiName = 'course'
      if (this.materialsType === 2) {
        apiName = 'courseTour'
      }
      if (!this.name) {
        this.showErrorMsg('请输入姓名')
        return
      } else if (!this.phone.match(/1[345789]\d{9}$/)) {
        this.showErrorMsg('请输入手机号码')
        return
      }
      var params = {
        name: this.name,
        telephone: this.phone,
        courseId: this.courseId
      }
      this.$api[apiName].thirdPartysignUp(params)
        .then((data) => {
          console.log(data)
          this.$router.push('/parent/thirdParty/successSignUp')
        })
        .catch(e => {
          if (e.code === 6023) {
            this.showErrorMsg('课程可报名人数已满')
          } else if (e.code === 6025) {
            this.showErrorMsg('你已经报名了')
          } else {
            this.showErrorMsg(e.msg)
          }
        })
    },
    setShare () {
//    var time = String(this.course.materialType) === '2' ? this.TimeModel.editStTime(this.course.lesson_time, this.course.lesson_time_end) : this.TimeModel.editTime(this.course.lesson_time, this.course.duration)
      var time
      try {
        time = TimeModel.editTime(this.course.lesson_time, this.course.duration).substring(5, 19)
      } catch (e) {
        time = ''
      }
      var title = `${this.userInfo.wxName}邀请你参加【${this.course.title}】`
      var site
      if (this.materialsType === 1) {
        let siteMap = this.course.lesson_site.replace(/市|县|区/g, '').split('-')
        site = '地区：' + siteMap[1] + '-' + siteMap[2]
      } else {
        if (this.course.lesson_location.length > 7) {
          site = '目的地：' + this.course.lesson_location.substring(0, 7) + '…'
        } else {
          site = '目的地：' + this.course.lesson_location + '…'
        }
      }
      var desc = site + '\r\n时间：' + time + '\r\n名额：' + this.course.total
      var imgUrl = window.location.origin + '/static/img/logo.png'
      if (this.course.cover) {
        imgUrl = window.location.origin + window.location.pathname + this.course.cover.replace('["./', '')
      }
      this.$share.setShareInfo(title, desc, imgUrl)
    },
    isStartCourse () {
      try {
        var time = this.course.lesson_time.replace(/-/g, '/')
        var startTime = new Date(time)
        var nowTime = new Date()
        if ((startTime.getTime() + 30 * 60 * 1000) - nowTime.getTime() < 0) {
          return true
        }
        return false
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.cl-module {
  margin-top: 0;
  font-size: 14px;
  color: #6c7b8a;
}
.course-detail{
  padding-bottom: 90px;
}

.courseinfo{
  margin-top: -10px;
  span{
    margin-right: 10px;
  }
}

.course-list{
  font-size: 13px;
  background-color: #fff;
  margin-bottom: 20px;
  .show-icon{
    text-align: center;
  }
  .lanmacolor{
    color:#00a6ac;
  }
  li{
    margin: 0 15px;
    padding: 11px 0;
  }
  .list{
    margin: 0 15px;
    padding: 11px 0;
    border-bottom: 1px solid #efeff4;
  }
  .fr{
    color: #efeff4;
    float: right;
  }
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 17px;
  line-height: 50px;
  text-align: center;
  background-color: #00a6ac;
  span{
    color: #fff;
  }
  .commit {
    display: inline-block;
    width:100%;
    height:100%;
    margin-left: 0;
  }
}
.gray{
  color: #555;
  background-color: #aaa;
}
.origin-price {
  text-decoration: line-through;
}
.wrap{
  margin-bottom: 15px;
}
.info-input{
  width: 100%;
  box-sizing: border-box;
  font-size: 1.1em;
  padding: .5em;
  border: 1px solid #efeff4;
  -webkit-appearance: none;
}
.left{
    font-size: 13px;
    font-weight: 300;
    color: #6c7b8a;
  }
  .right{
    font-size: 13px;
    font-weight: 300;
    color: #323b46;
  }
.disabledBtn{
  background: #ccc;
}
</style>
