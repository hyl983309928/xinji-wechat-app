<template>
  <div class="study-page">
    <div>
      <img src="/static/img/detail_img.gif">
    </div>
    <div class="details">
      <span>
        {{gold}}金币
      </span>
      <span class="sign">
        ({{yet}}/{{total}})待报名
      </span>
    </div>
    <CourseItem>
    </CourseItem>
    <div class="cl-module">
      <div class="cl-m-header">
        课程目标
      </div>
      <div class="cl-m-body">
        <x-textarea placeholder="课程目标" class="textarea xj-textarea"></x-textarea>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        费用说明
      </div>
      <div class="cl-m-body">
        <x-textarea placeholder="费用说明" class="textarea xj-textarea"></x-textarea>
      </div>
    </div>
    <x-button type="primary" class="apply" @click="apply">报名</x-button>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton,
  XTextarea
} from 'vux'
import CourseItem from 'components/CourseItem'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton,
    XTextarea,
    CourseItem
  },
  data () {
    return {
      gold: '100',
      yet: '8',
      total: '10'
    }
  },
  methods: {
    apply () {
      console.log('报名')
    }
  }
}
</script>

<style scoped>
.cl-m-body{
  border-radius:3px;
}
img{
  height: auto;
  width: 100%;
}
.details{
  margin-top: -50px;
  margin-left: 20px;
  color: #ffffff;
}
.sign{
  margin-left: 60%;
}
.textarea{
  height: auto;
}
.apply{
  height: 50px;
  line-height: 50px;
}
</style>
