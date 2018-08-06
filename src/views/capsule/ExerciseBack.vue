<template>
  <div class="exerBackPage">
    <div class="top">
      <span class="shareInfo">分享给朋友</span>
    </div>
    <div class="title">
      <div class="logoAndInfo">
        <img src="/static/img/capsule/标题@1x.png" />
      </div>
      <div class="titleContent">
        <h4>{{ capsuleInfo.topic }}</h4>
        <span>目标：{{ capsuleInfo.labelTarget_title }}</span><br />
        <span v-if="capsuleInfo.labelScene_title">场景：{{ capsuleInfo.labelScene_title.join('、') }}</span><br />
        <div @click="goCapsule">
          去看看 >
        </div>
      </div>
    </div>
    <div class="border">
    </div>
    <div class="exerciseBox">
      <div class="infoBox">
        <div class="userInfo">
          <img :src="headimgurl" />
          <span class="parentName">{{ name }}</span>
        </div>
        <div class="exercised">我和孩子已练习{{ exerciseCount }}个胶囊</div>
      </div>
      <div class="exerInfo" v-if="exerciseInfo.exercise">
        <div class="recordBox" v-if="exerciseInfo.exercise.soundUrl && exerciseInfo.exercise.soundUrl.length !== 0">
          <audio @canplay="changeAudio" id="recordPlay" :src="exerciseInfo.exercise.soundUrl" preload="auto">
          </audio>
          <!--<audio @canplay="changeAudio" id="recordPlay" src="../../../static/img/capsule/Big_Easy.ogg" preload="auto">
          </audio>-->
          <div @click="audioPlay" class="audio">
            <img src="/static/img/capsule/语音2@1x.png" class="icon"></img>
            <span class="length" v-if="!sound.playing">{{ exerciseInfo.exercise.timeLength }}"</span>
            <span class="length" v-else>{{ sound.playTime }}"</span>
          </div>
        </div>
        <div :class="[exerciseInfo.exercise.photoList.length == 1 ? 'answerTextOne':'answerText']" v-if="exerciseInfo.exercise.text && exerciseInfo.exercise.text.length !== 0" >
          <p>{{ exerciseInfo.exercise.text }}</p>
        </div>
        <div class="photoBox" v-if="exerciseInfo.exercise.photoList && exerciseInfo.exercise.photoList.length !== 0">
          <span :class="[exerciseInfo.exercise.photoList.length == 1 ? 'photoOne':'photo']" v-for="item in exerciseInfo.exercise.photoList">
            <img :src="item" @click="previewImage(item,exerciseInfo.exercise.photoList)"/>
          </span>
        </div>
      </div>
    </div>
    <loading :show="showLoading" :text="'加载中'"></loading>
  </div>
</template>

