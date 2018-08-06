<template>
  <div class="infoBox">
    <div class="authorInfo" v-if="capsuleInfo.authorInfo" @click="popupMenuShow = false">
      <div class="authorInfoImgBox" v-if="capsuleInfo.authorInfo">
        <img class="headImg" :src="capsuleInfo.authorInfo.headImgUrl" />
        <img class="vImg" :src="capsuleInfo.authorInfo.authorType !== 3?'/static/img/capsule/黄v.png':'/static/img/capsule/蓝v.png'">
      </div>
      <div class="listAuthorBox">
        <div class="listAuthor">
          <span class="listAuthorName">{{ capsuleInfo.authorInfo.author }}</span><span class="listAuthorTime" v-show="false">(小葫芦，3岁)</span>
        </div>
        <span class="listAuthorIdentity">{{ capsuleInfo.authorInfo.identity }}</span>
      </div>
    </div>
    <div class="infoTop" @click="popupMenuShow = false">
      <img class="infoTopBg" src="/static/img/capsule/bg人.png" />
      <div class="titleNameBox">
      	<span class="titleName">{{ capsuleInfo.topic }}</span>
      	<img src="/static/img/capsule/原创2.png" />
      </div>
    </div>
    <div class="infoCenterBox" @click="popupMenuShow = false">
      <div class="capsuleInfo">
        <div class="target">
          <label class="infoTitle">
            目标
          </label>
          <br />
          <p class="infoCenter">{{ capsuleInfo.labelTarget_title }}</p>
        </div>
        <div class="targetDescription">
          <label class="infoTitle">
            目标解读
          </label>
          <br />
          <p class="infoCenter contentLeft">{{ capsuleInfo.description }}</p>
        </div>
        <div class="labelAge">
          <label class="infoTitle">
            适合年龄
          </label>
          <br />
          <p class="infoCenter">{{ capsuleInfo.labelAge_title }}宝宝&家长</p>
        </div>
        <div class="scene" v-if="capsuleInfo.labelScene_title">
          <label class="infoTitle">
            适合场景
          </label>
          <br />
          <p class="infoCenter">{{ capsuleInfo.labelScene_title.join('、') }}</p>
        </div>
        <div class="sceneExample main" :class="[contentTooLong ? 'max-height':'']">
          <label class="infoTitle">
            范例
          </label>
          <br />
          <p class="infoCenter contentLeft" v-html="capsuleInfo.sceneExample"></p>
        </div>
        <div class="show-all" v-if="contentTooLong">
          <p @click="contentTooLong=false"><img src="/static/img/capsule/展开.png" />展开阅读全文</p>
        </div>
        <div class="keyPoint">
          <label class="infoTitle">
            要点
          </label>
          <br />
          <p class="infoCenter contentLeft" v-html="capsuleInfo.keyPoint"></p>
        </div>
        <div class="exercise">
          <label class="infoTitle">
            练习
          </label>
          <br />
          <p class="infoCenter contentLeft" v-html="capsuleInfo.exercise"></p><br />
          <p class="CapsuleUsedCount contentLeft infoCenter">已有 {{ capsuleUsedCount }} 个家庭练习过这个胶囊啦~</p>
        </div>
        <img v-if="!isExercise" class="arrowsImg" src="/static/img/capsule/箭头.png" />
      </div>
    </div>
    <div class="masker" v-if="showShare" @click="showShare=!showShare">
      <masker>
        <div slot="content" class="m-title">
          <img class="model-img" src="/static/img/shareintro.png" alt="">
        </div>
      </masker>
      <p class="share-text">请点击右上角，分享给朋友们~</p>
    </div>
    <x-dialog v-model="showDialog_guide" :hide-on-blur="false" :dialog-style="{'overflow': 'visible'}">
      <div class="guideDialogBox">
        <img class="dialogImg" src="/static/img/capsule/qd.png" />
        <p>
          {{ capsuleInfo.guide }}
        </p>
        <div class="btnBox">
          <x-button class="inInfo" type="primary" @click.native="dialogClick('ok')">立即开始</x-button>
        </div>
      </div>
    </x-dialog>
    <x-dialog v-model="isNoSubscribe" :hide-on-blur="false" :dialog-style="{'overflow': 'visible'}">
      <div class="dialogSubscribe">
        <img class="close" src="/static/img/capsule/关闭.png" @click="backPrePage" />
        <div class="top">
          陪伴胶囊，用5分钟的小互动<br />给孩子高质量的陪伴！
        </div>
        <div class="center">
          <p class="centerTop">
            关注「心迹教育」<br />各种亲子陪伴干货，get！
          </p>
          <img class="centerImg" src="/static/img/capsule/logo.png" />
          <p class="centerBottom">关注后点击返回，即可解锁此胶囊</p>
        </div>
      </div>
    </x-dialog>
    <div class="tabbar" id="tabbar">
      <div class="popupMenu" id="popupMenu" v-show="popupMenuShow">
        <em></em>
        <div @click="exerciseAction('photo')">
          <img src="/static/img/capsule/相机.png" />
          <span>拍照</span>
        </div>
        <div @click="exerciseAction('sound')">
          <img class="soundImg" src="/static/img/capsule/录音.png" />
          <span>录音</span>
        </div>
        <div @click="exerciseAction('text')">
          <img class="textImg" src="/static/img/capsule/文字.png" />
          <span>文字</span>
        </div>
      </div>
      <div class="capsuleBottom" v-if="isExercise" @click="goto('/capsule/exerciseEnd/'+capsuleId)">
        你和宝宝练习过这个胶囊了
        <a>点击查看></a>
      </div>
      <flexbox class="tabbarMenu" id="tabbarMenu">
        <flexbox-item @click.native="praiseClick">
          <img :src="[!isPraise ? '/static/img/capsule/点赞.png' : '/static/img/capsule/已赞.png']" />
        </flexbox-item>
        <flexbox-item @click.native="menuItemAction('1')" class="menuCenterBox">
          <img style="opacity: 0;" src="/static/img/capsule/分享.png" />
          <img class="menuCenterImg" :src="[isExercise ? '/static/img/capsule/已经开始练习.png':'/static/img/capsule/练习.png']" />
        </flexbox-item>
        <flexbox-item @click.native="menuItemAction('2')">
          <img src="/static/img/capsule/分享.png" />
        </flexbox-item>
      </flexbox>
      <flexbox class="tabbarMenu">
        <flexbox-item @click.native="praiseClick">
          <div class="labelMenu">{{ isPraise?'已赞':'赞' }} {{ praiseCount }}</div>
        </flexbox-item>
        <flexbox-item @click.native="menuItemAction('1')">
          <div class="labelMenu">开始练习</div>
        </flexbox-item>
        <flexbox-item @click.native="menuItemAction('2')">
          <div class="labelMenu">分享</div>
        </flexbox-item>
      </flexbox>
    </div>
    <loading :show="showLoading" :text="'加载中'"></loading>
    <div class="maskMask" v-if="isNoSubscribe || showDialog_guide"></div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, XDialog, XButton, Flexbox, FlexboxItem, WechatPlugin, Masker, Loading } from 'vux'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import common from 'src/common'
