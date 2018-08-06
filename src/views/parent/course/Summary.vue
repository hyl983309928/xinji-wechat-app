<template>
  <div class="study-page" :style="{height: pageSize + 'px'}">
    <swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false">
      <swipe-item>
        <div class="summary">
          <div class="progress">
            <div class="temop">
            </div>
          </div>
          <div class="cl-module">
            <div class="cl-m-header">
              总结
            </div>
            <div class="cl-m-body sum-page">
              <div class="sug">
                {{course.summary_status === 1 ? course.summary : '等待老师输入中…'}}
              </div>
            </div>
          </div>
        </div>
      </swipe-item>
      <swipe-item>
        <div class="survey">
          <div class="progress">
            <div class="temop">
            </div>
          </div>
          <div class="cl-module">
            <div class="cl-m-header">
              观察
            </div>
            <div class="cl-m-body">
              <div class="sum">
                {{course.summary_status === 1 ? course.observe : '等待老师输入中…'}}
              </div>
             </div>
          </div>
        </div>
      </swipe-item>
      <swipe-item>
        <div class="print">
          <div class="progress">
            <div class="temop">
            </div>
          </div>
          <div class="cl-module">
            <div class="cl-m-header">
              现场照片
            </div>
            <div class="cl-m-body">
              <div class="photo-list" v-if="course.summary_status === 1">
                <div class="photo-item" v-for="photo in course.photos">
                  <img :src="photo.url">
                </div>
              </div>
            </div>
          </div>
        </div>
      </swipe-item>
     </swipe>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XTextarea,
  XButton
} from 'vux'
import { Swipe, SwipeItem } from 'vue-swipe'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XTextarea,
    XButton,
    Swipe,
    SwipeItem
  },
  data () {
    return {
      pageSize: 0,
      url: '',
      course: {},
      material: {}
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
        })
    this.setPageSize()
  },
  methods: {
    setPageSize () {
      this.pageSize = window.innerHeight
    }
  }
}
</script>

<style scoped lang="scss">
@import '~vue-swipe/dist/vue-swipe.css';
.study-page {
  // height: 1200px;
}
div.mint-swipe, div.mint-swipe-items-wrap{
  overflow: auto;
}

li{
  list-style: none;
}
.progress{
  background-color: #ffffff;
  height: 6px;
  margin:15px;
  border-radius: 3px;
}
.temop{
  background: #60c9cf;
  height: 6px;
  border-radius: 3px;
}

.summary{
  .temop{
    width: 33%;
  }
}
.survey{
  .temop{
    width: 66%;
  }
}
.print{
  .temop{
    width: 100%;
  }
  .photo-list{
    margin: 15px;
  }
  .photo-item{
    float:left;
    margin-right:3px;
    margin-bottom: 3px;
    img{
      height: 93px;
      width: 93px;
    }
  }
}

</style>
