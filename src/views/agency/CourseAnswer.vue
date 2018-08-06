<template>
  <div class="preview-page" :style="{height: pageSize + 'px'}" v-if="loaded">
    <div>
      <div class="cl-module">
        <div class="cl-m-header">
          {{ method.title }} 任务{{ num2ChineseMap[taskIndex+1] }}
        </div>
        <div class="cl-m-body">
          <p class="question" v-if="task.question" v-html="task.question.replace(/\n/g, '<br />')"></p>
          <hr>
          <span>答案</span>
          <p class="idea" v-if="task.prompt" @click="task.showPrompt=!task.showPrompt">
            提示：
            <!--<img src="/static/img/more.png" alt="">-->
          </p>
          <div class="public" v-if="task.prompt" v-html="task.prompt.replace(/\n/g, '<br />')">
          </div>
          <div v-if="'option' in task" v-for="(item, index) in task.option" class="option-wrap">
            <span v-if="item" class="option-symbol">{{ num2CharMap[index] }}</span> {{ item }}
          </div>
        </div>
        <User v-bind:type="task.type" :answer="answerList" :methodIndex="methodIndex" :taskIndex="taskIndex"></User>
      </div>

    </div>
  </div>
</template>

<script>
  import {
    Tabbar,
    Cell,
    Group,
    Badge,
    Selector,
    XButton,
    XTextarea
  } from 'vux'
  import User from './User'
  // import _ from 'lodash'
  // import { Swipe, SwipeItem } from 'vue-swipe'

  export default {
    components: {
      Tabbar,
      Cell,
      Group,
      Badge,
      Selector,
      XButton,
      XTextarea,
      User
    },
    data() {
      return {
        loaded: false,
        id: 0,
        preview: 0,
        pageSize: 0,
        totalPage: 5,
        course: {},
        answerList: {},
        userList: [],
        material: {},
        numHash: {},
        userListLoaded: false,
        answerListLoaded: false,
        method: {},
        task: {},
        methodIndex: 0,
        realMethodIndex: 0,
        taskIndex: 0,
        num2ChineseMap: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        num2CharMap: ['A', 'B', 'C', 'D']
      }
    },
    beforeRouteLeave(to, form, next) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      next()
    },
    created() {
      var id = parseInt(this.$route.params.id)
      var realMethodIndex = parseInt(this.$route.params.method)
      var taskIndex = parseInt(this.$route.params.task)
      this.taskIndex = taskIndex
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      this.$api.course.getDetail(id)
        .then((course) => {
          var material = this.$material.formatMaterial(course.material)
          this.material = material
          this.realMethodIndex = realMethodIndex
          this.methodIndex = this.getRealIndex(realMethodIndex)
          this.method = material.taskList[this.methodIndex]
          this.task = material.taskList[this.methodIndex].questions[taskIndex]
          this.getAnswer(id, this.realMethodIndex, taskIndex)
          // this.setPageLength()
        })
      this.$label.getLabelList().then((labelList) => {
        this.$label.getLabelTree(labelList)
      })
      this.setPageSize()
      this.$nextTick(() => { // 为了解决 IOS 点击返回空白遮挡的问题
        window.scrollTo(0, 1)
      })
    },
    mounted() {
    },
    methods: {
      // goToEdit () {
      //   this.$router.push('/agency/edit_material/' + this.id)
      // },
      getAnswer(id, methodIndex, taskIndex) {
        var _this = this
        this.$api.course.getAllAnswer(id, methodIndex, taskIndex)
          .then((data) => {
            this.answerList = data.list.map(item => {
              var obj = []
              this.$material.formatTaskAnswer(this.material, obj, item.answers)
              this.loaded = true
              return obj[this.methodIndex]
              // if (item.answers.length === 0) {
              //   for (var i = 0; i < _this.material.taskList.length; i++) {
              //     item.answers.push([])
              //   }
              // } else {
              //   for (var j = 0; j < item.answers.length; j++) {
              //     item.answers[j] = JSON.parse(item.answers[j])
              //   }
              // }
              // try {
              //   var returnItem = item.answers[this.methodIndex]
              // } catch (error) {
              //   returnItem = [[]]
              // }
              // if (_.isEmpty(returnItem)) {
              //   returnItem = [[]]
              // }
              // return returnItem
            })
            this.timer = setTimeout(function () {
              _this.getAnswer(id, methodIndex, taskIndex)
            }, 5000)
            console.log(this.answerList)
          })
      },
      getRealIndex(index) {
        var counter = -1
        for (var i = 0; i < index + 1; i++) {
          if (this.material.content[i].type === 'task') {
            counter++
          }
        }
        return counter
      },
      setPageSize() {
        this.pageSize = window.innerHeight
      },
      setPageLength() {
        var numHash = {}
        var num = 2
        this.material.tasks.forEach((task, index) => {
          num++
          numHash[index] = num
          task.asks.forEach((ask, aIndex) => {
            num++
            numHash[index + '_a_' + aIndex] = num
          })
          task.summaries.forEach((summary, sIndex) => {
            num++
            numHash[index + '_s_' + sIndex] = num
          })
        })
        num++
        this.totalPage = num
        this.numHash = numHash
      },
      swipeItemCreated() {
      },
      swipeItemDestroyed() {
        // console.log(e)
      }
    }
  }

