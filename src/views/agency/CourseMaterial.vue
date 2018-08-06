<template>
  <div class="study-page" :style="{height: pageSize + 'px'}">
    <x-swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false">
      <x-swipe-item class="slide-item">
        <div class="label">
          <div class="cl-module">
            <div class="cl-m-body">
              <div class="outline">
                <div>
                  <img :src="material.cover">
                </div>
                <div class="title">
                  <p>
                    {{ course.title }}
                  </p>
                  <p>
                    {{ course.number }}
                  </p>
                </div>
              </div>
              <div class="label">
                <div class="object">
                  <ul>
                    <li>孩子年龄</li>
                    <li>课程主题</li>
                    <li>参与对象</li>
                    <li>课程时长</li>
                  </ul>
                </div>
                <div class="detail">
                  <ul>
                    <li>{{ course.ageLabel }}</li>
                    <li>{{ course.themeLabel }}</li>
                    <li>{{ course.targetLabel }}</li>
                    <li>{{ course.sceneLabel }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </x-swipe-item>
      <x-swipe-item v-if="0">
        <div>
          <div class="cl-module">
            <div class="cl-m-header">
              课程目标
            </div>
            <div class="cl-m-body">
            <div >
              <span>{{ course.themeLabel }}</span>
            </div>
              <hr>
              <div class="public" v-html="material.subject.replace(/\n/g, '<br />')">
              </div>
            </div>
          </div>
        </div>
      </x-swipe-item>
      <x-swipe-item>
        <div>
          <div class="cl-module">
            <div class="cl-m-header">
              课程指引
            </div>
            <div class="cl-m-body">
            <div >
              <span>{{ material.guide_title }}</span>
            </div>
              <hr>
              <div class="public" v-html="material.guide_content.replace(/\n/g, '<br />')">
              </div>
            </div>
          </div>
        </div>
      </x-swipe-item>
      <template v-for="(task, index) in material.tasks">
        <x-swipe-item>
          <div>
            <div class="cl-module">
              <div class="cl-m-header">
                {{ task.title }}
              </div>
              <div class="cl-m-body">
                <div>
                  <span>{{$label.getLabel(task.target).title}}</span>
                  <span id="tesk">{{typeList[task.type]}}</span>
                </div>
                <hr>
                <span>任务描述</span>
                <div class="public" v-html="task.content.replace(/\n/g, '<br />')">
                </div>
                <hr>
                <span>任务道具</span>
                <div class="public" v-html="task.tool.replace(/\n/g, '<br />')">
                </div>
              </div>
            </div>
          </div>
        </x-swipe-item>
        <x-swipe-item v-for="(ask, aIndex) in task.asks">
          <div>
            <div class="cl-module">
              <div class="cl-m-header">
                {{ task.title }}
              </div>
              <div class="cl-m-body">
                <div class="public" v-html="ask.ask.replace(/\n/g, '<br />')">
                </div>
                <hr>
                <div class="student">
                  <span class="answer">回答</span>
                  <div>
                    <ul class="nav">
                      <li>编号</li>
                      <li class="user-info">学员</li>
                      <li>回答</li>
                    </ul>
                  </div>
                  <div class="answer-list" v-for="user in userList" :id="'answer_' + ask.id + '_' + user.id" @click="toggleAnswer('answer_' + ask.id + '_' + user.id)">
                    <ul>
                      <li class="rel">
                        {{user.number}}
                      </li>
                      <li class="user-info">
                        <span>
                          <img :src="user.avatar">
                        </span>
                        <span class="name">{{user.nickname}}</span>
                      </li>
                      <li>
                        {{answerList[ask.id] && answerList[ask.id][user.id] ? '√' : '-'}}
                      </li>
                    </ul>
                    <template  v-if="answerList[ask.id] && answerList[ask.id][user.id]">
                      <div class="content" style="display:none;">
                        <div class="answer-photo" v-if="answerList[ask.id][user.id].photo">
                          <img :src="answerList[ask.id][user.id].photo">
                        </div>
                        <div class="answer-content">
                          {{answerList[ask.id][user.id].content}}
                        </div>
                        <div class="clear"></div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </x-swipe-item>
        <x-swipe-item v-for="(summary, sIndex) in task.summaries">
          <div>
            <div class="cl-module">
              <div class="cl-m-header">
                {{ task.title }}
              </div>
              <div class="cl-m-body">
                <div class="public">
                  {{summary.title}}
                </div>
                <hr>
                <div class="public" v-html="summary.content.replace(/\n/g, '<br />')">
                </div>
              </div>
            </div>
          </div>
        </x-swipe-item>
      </template>
      <x-swipe-item>
        <div>
          <div class="cl-module">
            <div class="cl-m-body finish">
              <div>
                <img src="/static/img/work.png">
              </div>
              <div>
                <p>感谢完成心迹家庭成长社课程授课</p>
                <p>请点击<strong>下课</strong>结束并进入总结</p>
              </div>
              <x-button type="primary" @click.native="dismiss">下课</x-button>
            </div>
          </div>
        </div>
      </x-swipe-item>
    </x-swipe>
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
import { XSwipe, XSwipeItem } from 'lib/swipe'
import _ from 'lodash'
// import FormData from 'form-data'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Selector,
    XButton,
    XTextarea,
    XSwipe,
    XSwipeItem
  },
  data () {
    return {
      id: 0,
      preview: 0,
      pageSize: 0,
      totalPage: 5,
      course: {},
      answerList: {},
      userList: [],
      material: {
        subject: '',
        guide_content: ''
      },
      numHash: {},
      typeList: {
        1: '普通任务',
        2: '用餐任务',
        3: '住宿任务'
      },
      userListLoaded: false,
      answerListLoaded: false
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
          // this.setPageLength()
          this.getCourseAnswer()
          this.getUserList()
        })
    this.$label.getLabelList().then((labelList) => {
      this.$label.getLabelTree(labelList)
    })
    this.setPageSize()
    this.initAnswerTimer()
  },
  mounted () {
  },
  methods: {
    getUserList () {
      this.$api.course.courseUserList(this.id).then((data) => {
        this.userList = data.list
      })
    },
    getCourseAnswer () {
      this.$api.course.getCourseAnswer(this.id).then((data) => {
        // console.log(data)
        // console.log(data.list)
        this.setUserAnswer(data.list)
      })
    },
    setUserAnswer (list) {
      // console.log(1111)
      // console.log(list)
      var answerList = {}
      for (var i = 0; i < list.length; i++) {
        var answer = list[i]
        var askId = answer.ask_id
        var userId = answer.user_id
        if (answerList[askId] === undefined) {
          answerList[askId] = {}
        }
        answerList[askId][userId] = answer
      }
      this.answerList = answerList
    },
    initAnswerTimer () {
      setInterval(() => {
        this.getCourseAnswer()
      }, 10000)
    },
    setPageSize () {
      this.pageSize = window.innerHeight
    },
    setPageLength () {
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
    swipeItemCreated () {
    },
    swipeItemDestroyed () {
      // console.log(e)
    },
    toggleAnswer (containerId) {
      var container = document.querySelector('#' + containerId)
      var $answer = container.querySelector('.content')
      console.log($answer)
      if ($answer.style.display === 'none') {
        $answer.style.display = 'block'
      } else {
        $answer.style.display = 'none'
      }
    },
    dismiss () {
      // var data = {
      //   course_id: this.course.id
      // }
      this.$api.course.dismiss(this.course.id).then((res) => {
        this.$vux.toast.show({
          text: '提交成功',
          type: 'success'
        })
      }).catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    },
    saveAnswer (ask) {
      console.log(ask)
      var answer = ask.answer
      answer.course_id = this.id
      answer.ask_id = ask.id
      console.log(answer)
      this.$api.course.saveUserAnswer(answer).then((data) => {
        this.$xLog(data)
        this.$vux.toast.show({
          text: '保存成功',
          type: 'success'
        })
      })
      .catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    },
    getAnswer () {
      this.$api.course.getUserAnswer(this.id)
        .then((data) => {
          var answerList = {}
          for (var i = 0; i < data.list.length; i++) {
            var answer = data.list[i]
            answerList[answer.ask_id] = answer
          }
          this.answerList = answerList
          this.setAskAnswer()
        })
    },
    setAskAnswer () {
      var material = _.clone(this.material)
      for (var i = 0; i < material.tasks.length; i++) {
        var task = material.tasks[i]
        for (var j = 0; j < task.asks.length; j++) {
          var ask = task.asks[j]
          var id = ask.id
          if (this.answerList[id]) {
            ask.answer = this.answerList[id]
          } else {
            ask.answer = {
              photo: '',
              content: ''
            }
          }
        }
      }
      this.material = material
    },
    uploadImg (ask) {
      var answer = ask.answer
      this.$wechat.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds

          var localId = localIds[0]
          window.xLog('localId:' + localId)
          answer.photo = localId
          ask.localId = localId
          this.$wechat.uploadImage({
            localId: localId,
            success: (res) => {
              var serverId = res.serverId
              ask.serverId = serverId
              window.xLog('serverId:' + serverId)
              this.$api.photo.downloadMedia(serverId).then((data) => {
                answer.photo = this.$helper.getImageUrl(data.url)
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style>
div.mint-swipe, div.mint-swipe-items-wrap{
  overflow: auto;
}
</style>
<style scoped lang="scss">
@import '~vue-swipe/dist/vue-swipe.css';
.study-page {
  // height: 1200px;
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
.label{
  .cl-module{
    padding-bottom: 60px;
  }
  .label{
    margin: 30px 20px;
    .detail li{
      text-align: right;
    }
  }
  img{
    width: 225px;
  }
  .cl-m-body{
    margin: 50px;
    .outline{
      text-align: center;
    }
    .title{
      p{
        margin-top: 20px;
      }
    }
  }
  ul{
    list-style: none;
  }
  li{
    margin-bottom: 10px;
  }
  .object{
    float: left;
    color: #00a6ac;
  }
  .detail{
    float: right;
  }
}
span{
  color: #60c9cf;
  margin-top: 5px;
  margin-left: 15px;
}
#tesk{
  color:#323b46;
  float: right;
  margin-right: 15px;
}
.finish{
  text-align: center;
div{
  margin: 50px 0;
  span{
    color: #00cac6;
    }
  }
}
hr{
  opacity: 0.3;
  margin: 15px;
}
.public{
  margin: 5px 15px;
  color:#323b46;
}
strong{
  color: #00a6ac;
}
.port{
  margin-bottom: 40px;
  span{
    width: 80px;
    height: 80px;
    margin-top: 15px;
    margin-left: 15px;
    display: inline-block;
    float:left;
  }
  .iconfont{
    line-height: 80px;
    text-align: center;
    color: #efeff4;
    border: solid 1px #efeff4;
  }
  .preview{
    margin-left: 30px;
    img{
      height: 80px;
    }
  }
}
.student{
  margin-top:10px;
  line-height: 30px;
}
.student ul{
  list-style: none;
  text-align: center;
  clear: both;
  li{
    float:left;
    height: 30px;
    margin:5px auto;
    width: 20%;
    color:#6c7b8a;
    overflow: hidden;
  }
  li.user-info{
    width:60%;
  }
}
.content{
  border: solid 1px #efeff4;
  padding: 10px;
  color: #323b46;
  margin:15px;
  clear: both;
  .answer-photo{
    float: right;
  }
  .answer-content{
    width: 70%;
  }
  img{
    height: 60px;
    width: 60px;
  }
}
.user-info{
  img{
    height: 24px;
    width: 24px;
    margin-right: 15px;
  }
  span{
    width: 40%;
    text-align: center;
  }
  .name{
    position: relative;
    font-size:14px;
    top: -7px;
    width: 60%;
  }
}

</style>
