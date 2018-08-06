<template>
  <div class="preview-page" :style="{height: pageSize + 'px'}" v-if="loaded">
    <TopCover :cover="course.cover" :theme="course.labelTheme" :age="course.labelAge" :target="course.labelTarget" :scene="course.labelScene" :title="course.title || course.name"></TopCover>
    <template v-for="(task, index) in course.material.content">
      <div v-if="task.type=='task'">
        <div class="cl-module">
          <div class="cl-m-header" v-cloak>
            任务卡：{{ task.title }}
          </div>
          <div class="time-tag">
            {{ task.time }}
          </div>
          <div class="cl-m-body">
            <span>任务</span>
            <template v-for="(question, questionindex) in task.questions">
              <template v-if="question.type==='photo'">
                <p class="question"  v-if="question.question"  v-html="questionindex + 1 + '. ' + taskTypeMap[question.type] + ':' + question.question.replace(/\n/g, '<br />')"></p>
                <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
                  提示：
                  <!--<img src="/static/img/more.png" alt="">-->
                </p>
                <div class="public" v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
                </div>
                <router-link :to="'/agency/course_answer/' + id + '/'+ index + '/' + questionindex" v-if="course.status>'8'">
                    <p>
                      <span class="task-info">查看任务详情</span>
                      <span class="goto">></span>
                    </p>
                </router-link>
                <hr v-if="questionindex!==task.questions.length-1">
              </template>
              <template v-if="question.type==='choose' || question.type==='mulchoose'">
                <p class="question"  v-if="question.question"  v-html="questionindex + 1 + '. ' + taskTypeMap[question.type] + ':' + question.question.replace(/\n/g, '<br />')"></p>
                <p class="select-item" v-for="(item, index) in question.option">
                  <span v-if="item">{{ num2CharMap[index] }}</span> {{ item }}
                </p>
                <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
                  提示：
                  <!--<img src="/static/img/more.png" alt="">-->
                </p>
                <div class="public" v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
                </div>
                <router-link :to="'/agency/course_answer/' + id + '/'+ index + '/' + questionindex" v-if="course.status>8">
                  <p>
                    <span class="task-info">查看任务详情</span>
                    <span class="goto">></span>
                  </p>
                </router-link>
                <hr v-if="questionindex!==task.questions.length-1">
              </template>
              <template v-if="question.type==='sound'">
                <p class="question"  v-if="question.question"  v-html="questionindex + 1 + '. ' + taskTypeMap[question.type] + ':' + question.question.replace(/\n/g, '<br />')"></p>
                <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
                  提示：
                  <!--<img src="/static/img/more.png" alt="">-->
                </p>
                <div class="public" v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
                </div>
                <router-link :to="'/agency/course_answer/' + id + '/'+ index + '/' + questionindex" v-if="course.status>8">
                    <p>
                      <span class="task-info">查看任务详情</span>
                      <span class="goto">></span>
                    </p>
                </router-link>
                <hr v-if="questionindex!==task.questions.length-1">
              </template>
            </template>
              <!-- <span>老师总结</span>
              <div class="public"  v-if="task.validationHints" v-html="task.validationHints.replace(/\n/g, '<br />')">
              </div> -->
          </div>
        </div>
      </div>
      <template v-if="task.type=='action'">
        <!--</swipe-item>-->
        <div class="cl-module">
          <div class="cl-m-header">
            教学引导：{{ task.title }}
          </div>
          <div class="time-tag">{{ task.time }}</div>
          <div class="cl-m-body">
            <div class="public" v-if="task.desc" v-html="task.desc.replace(/\n/g, '<br />')">
            </div>
          </div>
        </div>
      </template>
      <template v-if="task.type=='summary'">
        <div class="cl-module">
          <div class="cl-m-header">
            课堂笔记：{{ task.title }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="task.contentType=='text'" v-html="task.content.replace(/\n/g, '<br />')">
            </div>
            <img v-if="task.contentType=='pic'" :src="task.content" alt="" style="width:100%;">
          </div>
        </div>
      </template>
    </template>

    <!-- <div class="cl-module">
      <div class="cl-m-header">
        课程总结
      </div>
      <div class="cl-m-body">
        <div>
          <span>目标达成情况和总结</span>
          <div class="public"  v-if="material.summary" v-html="material.summary.replace(/\n/g, '<br />')">
          </div>
        </div>
        <div class="module-split">
          <span>请家长关注家庭拓展练习</span>
          <div class="public"  v-if="material.proposal" v-html="material.proposal.replace(/\n/g, '<br />')">
          </div>
        </div>

      </div>
    </div> -->

    <div class="cl-module homework" v-if="material.homework.title">
      <div class="cl-m-header">
        作业：{{ material.homework.title }}
      </div>
      <div class="cl-m-body">
        <span>参与对象</span>
        <div class="public">
          {{ material.homework.participant }}
        </div>
        <template v-if="material.homework.material">
          <span>准备材料</span>
          <div class="public">
            {{ material.homework.material }}
          </div>
        </template>
        <template v-if="material.homework.rule">
          <span>{{thirdPartyId == 1 ? '游戏规则': '作业内容'}}</span>
          <div class="public"  v-if="material.homework.rule" v-html="material.homework.rule.replace(/\n/g, '<br />')">
          </div>
        </template>
        <template v-if="material.homework.guide">
          <span>{{thirdPartyId == 1 ? '游戏指引': '要点提示'}}</span>
          <div class="public"  v-if="material.homework.guide" v-html="material.homework.guide.replace(/\n/g, '<br />')">
          </div>
        </template>
        <span>{{thirdPartyId == 1 ? '任务': '题目'}}</span>
        <template v-for="(question, index) in material.homework.question">
          <template v-if="question.type==='photo'">
            <p class="question"  v-if="question.question"  v-html="index + 1 + '. ' + taskTypeMap[question.type] + ':' + question.question.replace(/\n/g, '<br />')"></p>
            <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
              提示：
              <!--<img src="/static/img/more.png" alt="">-->
            </p>
            <div class="public" v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
            </div>
            <router-link :to="'/agency/homework_answer/' + id + '/0/' + index" v-if="course.status>8">
                <p>
                  <span class="task-info">查看答案详情</span>
                  <span class="goto">></span>
                </p>
            </router-link>
            <hr v-if="index!==material.homework.question.length-1">
          </template>
          <template v-if="question.type==='choose' || question.type==='mulchoose'">
            <p class="question"  v-if="question.question"  v-html="index + 1 + '. ' + taskTypeMap[question.type] + ':' + question.question.replace(/\n/g, '<br />')"></p>
            <p class="select-item" v-for="(item, index) in question.option">
              <span v-if="item">{{ num2CharMap[index] }}</span> {{ item }}
            </p>
            <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
              提示：
              <!--<img src="/static/img/more.png" alt="">-->
            </p>
            <div class="public" v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
            </div>
            <router-link :to="'/agency/homework_answer/' + id + '/0/' + index" v-if="course.status>8">
                <p>
                  <span class="task-info">查看答案详情</span>
                  <span class="goto">></span>
                </p>
            </router-link>
            <hr v-if="index!==material.homework.question.length-1">
          </template>
          <template v-if="question.type==='sound'">
            <p class="question"  v-if="question.question"  v-html="index + 1 + '. ' + taskTypeMap[question.type] + ':' + question.question.replace(/\n/g, '<br />')"></p>
            <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
              提示：
            </p>
            <div class="public" v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
            </div>
            <router-link :to="'/agency/homework_answer/' + id + '/0/' + index" v-if="course.status>8">
                <p>
                  <span class="task-info">查看答案详情</span>
                  <span class="goto">></span>
                </p>
            </router-link>
            <hr v-if="index!==material.homework.question.length-1">
          </template>
        </template>

      </div>
    </div>

    <div class="cl-module img-item" v-if="material.referPic && material.referPic.length != 0">
      <div class="cl-m-header">
        参考图片
      </div>
      <div class="cl-m-body">
        <img :src="item" alt="" v-for="item in material.referPic">
      </div>
    </div>

    <div class="cl-module" v-if="course.status>8 && course.reviewAfter">
      <div class="cl-m-header">
        老师点评
      </div>
      <div class="cl-m-body">
        <div class="public" v-if="course.reviewAfter" v-html="course.reviewAfter.replace(/\n/g, '<br />')">
        </div>
      </div>
    </div>

    <div class="cl-module img-item" v-if="course.status>8 && course.coursePics && course.coursePics.length !=0">
      <div class="cl-m-header">
        现场图片
      </div>
      <div class="cl-m-body">
        <img :src="item" alt="" v-for="item in course.coursePics">
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
  import TopCover from 'components/TopCover'
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
      TopCover
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
        typeList: {
          1: '普通任务',
          2: '用餐任务',
          3: '住宿任务'
        },
        taskTypeMap: {
          'choose': '选择题',
          'mulchoose': '多选题',
          'photo': '拍照题',
          'sound': '录音题'
        },
        userListLoaded: false,
        answerListLoaded: false,
        num2CharMap: ['A', 'B', 'C', 'D'],
        thirdPartyId: 0
      }
    },
    watch: {
      '$route' (to, from) {
        this.init()
      }
    },
    created() {
      this.init()
    },
    mounted() {
    },
    methods: {
      init() {
        var id = parseInt(this.$route.params.id)
        if (isNaN(id) || id < 0) {
          id = 0
        }
        this.id = id
        this.$api.course.getDetail(id)
          .then((course) => {
            var material = this.$material.formatMaterial(course.material)
            this.material = material
            this.thirdPartyId = course.userId
            this.course = course
            this.loaded = true
            // this.setPageLength()
          })
        this.$label.getLabelList().then((labelList) => {
          this.$label.getLabelTree(labelList)
        })
        this.setPageSize()
        this.$nextTick(() => { // 为了解决 IOS 点击返回空白遮挡的问题
          window.scrollTo(0, 1)
          window.scrollTo(0, 0)
        })
      },
      setPageSize() {
        this.pageSize = window.innerHeight
      }
    }
  }

</script>

<style scoped lang="scss">
  /*@import '~vue-swipe/dist/vue-swipe.css';*/

  .homework{
    .public{
      margin-bottom: 15px;
    }
  }

  .module-split{
    margin-top: 15px;
  }

  .question {
    color: #323b46;
    font-size: 13px;
    padding: 0 15px 15px 15px;
  }

  .select-item {
    font-size: 13px;
    margin: 10px 0 10px 15px;
    span {
      font-size: 13px;
      margin-left: 0;
    }
  }

  .img-item {
    img {
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
  }

  .idea {
    color: #6c7b8a;
    font-size: 13px;
    padding: 0 15px 0 15px;
    img {
      float: right;
      margin-top: 10px;
    }
  }

  .study-page {
    height: 1200px;
  }

  div.mint-swipe,
  div.mint-swipe-items-wrap {
    overflow: auto;
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

  .task-info{
    font-size: 13px;
    text-decoration: underline;
  }

  .goto{
    float: right;
    margin: 0 15px 5px 0;
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
