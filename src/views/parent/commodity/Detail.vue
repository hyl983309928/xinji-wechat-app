<template>
  <div class="course-detail">
    <TopCover :cover="course.cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name"></TopCover>
    
    <courseListCollapse  v-if="type=='group' && !singleId" :courseList="courseList"></courseListCollapse>

    <div class="courseinfo" v-if="type=='single' || singleId">
      <ModuleWrap :hideHeader="true" :border="'right'">
        <div slot="body">
          <!--<KeyWordItem :marginType="'left'" :textList="['上课时间', '上课地点']" :dataList="[course.lesson_time, course.lesson_location]"></KeyWordItem>-->
          <p>
            <span class="left">上课时间</span>
            <span class="right">{{course.materialType==2? TimeModel.editStTime(course.lesson_time,course.lesson_time_end):TimeModel.editTime(course.lesson_time, course.duration)}}</span>
          </p>
          <p>
            <span class="left">上课地点</span>
            <span class="right">{{course.materialType==2?course.lesson_location:backCourseSite(course.channelName,course.lesson_location) }}</span>
          </p>
        </div>
      </ModuleWrap>
    </div>

    <ModuleWrap>
      <span slot="header">课程简介</span>
      <div slot="body" class="public" v-if="course.content" v-html="course.content.replace(/\n/g, '<br />')"></div>
      <div slot="body" class="public" v-if="course.groupDesc" v-html="course.groupDesc.replace(/\n/g, '<br />')"></div>
    </ModuleWrap>

    <ModuleWrap v-if="!singleId">
      <span slot="header">基本信息</span>
      <div slot="body" class="public">
        <div class="wrap">
          <input class="info-input" type="text" v-model="name" placeholder="请输入您的姓名">
        </div>
        <div>
          <input class="info-input" type="text" v-model="phone" placeholder="请输入您的联系方式">
        </div>
      </div>
    </ModuleWrap>

    <div style="padding: 20px;"></div>
    <div class="footer" @click="enter" v-if="!singleId" :class="[onSale ? '' : 'gray']">
      <span class="commit" v-if="!hasPurse && onSale">
        <span>购买课程：¥{{ price }}</span>
        <span v-if="price && originalPrice!=price">
          （<i class="origin-price" >原价：¥{{ originalPrice }}</i>）
        </span>
      </span>
      <span class="commit" v-if="hasPurse && onSale">点击查看我的课程</span>
      <span class="commit" v-if="!onSale">报名已截止</span>
    </div>

  </div>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import FooterButton from 'components/FooterButton'
import TopCover from 'components/TopCover'
import KeyWordItem from 'components/seller/KeyWordItem'
import courseListCollapse from 'components/course/courseListCollapse'
import _ from 'lodash'
import TimeModel from 'lanmaLib/time'
export default {
  components: {
    TopCover,
    ModuleWrap,
    FooterButton,
    KeyWordItem,
    courseListCollapse
  },
  data () {
    return {
      goodsId: 0,
      singleId: 0,
      type: 'group',
      name: '',
      phone: '',
      course: {},
      price: '',
      originalPrice: '',
      hasPurse: false,
      onSale: true,
      courseList: [],
      createErrorMap: {'ER_COURSE_USER_HAS_MAX': '课程人数已满', 'ER_COURSE_HAS_EXPIRED': '上课时间已过，无法购买'},
      errorStatusMap: ['', '课程已结束', '已开课，停止报名', '已满员，停止报名'],
      sellerId: 0,
      TimeModel
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
  methods: {
    init() {
      this.goodsId = parseInt(this.$route.params.goodsId)
      this.singleId = parseInt(this.$route.params.singleId)
      this.sellerId = parseInt(this.$route.params.sellerId)
      this.checkHasPurse()
      this.getCommodityDetail()
    },
    getCommodityDetail () {
      var isSeller = 'getGoodsBySalesId'
      if (isNaN(this.sellerId) || this.sellerId < 0) {
        isSeller = 'getCommodityDetail'
      }
      this.$api.course[isSeller](this.goodsId, this.sellerId).then(commodity => {
        if (commodity.goodsInfo.status !== 2) {
          this.onSale = false
          this.showErrorMsg('报名已截止')
        }
        if (commodity.goodsInfo.goodsType === 1 || commodity.goodsInfo.goodsType === 3) { // 单课商品
          this.type = 'single'
          this.course = commodity.goodsInfo.original
        } else if (commodity.goodsInfo.goodsType === 2) { // 组合商品
          this.type = 'group'
          if (this.singleId) { // 组合内的 单个详情
            this.course = _.find(commodity.goodsInfo.original.courseList, {id: this.singleId})
          } else { // 组合商品
            this.course = commodity.goodsInfo.original
            this.courseList = this.course.courseList.map(item => {
              return {
                text: item.title,
                link: `/parent/commodity/detail/${this.goodsId}/${item.id}`
              }
            })
          }
        }
        console.log(this.course)
        this.price = commodity.channelInfo.channelPrice
        this.originalPrice = commodity.goodsInfo.originalPrice
      })
    },
    checkHasPurse () {
      this.$api.order.hasPurseCourse(this.goodsId).then((res) => {
        if (res) {
          this.hasPurse = true
          this.showErrorMsg('您已购买此课程')
        }
      })
      this.$api.getCurrentUserInfo().then((userInfo) => {
        this.phone = userInfo.mobile
        this.name = userInfo.name
      })
    },
    enter () {
      if (this.hasPurse) {
        this.$router.push('/parent/course/manage')
      } else if (!this.onSale) {
        return
      } else {
        this.createOrder()
      }
    },
    createOrder () {
      if (!this.checkInput()) {
        return
      }
      this.$api.order.createCourseOrder(this.goodsId, this.name, this.phone, this.sellerId)
        .then((res) => {
          if (res.orderId) {
            window.location.href = './?#/parent/commodity/pay/' + res.orderId
          }
        }).catch((error) => {
          this.showErrorMsg(this.createErrorMap[error.msg] || '获取配置失败')
        })
    },
    checkInput () {
      // if (this.name === '') {
      //   this.showErrorMsg('请输入姓名')
      //   return false
      // } else if (this.phone === '') {
      //   this.showErrorMsg('请输入联系方式')
      //   return false
      // } else
      if (this.phone && !this.phone.match(/1[345789]\d{9}$/)) {
        this.showErrorMsg('请输入正确的手机号')
        return false
      }
      return true
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
</style>
