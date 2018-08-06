<template>
  <div class="exerEndPage">
    <div class="exerEndTop">
      <div class="title">
        <h4>{{ capsuleInfo.topic }}</h4>
        <span>目标：{{ capsuleInfo.labelTarget_title }}</span><br />
        <span v-if="capsuleInfo.labelScene_title">场景：{{ capsuleInfo.labelScene_title.join('、') }}</span><br />
        <span>年龄：{{ capsuleInfo.labelAge_title }}</span><br />
        <div>
          <x-button @click.native="goCapsule" type='primary' style="border-radius:10px;font-size: .8rem;">查看胶囊></x-button>
        </div>
      </div>
      <div class="authorImg" v-if="capsuleInfo.authorInfo">
        <img class="headImg" :src="capsuleInfo.authorInfo.headImgUrl" />
        <img class="vImg" :src="capsuleInfo.authorInfo.authorType !== 3?'/static/img/capsule/黄v.png':'/static/img/capsule/蓝v.png'">
      </div>
    </div>
    <div class="exerEndInfo">
      <div class="exerItem">
        <div class="headImg">
          <img :src="userInfo.headimgurl" />
        </div>
        <div class="info">
          <div class="parentInfo" v-if="childrenInfo.childrenList">
            <span class="parentName">{{ userInfo.name }}</span>
            <span class="childInfo" v-if="childrenInfo.childrenList[0].name && childrenInfo.childrenList[0].name.length !== 0 && childrenInfo.childrenList[0].age !== -1">（{{ childrenInfo.childrenList[0].name }}，{{ childrenInfo.childrenList[0].age }}岁）</span>
          </div>
          <div class="answerText" v-if="exerciseInfo.exercise">
            <p>{{ exerciseInfo.exercise.text }}</p>
          </div>
          <div class="recordBox" v-if="exerciseInfo.exercise">
            <audio id="recordPlay" preload="auto" controls v-if="exerciseInfo.exercise.soundUrl && exerciseInfo.exercise.soundUrl.length !== 0" :src="exerciseInfo.exercise.soundUrl">
            </audio>
          </div>
          <div class="photoBox" v-if="exerciseInfo.exercise&&exerciseInfo.exercise.photoList&&exerciseInfo.exercise.photoList.length != 0">
            <span :class="[exerciseInfo.exercise.photoList.length == 1 ? 'photoBig':'photo']" v-for="item in exerciseInfo.exercise.photoList">
              <img :src="item" @click="previewImage(item,exerciseInfo.exercise.photoList)"/>
            </span>
          </div>
          <div class="uploadTime">
            <span>{{ exerciseInfo.updated_at }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="exerFoot">
      <x-button @click.native="knowClick('show')" style="border-radius:10px;">
        <img src="/static/img/capsule/分享.png" />
        分享给朋友
      </x-button>
      <x-button @click.native="goto('/capsule/list/{}')" style="border-radius:10px;">
        体验更多胶囊
      </x-button>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="shareDialogShow" >
        <div class="shareDia">
          <div class="shareDiaTop">
            <img src="/static/img/capsule/dz.png" />
            <p>
              通过这次练习，小家伙对「{{ capsuleInfo.labelTarget_endTitle }}」的认识提升啦，赞！
            </p>
          </div>
          <div class="shareDiaShare">
            <p>
              请点击页面右上角，选择<img src="/static/img/capsule/分享1.png" />或<img src="/static/img/capsule/分享2.png" />分享给更多朋友。
            </p>
          </div>
          <div class="btnBox">
            <x-button @click.native="knowClick('hide')" type='primary' style="border-radius:10px;">我知道了</x-button>
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="maskMask" v-if="shareDialogShow"></div>
    <loading :show="showLoading" :text="'加载中'"></loading>
  </div>
</template>

<script>
import { XDialog, TransferDom, XButton, WechatPlugin, Loading } from 'vux'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import userModule from 'lanmaLib/modules/user'
import common from 'src/common'
export default{
  components: {
    XDialog,
    XButton,
    Loading
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      capsuleId: 0,
      shareDialogShow: false,
      capsuleInfo: {},
      exerciseInfo: {},
      userInfo: {},
      childrenInfo: {},
      exerciseCapsuleList: [],
      showLoading: false
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    var isGoWhere = common.getShareParamter('isExerciseGo')
    if (isGoWhere) {
      this.shareDialogShow = true
    }
    this.showLoading = true
    window.scrollTo(0, 0)
    this.capsuleId = id
    labelModule.getLabelList().then((labelList) => {
      this.hashTable = labelModule.getHashTable(labelList)
      this.getAuthorList(id)
    })
    this.getCapsuleListByAction()
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
    init (id) {
      api.capsule.getCapsule(id)
        .then((data) => {
          data.labelScene_title = []
          data.labelAge_title = []
          data.authorInfo = this.authorTable[data.authorId]
          data.labelTarget_title = labelModule.getThemeLabel(data.labelTarget).replace(/ \/ /g, '|')
          data.labelTarget_endTitle = this.hashTable[data.labelTarget].title
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
          console.log(data)
        })
    },
    setExerH () {
      var _this = this
//    var box = document.getElementsByClassName('exerEndPage')[0]
      var topEl = document.getElementsByClassName('exerEndTop')[0]
      var infoEl = document.getElementsByClassName('exerEndInfo')[0]
      var footEl = document.getElementsByClassName('exerFoot')[0]
      var pageEl = document.getElementsByClassName('exerEndPage')[0]
      var temp = 1
      var htmlH = window.innerHeight
      var topH = topEl.offsetHeight
      var infoH = infoEl.offsetHeight
//    var boxH = box.offsetHeight
      var footH = footEl.offsetHeight
      if ((topH + infoH + footH) > (htmlH - 40)) {
        footEl.style.position = 'relative'
        footEl.style.bottom = '0'
        pageEl.style.paddingBottom = '1.875rem'
      }
      _this.showLoading = false
      var timer = setInterval(function () {
        temp++
        if (temp > 5) {
          clearInterval(timer)
        }
        var htmlH = window.innerHeight
        var topH = topEl.offsetHeight
        var infoH = infoEl.offsetHeight
  //    var boxH = box.offsetHeight
        var footH = footEl.offsetHeight
        if ((topH + infoH + footH) > (htmlH - 40)) {
          footEl.style.position = 'relative'
          footEl.style.bottom = '0'
          pageEl.style.paddingBottom = '1.875rem'
        }
      }, 200)
    },
    goCapsule () {
      this.$router.push('/capsule/info/' + this.capsuleId)
//    if (this.isSubscribe) {
//      var params = {
//        capsuleId: this.capsuleId,
//        statId: 9,
//        shareUserId: this.userInfo.id
//      }
//      api.capsule.addActivityStat(params)
//        .then((data) => {
//          this.$router.push('/capsule/info/' + this.capsuleId)
//        })
//    } else {
//      this.$router.push('/capsule/info/' + this.capsuleId)
//    }
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
        actionType: 'exercise'
      }
      api.capsule.getAction(params2)
        .then((res) => {
          res.exercise = JSON.parse(res.actionText)
          this.exerciseInfo = res
          this.getUserInfo()
        })
    },
    getCapsuleListByAction () {
      var params = {
        actionType: 'exercise'
      }
      api.capsule.getCapsuleListByAction(params)
        .then((data) => {
          this.exerciseCapsuleList = data.list
        })
    },
    getUserInfo () {
      userModule.getUserInfo()
        .then((data) => {
          this.userInfo = data
          console.log(data)
          api.user.getChildrenInfo()
            .then((data) => {
              this.childrenInfo = data
              data.childrenList[0].age = this.getAge(data.childrenList[0].birthday)
              console.log(data.childrenList[0].age)
              this.setShare()
              this.$nextTick(function () {
                this.setExerH()
              })
            })
        })
    },
    knowClick (flag) {
      switch (flag) {
        case 'show':
          this.shareDialogShow = true
          break
        case 'hide':
          this.shareDialogShow = false
          break
      }
    },
    goto (url) {
      this.$router.push(url)
    },
    setShare () {
      var title = '这是我们的第' + this.exerciseCapsuleList.length + '次陪伴练习！有质量的陪伴，才是最好的教育。'
      var desc = '今日话题：' + this.capsuleInfo.topic + '。目标：' + this.capsuleInfo.labelTarget_title
      var imgUrl = ''
      if (this.exerciseInfo.exercise.photoList && this.exerciseInfo.exercise.photoList.length >= 1) {
        imgUrl = window.location.origin + this.exerciseInfo.exercise.photoList[0]
      } else {
        imgUrl = window.location.origin + '/static/img/capsule/newlogo.jpg'
      }
      this.setShareInfo(title, desc, imgUrl)
    },
    setShareInfo (title, desc, imgUrl) {
      var _this = this
      var userId = ''
      userModule.getUserInfo()
      .then((userInfo) => {
        userId = userInfo.id
        var url = window.location.href
        if (url.indexOf('?') === -1) {
          url += '?source=' + userId
        } else {
          url += '&source=' + userId
        }
        console.log(url)
        if (url.match(/\/course_material || \/homework || \/exerciseEnd/)) {
          var date = new Date()
          var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
          url = url.replace('/course_tour/course_material', '/course_tour/course_material_share')
          url = url.replace('/course/course_material', '/course/course_material_share')
          url = url.replace('/course/homework', '/course/homework_share')
          url = url.replace('/course/report/homework', '/course/homework_share')
          url = url.replace('/capsule/exerciseEnd', '/capsule/exerciseBack')
          url += '&headimgurl=' + encodeURIComponent(userInfo.headimgurl)
          url += '&name=' + encodeURIComponent(userInfo.name)
          url += '&time=' + encodeURIComponent(time)
        }
        var shareInterval = setInterval(function() {
          WechatPlugin.$wechat.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc,
            link: url,
            imgUrl: imgUrl,
            success: function (res) {
              _this.activityAddStatld(7, _this.capsuleId)
              api.capsule.addClickCount(_this.capsuleId, 'exerciseShare')
              WechatPlugin.$wechat.closeWindow()
            }
          })
          WechatPlugin.$wechat.onMenuShareTimeline({
            title: title, // 分享标题
            desc: desc,
            link: url,
            imgUrl: imgUrl,
            success: function (res) {
              _this.activityAddStatld(7, _this.capsuleId)
              api.capsule.addClickCount(_this.capsuleId, 'exerciseShare')
              WechatPlugin.$wechat.closeWindow()
            }
          })
        }, 1000)
        setTimeout(function() {
          clearInterval(shareInterval)
        }, 5000)
      })
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
.exerEndPage{
  background: #FFF;
  min-height: 100vh;
  box-sizing: border-box;
}
.exerEndTop{
  box-sizing: border-box;
  padding: 10px 15px;
  background: #FFF;
  margin-bottom: 5px;
  border-bottom: 5px solid #CCCCCC;
  width:100%;
  .title{
    display: inline-block;
    width:80%;
    font-size: 1.0rem;
    line-height:1.2rem;
    span{
      color: #999;
      font-size: .8rem;
    }
    div{
      margin: 5px;
      width:35%;
      button{
        background: #00A6AC;
      }
    }
  }
  .authorImg{
    display: inline-block;
    width:40px;
    height:40px;
    position: relative;
    border-radius: 50%;
    vertical-align: top;
    float: right;
    .headImg{
      width:100%;
      border-radius: 50%;
      vertical-align: top;
      margin-top: 5px;
    }
    .vImg{
      width:40%;
      position: absolute;
      right:-3px;
      bottom: -10px;
    }
  }
}
.exerEndInfo{
  background: #FFF;
  box-sizing: border-box;
  padding: 10px;
  .exerItem{
    .headImg{
      width:10%;
      display: inline-block;
      vertical-align: top;
      img{
        width:100%;
      }
    }
    .info{
      width:80%;
      margin-left: 5px;
      display: inline-block;
      .parentInfo{
        margin-bottom: 0px;
        .parentName{
          color: #00A6AC;
          font-size: .9rem;
        }
        .childInfo{
          color: #999;
          font-size: .8rem;
        }
      }
      .answerText{
        margin-bottom: 10px;
        p{
          font-size: .9rem;
          line-height: 1rem;
        }
      }
      .recordBox{
        margin-bottom: 10px;
        width:100%;
        audio{
          width:90%;
        }
      }
      .photoBox{
        margin-bottom: 10px;
        width:100%;
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
        .photoBig{
          display: inline-block;
          width:60%;
          img{
            width:100%;
          }
        }
      }
      .uploadTime{
        span{
          font-size: .7rem;
          color: #999;
        }
      }
    }
  }
}
.exerFoot{
  width:80%;
  height:(100rem/16);
  line-height:(50rem/16);
  position: fixed;
  left: 10%;
  bottom: (30rem/16);
  button{
    width:100%;
    text-align: center;
    font-weight: normal;
    color: #fff;
    background: #00A6AC;
    font-size: 1.1rem;
    img {
      height: 1.1rem;
      vertical-align: text-top;
    }
  }
  img{
    
  }
}
.shareDia{
  padding: 10px;
  .shareDiaTop{
    width:100%;
    box-sizing: border-box;
    padding: 20px 0;
    border-bottom: 1px solid #999;
    img{
      width:15%;
      vertical-align: top;
      margin-right: 10px;
    }
    p{
      text-align: left;
      font-size: 1rem;
      width:75%;
      display: inline-block;
    }
    .btnBox{
      button{
        background: #60c9cf;
      }
    }
  }
  .shareDiaShare{
    width:100%;
    box-sizing: border-box;
    padding: 20px 0;
    p{
      text-align: left;
      font-size: 1rem;
      color: #F47A00;
      img{
        height:1.2rem;
        vertical-align: text-top;
      }
    }
  }
}
.maskMask{
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,.6);
  z-index: 600;
}
</style>