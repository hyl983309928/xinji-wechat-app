<template>
  <div class="study-page" v-if="loaded">
    <!--<swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false">-->
    <!--<swipe-item v-for="(homework, index) in material.homework">-->
    <div v-if="!hasHomework" style="text-align:center;margin-top:80px;color:#7f7f7f;">这堂课没有布置作业</div>
    <div v-if="hasHomework">
      <div class="cl-module">
        <div class="cl-m-header">
          {{ homework.title }}
        </div>
        <div class="cl-m-body">
          <div class="cl-m-title" v-if="homework.participant && homework.participant!='请选择'">
            <p>参与对象</p>
          </div>
          <div class="cl-m-text" v-if="homework.participant && homework.participant!='请选择'">
            <p>{{ homework.participant }}</p>
          </div>
          <div class="cl-m-title" v-if="homework.material">
            <p>准备材料</p>
          </div>
          <div class="cl-m-text" v-if="homework.material">
            <p>{{ homework.material }}</p>
          </div>
          <div class="cl-m-title" v-if="homework.rule && homework.rule!='<p><br></p>'">
            <p>{{thirdPartyId == 1 ? '游戏规则': '作业内容'}}</p>
          </div>
          <div class="cl-m-text vHtml" v-if="homework.rule && homework.rule!='<p><br></p>'">
            <p  v-html="homework.rule.replace(/\n/g, '<br />')"></p>
          </div>
          <div class="cl-m-title" v-if="homework.guide && homework.guide!='<p><br></p>'">
            <p>{{thirdPartyId == 1 ? '游戏指引': '要点提示'}}</p>
          </div>
          <div class="cl-m-text vHtml" v-if="homework.guide && homework.guide!='<p><br></p>'">
            <p v-html="homework.guide.replace(/\n/g, '<br />')"></p>
          </div>
        </div>
      </div>
    </div>

    <template v-if="hasHomework" v-for="(question, index) in homework.question">
        <!--<template v-for="(question, index) in task.questions">-->
          <template v-if="question.type==='photo'">
            <div class="cl-module">
              <div class="cl-m-header">
                {{ homework.title }} {{thirdPartyId == 1 ? '任务': '题目'}}{{ num2ChineseMap[index+1] }}
              </div>
              <div class="cl-m-body">
                <div class="public" v-if="question.question" v-html="(index+1) + '. ' + '照片题：' + question.question.replace(/\n/g, '<br />')">
                </div>
                <hr>
                <div class="port">
                  <span class="preview" v-for="img in answerList[index]"  v-if="!hasAnswer">
                    <img :src="img" @click="previewImg(img, answerList[index])">
                    <span class="iconfont icon-close delete-btn" @click="deletePhoto(img, index)"></span>
                  </span>
                  <ImgPreview v-if="hasAnswer" class="preview_h" :imgList="answerList[index]"></ImgPreview>
                  <span slot="icon" class="iconfont icon-plus add-photo" @click="uploadImg(index)" v-if="answerList[index].length < 3 && !hasAnswer"></span>
                  <div class="clear"></div>
                </div>
                <div class="cl-m-title" v-if="question.prompt">
                  <p>提示：</p>
                </div>
                <div class="cl-m-text">
                  <p v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')"></p>
                </div>
              </div>
            </div>
          </template>
          <template v-if="question.type==='choose'">
            <div class="cl-module">
              <div class="cl-m-header">
                {{ homework.title }} {{thirdPartyId == 1 ? '任务': '题目'}}{{ num2ChineseMap[index+1] }}
              </div>
              <div class="cl-m-body">
                <div class="public" v-if="question.question" v-html="(index+1) + '. ' + '单选题：' + question.question.replace(/\n/g, '<br />')">
                </div>
                <hr>
                <TaskRadio :options="question.option" :isDisabled="hasAnswer" v-model="answerList[index]" :radioname="index"></TaskRadio>
                <div class="cl-m-title" v-if="question.prompt">
                  <p>提示：</p>
                </div>
                <div class="cl-m-text">
                  <p v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')"></p>
                </div>
              </div>
            </div>
          </template>
          <template v-if="question.type==='mulchoose'">
            <div class="cl-module">
              <div class="cl-m-header">
                {{ homework.title }} {{thirdPartyId == 1 ? '任务': '题目'}}{{ num2ChineseMap[index+1] }}
              </div>
              <div class="cl-m-body">
                <div class="public" v-if="question.question" v-html="(index+1) + '. ' + '多选题：' + question.question.replace(/\n/g, '<br />')">
                </div>
                <hr>
                <TaskCheckbox :options="question.option" :isDisabled="hasAnswer" v-model="answerList[index]" :checkboxname="index"></TaskCheckbox>
                <div class="cl-m-title" v-if="question.prompt">
                  <p>提示：</p>
                </div>
                <div class="cl-m-text">
                  <p v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')"></p>
                </div>
              </div>
            </div>
          </template>
          <template v-if="question.type==='sound'">
            <div class="cl-module">
              <div class="cl-m-header">
                {{ homework.title }} {{thirdPartyId == 1 ? '任务': '题目'}}{{ num2ChineseMap[index+1] }}
              </div>
              <div class="cl-m-body">
                <div class="public" v-if="question.question" v-html="(index+1) + '. ' + '录音题：' + question.question.replace(/\n/g, '<br />')">
                </div>
                <hr>
                <div v-if="!hasAnswer" class="public flexset vux-flex-row">
                  <img src="/static/img/mic.png" alt="">
                  <button class="voice-button" @touchstart.prevent="startRecord(index, $event)" @touchend="endRecord(index, $event)">
                    <audio :src="answerList[index][0].url" @ended="playend(index)"></audio>
                    <img class="img-left" src="/static/img/voice_gray.png" alt="" v-if="answerList[index][0].url && answerList[index][0].status!='play'">
                    <span class="voice-text" v-if="(answerList[index][0].status && !answerList[index][0].url) || (answerList[index][0].status && answerList[index][0].status=='play')">{{ statusMap[answerList[index][0].status] }}</span>
                    <span class="voice-text-left" v-if="answerList[index][0].url && answerList[index][0].status!='play'">{{ answerList[index][0].totalTime }}s</span>
                    <img class="voice-img deletevoice img-right" src="/static/img/delete.png" alt="" v-if="answerList[index][0].url && answerList[index][0].status!='play'">
                  </button>
                </div>
                <div v-if="hasAnswer" class="public flexset vux-flex-row">
                  <img src="/static/img/mic.png" alt="">
                  <button class="voice-button" @touchstart.prevent="startRecord(index, $event)" @touchend="endRecord(index, $event)">
                    <audio :src="answerList[index][0].url" @ended="playend(index)"></audio>
                    <img class="img-left" src="/static/img/voice_gray.png" alt="" v-if="answerList[index][0].status!='play'">
                    <!-- <span class="voice-text" v-if="(answerList[index][0].status && !answerList[index][0].url) || (answerList[index][0].status && answerList[index][0].status=='play')">{{ statusMap[answerList[index][0].status] }}</span> -->
                    <span class="voice-text-left" v-if="answerList[index][0].status!='play'">{{ answerList[index][0].totalTime || 0 }}s</span>
                    <img class="voice-img deletevoice img-right" src="/static/img/delete.png" alt="" :style="{visibility: hasAnswer?'hidden':''}">
                  </button>
                </div>
                <div class="cl-m-title" v-if="question.prompt">
                  <p>提示：</p>
                </div>
                <div class="cl-m-text">
                  <p v-if="question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')"></p>
                </div>
              </div>
            </div>
          </template>
        <!--</template>-->
    </template>

    <div style="padding: 20px;"></div>
    <div class="footer"  @click="uploadAnswer" v-if="hasHomework">
      <span class="commit">{{ hasAnswer ? '分享给朋友' : '提交作业' }}</span>
    </div>
    <div class="masker" v-if="showShare" @click="showShare=!showShare">
      <masker>
        <div slot="content" class="m-title">
          <img class="model-img" src="/static/img/shareintro.png" alt="">
        </div>
      </masker>
      <p class="share-text">请点击右上角 分享给其他家长</p>
    </div>

    <div>
      <x-dialog v-model="showDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', 'background-color': 'transparent'}">
        <div class="dialog_wrap">
          <h3>作业已提交</h3>
          <p>把作业分享给身边的家长朋友看看？</p>
          <p>他们也可以带孩子这么玩哒~</p>
          <x-button type="primary" class="button" @click.native="showDialog=false,showShare=true">分享给朋友</x-button>
          <x-button type="primary" class="button disabled" @click.native="$wechat.closeWindow()">不，我自己知道就好了</x-button>
        </div>
      </x-dialog>
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
  Masker,
  XDialog
} from 'vux'
import ImgPreview from 'components/ImgPreview'
import TaskRadio from 'components/course/TaskRadio'
import TaskCheckbox from 'components/course/TaskCheckbox'
import _ from 'lodash'
import StatModel from 'lanmaLib/modules/statistics'
import common from 'src/common'
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
    ImgPreview,
    Masker,
    XDialog,
    TaskRadio,
    TaskCheckbox
    // Swipe,
    // SwipeItem
  },
  data() {
    return {
      id: 0,
      thirdPartyId: 0,
      loaded: false,
      courseTitle: '',
      showDialog: false,
      homework: {},
      answerList: [],
      showShare: false,
      hasAnswer: false,
      hasHomework: true,
      recordStartTime: 0,
      showingTime: 0,
      totalTime: 0,
      checklist001: '',
      num2CharMap: ['A', 'B', 'C', 'D'],
      num2ChineseMap: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      statusMap: {'init': '按住开始录音', 'start': '录音中...', 'play': '播放中...'},
      thirdPartyList: [],
      course: {}
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
      var statId = common.getShareParamter('statId')
      if (statId && id) {
        StatModel.activityAddStat(statId, id)
      }
      this.$axios.all([this.getThirdPartyList()])
        .then(() => {
          this.$api.course.reportClick(id).then((course) => {
            this.course = course
            this.courseTitle = course.title
            this.thirdPartyId = course.userId
            this.homework = course.material.homework
            this.hasHomework = !_.isEmpty(this.homework.question)
            this.$material.formatHomeworkAnswer(course.material, this.answerList, course.userInfo.homework_answers)
            this.hasAnswer = !(_.isEmpty(course.userInfo.homework_answers))
            this.loaded = true
            this.setShare()
          })
        })
    },
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
    uploadImg(index) {
      // var _this = this
      this.$wechat.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds

          var localId = localIds[0]

          this.$wechat.uploadImage({
            localId: localId,
            success: (res) => {
              var serverId = res.serverId
              // window.xLog('serverId:' + serverId)
              this.$api.photo.uploadImg(serverId).then((data) => {
                this.answerList[index].push(data.url)
                // _this.uploadAnswer()
              })
            }
          })
        }
      })
    },
    deletePhoto (photo, answerindex) {
      this.showConfirm('确认删除？', () => {
        this.answerList[answerindex].forEach((_p, index) => {
          if (_p === photo) {
            this.answerList[answerindex].splice(index, 1)
          }
        })
      })
    },
    startRecord(index, event) {
      if (event.target.className.indexOf('deletevoice') !== -1) {
        this.deleteRecord(index, event)
      } else if (!this.answerList[index][0].url && !this.hasAnswer) {
        this.answerList[index][0].status = 'start'
        this.recordStartTime = new Date().getTime()
        this.$wechat.startRecord({
          cancel: function () {
            this.$vux.alert.show('请允许授权录音')
          }
        })
      } else {
        this.playRecord(index, event)
      }

      this.$wechat.onVoiceRecordEnd({
        complete: function (res) {
          this.uploadVoice(res.localId, index)
          this.$vux.alert.show('录音时间已超过一分钟，自动结束')
        }
      })
    },
    endRecord(index, event) {
      if (!this.answerList[index][0].url && !this.hasAnswer) {
        var _this = this
        var time = new Date().getTime() - this.recordStartTime
        this.answerList[index][0].totalTime = parseInt(time / 1000)
        if (time < 1000) {
          setTimeout(function() {
            _this.$vux.toast.show({
              text: '录音时间过短',
              type: 'warn'
            })
            _this.$wechat.stopRecord({})
            _this.answerList[index][0].status = 'init'
          }, 1000 - time)
          return
        }
        this.$wechat.stopRecord({
          success: function (res) {
            _this.uploadVoice(res.localId, index)
          },
          fail: function (res) {
            this.$vux.alert.show(JSON.stringify(res))
          }
        })
      }
    },
    uploadVoice(localId, index) {
      var _this = this
      this.$wechat.uploadVoice({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
          var serverId = res.serverId
          _this.$api.photo.uploadImg(serverId).then((data) => {
            _this.answerList[index][0].url = data.url
            _this.answerList[index][0].localId = localId
          })
        }
      })
    },
    deleteRecord(index, event) {
      this.answerList[index][0].url = ''
      this.answerList[index][0].localId = ''
      this.answerList[index][0].totalTime = ''
      this.answerList[index][0].status = 'init'
    },
    setSingleAnswer (index, answer) {
      this.answerList[index] = [answer]
    },
    uploadAnswer () {
      if (this.hasAnswer) {
        this.showShare = true
        return
      }
      console.log(JSON.stringify(this.answerList))
      if (!JSON.stringify(this.answerList).match(/A|B|C|D|\.\/uploads/)) {
        this.$vux.toast.show({
          text: '作业还没有完成呢.',
          type: 'warn'
        })
        return
      }
      this.showConfirm('确定要提交答案？', () => {
        for (var i = 0; i < this.answerList.length; i++) {
          this.answerList[i] = this.answerList[i].sort()
        }
        this.$api.course.setHomeworkAnswer(this.id, this.answerList).then((res) => {
          this.showDialog = true
          this.init()
        }).catch((e) => {
          this.$vux.toast.show({
            text: e.message,
            type: 'warn'
          })
        })
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
      // this.$wechat.onVoicePlayEnd({
      //   complete: function (res) {
      //     homework.answer.playing = false
      //   }
      // })
    },
    playend (index) {
      this.answerList[index][0].status = ''
    },
    submit() {
      var answerList = []
      this.material.homework.forEach((item) => {
        var answer = item.answer
        answer.homework_id = item.id
        answer.course_id = item.course_id
        answerList.push(answer)
      })
      var data = {
        course_id: this.course.id,
        answer_list: answerList
      }
      this.$api.course.submitHomework(data).then((res) => {
        this.$vux.toast.show({
          text: '提交成功',
          type: 'success'
        })
        this.$router.push('/parent/course/report/' + this.id)
      }).catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    },
    previewImg(currentUrl, urlList) {
      currentUrl = window.location.origin + window.location.pathname + currentUrl.replace('./', '')
      urlList = urlList.map(item => {
        return window.location.origin + window.location.pathname + item.replace('./', '')
      })
      this.$wechat.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: urlList // 需要预览的图片http链接列表
      })
    },
    setShare() {
      var title = `和孩子一起完成了一项很有意思的课后作业。`
      var desc = `课程：${this.courseTitle} \n作业：${this.homework.title}`
      var imgUrl = window.location.origin + window.location.pathname + this.course.cover.substring(2)
      var answerJson = JSON.stringify(this.answerList).match('\\[\\"\\.\\/.+?\\.(?!mp3)(jpeg|jpg|gif|png)')
      if (answerJson) {
        imgUrl = window.location.origin + window.location.pathname + answerJson[0].replace('["./', '')
      }
      console.log(imgUrl)
      this.$share.setShareInfo(title, desc, imgUrl)
    }
  }
}
</script>

