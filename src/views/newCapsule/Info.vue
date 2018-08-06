<template>
  <div class="page">
    <div class="top">
      <img :src="capsuleInfo.smallCover" />
      <img class="share" src="/static/img/newCapsule/share.png" @click="showShare = true" />
    </div>
    <div class="targetBox">
      <img v-if="capsuleInfo.authorInfo && capsuleInfo.authorInfo.headImgUrl" :src="capsuleInfo.authorInfo.headImgUrl" />
      <img src="/static/img/newCapsule/icon1@3x.png" v-else />
      <span>目标：{{capsuleInfo.labelTarget_title}}</span>
    </div>
    <div class="contentBox">
      <div class="contentItem">
        <label>
          动起来
        </label>
        <br />
        <p class="info" v-html="capsuleInfo.exercise"></p>
      </div>
      <div class="contentItem">
        <label>
          注意事项
        </label>
        <br />
        <p class="info" v-html="capsuleInfo.keyPoint"></p>
      </div>
    </div>
    <div class="commentBox">
      <div class="top">
        <div class="one">
          <p>{{capsuleInfo.clickNum}}</p>
          <span>阅读</span>
        </div>
        <div class="two">
          <p>{{capsuleUsedCount}}</p>
          <span>完成练习</span>
        </div>
        <div class="three">
          <p>{{parseInt(capsuleUsedCount*100/capsuleInfo.clickNum)}}%</p>
          <span>打卡</span>
        </div>
      </div>
      <div class="newUsreBox">
        <div class="imgBox">
          <template v-if="recentUserList.length <= 4" v-for="item in recentUserList">
            <img :src="item.headImgUrl" />
          </template>
          <template v-if="recentUserList.length > 4" v-for="item,index in 4">
            <img :src="recentUserList[index].headImgUrl"  />
            <span v-if="exerList.length > 4">+{{exerList.length - 4}}</span>
          </template>
        </div>
        <span class="newUser">最新参加的用户</span>
      </div>
      <div class="numBox">
        <div @click="praiseClick">
          <img :src="isPraise?'/static/img/newCapsule/redHeard.png':'/static/img/newCapsule/heard.png'"/>
          <span>{{praiseCount}}</span>
        </div>
        <div>
          <img src="/static/img/newCapsule/comment.png"/>
          <span>{{capsuleUsedCount}}</span>
        </div>
      </div>
      <div class="commentList">
        <div class="itemsBox" v-for="item in exerList">
          <div class="title">
            <img :src="item.headimgurl" />
            <div>
              <p>
                {{item.wxname}}
              </p>
              <span v-if="item.childrenInfo">{{item.childrenInfo.childAge}}岁{{item.childrenInfo.sex == 1? '女孩':'男孩'}}{{item.sex == 2 ? '宝妈' : item.sex == 1 ?'宝爸':'父母'}}</span>
            </div>
          </div>
          <div class="textBox" v-if="item.exercise">
            <p>{{item.exercise.text}}</p>
          </div>
          <div class="photoBox" v-if="item.exercise&&item.exercise.photoList&&item.exercise.photoList.length != 0">
            <span  v-for="photoItem in item.exercise.photoList" style="margin-right: 10px">
              <img :src="photoItem" @click="previewImage(photoItem,item.exercise.photoList)"/>
            </span>
          </div>
          <div class="praiseNum" @click="exerPraiseClick(item)">
            <img :src="item.hasPraise?'/static/img/newCapsule/redHeard.png':'/static/img/newCapsule/heard.png'"/>
            <span>{{item.praiseCount}}</span>
          </div>
        </div>
        <p v-if="isMoreExer" class="addMore" @click="addMore">加载更多的评论</p>
        <p v-else style="color: #999;text-align: center;padding: 10px;">暂时没有更多评论了</p>
      </div>
    </div>
    <button class="btn" @touchstart="submit" v-if="!isExercise && capsuleInfo">
      <img src="/static/img/newCapsule/infobtn@2x.png" />
      打卡
    </button>
    <button v-if="isExercise && capsuleInfo" class="btn btn_Exer" @touchstart="goto('/newCapsule/guideShare/'+capsuleId)">
        <img src="/static/img/newCapsule/infobtn@2x.png" />
        查看详情

    </button>
    <div class="masker" v-if="showShare" @click="showShare=!showShare">
      <masker>
        <div slot="content" class="m-title">
          <img class="model-img" src="/static/img/shareintro.png" alt="">
        </div>
      </masker>
      <p class="share-text">请点击右上角，分享给朋友们~</p>
    </div>
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
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import { Masker, XDialog } from 'vux'
import StatModel from 'lanmaLib/modules/statistics'
export default{
  components: {
    Masker,
    XDialog
  },
  directives: {
  },
  data () {
    return {
      page: 1,
      capsuleId: 0,
      hashTable: {},
      authorTable: {},
      capsuleInfo: {},
      exerList: [],
      capsuleUsedCount: 0,
      praiseCount: 0,
      showShare: false,
      isPraise: false,
      isExercise: false,
      recentUserList: [],
      isMoreExer: true,
      isNoSubscribe: false
    }
  },
  computed: {
  },
  created () {
    StatModel.activityAddStat(43)
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    api.user.isSubscribe()
      .then((res) => {
        this.isNoSubscribe = !res
        if (res) {
          this.$api.user.getChildrenInfo()
            .then(data => {
              if (data.childrenList.length === 0) {
                this.$api.user.createChildren()
                  .then(() => {
                    this.$router.push('/newCapsule/register/' + id)
                  })
              } else {
                if (!(data.childrenList.length !== 0 && data.childrenList[0].name && data.childrenList[0].birthday && (data.childrenList[0].sex === 0 || data.childrenList[0].sex === 1))) {
                  this.$router.push('/newCapsule/register/' + id)
                }
              }
            })
        }
      })
    this.capsuleId = id
    this.$axios.all([this.getLabelList(), this.getAuthorList(), this.getCapsuleExerciseAnsList(), this.getCapsuleUsedCount()])
      .then(() => {
        this.getRecentUser()
        this.getCapsuleInfo()
      })
  },
  mounted () {
  },
  methods: {
    goto(url) {
      this.$router.push(url)
    },
    getRecentUser () {
      api.newCapsule.getRecentUser(this.capsuleId)
        .then((data) => {
          this.recentUserList = data.list
        })
    },
    getLabelList () {
      return labelModule.getLabelList()
        .then((labelList) => {
          this.hashTable = labelModule.getHashTable(labelList)
        })
    },
    getAuthorList () {
      var authorParams = {
        offset: 0,
        length: 0,
        authorType: 0,
        authorTypeList: [0, 1, 2]
      }
      return api.capsule.getCertificaList(authorParams)
        .then((data) => {
          var temp = {}
          data.list.forEach(function (item) {
            temp[item.id] = item
          })
          this.authorTable = temp
        })
    },
    getCapsuleInfo () {
      api.capsule.getCapsule(this.capsuleId)
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
          this.setShare()
          console.log(data)
        })
    },
    getCapsuleExerciseAnsList () {
      var _this = this
      var params = {
        capsuleId: this.capsuleId,
        offset: (this.page - 1) * 5,
        length: 5
      }
      api.newCapsule.getCapsuleExerciseAnsList(params)
        .then((data) => {
          data.list.forEach(function (item) {
            item.exercise = JSON.parse(item.actionText)
            item.childrenInfo.childAge = _this.getAge(item.childrenInfo.birthDay)
            return item
          })
          this.exerList = this.exerList.concat(data.list)
          if (data.list.length === 0) {
            this.isMoreExer = false
          }
        })
        .catch((e) => {
          this.exerList = []
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
    },
    backPrePage () {
      this.$wechat.closeWindow()
    },
    getAge (birthday) {
      try {
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
        return returnAge
      } catch (e) {
        return -1
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
    },
    addMore () {
      this.page++
      this.getCapsuleExerciseAnsList()
    },
    setShare () {
      var title = '发现一个好玩的游戏'
      var desc = this.capsuleInfo.topic
      var imgUrl = window.location.origin + '/static/img/newCapsule/panda2.png'
      this.$share.setShareInfo(title, desc, imgUrl)
    },
    submit () {
      var params = {
        capsuleId: this.capsuleId,
        actionType: 'exercise',
        actionText: {
          text: '已打卡'
        }
      }
      api.capsule.addAction(params)
        .then((data) => {
          this.$router.push('/newCapsule/guideShare/' + this.capsuleId)
        })
    },
    praiseClick () {
      var params = {
        capsuleId: this.capsuleId,
        actionType: 'praise',
        actionText: ''
      }
      if (this.isPraise) {
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
    exerPraiseClick (item) {
      var params = {
        capsuleActionId: item.id,
        actionType: 'praise',
        actionText: ''
      }
      if (item.hasPraise) {
        api.newCapsule.delAnsAction(params)
          .then(() => {
            item.praiseCount -= 1
            item.hasPraise = false
          })
      } else {
        api.newCapsule.addAnsAction(params)
          .then(() => {
            item.praiseCount += 1
            item.hasPraise = true
          })
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .page{
    width:100%;
    min-height: 100vh;
    box-sizing: border-box;
    background: #fff;
    padding-bottom: (50rem/16);
  }
  .top{
    width:100%;
    img{
      width:100%;
    }
    .share{
      width:(20rem/16);
      position: absolute;
      top: (10rem/16);
      right:(10rem/16);
    }
  }
  .targetBox{
    padding: 0 (10rem/16);
    display: flex;
    align-items: center;
    img{
      width:(40rem/16);
      height:(40rem/16);
      border-radius: 50% 50%;
      margin-right: (10rem/16);
    }
    span{
      display: inline-block;
      color: #000;
    }
  }
  .contentBox{
    .contentItem{
      padding: 0 (5rem/16);
      label{
        font-size: 16px;
        color: #000;
        display: inline-block;
        padding: 0 (10rem/16);
        border-left: 4px solid #61CF5B;
        margin-top: (20rem/16);
      }
      p{
        font-size: (14rem/16);
        color: #666;
        padding: 0 (10rem/16);
      }
    }
  }
  .btn{
    height:(50rem/16);
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    width:100%;
    left: 0;
    right: 0;
    border: 0;
    background: #6665FF;
    color: #fff;
    font-size: (18rem/16);
    img{
      vertical-align: middle;
      margin-top: -(4rem/16);
      width:(15rem/16);
    }
  }
  .commentBox{
    margin-top: (40rem/16);
    .top{
      display: flex;
      align-items: center;
      width:100%;
      div{
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        display: inline-block;
        text-align: center;
        width:33%;
        border-right: 1px solid #eee;
        &:last-child{
          border-right: 0px solid #eee;
        }
        p{
          font-size: (18rem/16);
          font-weight: bold;
          line-height: 1.2;
        }
        span{
          color: #999;
          font-size: (14rem/16);
        }
      }
    }
    .newUsreBox{
      padding: (20rem/16);
      border-bottom: 1px solid #eee;
      position: relative;
      .imgBox{
        display: inline-block;
        position: relative;
        font-size: 0;
        img{
          width:(30rem/16);
          height:(30rem/16);
          border-radio: (5rem/16);
          margin-right: (5rem/16);
        }
        span{
          font-size: 1rem;
          width:(30rem/16);
          height:(30rem/16);
          line-height: (30rem/16);
          display: inline-block;
          border-radio: (5rem/16);
          background: #CDCDCD;
          vertical-align: top;
          color: #fff;
          text-align: center;
          font-weight: bold;
        }
      }
      .newUser{
        color: #999;
        display: inline-block;
        position: absolute;
        right:(40rem/16);
        top: (30rem/16);
        line-height: (15rem/16);
      }
    }
    .numBox{
      padding: (20rem/16) (5rem/16);
      border-bottom: 1px solid #eee;
      &>div{
        display: inline-flex;
        align-items: center;
        img{
          margin-left: (15rem/16);
          width:(15rem/16);
        }
        span{
          display: inline-block;
          margin-left: (5rem/16);
        }
      }
    }
    .commentList{
      .itemsBox{
        padding: (10rem/16) (20rem/16);
        border-bottom: 1px solid #eee;
        .title{
          margin-bottom: (10rem/16);
          display: flex;
          align-items: center;
          img{
            width:(40rem/16);
            height:(40rem/16);
            margin-right: (10rem/16);
          }
          div{
            display: inline-block;
            p{
              color: #6B7980;
              line-height: 1.3;
            }
            span{
              color: #D5D8DB;
              font-size: (13rem/16);
            }
          }
        }
        .textBox{
          color: #6B7980;
        }
        .photoBox{
          span{
            display: inline-block;
            width: (60rem/16);
            height: (60rem/16);
            img{
              width:100%;
              height:100%;
            }
          }
        }
        .praiseNum{
          margin-top: (10rem/16);
          display: flex;
          align-items: center;
          img{
            width:(15rem/16);
          }
          span{
            display: inline-block;
            margin-left: (5rem/16);
          }
        }
      }

      .addMore{
        text-align: center;
        color: #4E9BC0;
        padding: (10rem/16);
      }
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
  .btn_Exer{
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
  }
</style>
