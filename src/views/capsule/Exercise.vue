<template>
  <div>
    <div class="infoTop">
      <span class="titleName">{{ capsuleInfo.topic }}</span>
    </div>
    <div class="exerciseInfo">
      <textarea rows="10" placeholder="用文字记录..." class="exerText" v-model="exerText">
      </textarea>
      <div class="exerBottom">
        <span @click="addPhoto" class="soundBtn" v-if="!sound.soundExist && photo.urlList.length === 0"><img src="/static/img/capsule/photo.png" />添加照片</span>
        <span @click="addSound" class="soundBtn" v-if="!sound.soundExist && photo.urlList.length === 0"><img src="/static/img/capsule/sound.png" />添加录音</span>
        <div class="audioBox" v-if="sound.soundExist"><audio id="recordPlay" src="" preload="auto" controls v-if="sound.soundExist"></audio></div>
        <div class="photoBox" v-if="photo.urlList.length != 0">
          <span class="photoList" v-for="item,index in photo.urlList">
            <img class="close" src="/static/img/capsule/X3.png" @click="delPhoto(index)" />
            <img class="photo" :src="item" @click="previewImage(item,photo.urlList)" />
          </span>
          <span class="addPhoto" v-if="photo.urlList.length < 3 && photo.num < 3" @click="addPhoto">
            <span>+</span>
          </span>
        </div>
        <img class="closeIcon" src="/static/img/capsule/X1.png" v-if="sound.soundExist" @click="showIsConfirm = true" />
        <span @click="submit" class="submitBtn" v-if="sound.soundExist || exerText !== '' || photo.urlList.length !== 0">完 成</span>
        <span class="noSubmitBtn" v-else>完 成</span>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="soundShow" @on-hide="log(sound.soundExist)" @on-show="log('show')" :hide-on-blur="false" :popup-style="{'overflow':'hidden','background':'#fff'}" :show-mask="false">
        <div class="popupSound">
          <p class="soundTitle">
            录下孩子的分享，完成胶囊的练习：
          </p>
          <!--<div class="soundImgBox">
             <img class="imgCenter" src="/static/img/capsule/录音@1x.png" />
          </div>-->
          <flexbox class="soundImgBox">
            <flexbox-item class="soundImgItem" v-if="sound.soundExist">
              <img @click="playRecord(sound.playRecord)" :src="[!sound.playRecord ? '/static/img/capsule/播放录音@1x.png' : '/static/img/capsule/暂停录音@1x.png']" />
            </flexbox-item>
            <flexbox-item class="soundImgItem">
              <img @click="recordClick(sound.recording, sound.playRecord)" :class="{'imgCenter':sound.soundExist,'imgCenterOnly':!sound.soundExist}" :src="[sound.recording ? '/static/img/capsule/录音中@1x.png' : !sound.playRecord ? '/static/img/capsule/录音@1x.png' : '/static/img/capsule/播放录音灰@1x.png']" />
            </flexbox-item>
            <flexbox-item class="soundImgItem" v-if="sound.soundExist">
              <img @click="recordSubmit(sound.playRecord)" :src="[sound.soundExist ? !sound.playRecord?'/static/img/capsule/我讲完了绿色@1x.png':'/static/img/capsule/我讲完了@1x.png' : '']" />
            </flexbox-item>
          </flexbox>
          <flexbox class="soundTextBox">
            <flexbox-item class="soundImgItem" v-if="sound.soundExist">
              <p>
                {{ !sound.playRecord ? '播放录音' : '正在播放录音，点击暂停' }}
              </p>
            </flexbox-item>
            <flexbox-item class="soundImgItem" v-if="!sound.playRecord">
              <p>
                {{sound.textCenter}}
              </p>
            </flexbox-item>
            <flexbox-item class="soundImgItem" v-if="sound.soundExist && !sound.playRecord">
              <p>
                我讲完了
              </p>
            </flexbox-item>
          </flexbox>
        </div>
      </popup>
    </div>
    <div class="mask" v-show="soundShow" @click="hidePopup">
    </div>
    <div v-transfer-dom>
      <alert v-model="sound.recordingBeyound" title="已超时" button-text="我知道了">录音最长时间为60S</alert>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showIsConfirm"
      :title="'确认删除录音?'"
      @on-confirm="delRecordPlay">
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showDelPhoto"
      :title="'确认删除照片?'"
      @on-confirm="delPhotoConfirm"
      @on-cancel="photoCancel">
      </confirm>
    </div>
  </div>
