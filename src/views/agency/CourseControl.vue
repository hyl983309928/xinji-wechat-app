<template>
  <div class="preview-page">
      <!-- previous -->
    <div class="top_info" v-if="minIndex>-1">
      <p class="top_suc">
        <span>{{actionMap[previousPush.type]}}推送成功√</span>
        <span class="push_again" @click="pushTask(minIndex, previousPush.type, actionMap[previousPush.type] + '：' + (previousPush.title||actionMap[previousPush.type]), false)">再次推送></span>
      </p>
      <p class="top_num" v-if="previousPush.type=='task'">
        <span>已有{{readyNum}}人提交任务，还差{{remainNum}}人未完成。</span>
        <img src="/static/img/reload.png" alt="" @click="loadCompleteNum(previousPush)">
      </p>
    </div>
    <div style="padding:35px;" v-if="minIndex>-1"></div>

    <template v-for="(item, taskIndex) in material.content">
      <ModuleWrap v-if="item.type=='action' && taskIndex<=maxIndex && taskIndex>minIndex" headerColor="#fa8072"><!-- 教学引导 -->
        <p slot="header" class="center">教学引导（{{ item.time }}min）</p>
        <div slot="body" class="module_body">
          <p>标题：{{ item.title }}</p>
          <p style="height:5px;"></p>
          <p v-html="item.desc"></p>
        </div>
      </ModuleWrap>

      <template v-if="item.type=='task' && taskIndex<=maxIndex && taskIndex>minIndex">
        <ModuleWrap headerColor="#60c9cf"><!-- 任务卡 -->
          <p slot="header" class="center">任务卡{{ getTaskIndex(item) }}（{{ item.time }}min）</p>
          <div slot="body" class="module_body">
            <p>任务名称：{{ item.title }}</p>
            <p style="height:5px;"></p>
            <template v-for="(it, index) in item.questions">
              <p>{{ `${index + 1}.${taskTypeMap[it.type]}：`}}<p v-html="it.question"></p></p>
              <p style="height:5px;"></p>
            </template>
          </div>
        </ModuleWrap>
        <p class="push_btn" v-if="isPushed" @click="linkTo(`/agency/course_control/${id}/${index + 1}`)">下一页</p>
        <p class="push_btn" v-else @click="pushTask(taskIndex, 'task', '任务卡：' + item.title)">推送任务</p>
        <p style="padding:10px;"></p>
      </template>

      <div v-if="item.type=='task' && taskIndex<maxIndex && taskIndex>=minIndex"> <!-- 任务卡详情 -->
        <template v-for="(question, questionindex) in item.questions">
          <ModuleWrap v-if="question.type==='photo'" @click.native="linkTo('/agency/course_answer/' + id + '/' + taskIndex + '/' + questionindex)">
            <p slot="header" class="center">{{ `${item.title} 任务${num2CharMap[questionindex+1]}` }}</p>
            <div slot="body" class="module_body">
              <p class="question"  v-if="question.question" v-html="`${questionindex + 1}.[${taskTypeMap[question.type]}]` + question.question.replace(/\n/g, '<br />')"></p>
              <div class="idea" v-if="question.prompt" v-html="'提示：' + question.prompt.replace(/\n/g, '<br />')"></div>
              <a class="showUserAnswer">查看学员的回答></a>
            </div>
          </ModuleWrap>

          <ModuleWrap v-if="question.type==='choose' || question.type==='mulchoose'" @click.native="linkTo('/agency/course_answer/' + id + '/' + taskIndex + '/' + questionindex)">
            <p slot="header" class="center">{{ `${item.title} 任务${num2CharMap[questionindex+1]}` }}</p>
            <div slot="body" class="module_body">
              <p class="question"  v-if="question.question" v-html="`${questionindex + 1}.[${taskTypeMap[question.type]}]` + question.question.replace(/\n/g, '<br />')"></p>
              <div v-for="(option, optionindex) in question.option" class="option-wrap">
                <span v-if="option">{{ numMap[optionindex] }}</span> {{ option }}
              </div>
              <div class="idea" v-if="question.prompt" v-html="'提示：' + question.prompt.replace(/\n/g, '<br />')"></div>
              <a class="showUserAnswer">查看学员的回答></a>
            </div>
          </ModuleWrap>

          <ModuleWrap v-if="question.type==='sound'" @click.native="linkTo('/agency/course_answer/' + id + '/' + taskIndex + '/' + questionindex)">
            <p slot="header" class="center">{{ `${item.title} 任务${num2CharMap[questionindex+1]}` }}</p>
            <div slot="body" class="module_body">
              <p class="question"  v-if="question.question" v-html="`${questionindex + 1}.[${taskTypeMap[question.type]}]` + question.question.replace(/\n/g, '<br />')"></p>
              <div class="idea" v-if="question.prompt" v-html="'提示：' + question.prompt.replace(/\n/g, '<br />')"></div>
              <a class="showUserAnswer">查看学员的回答></a>
            </div>
          </ModuleWrap>
        </template>
      </div>

      <template v-if="item.type=='summary' && taskIndex<=maxIndex && taskIndex>minIndex">
        <ModuleWrap headerColor="#60c9cf"> <!-- 课堂笔记 -->
          <p slot="header" class="center">课堂笔记</p>
          <div slot="body" class="module_body">
            <p v-html="item.content" v-if="item.contentType=='text'"></p>
            <p v-if="item.contentType=='pic'">
              <img class="note_img" :src="item.content" alt="">
            </p>
          </div>
        </ModuleWrap>
        <p class="push_btn" v-if="isPushed" @click="linkTo(`/agency/course_control/${id}/${index + 1}`)">下一页</p>
        <p class="push_btn" v-else @click="pushTask(taskIndex, 'summary', ' 笔记')">推送课堂笔记</p>
        <p style="padding:10px;"></p>
      </template>

      <template v-if="maxIndex === 999 && taskIndex==material.content.length-1 && hasHomework">
        <ModuleWrap headerColor="#60c9cf"> <!-- 课后作业 -->
          <p slot="header" class="center">{{ material.homework.title }}</p>
          <div slot="body" class="module_body">
            <!--<template v-for="info in homeworkInfoList">-->
              <!--<p class="cl-m-title">{{ info.text }}</p>-->
              <!--<p class="cl-m-text">{{ material.homework[info.key] }}</p>-->
            <!--</template>-->

            <div class="cl-m-title" v-if="material.homework.participant && material.homework.participant!='请选择'">
              <p>参与对象</p>
            </div>
            <div class="cl-m-text" v-if="material.homework.participant && material.homework.participant!='请选择'">
              <p>{{ material.homework.participant }}</p>
            </div>
            <div class="cl-m-title" v-if="material.homework.material">
              <p>准备材料</p>
            </div>
            <div class="cl-m-text" v-if="material.homework.material">
              <p>{{ material.homework.material }}</p>
            </div>
            <div class="cl-m-title" v-if="material.homework.rule && material.homework.rule!='<p><br></p>'">
              <p>{{thirdPartyId == 1 ? '游戏规则': '作业内容'}}</p>
            </div>
            <div class="cl-m-text vHtml" v-if="material.homework.rule && material.homework.rule!='<p><br></p>'">
              <p  v-html="material.homework.rule.replace(/\n/g, '<br />')"></p>
            </div>
            <div class="cl-m-title" v-if="material.homework.guide && material.homework.guide!='<p><br></p>'">
              <p>{{thirdPartyId == 1 ? '游戏指引': '要点提示'}}</p>
            </div>
            <div class="cl-m-text vHtml" v-if="material.homework.guide && material.homework.guide!='<p><br></p>'">
              <p v-html="material.homework.guide.replace(/\n/g, '<br />')"></p>
            </div>

            <p class="cl-m-title">{{thirdPartyId == 1 ? '作业内容': '作业题目'}}</p>
            <div class="cl-m-text">
              <template v-for="(it, homeworkindex) in material.homework.question">
                <p class="homework_q" v-html="`${homeworkindex+1}[${taskTypeMap[it.type]}] ` + it.question.replace(/\n/g, '<br />')"></p>
                <div v-for="(option, optionindex) in it.option" class="option-wrap">
                  <span v-if="option">{{ numMap[optionindex] }}</span> {{ option }}
                </div>
                <hr v-if="homeworkindex!==material.homework.question.length-1">
              </template>
            </div>
          </div>
        </ModuleWrap>
      </template>

      <template v-if="maxIndex === 999 && taskIndex==material.content.length-1 && hasHomework">
        <p class="center endtext">课程已结束，请点击下方按钮下课</p>
        <p class="push_btn" v-if="!isHomeworkPushed" @click="pushTask(taskIndex, 'homework', '作业：' + material.homework.title)">推送作业&下课</p>
        <p class="push_btn" v-if="isHomeworkPushed" @click="linkTo('/agency/comment/' + id)">写点评</p>
        <p style="padding:10px;"></p>
      </template>

      <template v-if="maxIndex === 999 && taskIndex==material.content.length-1 && !hasHomework">
        <p class="center endtext">课程已结束，请点击下方按钮下课</p>
        <p class="push_btn" @click="endClass">下课</p>
        <p style="padding:10px;"></p>
      </template>

    </template>
  </div>
