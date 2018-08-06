<template>
  <div class="study-page">
    <div>
        <tab :line-width=2 active-color='#00a6ac' v-model="tabIndex">
          <tab-item class="vux-center" :selected="TabItem === item" v-for="(item, index) in tabList" @click.native="changeTab(index, item)" :key="index">{{item}}</tab-item>
        </tab>
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
  import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
  // import _ from 'lodash'
  // import Homework from './Homework'
  import StatModel from 'lanmaLib/modules/statistics'
  import common from 'src/common'
  export default {
    components: {
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    data() {
      return {
        id: 0,
        tabIndex: 0,
        TabItem: '',
        tabList: ['概览', '任务卡', '笔记', '作业', '照片'],
        routerList: ['detail', 'task_card', 'note', 'homework', 'photo_card']
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      var statId = common.getShareParamter('statId')
      if (statId && id) {
        StatModel.activityAddStat(statId, id)
      }
      this.routerList.map((item, index) => {
        if (window.location.href.match(item)) {
          this.tabIndex = index
        }
      })
      // this.$api.course.reportClick(id)
      //   .then((course) => {
      //     course = this.$course.formatCourse(course)
      //     var material = this.$material.formatMaterial(course.material)
      //     this.material = material
      //     this.course = course
      //     this.$material.formatHomeworkAnswer(course.material, this.homeworkAnswerList, course.userInfo.homework_answers)
      //     this.$material.formatTaskAnswer(course.material, this.classAnswerList, course.userInfo.answers)
      //     this.loaded = true
      //   })
      // this.$label.getLabelList().then((labelList) => {
      //   this.$label.getLabelTree(labelList)
      // })
    },
    mounted() {},
    methods: {
      changeTab(index, item) {
        this.TabItem = item
        this.$router.replace('/parent/course/report/' + this.routerList[index] + '/' + this.id)
      }
    }
  }
</script>

<style scoped lang="scss">
.vux-center{
  font-size: 16px;
}
</style>