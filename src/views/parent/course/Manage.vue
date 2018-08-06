<template>
  <div class="study-page" v-if="show">
    <tab :line-width="0" class="tab" active-color="#353535">
      <tab-item :selected="currentTab === 0" @click.native="toggle(0)">
        未支付
      </tab-item>
      <tab-item :selected="currentTab === 7" @click.native="toggle(7)">
        待上课
      </tab-item>
      <tab-item :selected="currentTab === 8" @click.native="toggle(8)">
        上课中
      </tab-item>
      <tab-item :selected="currentTab === 9" @click.native="toggle(9)">
        课后
      </tab-item>
      <!--<tab-item :selected="currentTab === 3" @click.native="toggle(3)">
        已签到
      </tab-item>-->
    </tab>
    <CourseItem v-for="course in courseList" :course="course" :tab="currentTab" v-if="currentTab>6">
    </CourseItem>
    <OrderItem v-for="order in orderList" :order="order" :tab="currentTab" v-if="currentTab<6">
    </OrderItem>
    <p class="empty-sug" v-if="courseList.length === 0 && currentTab > 7 && loaded">该选项下没有数据</p>
    <p class="empty-sug" v-if="orderList.length === 0 && currentTab < 6 && loaded">该选项下没有数据</p>
    <div class="waitstart" v-if="courseList.length === 0 && currentTab == 7 && loaded">
      <p>你还没有购买任何课程。</p>
      <br>
      <p>心迹家庭成长社，联合清华大学、北师大、华中师大等著名院校的心理学和教育学专家，为孩子创造了“学会学习”、“学会生活”、“学会相处”三大成长模块，对应50个维度的“全人成长教育体系”。</p>
      <br>
      <p>快去看看，有没有你和孩子感兴趣的快乐亲子成长课程吧 ></p>
      <div class="button-wrap">
        <x-button type="primary" class="button" @click.native="startSelect">开始选课</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton } from 'vux'

import CourseItem from 'components/CourseItem'
import OrderItem from 'components/OrderItem'
import _ from 'lodash'
import TimeModel from 'lanmaLib/time'
// const version = require('../package.json').version
export default {
  components: {
    Tab,
    TabItem,
    CourseItem,
    OrderItem,
    XButton
  },
  data () {
    return {
      show: false,
      loaded: false,
      currentTab: 0,
      menu: {
        1: '已报名',
        2: '已确认',
        3: '已签到'
      },
      listCache: {},
      courseList: [],
      orderList: [],
      TimeModel,
      thirdPartyList: {}
    }
  },
  // watch: {
  //   // 因此需要侦听路由变化，来加载数据
  //   '$route' (to, from) {
  //     this.created()
  //   }
  // },
  created () {
    this.$user.hasChildren(this)
    var tab = parseInt(this.$route.params.tab)
    this.$axios.all([this.getThirdPartyList()])
      .then(() => {
        if (isNaN(tab) || tab < 0) {
          this.priority()
        } else {
          this.currentTab = tab
          this.getCourse(this.currentTab)
        }
      })
  },
  methods: {
    toggle (tab) {
      this.currentTab = tab
      this.getCourse(tab)
    },
    priority () {
      this.currentTab = 0
      this.$api.order.getUserUnpaymentOrderList().then((order) => {
        if (order.list.length === 0) {
          this.currentTab = 7
          this.$api.course.userCourse(7).then((course7) => {
            if (course7.list.length === 0) {
              this.currentTab = 8
              this.$api.course.userCourse(8).then((course8) => {
                if (course8.list.length === 0) {
                  this.toggle(9)
                } else {
                  this.formateList(course8)
                }
              })
            } else {
              this.formateList(course7)
            }
          })
        } else {
          this.getOrderInfoList(order.list)
          this.show = true
        }
      })
    },
    getCourse (tab) {
      this.courseList = []
      this.orderList = []
      this.loaded = false
      if (tab === 0) {
        this.$api.order.getUserUnpaymentOrderList().then((data) => {
          this.getOrderInfoList(data.list)
          this.show = true
          this.loaded = true
        })
      } else {
        this.$api.course.userCourse(tab).then((data) => {
          this.formateList(data)
          this.show = true
          this.loaded = true
        })
      }
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
    formateList(data) {
      var list = []
      for (var i = 0; i < data.list.length; i++) {
        var course = data.list[i].courseInfo
        var hasHomework = 1
        try {
          hasHomework = course.courseExtra.hasHomework
        } catch (error) {}
        course.link = '/parent/course/detail/' + course.id
        if (String(course.materialType) === '2') {
          course.link = '/parent/course_tour/detail/' + course.id
        }
        course.thirdPartyName = this.thirdPartyList[data.list[i].courseInfo.userId] ? this.thirdPartyList[data.list[i].courseInfo.userId].name : ''
        course.courseStatus = data.list[i].courseStatus
        course.showHomework = (hasHomework) && (_.isEmpty(data.list[i].homework_answers))
        course = this.$course.formatCourse(course)
        list.push(course)
      }
      this.courseList = list
      this.show = true
    },
    getOrderInfoList (orderList) {
      var orderTypeMap = ['', '体验坊', '课程组合', '游学营']
      this.orderList = orderList.map(item => {
        var obj = {'orderId': item.orderId, 'title': item.goodsName, 'orderType': orderTypeMap[item.goodsInfo.goodsType], 'telephone': item.telephone, 'price': item.price, 'lesson_time': String(item.goodsInfo.goodsType) === '3' ? TimeModel.editStTime(item.goodsInfo.original.lesson_time, item.goodsInfo.original.lesson_time_end) : TimeModel.editTime(item.goodsInfo.original.lesson_time, item.goodsInfo.original.duration)}
        return obj
      })
      console.log(this.orderList)
    },
    startSelect () {
      this.$router.push('/parent/course/list/%7B%7D')
    }
  }
}
</script>

<style scoped lang="scss">
.study-page {
  padding-top: 44px;
}
.vux-tab{
  margin-top: 0;
  margin-left: 0;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 99;
}

.cl-module{
  margin-top: -5px;
  :nth-child(even){
    margin-left: 5px;
  }
}
div.vux-tab .vux-tab-selected{
  background: #eaeaea;
}
.empty-sug{
  text-align: center;
  line-height: 40px;
  color: #666;
}
.waitstart{
  margin: 20px;
  font-size: 14px;
  color: #666;
  .button-wrap{
    text-align: center;
    margin: 50px 0;
    .button{
      width: 120px;
      font-size: 16px;
    }
  }

}
</style>