</template>

<script>
  import ModuleWrap from 'components/ModuleWrap'
  import _ from 'lodash'

  export default {
    components: {
      ModuleWrap
    },
    data() {
      return {
        id: 0,
        index: 0,
        minIndex: -1,
        maxIndex: 0,
        readyNum: 0,
        remainNum: 0,
        isPushed: false,
        material: {},
        previousPush: {},
        hasHomework: false,
        taskTypeMap: {
          'choose': '选择题',
          'mulchoose': '多选题',
          'photo': '拍照题',
          'sound': '录音题'
        },
        actionMap: {
          'task': '任务卡',
          'summary': '笔记'
        },
        num2CharMap: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一'],
        numMap: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        homeworkInfoList: [
          {'text': '参与对象', 'key': 'participant'},
          {'text': '准备材料', 'key': 'material'},
          {'text': '游戏规则', 'key': 'rule'},
          {'text': '游戏指引', 'key': 'guide'}
        ],
        thirdPartyId: 0
      }
    },
    created() {
      this.init()
    },
    mounted() {},
    watch: {
      '$route' () {
        this.init()
      }
    },
    methods: {
      init() {
        this.id = parseInt(this.$route.params.id)
        this.index = parseInt(this.$route.params.index)
        this.$api.course.getDetail(this.id).then((course) => {
          this.thirdPartyId = course.userId
          this.material = this.$material.formatMaterial(course.material)
          this.maxIndex = this.getTaskOrSummaryIndex(this.index)
          this.minIndex = this.index === 0 ? -1 : this.getTaskOrSummaryIndex(this.index - 1)
          console.log(this.minIndex, this.maxIndex)
          try {
            this.isPushed = !!course.courseExtra.coursePushState[this.maxIndex]
          } catch (error) {
            this.isPushed = false
          }
          try {
            this.isHomeworkPushed = !!course.courseExtra.homeworkPushState
          } catch (error) {
            this.isHomeworkPushed = false
          }
          this.previousPush = this.material.content[this.minIndex]
          if (this.previousPush && this.previousPush.type === 'task') {
            this.loadCompleteNum(this.previousPush)
          }
          this.judgeHomework()
          window.scroll(0, 0)
        })
      },
      linkTo(link) {
        this.$router.push(link)
      },
      getTaskIndex(item) {
        var index = _.indexOf(this.material.content.filter(item => {
          return item.type === 'task'
        }), item)
        return this.num2CharMap[index + 1]
      },
      getTaskOrSummaryIndex(index) {
        var res
        var array = this.material.content.map((item, index) => {
          item.realIndex = index
          return item
        }).filter(item => {
          return (item.type === 'task') || (item.type === 'summary')
        })
        try {
          res = array[index].realIndex
        } catch (error) {
          res = 999
        }
        return res
      },
      pushTask (index, type, title, linkTo = true) {
        this.showConfirm('是否推送' + title + '？', () => {
          switch (type) {
            case 'task':
              this.$api.course.pushTask(this.id, index).then((res) => {
                this.$vux.toast.show({
                  text: '推送成功',
                  type: 'success'
                })
                if (linkTo) this.$router.push(`/agency/course_control/${this.id}/${this.index + 1}`)
              })
              break
            case 'summary':
              this.$api.course.pushTaskSummary(this.id, index).then((res) => {
                this.$vux.toast.show({
                  text: '推送成功',
                  type: 'success'
                })
                if (linkTo) this.$router.push(`/agency/course_control/${this.id}/${this.index + 1}`)
              })
              break
            case 'homework':
              this.$api.course.sendHomeworkMessage(this.id).then(() => {
                this.$vux.toast.show({
                  text: '推送成功',
                  type: 'success'
                })
                this.endClass()
              })
              break
            default:
              break
          }
        })
      },
      loadCompleteNum(item) {
        var index = _.indexOf(this.material.content.filter(item => {
          return item.type === 'task'
        }), item)
        this.$api.course.getTaskCompleteStatus(this.id, index).then(res => {
          this.readyNum = res.completeCount
          this.remainNum = res.uncompleteCount
        })
      },
      judgeHomework() {
        try {
          if (this.material.homework.question.length > 0) {
            this.hasHomework = true
          }
        } catch (error) {
          this.hasHomework = false
        }
      },
      endClass() {
        this.$api.course.classEnd(this.id).then(res => {
          this.$router.push('/agency/comment/' + this.id)
        }).catch(() => {
          this.$router.push('/agency/comment/' + this.id)
        })
      }
    }
  }