<style scoped lang="scss">
.study-page {
  font-size: 17px;
  padding-bottom: 60px;
}

div.mint-swipe,
div.mint-swipe-items-wrap {
  overflow: auto;
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

.option-text {
  color:#323b46;
}

.cl-module {
  /*padding-bottom: 60px;*/
}

.cl-m-body {
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
    position: relative;
    img {
      height: 80px;
      width: 80px;
    }
    .delete-btn{
      position: absolute;
      width:15px;
      height:15px;
      bottom:0;
      left:-15px;
      background-color: rgba(50, 59, 70, 0.5);
      /*border-radius: 15px;*/
      line-height: 17px;
    }
  }
  .preview_h{
      margin: 15px 15px 0 15px;
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

.add-photo {
  font-size: 60px;
}
.hide {
  visibility: hidden;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 17px;
  line-height: 50px;
  text-align: center;
  background-color: #00a6ac;
  span{
    color: #fff;
  }
  .commit {
    margin-left: 0;
  }
}
.masker{
  margin: 0;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.8;
  background-color:#000;
  span{
    color: #fff;
  }
  .share-text{
    color: #fff;
    margin-top: 41%;
    text-align: center;
  }
  .model-img{
    float: right;
    margin-right: 20px;
  }
}
.dialog_wrap{
  margin: 0 40px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  h3{
    font-weight: 100;
    margin-bottom: 20px;
  }
  p{
    margin-bottom: 20px;
    font-size: 14px;
    text-align: left;
  }
  .button{
    margin: 0 auto;
    border-radius: 20px;
    width: 170px;
    margin-top: 10px;
    font-size: 14px;
    background: #4bd3e7;
  }
  .disabled{
    background-color: #ccc;
  }
}
</style>
