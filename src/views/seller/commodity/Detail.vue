<template>
  <div class="course-detail">
    <TopCover :cover="cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name" :price="course.price"></TopCover>
    
    <courseListCollapse  v-if="type=='group' && !singleId" :courseList="courseList"></courseListCollapse>

    <div class="courseinfo" v-if="type=='single' || singleId">
      <ModuleWrap :hideHeader="true" :border="'right'">
        <div slot="body">
          <!--<KeyWordItem :marginType="'left'" :textList="['上课时间', '上课地点']" :dataList="[course.lesson_time, course.lesson_location]"></KeyWordItem>-->
          <p>
            <span class="left">上课时间</span>
            <span class="right" :style="{'margin-left':'0px'}">{{course.materialType==2? TimeModel.editStTime(course.lesson_time,course.lesson_time_end):TimeModel.editTime(course.lesson_time, course.duration)}}</span>
          </p>
          <p>
            <span class="left">上课地点</span>
            <span class="right" :style="{'margin-left':'0px'}">{{course.materialType==2?course.lesson_location:backCourseSite(course.channelName,course.lesson_location) }}</span>
          </p>
          <p>
            <span class="left">课程价格</span>
            <span class="right" :style="{'margin-left':'0px'}">￥{{goodsInfo.channelPrice}}<span class="originalPriceBox" v-if="goodsInfo.channelPrice != goodsInfo.originalPrice">（<span>原价：￥{{goodsInfo.originalPrice}}</span>）</span></span>
          </p>
        </div>
      </ModuleWrap>
    </div>

    <!--<SaleInfoBox :status="3" :total="12" :personal="2" :remain="10"></SaleInfoBox>-->

    <ModuleWrap>
      <span slot="header">课程简介</span>
      <div slot="body" class="public" v-if="course.content" v-html="course.content.replace(/\n/g, '<br />')"></div>
      <div slot="body" class="public" v-if="course.groupDesc" v-html="course.groupDesc.replace(/\n/g, '<br />')"></div>
    </ModuleWrap>

    <!--<router-link :to="'/parent/course/pay/' + courseId">-->
    <!--<FooterButton v-if="!singleId" :text="'添加家长'" @click.native="addBuyer"></FooterButton>-->
    <div class="footBtn" v-if="!singleId">
      <span class="QRcode" @click="goto('/seller/course_QRcode/' + goodsId)">商品二维码</span>
      <span class="addBuyer" @click="addBuyer">赠送课程</span>
    </div>
  </div>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import FooterButton from 'components/FooterButton'
import TopCover from 'components/TopCover'
// import SaleInfoBox from 'components/seller/SaleInfoBox'
import KeyWordItem from 'components/seller/KeyWordItem'
import courseListCollapse from 'components/course/courseListCollapse'
import TimeModel from 'lanmaLib/time'
export default {
  components: {
    TopCover,
    // SaleInfoBox,
    ModuleWrap,
    FooterButton,
    KeyWordItem,
    courseListCollapse
  },
  data () {
    return {
      goodsId: 0,
      courseId: 0,
      singleId: 0,
      type: 'group',
      cover: '',
      course: {},
      showList: false,
      courseList: [],
      goodsInfo: {},
      goodsType: '',
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
      var type = this.$route.params.type
      this.type = type
      this.goodsId = parseInt(this.$route.params.goodsId)
      this.courseId = parseInt(this.$route.params.courseId)
      this.singleId = parseInt(this.$route.params.singleId)
      this.getGoods()
    },
    getSingleCourseDetail (courseId) {
      var apiName = 'course'
      if (String(this.goodsType) === '3') {
        apiName = 'courseTour'
      }
      this.$api[apiName].getDetail(courseId).then((course) => {
        this.course = course
        this.cover = course.material.cover
      })
    },
    getgroupCourseDetail (courseId) {
      this.$api.course.getGroupCourseDetail(courseId).then((course) => {
        this.course = course
        this.cover = course.cover
        this.courseList = this.course.courseList.map(item => {
          return {
            text: item.title,
            link: `/seller/course_detail/${this.type}/${this.goodsId}/${this.courseId}/${item.id}`
          }
        })
      })
    },
    addBuyer() {
      this.$router.push(`/seller/add_buyer/${this.goodsId}`)
    },
    getGoods () {
      this.$api.seller.getCommodity(this.goodsId).then((data) => {
        this.goodsInfo = data.goodsInfo
        this.goodsType = data.goodsInfo.goodsType
        this.goodsInfo.channelPrice = data.channelInfo.channelPrice
        if (this.singleId) {
          this.getSingleCourseDetail(this.singleId)
        } else if (this.type === 'single') {
          this.getSingleCourseDetail(this.courseId)
        } else if (this.type === 'group') {
          this.getgroupCourseDetail(this.courseId)
        }
      })
    },
    goto (url) {
      this.$router.push(url)
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
.flex-wrap {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
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
  .footBtn{
    height:50px;
    position: fixed;
    width:100%;
    bottom: 0;
    box-sizing: border-box;
    .addBuyer{
      position: absolute;
      width:50%;
      right: 0;
      box-sizing: border-box;
      display: inline-block;
      color: #fff;
      font-size: 1.1rem;
      background: #00a6ac;
      text-align: center;
      line-height: 50px;
    }
    .QRcode{
      position: absolute;
      left: 0;
      box-sizing: border-box;
      text-align: center;
      width:50%;
      color: #fff;
      line-height: 50px;
      font-size: 1.1rem;
      display: inline-block;
      background: rgb(234,112,34);
    }
  }
  .originalPriceBox{
    color: #6c7b8a;
    span{
      text-decoration: line-through;
      margin-right: 0;
      font-style: italic;
    }
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