</script>

<style scoped lang="scss">
.top_info{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  .top_suc{
    display: flex;
    justify-content: space-between;
    background-color: #ffff99;
    padding: 5px 20px;
    border-bottom: 1px solid #ccc;
    .push_again{
      text-decoration: underline;
      color: #0070c0;
    }
  }
  .top_num{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 5px 20px;
    border-bottom: 1px solid #ccc;
    img{
      width: 20px;
    }
  }
}
.center{
  text-align: center;
}
.module_body{
  font-size: 16px;
}
.push_btn{
  margin: 0 15px;
  text-align: center;
  border-radius: 6px;
  font-size: 19px;
  color: #fff;
  background-color: #00a6ac;
  height: 45px;
  line-height: 45px;
}
.option-wrap{
  margin-left: 10px;
}
.idea{
  margin-top: 10px;
  background-color: #eee;
  border-radius: 6px;
  padding: 5px;
  color: #7f7f7f;
  img{
    float: right;
    margin-top: 10px;
  }
}
.question{
  margin-bottom: 10px;
}
.cl-m-title {
  margin: 0 15px 5px 15px;
  color: #60c9cf;
  font-size: 17px;
}
.cl-m-text {
  margin: 0 15px 15px 15px;
  font-size: 16px;
}
.homework_q{
  margin: 10px 0;
}
.endtext{
  margin: 15px;
}
hr{
  opacity: 0.3;
  margin: 15px 0;
}
.note_img{
  width: 100%;
}
.showUserAnswer{
  display: block;
  color:#00A6AC;
  padding-top: (16rem/16);
  text-align: center;
}
</style>
