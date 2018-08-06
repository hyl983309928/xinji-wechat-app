<template>
  <div class="preview-page" :style="{height: pageSize + 'px'}">
    <div>
      <div class="cl-module">
        <div class="cl-m-header">
          {{ material.homework.title }} 作业任务{{ num2ChineseMap[taskIndex+1] }}
        </div>
        <div class="cl-m-body">
          <p class="question" v-if="task.question" v-html="task.question.replace(/\n/g, '<br />')"></p>
          <hr>
          <span>答案</span>
          <p class="idea" v-if="task.prompt" @click="task.showPrompt=!task.showPrompt">
            提示：
            <img src="/static/img/more.png" alt="">
          </p>
          <template v-if="task.showPrompt && task.prompt">
            <div class="public" v-html="task.prompt.replace(/\n/g, '<br />')">
            </div>
            <div class="public">
              <ImgPreview :imgList="task.promptImg"></ImgPreview>
            </div>
          </template>
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
  import ImgPreview from 'components/ImgPreview'
  import _ from 'lodash'
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
      User,
      ImgPreview
    },
    data() {
      return {
        id: 0,
        preview: 0,
        pageSize: 0,
        totalPage: 5,
        course: {},
        answerList: [],
        userList: [],
        material: {},
        numHash: {},
        userListLoaded: false,
        answerListLoaded: false,
        task: {},
        methodIndex: 0,
        taskIndex: 0,
        num2ChineseMap: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      }
    },
    beforeRouteLeave(to, form, next) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      next()
    },
    created() {
      var _this = this
      var id = parseInt(this.$route.params.id)
      var taskIndex = parseInt(this.$route.params.task)
      this.taskIndex = taskIndex
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      this.$api.courseTour.getDetail(id)
        .then((course) => {
          console.log(course)
          var material = this.$material.formatMaterial(course.material)
          this.material = material
          this.task = material.homework.question[taskIndex]
          _this.getAnswer(id)
        })
      this.$label.getLabelList().then((labelList) => {
        this.$label.getLabelTree(labelList)
      })
      this.setPageSize()
    },
    mounted() {
    },
    methods: {
      // goToEdit () {
      //   this.$router.push('/agency/edit_material/' + this.id)
      // },
      getAnswer (id) {
        var _this = this
        this.$api.courseTour.getCompleteCourseInfo(id)
          .then((data) => {
            this.answerList = data.userList.map(item => {
              if (_.isEmpty(item.homework_answers)) {
                item.homework_answers = []
                for (var i = 0; i < _this.material.homework.question.length; i++) {
                  item.homework_answers.push([])
                }
              }
              return item.homework_answers
            })
            this.timer = setTimeout(function() {
              _this.getAnswer(id)
            }, 5000)
            console.log(this.answerList)
            // this.setPageLength()
          })
      },
      getRealIndex(index) {
        var counter = -1
        var realindex = 0
        for (var i = 0; i < this.material.content.length; i++) {
          if (this.material.content[i].type === 'task') {
            counter++
          }
          if (counter === Number(index)) {
            realindex = i
            break
          }
        }
        return realindex
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
</style>