</script>

<style scoped lang="scss">
  /*@import '~vue-swipe/dist/vue-swipe.css';*/

  .question {
    color: #323b46;
    font-size: 17px;
    padding: 0 15px 0 15px;
  }

  .select-item {
    font-size: 13px;
    margin: 10px 0;
    span {
      font-size: 13px;
    }
  }

  .img-item {
    img {
      width: 80px;
      height: 80px;
    }
  }

  .idea {
    color: #6c7b8a;
    font-size: 13px;
    padding: 10px 15px 0 15px;
    img {
      float: right;
      margin-top: 10px;
    }
  }

  li {
    list-style: none;
  }

  .temop {
    background: #60c9cf;
    height: 6px;
    border-radius: 3px;
  }

  .cl-module {
    position: relative;
    overflow: visible;
  }

  .cl-m-header {
    border-radius: 6px 6px 0 0;
  }

  .time-tag {
    position: absolute;
    font-size: 36px;
    font-weight: 600;
    color: #60c9cf;
    text-align: center;
    top: -10px;
    right: -10px;
    width: 96px;
    height: 80px;
    background: url('/static/img/bgMins.png') no-repeat;
  }

  span {
    font-size: 17px;
    color: #60c9cf;
    margin-top: 5px;
    margin-left: 15px;
  }

  #tesk {
    color: #323b46;
    float: right;
    margin-top: 0;
    margin-right: 15px;
  }

  .task-text {
    font-size: 13px;
    color: #323b46;
    margin: 15px 15px 0 15px;
  }

  .method {
    margin-bottom: 15px;
  }

  .finish {
    text-align: center;
    div {
      margin: 50px 0;
      span {
        color: #00cac6;
      }
    }
  }

  hr {
    opacity: 0.3;
    margin: 15px;
  }

  .public {
    font-size: 13px;
    margin: 5px 15px;
    color: #323b46;
  }

  strong {
    color: #00a6ac;
  }

  .port {
    margin-bottom: 40px;
    span {
      width: 80px;
      height: 80px;
      margin-top: 15px;
      margin-left: 15px;
      display: inline-block;
      float: left;
    }
    .iconfont {
      line-height: 80px;
      text-align: center;
      color: #efeff4;
      border: solid 1px #efeff4;
    }
    .preview {
      margin-left: 30px;
      img {
        height: 80px;
      }
    }
  }

  .student {
    margin-top: 10px;
    line-height: 30px;
  }

  .student ul {
    list-style: none;
    text-align: center;
    clear: both;
    li {
      float: left;
      height: 30px;
      margin: 5px auto;
      width: 20%;
      color: #6c7b8a;
      overflow: hidden;
    }
    li.user-info {
      width: 60%;
    }
  }

  .content {
    border: solid 1px #efeff4;
    padding: 10px;
    color: #323b46;
    margin: 15px;
    clear: both;
    .answer-photo {
      float: right;
    }
    .answer-content {
      width: 70%;
    }
    img {
      height: 60px;
      width: 60px;
    }
  }

  .user-info {
    img {
      height: 24px;
      width: 24px;
      margin-right: 15px;
    }
    span {
      width: 40%;
      text-align: center;
    }
    .name {
      position: relative;
      font-size: 14px;
      top: -7px;
      width: 60%;
    }
  }

  .edit-material-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background-color: #00a6ac;
    border-radius: 30px;
    border: none;
    color: #fff;
    font-size: 18px;
  }
  .option-symbol{
    margin-right: 10px;
    font-size: 13px;
  }
  .option-wrap{
    font-size: 13px;
    font-weight: 300;
    color: #323b46;
    margin-top: 10px;
  }
</style>