</template>

<script>
import { Popup, TransferDom, Flexbox, FlexboxItem, Alert, Confirm } from 'vux'
import ImgPreview from 'components/ImgPreview'
import api from 'lanmaLib/common/api'
export default{
  components: {
    Popup,
    Flexbox,
    FlexboxItem,
    Alert,
    Confirm,
    ImgPreview
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      soundShow: false,
      capsuleId: 0,
      showIsConfirm: false,
      showDelPhoto: false,
      delPhotoIndex: '',
      sound: {
        timer: '',
        timeLength: 0,
        recordingText: 's/60s',
        textCenter: '单击开始录音',
        soundExist: false,
        recording: false,
        recordingBeyound: false,
        playRecord: false,
        url: '',
        localId: '',
        playTimer: ''
      },
      photo: {
        urlList: [],
        num: 0
      },
      exerText: '',
      capsuleInfo: {},
      type: 'text'
    }
  },
  computed: {
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.type = this.$route.params.type
    if (this.type === 'sound') {
      this.soundShow = true
    }
    this.capsuleId = id
    var params2 = {
      capsuleId: this.capsuleId,
      actionType: 'exercise'
    }
    api.capsule.getAction(params2)
      .then((res) => {
        if (res.id) {
          this.$router.go(-1)
        }
      })
    this.activityAddStatld(3, this.capsuleId)
    api.capsule.addClickCount(this.capsuleId, 'exerciseClick')
    this.init(id)
  },
  mounted () {
  },
  methods: {
    activityAddStatld (statId, capsuleId, shareUserId) {
      var params = {
        capsuleId: capsuleId,
        statId: statId,
        shareUserId: shareUserId
      }
      api.capsule.addActivityStat(params)
        .then((data) => {
        })
    },
    log (data) {
      console.log(data)
    },
    init (id) {
      var _this = this
      api.capsule.getCapsule(id)
        .then((data) => {
          this.capsuleInfo = data
          this.$nextTick(function () {
            if (this.type === 'photo') {
              this.$wechat.ready(() => {
                _this.addPhoto()
              })
            }
          })
        })
    },
    hidePopup () {
      if (!this.sound.soundExist && !this.sound.recording) {
        this.soundShow = false
      }
    },
    recordClick(recording, playRecord) {
      if (playRecord) {
        return
      }
      var _this = this
      var temp = 0
      if (!recording) {
        this.sound.recording = true
        this.sound.soundExist = false
        this.sound.textCenter = temp + this.sound.recordingText
        this.sound.timer = setInterval(function () {
          temp++
          _this.sound.timeLength = temp
          if (temp >= 59) {
            temp = 60
            _this.sound.timeLength = temp
            _this.sound.textCenter = temp + _this.sound.recordingText
            _this.sound.recordingBeyound = true
            _this.sound.soundExist = true
            _this.sound.textCenter = '重新录音'
            _this.sound.recording = false
            _this.stopRecord()
            clearInterval(_this.sound.timer)
          }
          if (_this.sound.recording) {
            _this.sound.textCenter = temp + _this.sound.recordingText
          }
        }, 1000)
        this.$wechat.startRecord({
          cancel: function () {
            this.$vux.alert.show('请允许授权录音')
          }
        })
        this.$wechat.onVoiceRecordEnd({
          complete: function (res) {
            this.uploadVoice(res.localId)
          }
        })
      } else {
        _this.stopRecord()
        this.sound.recording = false
        clearInterval(this.sound.timer)
        this.sound.soundExist = true
        this.sound.textCenter = '重新录音'
      }
    },
    playRecord (playRecord) {
      var audio = document.getElementById('recordPlay')
      var _this = this
      if (playRecord) {
        clearInterval(this.sound.playTimer)
        this.sound.playRecord = false
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
        }
      } else {
        var timeLength = this.sound.timeLength
        this.sound.playRecord = true
        audio.play()
        clearInterval(_this.sound.playTimer)
        this.sound.playTimer = setInterval(function () {
          timeLength--
          if (timeLength <= 0) {
            _this.sound.playRecord = false
            clearInterval(_this.sound.playTimer)
          }
        }, 1000)
      }
    },
    recordSubmit (playRecord) {
      if (playRecord) {
        return
      }
      this.soundShow = false
    },
    stopRecord () {
      var _this = this
      this.$wechat.stopRecord({
        success: function (res) {
          console.log('结束成功')
          _this.uploadVoice(res.localId)
        },
        fail: function (res) {
          console.log('结束失败' + res)
          this.$vux.alert.show(JSON.stringify(res))
        }
      })
    },
    uploadVoice (localId) {
      var _this = this
      console.log('开始上传')
      this.$wechat.uploadVoice({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
          console.log('微信上传成功')
          var serverId = res.serverId
          _this.$api.photo.uploadImg(serverId).then((data) => {
            console.log('服务器上传成功' + data.url)
            _this.sound.url = data.url
            _this.setSoundUrl(data.url)
            _this.sound.localId = localId
            // _this.uploadAnswer()
          })
        }
      })
    },
    addSound () {
      this.soundShow = true
    },
    setSoundUrl (url) {
      var audio = document.getElementById('recordPlay')
      audio.src = url
      audio.load()
    },
    submit () {
      var params = {
        capsuleId: this.capsuleId,
        actionType: 'exercise',
        actionText: {
          text: this.exerText,
          soundUrl: this.sound.url,
          timeLength: this.sound.timeLength,
          photoList: this.photo.urlList
        }
      }
      api.capsule.addAction(params)
        .then((res) => {
          var params = {
            capsuleId: this.capsuleId,
            statId: 6
          }
          api.capsule.addActivityStat(params)
            .then((data) => {
              this.$router.push('/capsule/exerciseEnd/' + this.capsuleId + '?isExerciseGo=true')
            })
        })
    },
    delRecordPlay () {
      this.sound.url = ''
      this.sound.soundExist = false
      this.sound.recording = false
      this.sound.recordingBeyound = false
      this.sound.playRecord = false
      this.sound.textCenter = '单击开始录音'
      this.showIsConfirm = false
    },
    addPhoto () {
      var count = 3 - this.photo.num
      this.$wechat.chooseImage({
        count: count, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.log(res)
          var localIds = res.localIds
          this.uoloadImg(0, localIds)
        }
      })
    },
    uoloadImg (index, urlList) {
      if (index >= urlList.length) {
        return
      }
      var localId = urlList[index]
      this.$wechat.uploadImage({
        localId: localId,
        success: (res) => {
          this.photo.num += 1
          var serverId = res.serverId
          this.$api.photo.uploadImg(serverId).then((data) => {
            this.photo.urlList.push(data.url)
            index++
            this.uoloadImg(index, urlList)
          })
          .catch(e => {
            this.photo.num -= 1
          })
        }
      })
    },
    delPhoto (index) {
      this.delPhotoIndex = index
      this.showDelPhoto = true
    },
    delPhotoConfirm () {
      if (this.delPhotoIndex === '') {
        return
      }
      this.photo.urlList.splice(this.delPhotoIndex, 1)
      this.photo.num -= 1
    },
    photoCancel () {
      this.showDelPhoto = false
      this.delPhotoIndex = ''
    },
    previewImage (url, urlList) {
      url = window.location.origin + window.location.pathname + url.replace('./', '')
      urlList = urlList.map(item => {
        return window.location.origin + window.location.pathname + item.replace('./', '')
      })
      this.$wechat.previewImage({
        current: url,
        urls: urlList
      })
    }
  }
}
</script>

