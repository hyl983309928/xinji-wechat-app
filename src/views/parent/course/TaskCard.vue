<template>
  <div v-if="show">
    <div class="task_card" v-for="(item, index) in task" @click="goto(item.realIndex)">
      <p class="title">任务卡{{index+1}}：{{ item.title }}</p>
      <div class="flex_box">
        <div class="text">
          <p>任务数：{{ item.questions.length }}个</p>
          <p>耗时：{{ item.time }}分钟</p>
          <p>状态：{{ item.status }}</p>
        </div>
        <div class="img_box">
          <img :src="item.imgSrc" alt="">
        </div>
      </div>
      <hr>
      <div class="flex_box">
        <span>详情</span>
        <span>></span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  components: {},
  data () {
    return {
      show: false,
      task: {},
      answerList: []
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.course.reportClick(id).then((course) => {
      this.allAnswerList = this.$material.formatTaskAnswer(course.material, this.answerList, course.userInfo.answers)
      this.task = course.material.content.filter((item, index) => {
        item.realIndex = index
        return item.type === 'task'
      })
      var hasAnswer
      this.task.map((item, index) => {
        // try {
        hasAnswer = !_.isEmpty(this.answerList[index][0])
        if (hasAnswer && (this.answerList[index][0] instanceof Array) && (this.answerList[index][0][0] instanceof Object) && 'url' in this.answerList[index][0][0]) {
          hasAnswer = !_.isEmpty(this.answerList[index][0][0].url)
        }
        // } catch (error) {
        //   debugger
        //   hasAnswer = false
        // }
        var imgAnswer = JSON.stringify(this.answerList[index]).match('\\[\\"\\.\\/.+?\\.(?!mp3)(jpeg|jpg|gif|png)')
        item.status = hasAnswer ? '已完成' : '未完成'
        if (imgAnswer) {
          item.imgSrc = imgAnswer[0].replace('["', '')
        }
        return item
      })
      this.show = true
    })
  },
  methods: {
    goto(index) {
      this.$router.push(`/parent/course/course_material/${this.id}/${index}`)
    }
  }
}
</script>

<style scoped lang="scss">
.task_card{
  margin: 15px;
  background-color:#fff;
  border: 1px solid #ccc;
  border-radius: 20px;
  hr{
    opacity: 0.5;
  }
  .title{
    font-size: 18px;
    margin: 15px 25px;
    color: #00a6ac;
  }
  .flex_box{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 10px 25px;
    font-size: 16px;
    color: #666;
    .img_box{
      height: 70px;
    }
    .img_box img{
      height: 100%;
    }
  }
}
</style>