import user from 'lanmaLib/modules/user'
export default{
  components: {
    Tabbar,
    TabbarItem,
    XDialog,
    XButton,
    Flexbox,
    FlexboxItem,
    Masker,
    Loading
  },
  data () {
    return {
      capsuleId: 0,
      isShare: 'info',  //  分享： share   正常进入  ；info
      authorTable: {},
      contentTooLong: false,
      tabbarSelect: 0,
      popupMenuShow: false,
      isExercise: false,
      showDialog_guide: false,
      capsuleInfo: {},
      hashTable: [],
      isPraise: false,
      isNoSubscribe: false,
      capsuleUsedCount: 0,
      shareUserId: 0,
      praiseCount: 0,
      showShare: false,
      showLoading: false
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    window.scrollTo(0, 0)
    var userId = common.getShareParamter('source')
    this.capsuleId = id
    if (userId) {
      this.isShare = 'share'
      this.shareUserId = userId
      this.activityAddStatld(10, this.capsuleId, this.shareUserId)
    }
    this.showLoading = true
    this.activityAddStatld(2, this.capsuleId)
    api.capsule.addClickCount(this.capsuleId, 'click')
    api.user.isSubscribe()
      .then((res) => {
        this.isNoSubscribe = !res
        if (!res) {
          this.showDialog_guide = false
        }
      })
    labelModule.getLabelList().then((labelList) => {
      this.hashTable = labelModule.getHashTable(labelList)
      this.getAuthorList(id)
    })
    this.getCapsuleUsedCount()
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
    isInPage () {
      var flag = window.localStorage.getItem('isInCapsulePage')
      console.log(flag)
      if (!flag && !this.isNoSubscribe) {
        this.showDialog_guide = true
      }
    },
    init (id) {
      var params1 = {
        capsuleId: this.capsuleId,
        actionType: 'praise'
      }
      api.capsule.getAction(params1)
        .then((res) => {
          if (res.id) {
            this.isPraise = true
          }
        })
      var params2 = {
        capsuleId: this.capsuleId,
        actionType: 'exercise'
      }
      api.capsule.getAction(params2)
        .then((res) => {
          if (res.id) {
            this.isExercise = true
          }
        })
      this.$nextTick(function () {
        var contentHeight = window.document.getElementsByClassName('main')[0].clientHeight
        console.log(contentHeight)
        if (contentHeight > 1400) {
          this.contentTooLong = true
        } else {
          this.contentTooLong = false
        }
      })
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
          this.getCapsuleInfo(id)
        })
    },
    getCapsuleInfo (id) {
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
          this.isInPage()
//        this.isNoSubscribe ? this.showDialog_guide = false : this.showDialog_guide = true
          this.showLoading = false
          this.init()
          this.setShare()
          window.scrollTo(0, 0)
        })
    },
    getCapsuleUsedCount () {
      api.capsule.getCapsuleUsedCount(this.capsuleId)
        .then((count) => {
          this.capsuleUsedCount = count
        })
      api.capsule.getPraiseCount(this.capsuleId)
        .then((count) => {
          this.praiseCount = count
        })
    },
    tabbarClick () {
      return false
    },
    dialogClick (label) {
      var _this = this
      switch (label) {
        case 'close':
          _this.$router.push('/capsule/list/{}')
          break
        case 'ok':
          window.localStorage.setItem('isInCapsulePage', 'true')
          _this.showDialog_guide = false
          break
        default:
          break
      }
    },
    menuItemAction (index) {
      var _this = this
      switch (index) {
        case '0':
          break
        case '1':
          if (this.isExercise) {
            return
          }
          var tabEl = document.getElementById('tabbar')
          var popEl = document.getElementById('popupMenu')
          popEl.style.bottom = (tabEl.offsetHeight + 30) + 'px'
          _this.popupMenuShow = !_this.popupMenuShow
          break
        case '2':
          this.showShare = true
          break
        default:
          break
      }
    },
    exerciseAction (type) {
      if (this.isExercise) {
        this.$router.push('/capsule/exerciseEnd/' + this.capsuleId)
      } else {
        this.$router.push('/capsule/exercise/' + type + '/' + this.capsuleId)
      }
    },
    setShare () {
      var title = '亲子陪伴小胶囊：' + this.capsuleInfo.topic
      var desc = this.capsuleInfo.guide
      var imgUrl = window.location.origin + '/static/img/capsule/newlogo.jpg'
      this.setShareInfo(title, desc, imgUrl)
    },
    praiseClick () {
      var params = {
        capsuleId: this.capsuleId,
        actionType: 'praise',
        actionText: ''
      }
      if (this.isPraise
      ) {
        api.capsule.delAction(params)
          .then((res) => {
            this.praiseCount -= 1
            this.isPraise = false
          })
      } else {
        api.capsule.addAction(params)
          .then((res) => {
            this.praiseCount += 1
            this.isPraise = true
            this.activityAddStatld(5, this.capsuleId)
          })
      }
    },
    goto (url) {
      this.$router.push(url)
    },
    gotoHome () {
      var params = {
        capsuleId: this.capsuleId,
        statId: 11,
        shareUserId: this.shareUserId
      }
      api.capsule.addActivityStat(params)
        .then((data) => {
          var loUrl = window.location.origin
          if (loUrl.indexOf('wxtest2') !== -1) {
            window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzE1MjIwMQ==&scene=124#wechat_redirect'
          } else {
            window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4MDQzNjI4MA==&scene=123&from=groupmessage#wechat_redirect'
          }
        })
    },
    backPrePage () {
      this.$wechat.closeWindow()
    },
    setShareInfo (title, desc, imgUrl) {
      var _this = this
      var userId = ''
      user.getUserInfo()
      .then((userInfo) => {
        userId = userInfo.id
        var url = window.location.href
        url += '?source=' + userId
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
              _this.activityAddStatld(4, _this.capsuleId)
              api.capsule.addClickCount(_this.capsuleId, 'share')
              WechatPlugin.$wechat.closeWindow()
            }
          })
          WechatPlugin.$wechat.onMenuShareTimeline({
            title: title, // 分享标题
            desc: desc,
            link: url,
            imgUrl: imgUrl,
            success: function (res) {
              _this.activityAddStatld(4, _this.capsuleId)
              api.capsule.addClickCount(_this.capsuleId, 'share')
              WechatPlugin.$wechat.closeWindow()
            }
          })
        }, 2000)
        setTimeout(function() {
          clearInterval(shareInterval)
        }, 10000)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.infoBox{
  font-family: "microsoft yahei";
  padding-bottom: 70px;
  padding-top: 20px;
  background: #60c9cf;
  width:100%;
  text-align: center;
}
.authorInfo{
  width:87%;
  margin: 0 auto;
  background: #4598a0;
  padding: 10px;
  color: #fff;
  text-align: left;
  .authorInfoImgBox{
    display: inline-block;
    width:40px;
    height:40px;
    position: relative;
    margin-right: 5px;
    border-radius: 50%;
    vertical-align: top;
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
  .listAuthorBox{
    font-family: "microsoft yahei";
    width:80%;
    display: inline-block;
    .listAuthor{
      .listAuthorName{
        font-size: 1.1rem;
      }
      .listAuthorTime{
        margin-left: 5px;
        font-size: 0.8rem;
      }
    }
    .listAuthorIdentity{
      display: inline-block;
      font-size: 0.8rem;
      line-height: 0.9rem;
    }
  }
}
.infoTop{
  margin-top: 5px;
  width:100%;
  position: relative;
  padding-top: 30%;
  font-family: "microsoft yahei";
  z-index: 100;
  .infoTopBg{
    position: absolute;
    width:90%;
    top: 0;
    left: 5%;
  }
  .titleNameBox{
    width:100%;
    background: url(/static/img/capsule/标题.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 5% 0;
    span{
      display: inline-block;
      width:75%;
      font-size: 1.1rem;
      color: #fff;
    }
    img{
      width:10%;
      position: absolute;
      right: 7.7%;
      top:0;
    }
  }
}
.infoCenterBox{
  box-sizing: border-box;
  width:100%;
  padding: 0 4%;
  position: relative;
  z-index: 99;
  font-family: "microsoft yahei";
  .show-all{
    text-align: center;
    p{
      font-size: .9rem;
      color: #999;
      img{
        height:1.1rem;
        margin-right: 2px;
        vertical-align: middle;
      }
    }
  }
  .capsuleInfo{
    background: #FFF;
    width:100%;
    padding-top: 8%;
    margin-top:-4%;
    padding-bottom: 5%;
    margin-bottom: 15%;
  }
  .capsuleInfo>div{
    margin-bottom: 20px;
    .infoTitle{
      position: relative;
      list-style: square;
      color: #db9206;
      display: inline-block;
      font-size: 1.1rem;
      padding: 10px;
    }
    .infoTitle:after{
      content: '';
      display: inline-block;
      width:8px;
      height:8px;
      background: url(/static/img/capsule/圆角.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 0;
      top:50%;
      margin-top: -4px;
    }
    .infoTitle:before{
      content: '';
      display: inline-block;
      width:8px;
      height:8px;
      background: url(/static/img/capsule/圆角.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top:50%;
      margin-top: -4px;
    }
    .infoCenter{
      font-size: 1rem;
      color: #000;
    }
  }
}
.contentLeft{
  padding: 0 8%;
  text-align: left;
}
.max-height{
  max-height: 700px;
  overflow: hidden;
}
.tabbar{
  position: fixed;
  bottom:0px;
  width:100%;
  z-index: 200;
  box-sizing: border-box;
  padding: 5px 0;
  background: #00A6AC;
  box-shadow:0px -1px 1px 0 rgba(0,0,0,.2);
  .tabbarMenu{
    text-align: center;
    img{
      width:17%;
    }
    .menuCenterBox{
      position: relative;
      .menuCenterImg{
        position: absolute;
        top:-90%;
        left: 30%;
        width:40%;
        z-index: -1;
      }
      div{
        height:31px
      }
    }
    .labelMenu{
      font-size: .8rem;
      color: #fff;
    }
  }
  .capsuleBottom{
    position: absolute;
    box-sizing: border-box;
    top: -100%;
    background: #FFA800;
    padding: 0 10px;
    width:100%;
    color: #fff;
    text-align: left;
    padding: 5px 20px;
    a{
      float: right;
      color: #000;
    }
  }
  .popupMenu{
    z-index: 300;
    vertical-align: top;
    width:100px;
    box-sizing: border-box;
    border-radius: 10px;
    position:absolute;
    background-color:#ffa800;
    left: 50%;
    bottom:0px;
    margin-left: -50px;
    padding: 10px;
    em{
      display:block;
      border-width:10px;
      position:absolute;
      bottom:-20px;
      left:40px;
      border-style:solid dashed dashed;
      border-color:#ffa800 transparent transparent;
      font-size:0;
      line-height:0;
    }
    div{
      text-align: center;
      border-bottom: 1px solid #ffbe41;
      height:45px;
      line-height: 45px;
      img{
        height:.95rem;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 5px;
      }
      .soundImg{
        height:1.3rem
      }
      .textImg{
        height:1.1rem
      }
      span{
        font-weight: normal;
        color: #FFF;
        font-size: 1.1rem;
      }
    }
    div:last-child{
      border-bottom: 0px solid #999;
    }
  }
}
.arrowsImg{
  position: absolute;
  bottom: -1%;
  width:6%;
  left:52%;
}
.guideDialogBox{
  padding: 20px;
  padding-top: 150px;
  position: relative;
  background: #fff;
  text-align: center;
  .dialogImg{
    z-index: 600;
    position: absolute;
    top: -40px;
    left: 20%;
    width:60%;
  }
  p{
    font-family: "microsoft yahei";
    color: #000;
    font-size: 1.1rem;
    text-align: left;
    strong{
      font-weight: bold;
      color: #087076;
      margin: 10px 0;
      display: inline-block;
    }
  }
  .btnBox{
    margin-top: 20px;
    width:60%;
    margin-left: 20%;
    margin-bottom: 15px;
    .inInfo{
      color: #FFF;
      background: #60c9cf;
    }
  }
}
.dialogSubscribe{
  padding: 30px 10px;
  position: relative;
  background: #60c9cf;
  font-family: "microsoft yahei";
  text-align: center;
  .close{
    position: absolute;
    right: -5%;
    top: -5%;
    width:16%;
  }
  .top{
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .center{
    .centerTop{
      color: #fff;
      font-size: .9rem;
      margin-bottom: 5px;
    }
    .centerImg{
     width:50%;
     margin-bottom: 5px;
    }
    .centerBottom{
      color: #fff;
      font-size: .9rem;
    }
  }
  /*p{
    font-family: "microsoft yahei";
    color: #fff;
    font-size: 1.1rem;
    strong{
      font-weight: bold;
      color: #087076;
      margin: 10px 0;
      display: inline-block;
    }
  }*/
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
  z-index: 600;
  span{
    color: #fff;
  }
  .share-text{
    color: #fff;
    margin-top: 41%;
    font-size: 1.2rem;
    text-align: center;
  }
  .model-img{
    float: right;
    margin-right: 20px;
  }
}
.sceneExample{
  overflow-x: hidden;
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
.CapsuleUsedCount{
  font-size: .9rem !important;
  color: #999 !important;
  text-align: center;
  font-style: italic;
}
</style>