<style scoped lang="scss">
.infoTop{
  background: #FFF;
  padding:15px 10px;
  margin-bottom: 10px;
  position: relative;
  box-shadow:0px 1px 1px 0 rgba(0,0,0,.2);
  .titleName{
    font-weight: bold;
    font-size: 1.0rem;
  }
}
.exerciseInfo{
  position: relative;
  padding: 0px;
  .exerText{
    border: 0px solid #000;
    box-sizing: border-box;
    width:100%;
    resize: none;
    font-size: 15px;
    padding: 10px 10px 70px 10px;
  }
  .exerBottom{
    position: absolute;
    bottom:10px;
    box-sizing: border-box;
    width:100%;
    height:40px;
    .soundBtn{
      font-size: 0.8rem;
      display: inline-block;
      background: #fff;
      border: 1px solid #4c4c4b;
      color: #4c4c4b;
      margin-left: 10px;
      padding: 5px 15px;
      border-radius: 10px;
      img{
        height:.9rem;
        vertical-align: text-top;
        margin-right: 5px;
      }
    }
    .closeIcon{
      height:15px;
      vertical-align:top;
      margin-left: 2px;
      margin-top: 7px;
    }
    .submitBtn{
      font-size: .9rem;
      display: block;
      padding: 5px 25px;
      border-radius: 5px;
      position: absolute;
      bottom: 5px;
      right:10px;
      background: #00a6ac;
      color: #fff;
    }
    .noSubmitBtn{
      font-size: .9rem;
      display: inline-block;
      padding: 5px 25px;
      border-radius: 5px;
      position: absolute;
      bottom: 5px;
      right:10px;
      background: #999;
      color: #FFF;
    }
  }
}
.soundTitle{
  font-family: PingFangSC-Regular;
  padding: 10px 0;
  line-height: 2rem;
  text-align: center;
  font-size: 1rem;
  color: #333;
  border-bottom: 1px solid #DADADA;
  background: #fff;
}
.soundTextBox{
  width:100%;
  padding-bottom: 15px;
  margin-top: -2px;
  .soundImgItem{
    text-align: center;
    p{
      font-family: PingFangSC-Regular;
      color: #4c4c4b;
      font-size: .9rem;
    }
  }
}
.soundImgBox{
  width:100%;
  padding-top: 15px;
  .soundImgItem{
    text-align: center;
    p{
      font-family: PingFangSC-Regular;
      color: #4c4c4b;
      font-size: 1rem;
    }
  }
  img{
    width:50%;
  }
  .imgCenter{
    width:65%;
  }
  .imgCenterOnly{
    width:20%;
  }
}
.popupSound{
  background: #fff;
  div{
    background: #fff;
  }
}
.audioBox{
  width:50%;
  display: inline-block;
  padding-left: 10px;
  overflow: hidden;
}
.photoBox{
  width:60%;
  height:4rem;
  display: inline-block;
  position: absolute;
  bottom: 5px;
  left: 10px;
  .photoList{
    display: inline-block;
    width:4rem;
    position: relative;
    height:4rem;
    margin-right:10px;
    .photo{
      width:100%;
      height:100%;
    }
    .close{
      width: 1rem;
      height: 1rem;
      position: absolute;
      right:-0.4rem;
      top:-0.4rem;
    }
  }
  .addPhoto{
    width:4rem;
    height:4rem;
    box-sizing: border-box;
    border: 1px solid #ccc;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    line-height: 4rem;
    &:active{
      background: #ccc;
    }
    span{
      font-family: Droidsansfallback;
      display: inline-block;
      color: #999;
      font-size: 4.5rem;
      height:4rem;
      line-height: 4rem;
      font-weight: 100;
    }
  }
}
#recordPlay{
  width:100%;
}
@media screen and (max-width: 330px) {
  #recordPlay {
    width:50%;
    max-width:160px;
  }
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  background: rgba(0,0,0,.8);
  z-index: 500;
  transition: opacity 400ms;
}
</style>