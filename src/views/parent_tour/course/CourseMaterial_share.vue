<template>
  <div class="study-page" :style="{height: pageSize + 'px'}" v-if="loaded">
    <!--<div class="cl-module">-->
      <div class="cl-m-body shareInfoTop">
        <div class="public">
          <div class="inline-wrap">
            <img class="headimg" :src="headimgurl" alt="">
          </div>
          <div class="inline-wrap">
            <span class="username">{{ name }}</span><br>
            <span class="time">{{ time }}</span>
          </div>
          <p class="share-info">今天和孩子参加「{{thirdPartyList[course.userId].name}}」的陪伴技巧体验营「{{ course.title }}」，和小家伙一起完成老师布置的营地任务，很有启发，值得分享！</p>
          <p class="share-icon">︾</p>
        </div>
      </div>
    <!--</div>-->
    <!--<template v-for="(task, index) in material.taskList">-->
      <TourCourseLabelTarget :targetId="task.target"></TourCourseLabelTarget>
    <template v-for="(question, index) in task.questions">
      <template v-if="question.type==='photo'">
        <div class="cl-module">
          <div class="cl-m-header">
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="'照片题：' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
            <div class="port">
              <p class="preview"><ImgPreview :imgList="answerList[index]"></ImgPreview></p>
              <!--<span slot="icon" class="iconfont icon-plus add-photo" @click="uploadImg(index)" v-if="answerList[index].length < 3"></span>-->
              <div class="clear"></div>
            </div>
            <div class="cl-m-title" v-if="question.prompt">
              <p>提示：</p>
            </div>
            <div class="cl-m-text" v-if="question.prompt">
              <p v-html="question.prompt.replace(/\n/g, '<br />')"></p>
              <p><ImgPreview :imgList="question.promptImg"></ImgPreview></p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="question.type==='choose'">
        <div class="cl-module">
          <div class="cl-m-header">
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="'单选题：' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
            <TaskRadio :options="question.option" :isDisabled="true" v-model="answerList[index]" :radioname="index"></TaskRadio>
            <div class="cl-m-title" v-if="question.prompt">
              <p>提示：</p>
            </div>
            <div class="cl-m-text" v-if="question.prompt">
              <p v-html="question.prompt.replace(/\n/g, '<br />')"></p>
              <p><ImgPreview :imgList="question.promptImg"></ImgPreview></p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="question.type==='mulchoose'">
        <div class="cl-module">
          <div class="cl-m-header">
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="'多选题：' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
            <TaskCheckbox :options="question.option" :isDisabled="true" v-model="answerList[index]" :checkboxname="index"></TaskCheckbox>
            <div class="cl-m-title" v-if="question.prompt">
              <p>提示：</p>
            </div>
            <div class="cl-m-text" v-if="question.prompt">
              <p v-html="question.prompt.replace(/\n/g, '<br />')"></p>
              <p><ImgPreview :imgList="question.promptImg"></ImgPreview></p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="question.type==='sound'">
        <div class="cl-module">
          <div class="cl-m-header">
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="'录音题：' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
            <div class="public flexset vux-flex-row">
              <img src="/static/img/mic.png" alt="">
              <button class="voice-button" @touchstart.prevent="startRecord(index, $event)" @touchend="endRecord(index, $event)">
                <audio :src="answerList[index][0].url" @ended="playend(index)"></audio>
                <img class="img-left" src="/static/img/voice_gray.png" alt="" v-if="answerList[index][0].status!='play'">
                <!-- <span class="voice-text" v-if="(answerList[index][0].status && !answerList[index][0].url) || (answerList[index][0].status && answerList[index][0].status=='play')">{{ statusMap[answerList[index][0].status] }}</span> -->
                <span class="voice-text-left" v-if="answerList[index][0].status!='play'">{{ answerList[index][0].totalTime || 0 }}s</span>
                <img class="voice-img deletevoice img-right" src="/static/img/delete.png" alt="" :style="{visibility: 'hidden'}">
              </button>
            </div>
            <div class="cl-m-title" v-if="question.prompt">
              <p>提示：</p>
            </div>
            <div class="cl-m-text" v-if="question.prompt">
              <p v-html="question.prompt.replace(/\n/g, '<br />')"></p>
              <p><ImgPreview :imgList="question.promptImg"></ImgPreview></p>
            </div>
          </div>
        </div>
      </template>
    </template>
    <div class="footer">
      <div class="textBox">
        <p class="text">{{thirdPartyList[course.userId].name}}</p>
        <p>{{ course.title }}</p>
      </div>
      <img src="/static/img/qrcode-single.png" alt="">
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
    XTextarea,
    Flexbox,
    FlexboxItem,
    Checklist
  } from 'vux'
  import ImgPreview from 'components/ImgPreview'
  import TaskRadio from 'components/course/TaskRadio'
  import TaskCheckbox from 'components/course/TaskCheckbox'
  import common from 'src/common'
  import TourCourseLabelTarget from 'components/course/TourCourseLabelTarget'
  export default {
    components: {
      Tabbar,
      Cell,
      Group,
      Badge,
      Selector,
      XButton,
      XTextarea,
      Flexbox,
      FlexboxItem,
      Checklist,
      ImgPreview,
      TaskRadio,
      TaskCheckbox,
      TourCourseLabelTarget
    },
    data() {
      return {
        id: 0,
        userId: '',
        headimgurl: '',
        target: '',
        loaded: false,
        name: '',
        time: '',
        date: new Date(),
        pageSize: 0,
        totalPage: 5,
        course: {},
        task: {},
        answerList: [],
        methodindex: 0,
        allAnswerList: [],
        test: [],
        checklistTitle: 'ceshi',
        checkanswer: [],
        material: {},
        numHash: {},
        typeList: {
          1: '普通任务',
          2: '用餐任务',
          3: '住宿任务'
        },
        num2CharMap: ['A', 'B', 'C', 'D'],
        num2ChineseMap: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        statusMap: {'init': '按住开始录音', 'start': '录音中...', 'play': '播放中...'},
        showShare: false,
        hasUploadAnswer: false,
        thirdPartyList: {}
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      var methodindex = parseInt(this.$route.params.methodindex)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      console.log(common)
      let error = window.location.href.match(/source%3D\d{5}/)
      if (error) {
        this.userId = error[0].replace('source%3D', '')
      } else {
        this.userId = common.getShareParamter('source')
      }
      this.headimgurl = common.getShareParamter('headimgurl')
      console.log(this.headimgurl)
      this.name = decodeURIComponent(common.getShareParamter('name'))
      this.time = decodeURIComponent(common.getShareParamter('time'))
      this.$axios.all([this.getThirdPartyList()])
        .then(() => {
          this.$api.courseTour.getShareCourseSummary(this.userId, id)
            .then((course) => {
              this.allAnswerList = this.$material.formatTaskAnswer(course.material, this.answerList, course.userInfo.answers)
              course = this.$course.formatCourse(course)
              var material = this.$material.formatMaterial(course.material)
              this.material = material
              this.task = material.content[methodindex]
              this.course = course
              this.methodindex = this.getRealIndex(methodindex)
              this.answerList = this.allAnswerList[this.methodindex]
              this.target = this.$label.getLabelTitle(this.course.labelTheme)
              this.loaded = true
            })
        })
      this.$label.getLabelList().then((labelList) => {
        this.$label.getLabelTree(labelList)
      })

      // this.$api.course.reportClick(id)
    },
    mounted() {
    },
    methods: {
      getThirdPartyList () {
        var params = {
          offset: 0,
          length: 0
        }
        return this.$api.thirdParty.getThirdPartyList(params)
          .then((data) => {
            var temp = {}
            for (var i = 0; i < data.list.length; i++) {
              temp[data.list[i].user_id] = data.list[i]
            }
            this.thirdPartyList = temp
          })
      },
      startRecord(index, event) {
        this.playRecord(index, event)
        this.$wechat.onVoiceRecordEnd({
          complete: function (res) {
            this.uploadVoice(res.localId, index)
            this.$vux.alert.show('录音时间已超过一分钟，自动结束')
          }
        })
      },
      playRecord(index, event) {
        var _this = this
        event.target.firstChild.play()
        var playtime = this.answerList[index][0].totalTime * 1000
        this.answerList[index][0].status = 'play'
        setTimeout(function() {
          _this.answerList[index][0].status = ''
        }, playtime)
      },
      playend (index) {
        this.answerList[index][0].status = ''
      },
      getRealIndex(index) {
        var counter = -1
        for (var i = 0; i < index + 1; i++) {
          if (this.material.content[i].type === 'task') {
            counter++
          }
        }
        return counter
      }
    }
  }

</script>

<style scoped lang="scss">
  @import '~vue-swipe/dist/vue-swipe.css';
  .shareInfoTop{
    background: #fff;
    box-shadow: 0 1px 1px 0 #4c4c4c;
  }
  .headimg{
    width: 45px;
    height: 45px;
  }

  div.mint-swipe,
  div.mint-swipe-items-wrap {
    overflow: auto;
  }

  .cl-module:last-of-type{
    margin-bottom: 60px;
  }

  .method {
    color: #60c9cf;
    font-size: 13px;
    text-align: center;
    padding: 15px;
  }

  .option-text {
    color:#323b46;
  }

  .cl-m-body {
    padding: 15px 15px 0 15px;
    .cl-m-title {
      p {
        margin: 15px 15px -1px 15px;
        color: #00a6ac;
        font-size: 15px;
      }
    }
    .cl-m-text {
      p {
        margin: 0 15px 30px 15px;
        font-size: 15px;
        color: #7f7f7f;
      }
    }
  }

.voice-button {
  width: 231px;
  height: 42px;
  margin-left: 30px;
  /*box-shadow: 1px 1px 4px #888888;*/
  font-size: 13px;
  color: #c8d2dc;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0 0 0 10px;
  .voice-text {
    margin-left: 0;
    line-height: 42px;
    color: #c8d2dc;
  }
  .deletevoice{
    padding: 14px;
  }
}

.flexset {
  text-align: left;
  display: flex;
  box-align: center;
  align-items: center;
  margin-bottom: 30px;
  .time-left {
    float: left;
    margin-top: 1px;
    color: #c8d2dc;
  }
  .time-right {
    float: right;
    margin-top: 1px;
  }
  .img-right {
    float: right;
  }
  .img-left {
    float: left;
    margin-top: 8px;
  }
  .voice-text-left {
    float: left;
    margin-top: 14px;
  }
  .voice-text-gray {
    margin: 0;
    color: #c8d2dc;
  }
}

  li {
    list-style: none;
  }

  .progress {
    background-color: #ffffff;
    height: 6px;
    margin: 15px;
    border-radius: 3px;
  }

  .temop {
    background: #60c9cf;
    height: 6px;
    border-radius: 3px;
  }

  .label {
    .cl-module {
      padding-bottom: 60px;
    }
    .label {
      margin: 30px 20px;
      .detail li {
        text-align: right;
      }
    }
    img {
      width: 225px;
    }
    .cl-m-body {
      margin: 50px;
      .outline {
        text-align: center;
      }
      .title {
        p {
          margin-top: 20px;
        }
      }
    }
    ul {
      list-style: none;
    }
    li {
      margin-bottom: 10px;
    }
    .object {
      float: left;
      color: #00a6ac;
    }
    .detail {
      float: right;
    }
  }

  span {
    color: #60c9cf;
    margin-top: 5px;
    margin-left: 15px;
  }

  #tesk {
    color: #323b46;
    float: right;
    margin-right: 15px;
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
    margin: 5px 15px 15px 15px;
    color: #323b46;
    font-size: 17px;
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
      margin: 0 15px;
    }
  }

  .add-photo {
    font-size: 60px;
  }

  .print {
    .temop {
      width: 100%;
    }
    .photo-list {
      margin: 15px;
    }
    .photo-item {
      float: left;
      margin-right: 3px;
      margin-bottom: 3px;
      img {
        height: 93px;
        width: 93px;
      }
    }
  }
.inline-wrap{
  display: inline-block;
  vertical-align: top;
  .username{
    font-size: 20px;
    color: #00a6ac;
  }
  .time{
    color: #7f7f7f;
  }
}
.share-info{
  margin-top: 15px;
  font-size: 18px;
}
.share-icon{
  margin-top: 15px;
  font-size: 20px;
  text-align: center;
  color: #7f7f7f;
}
.lanmaimg{
  width: 60%;
  height: 60%;
}
h3{
  margin-bottom: 10px;
  color: #60c9cf;
  font-size: 20px;
}
.center{
  text-align: center;
}
.subscribe{
  color: #999;
}
.lanmatext{
  margin-bottom: 10px;
  text-align: left;
}
.hide {
  visibility: hidden;
}
.footer{
  background: rgb(250,233,220);
  text-align: left;
  padding: 10px 25px;
  margin-top: 20px;
  font-size: 14px;
  color: #7f7f7f;
  .textBox{
    width:80%;
    display: inline-block;
    text-align: right;
  }
  .text{
    color: #4c4c4c;
  }
  img{
    vertical-align: top;
    width: (50rem/16);
    height: (50rem/16);
  }
}
</style>
