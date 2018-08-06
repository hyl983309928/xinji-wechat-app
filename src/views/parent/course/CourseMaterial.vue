<template>
  <div class="study-page" :style="{height: pageSize + 'px'}">

    <!--<template v-for="(task, index) in material.taskList">-->
    <template v-for="(question, index) in task.questions">
      <template v-if="question.type==='photo'">
        <div class="cl-module">
          <div class="cl-m-header">
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="(index+1) + '. '+'照片题' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
            <div class="port">
              <span class="preview" v-for="img in answerList[index]" v-if="!hasAnswer">
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
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="(index+1) + '. ' + '单选题：' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
            <TaskRadio  :options="question.option" :isDisabled="hasAnswer" v-model="answerList[index]" :radioname="index"></TaskRadio>
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
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="(index+1) + '. '  + '多选题：' + question.question.replace(/\n/g, '<br />')">
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
            {{ task.title }} 任务{{ num2ChineseMap[index+1] }}
          </div>
          <div class="cl-m-body">
            <div class="public" v-if="question.question" v-html="(index+1)+ '. ' + '录音题' + question.question.replace(/\n/g, '<br />')">
            </div>
            <hr>
                <div class="public flexset vux-flex-row" v-if="!hasAnswer">
                  <img src="/static/img/mic.png" alt="">
                  <button class="voice-button" @touchstart.prevent="startRecord(index, $event)" @touchend="endRecord(index, $event)">
                    <audio :src="answerList[index][0].url" @ended="playend(index)"></audio>
                    <img class="img-left" src="/static/img/voice_gray.png" alt="" v-if="answerList[index][0].url && answerList[index][0].status!='play'">
                    <span class="voice-text" v-if="(answerList[index][0].status && !answerList[index][0].url) || (answerList[index][0].status && answerList[index][0].status=='play')">{{ statusMap[answerList[index][0].status] }}</span>
                    <span class="voice-text-left" v-if="answerList[index][0].url && answerList[index][0].status!='play'">{{ answerList[index][0].totalTime }}s</span>
                    <img class="voice-img deletevoice img-right" src="/static/img/delete.png" alt="" v-show="answerList[index][0].url && answerList[index][0].status!='play'" :style="{visibility: hasAnswer?'hidden':''}">
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
    </template>
    <div style="padding: 20px;"></div>
    <div class="footer"  @click="uploadAnswer">
      <span class="commit">{{ hasAnswer ? '分享给朋友' : '提交任务答案' }}</span>
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
          <h3>任务已提交</h3>
          <p>要不要把任务卡分享给身边的家长朋友？</p>
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
    Checklist,
    Masker,
    XDialog
  } from 'vux'
  import ImgPreview from 'components/ImgPreview'
  import TaskRadio from 'components/course/TaskRadio'
  import TaskCheckbox from 'components/course/TaskCheckbox'
  // import { Swipe, SwipeItem } from 'vue-swipe'
  import _ from 'lodash'
  import StatModel from 'lanmaLib/modules/statistics'
  import common from 'src/common'
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
      Flexbox,
      FlexboxItem,
      Checklist,
      ImgPreview,
      Masker,
      XDialog,
      TaskRadio,
      TaskCheckbox
    },
    data() {
      return {
        id: 0,
        pageSize: 0,
        totalPage: 5,
        course: {},
        task: {},
        showShare: false,
        answerList: [],
        methodindex: 0,
        hasAnswer: false,
        allAnswerList: [],
        showDialog: false,
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
        thirdPartyList: []
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
        var taskindex = parseInt(this.$route.params.methodindex)
        if (isNaN(id) || id < 0) {
          id = 0
        }
        var statId = common.getShareParamter('statId')
        if (statId && id) {
          StatModel.activityAddStat(statId, id, taskindex + 1)
        }
        this.$axios.all([this.getThirdPartyList()])
          .then(() => {
            this.id = id
            this.$api.course.reportClick(id).then((course) => {
              this.allAnswerList = this.$material.formatTaskAnswer(course.material, this.answerList, course.userInfo.answers)
              course = this.$course.formatCourse(course)
              var material = this.$material.formatMaterial(course.material)
              this.material = material
              this.task = material.content[taskindex]
              this.course = course
              this.methodindex = this.getRealIndex(taskindex)
              this.answerList = this.allAnswerList[this.methodindex]
              this.hasAnswer = !(_.isEmpty(course.userInfo.answers[this.methodindex]))
              this.setShare()
            })
          })
        this.$label.getLabelList().then((labelList) => {
          this.$label.getLabelTree(labelList)
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
                this.$api.photo.uploadImg(serverId).then((data) => {
                  this.answerList[index].push(data.url)
                })
              }
            })
          }
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
              console.log('结束成功')
              _this.uploadVoice(res.localId, index)
            },
            fail: function (res) {
              console.log('结束失败' + res)
              this.$vux.alert.show(JSON.stringify(res))
            }
          })
        }
      },
      uploadVoice(localId, index) {
        var _this = this
        console.log('开始上传')
        this.$wechat.uploadVoice({
          localId: localId,
          isShowProgressTips: 1,
          success: function (res) {
            console.log('微信上传成功')
            // _this.$vux.alert.show('微信上传成功')
            var serverId = res.serverId
            _this.$api.photo.uploadImg(serverId).then((data) => {
              console.log('服务器上传成功' + data.url)
              _this.answerList[index][0].url = data.url
              _this.answerList[index][0].localId = localId
              // _this.uploadAnswer()
            })
          }
        })
      },
      deleteRecord(index, event) {
        // event.currentTarget.querySelector('.voice-text').innerText = '按住开始录音'
        this.answerList[index][0].url = ''
        this.answerList[index][0].localId = ''
        this.answerList[index][0].totalTime = ''
        this.answerList[index][0].status = 'init'
      },
      setSingleAnswer (index, answer) {
        // this.$vux.alert.show(JSON.stringify(answer))
        this.answerList[index] = [answer]
        // this.uploadAnswer()
      },
      uploadAnswer () {
        if (this.hasAnswer) {
          this.showShare = true
          return
        }
        this.showConfirm('确定要提交答案？', () => {
          for (var i = 0; i < this.answerList.length; i++) {
            this.answerList[i] = this.answerList[i].sort()
          }
          this.$api.course.setTaskAnswer(this.id, this.methodindex, this.answerList).then((res) => {
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
      deletePhoto (photo, answerindex) {
        this.showConfirm('照片删除后将不能恢复，是否删除', () => {
          this.answerList[answerindex].forEach((_p, index) => {
            if (_p === photo) {
              this.answerList[answerindex].splice(index, 1)
            }
          })
          // this.uploadAnswer()
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
        var title = `今天带孩子参加[${this.thirdPartyList[this.course.userId].name}]的[${this.course.title}]，很受启发。`
        var desc = `我正陪孩子完成[${this.task.title}]任务，很有意思，分享给大家看看！`
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
  @import '~vue-swipe/dist/vue-swipe.css';

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
        line-height: 15px;
      }
    }
    .preview_h{
      margin: 15px 15px 0 15px;
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
