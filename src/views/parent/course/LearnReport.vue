<template>
  <div class="study-page" :style="{height: pageSize + 'px'}">
    <x-swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false" ref="slider">
      <x-swipe-item class="slide-item">
        <div class="label">
          <div class="cl-module">
            <div class="cl-m-body">
              <div class="outline">
                <div>
                  <img :src="learn.cover">
                </div>
                <div class="title">
                  <p>
                    {{ learn.title }}
                  </p>
                  <!-- <p>
                    {{ learn.number }}
                  </p> -->
                </div>
              </div>
              <div class="label">
                <div class="object">
                  <ul>
                    <li>孩子年龄</li>
                    <li>课程主题</li>
                  </ul>
                </div>
                <div class="detail">
                  <ul>
                    <li>{{ learn.ageLabel }}</li>
                    <li>{{ learn.themeLabel }}</li>
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
              课程简介
            </div>
            <div class="cl-m-body">
              <div class="public">
                {{ learn.content }}
              </div>
            </div>
          </div>
        </div>
      </x-swipe-item>
      <template v-for="(task, index) in learn.tasks">
        <x-swipe-item v-if="learn.status !== 8">
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
                <div class="public">
                  {{task.content}}
                </div>
                <hr>
                <span>任务道具</span>
                <div class="public">
                  {{task.tool}}
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
                <div class="public">
                  {{ask.ask}}
                </div>
                <hr>
                <div class="answer">
                  <span>回答</span>
                </div>
                <div class="public">
                  {{ask.answer.content}}
                </div>
                <div class="port">
                  <span class="preview">
                    <img v-if="ask.answer.photo" :src="ask.answer.photo">
                  </span>
                  <div class="clear"></div>
                </div>
              </div>
            </div>
          </div>
        </x-swipe-item>
        <x-swipe-item v-for="(summary, sIndex) in task.summaries" v-if="learn.status !== 8">
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
                <div class="public">
                  {{summary.content}}
                </div>
              </div>
            </div>
          </div>
        </x-swipe-item>
      </template>
      <x-swipe-item v-for="(homework, index) in material.homework">
        <div>
          <div class="cl-module">
            <div class="cl-m-header">
              作业{{ index + 1 }}
            </div>
            <div class="cl-m-body">
              <div class="public">
                {{homework.homework}}
              </div>
              <hr>
              <div class="answer">
                <span>回答</span>
              </div>
              <div class="public">
                <x-textarea class="xj-textarea" :placeholder="homework.sug" v-model="homework.answer.content"></x-textarea>
              </div>
              <div class="port">
                <span class="preview">
                  <img v-if="homework.answer.photo" :src="homework.answer.photo">
                </span>
                <div class="clear"></div>
              </div>
            </div>
          </div>
        </div>
      </x-swipe-item>
      <x-swipe-item>
        <div>
          <div class="cl-module">
            <div class="cl-m-body finish">
              <div>
                <img src="/static/img/work.png">
              </div>
              <div>
                <p>感谢参与心迹家庭成长社课程</p>
              </div>
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
      pageSize: 0,
      totalPage: 5,
      learn: {},
      material: {},
      answerList: {},
      numHash: {},
      typeList: {
        1: '普通任务',
        2: '用餐任务',
        3: '住宿任务'
      }
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.learn.find(id)
        .then((learn) => {
          learn.themeLabel = this.$label.getLabelTitle(learn.theme)
          learn.ageLabel = this.$label.getLabelTitle(learn.age)
          this.learn = learn
          // this.setPageLength()
          this.getAnswer()
          this.getHomework()
        })
    this.$label.getLabelList().then((labelList) => {
      this.$label.getLabelTree(labelList)
    })
    this.setPageSize()
  },
  mounted () {
  },
  methods: {
    setPageSize () {
      this.pageSize = window.innerHeight
    },
    setPageLength () {
      var numHash = {}
      var num = 2
      this.learn.tasks.forEach((task, index) => {
        if (this.learn.status !== 8) {
          num++
          numHash[index] = num
        }
        task.asks.forEach((ask, aIndex) => {
          num++
          numHash[index + '_a_' + aIndex] = num
        })
        if (this.learn.status !== 8) {
          task.summaries.forEach((summary, sIndex) => {
            num++
            numHash[index + '_s_' + sIndex] = num
          })
        }
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
    getHomework () {
      this.$api.learn.getUserHomework(this.id)
        .then((data) => {
          var answerList = {}
          for (var i = 0; i < data.list.length; i++) {
            var answer = data.list[i]
            answerList[answer.homework_id] = answer
          }
          this.answerList = answerList
          this.setUserAnswer()
        })
    },
    setUserAnswer () {
      var material = _.clone(this.learn)
      for (var i = 0; i < material.homework.length; i++) {
        var homework = material.homework[i]
        var id = homework.id
        if (this.answerList[id]) {
          homework.answer = this.answerList[id]
        } else {
          homework.answer = {
            photo: '',
            content: ''
          }
        }
      }
      console.log(material)
      this.material = material
    },
    showNext () {
      this.$refs.slider.next()
    },
    submit () {
      var data = {
        learn_id: this.learn.id
      }
      this.$api.learn.submitAnswer(data).then((res) => {
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
      answer.learn_id = this.id
      answer.ask_id = ask.id
      console.log(answer)
      this.$api.learn.saveUserAnswer(answer).then((data) => {
        this.$xLog(data)
        this.showNext()
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
      this.$api.learn.getUserAnswer(this.id)
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
      var learn = _.clone(this.learn)
      for (var i = 0; i < learn.tasks.length; i++) {
        var task = learn.tasks[i]
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
      this.learn = learn
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
.add-photo{
  font-size:60px;
}

</style>