<script>
import { XButton, Loading } from 'vux'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import userModule from 'lanmaLib/modules/user'
import common from 'src/common'
export default{
  components: {
    XButton,
    Loading
  },
  data () {
    return {
      showLoading: false,
      capsuleId: 0,
      userId: 0,
      headimgurl: '',
      name: '',
      time: '',
      shareDialogShow: false,
      capsuleInfo: {},
      exerciseInfo: {},
      userInfo: {},
      childrenInfo: {},
      isSubscribe: false,
      exerciseCount: 0,
      sound: {
        playing: false,
        time: 0,
        playTime: 0,
        timer: ''
      }
    }
  },
  created () {
    var capsuleId = parseInt(this.$route.params.capsuleId)
    this.userId = common.getShareParamter('source')
    this.headimgurl = common.getShareParamter('headimgurl')
    this.name = decodeURIComponent(common.getShareParamter('name'))
    this.time = decodeURIComponent(common.getShareParamter('time'))
    if (isNaN(capsuleId) || capsuleId < 0) {
      capsuleId = 0
    }
    this.showLoading = true
    this.capsuleId = capsuleId
    this.getCapsuleUsedCount()
    userModule.getUserInfo()
      .then((userInfo) => {
        this.userInfo = userInfo
        console.log(this.userInfo)
        this.activityAddStatld(8, this.capsuleId, this.userId)
      })
    api.user.isSubscribe()
      .then((res) => {
        this.isSubscribe = res
      })
    labelModule.getLabelList().then((labelList) => {
      this.hashTable = labelModule.getHashTable(labelList)
      this.getAuthorList(this.capsuleId)
    })
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
    setExerH () {
      var box = document.getElementsByClassName('exerBackPage')[0]
      var topEl = document.getElementsByClassName('top')[0]
      var titleEl = document.getElementsByClassName('title')[0]
      var exerEl = document.getElementsByClassName('exerInfo')[0]
      var borderEl = document.getElementsByClassName('border')[0]
      var infoEl = document.getElementsByClassName('infoBox')[0]
      var htmlH = window.innerHeight
      var boxH = box.offsetHeight
      if (htmlH >= boxH && exerEl) {
        exerEl.style.height = (htmlH - topEl.offsetHeight - titleEl.offsetHeight - borderEl.offsetHeight - infoEl.offsetHeight) + 'px'
      }
    },
    changeAudio () {
//    var _this = this
//    var audioEl = document.getElementById('recordPlay')
//    var temp = 0
//    audioEl.play()
//    audioEl.pause()
//    var timer = setInterval(function () {
//      temp++
//      if (parseInt(audioEl.duration) !== 0 && !isNaN(parseInt(audioEl.duration))) {
//        _this.sound.time = parseInt(audioEl.duration)
//        clearInterval(timer)
//      }
//      if (temp > 10) {
//        clearInterval(timer)
//      }
//    }, 1000)
//    console.log(parseInt(audioEl.duration))
    },
    goCapsule () {
      if (this.isSubscribe) {
        var params = {
          capsuleId: this.capsuleId,
          statId: 9,
          shareUserId: this.userInfo.id
        }
        api.capsule.addActivityStat(params)
          .then((data) => {
            this.$router.push('/capsule/info/' + this.capsuleId)
          })
      } else {
        this.$router.push('/capsule/info/' + this.capsuleId)
      }
    },
    init (id) {
      api.capsule.getCapsule(id)
        .then((data) => {
          data.labelScene_title = []
          data.labelAge_title = []
          data.authorInfo = this.authorTable[data.authorId]
          data.labelTarget_title = labelModule.getThemeLabel(data.labelTarget).replace(/ \/ /g, '|')
          data.guide = this.hashTable[data.labelTarget].guide
          data.description = this.hashTable[data.labelTarget].description
          for (var i = 0; i < data.labelScene.length; i++) {
            data.labelScene_title.push(this.hashTable[data.labelScene[i]].title)
          }
          if (data.labelAge.length === 1) {
            data.labelAge_title = this.hashTable[data.labelAge[0]].title
          } else {
            var hashTable = this.hashTable
            var temp = []
            var temp1 = hashTable[data.labelAge[0]].code.split(/_/).splice(0, 2)
            var temp2 = hashTable[data.labelAge[1]].code.split(/_/).splice(0, 2)
            if (temp1[0] > temp2[0]) {
              temp.push(temp2[0], temp1[1])
            } else {
              temp.push(temp1[0], temp2[1])
            }
            data.labelAge_title = temp.join('-') + '岁'
          }
          this.capsuleInfo = data
          this.getExerciseInfo()
          this.getUserInfo()
          console.log(data)
        })
    },
    getCapsuleUsedCount () {
      api.capsule.getExerciseCount(this.userId)
        .then((count) => {
          this.exerciseCount = count
        })
    },
    getAge (birthday) {
      if (!birthday || birthday.length === 0) {
        return -1
      }
      var returnAge = -1
      var birthdayArr = birthday.split('-')
      var birthYear = parseInt(birthdayArr[0])
      var birthMonth = parseInt(birthdayArr[1])
      var birthDay = parseInt(birthdayArr[2])
      var d = new Date()
      var nowYear = d.getFullYear()
      var nowMonth = d.getMonth() + 1
      var nowDay = d.getDate()
      if (nowYear === birthYear) {
        returnAge = 0
      } else {
        var ageDiff = nowYear - birthYear
        if (ageDiff > 0) {
          if (nowMonth === birthMonth) {
            var dayDiff = nowDay - birthDay
            if (dayDiff < 0) {
              returnAge = ageDiff - 1
            } else {
              returnAge = ageDiff
            }
          } else {
            var monthDiff = nowMonth - birthMonth
            if (monthDiff < 0) {
              returnAge = ageDiff - 1
            } else {
              returnAge = ageDiff
            }
          }
        } else {
          returnAge = -1
        }
      }
      console.log(returnAge)
      return returnAge
    },
    getAuthorList (id) {
      var authorParams = {
        offset: 0,
        length: 0,
        authorType: 0,
        authorTypeList: [0, 1, 2]
      }
      api.capsule.getCertificaList(authorParams)
        .then((data) => {
          var temp = {}
          data.list.forEach(function (item) {
            temp[item.id] = item
          })
          this.authorTable = temp
          this.init(id)
        })
    },
    getExerciseInfo () {
      var params2 = {
        capsuleId: this.capsuleId,
        actionType: 'exercise',
        userId: this.userId
      }
      api.capsule.getAction(params2)
        .then((res) => {
          res.exercise = JSON.parse(res.actionText)
          this.exerciseInfo = res
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getUserInfo () {
      api.user.getChildrenInfo(this.userId)
        .then((data) => {
          this.childrenInfo = data
          data.childrenList[0].age = this.getAge(data.childrenList[0].birthday)
          this.showLoading = false
          this.$nextTick(function () {
            this.setExerH()
          })
        })
    },
    goto (url) {
      this.$router.push(url)
    },
    audioPlay () {
      var _this = this
      var audioEl = document.getElementById('recordPlay')
      if (this.sound.playing) {
        audioEl.pause()
        this.sound.playing = false
        this.sound.playTime = 0
        audioEl.currentTime = 0
        clearInterval(_this.sound.timer)
      } else {
        this.sound.playing = true
        audioEl.play()
        this.sound.timer = setInterval(function () {
          _this.sound.playTime++
          if (_this.sound.playTime > _this.exerciseInfo.exercise.timeLength) {
            _this.sound.playing = false
            _this.sound.playTime = 0
            clearInterval(_this.sound.timer)
          }
          if (audioEl.paused) {
            _this.sound.playing = false
            _this.sound.playTime = 0
            clearInterval(_this.sound.timer)
          }
        }, 1000)
      }
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
.exerBackPage{
  width:100%;
  min-height: 100vh;
  background: url(/static/img/capsule/backbg.png) no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}
.top{
  position: relative;
  height:3rem;
  .shareInfo{
    position: absolute;
    top: 0;
    right:10px;
    color: #EEB457;
    display: inline-block;
    font-size: .7rem;
    padding: 10px 15px;
    padding-top: 17px;
    background: url(/static/img/capsule/分享@1x.png) no-repeat;
    background-size: 100% 100%;
  }
}
.title{
  font-family: PingFangSC-Medium;
  .logoAndInfo{
    width:70%;
    position: relative;
    left:15%;
    img{
      width:100%;
    }
  }
  .titleContent{
    width:100%;
    box-sizing: border-box;
    position: relative;
    background: url(/static/img/capsule/backbg2@1x.png) no-repeat;
    background-size: 100% 100%;
    padding:20px 30px 40px 30px;
    padding-bottom: 2.8rem;
    h4{
      color: #fff;
      font-size: 1.1rem;
      font-weight: normal;
    }
    span{
      display: inline-block;
      color: #75D9DE;
      font-size: (14rem/16);
      font-weight: normal;
    }
    div{
      background: url(/static/img/capsule/按钮@1x.png) no-repeat;
      text-align: center;
      background-size: 100% 100%;
      color: #FFF;
      width:50%;
      font-size: 1.1rem;
      line-height: 1.1rem;
      position: absolute;
      bottom: -1.2rem;
      left: 25%;
      padding: 1rem 0;
    }
  }
}
.border{
  height:2.5rem
}
.exerciseBox{
  width:100%;
  box-sizing: border-box;
  text-align: center;
  .infoBox{
    background: url(/static/img/capsule/backbg3@1x.png) no-repeat top left;
    background-size: 100% 100%;
    padding-top: 40px;
  }
  .userInfo{
    text-align: center;
    img{
      height:2rem;
      vertical-align: top;
    }
    .parentName{
      display: inline-block;  
      font-size: 1.05rem;
      line-height: 2rem;
      color: #4DB6CA;
    }
  }
  .exercised{
    color: #4DB6CA;
    font-size: (14rem/16);
    padding: (16rem/16);
    font-style: italic;
  }
  .exerInfo{
    padding-bottom: 20px;
    background: rgb(231,255,255);
    .recordBox{
      margin-bottom: 20px;
      #recordPlay{
        width:68%;
      }
      .audio{
        width:75%;
        box-sizing: border-box;
        margin-left: 12.5%;
        line-height: (40rem/16);
        height:(40rem/16);
        background: url(/static/img/capsule/backSound@1x.png) no-repeat;
        background-size: 100% 100%; 
        padding: 0 10px;
        .icon{
          height:(25rem/16);
          margin-top: (7.5rem/16);
          margin-left: (5rem/16);
          float: left;
        }
        .length{
          color: #fff;
          float: right;
          font-size: (18rem/16);
        }
      }
    }
    .answerText{
      width:90%;
      margin-left: 5%;
      p{
        text-align: left;
        font-size: (16rem/16);
        color: #4DB6CA;
      }
    }
    .answerTextOne{
      width:90%;
      margin-left: 5%;
      p{
        text-align: left;
        font-size: (16rem/16);
        color: #4DB6CA;
      }
    }
    .photoBox{
      width:90%;
      box-sizing: border-box;
      margin-left: 5%;
      margin-top: 10px;
      text-align: left;
      .photo{
        display: inline-block;
        width:5rem;
        height:5rem;
        margin-right:10px;
        img{
          width:100%;
          height:100%;
        }
      }
      .photoOne{
        display: inline-block;
        width:60%;
        margin-right:10px;
        img{
          width:100%;
        }
      }
    }
  }
}
.footBg{
  background: rgb(231,255,255);
  width:100%;
}
</style>
