<template>
  <div class="page">
    <div class="center">
      <div class="itemList" :style="{transform: 'translateX('+ itemW +'rem)'}">
        <div class="itemBox" v-for="item,index in capsuleList">
          <div class="title">
            <p>{{item.topic}}</p>
            <div class="authorInfo">
              <img v-if="item.authorInfo.headImgUrl" :src="item.authorInfo.headImgUrl" />
              <span>年龄：{{item.labelAge_title.replace('-','~')}}</span>
            </div>
          </div>
          <div class="card">
            <div class="imgBox">
              <div class="targetBox">
                <span>{{item.labelTarget_title[1]}}</span>
                <span>{{item.labelTarget_title[2]}}</span>
              </div>
              <img :src="item.cover" />
              <img class="isExer" v-if="item.isExerciseAlready" src="/static/img/newCapsule/isdaka@3x.png" />
            </div>
            <div class="infoBox">
              <p>
                <span>目标：</span>{{item.description}}
              </p>
              <button @touchstart="goto('/newCapsule/info/' + item.id)">开始</button>
            </div>
          </div>
        </div>
        <div class="itemBoxLast" style="vertical-align: top">
          <div class="title">
            <p>温馨提示</p>
          </div>
          <div class="card">
            <div class="imgBox">
              <img src="/static/img/newCapsule/panda.png" />
            </div>
            <div class="infoBox">
              <p>
                没有更多的游戏了<br/>
                明天会更新一波呦~
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading :show="showLoading" :text="'加载中'"></loading>
  </div>
</template>

<script>
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import { Loading } from 'vux'
import StatModel from 'lanmaLib/modules/statistics'
export default{
  components: {
    Loading
  },
  directives: {
  },
  data () {
    return {
      page: 1,
      rootLabel: [],
      targetLabelTree: [],
      hashTable: {},
      capsuleScenneLabelList: [],
      capsuleScenneParent: 0,
      exerAlreadyList: [],
      capsuleList: [],
      itemW: 0,
      showLoading: false
    }
  },
  computed: {
  },
  created () {
    StatModel.activityAddStat(42)
    this.showLoading = true
    api.label.getRootLabel()
      .then((data) => {
        this.rootLabel = data.list
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].code === 'capsuleScenne') {
            this.capsuleScenneParent = data.list[i].id
          }
        }
        this.$axios.all([this.getLabelList(), this.getAuthorList(), this.getExerList()])
          .then(() => {
            this.getList()
          })
      })
  },
  mounted () {
    // var el = document.getElementsByClassName('center')[0]
    // this.itemW = (el.clientWidth - 20) * 0.95 + 20
    // console.log(this.itemW)
    this.moveItems()
    document.querySelector('body').addEventListener('touchstart', function (event) {
      event.preventDefault()
    }, false)
  },
  beforeRouteLeave (to, from, next) {
    document.querySelector('body').addEventListener('touchstart', function (event) {
      event.returnValue = true
    })
    next()
  },
  methods: {
    moveItems () {
      var docEl = document.documentElement
      var w = docEl.getBoundingClientRect().width
      var rem = w / 23.4375
      var _this = this
      var el = document.getElementsByClassName('itemList')[0]
      var stW = 0
      var stItemRem = _this.itemW
      var max = 0
      var sTime
      var nowW
      el.addEventListener('touchstart', function (event) {
        max = _this.capsuleList.length * -22
        stItemRem = _this.itemW
        stW = event.changedTouches[0].pageX
        sTime = new Date()
      })
      el.addEventListener('touchmove', function (event) {
        el.style.transition = '0s'
        nowW = event.changedTouches[0].pageX
        var dis = nowW - stW
        _this.itemW = stItemRem + dis / rem
      })
      el.addEventListener('touchend', function (event) {
        var eTime = new Date()
        var dis = nowW - stW
        var timeTemp = eTime.getTime() - sTime.getTime()
        el.style.transition = '0.3s all'
        var temp = _this.itemW
        if (temp >= 0) {
          _this.itemW = 0
          return
        } else if (temp <= max) {
          _this.itemW = max
          return
        }
        if (Math.abs(dis / timeTemp) > 0.6) {
          if (dis > 0) {
            temp = -22 * Math.abs(parseInt(temp / 22))
          } else {
            temp = -22 * (Math.abs(parseInt(temp / 22)) + 1)
          }
        } else {
          if (Math.abs(temp % 22) > 10) {
            temp = -22 * (Math.abs(parseInt(temp / 22)) + 1)
          } else {
            temp = -22 * Math.abs(parseInt(temp / 22))
          }
        }
        _this.itemW = temp
      })
    },
    getLabelList () {
      return labelModule.getLabelList()
        .then((labelList) => {
          this.targetLabelTree = labelModule.getTargetTreee()
          this.hashTable = labelModule.getHashTable(labelList)
          var temp = [{'title': '场景', 'id': 0}]
          temp = temp.concat(labelModule.getLabel(this.capsuleScenneParent).childs)
          this.capsuleScenneLabelList = temp
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
    getExerList () {
      var params = {
        actionType: 'exercise'
      }
      api.capsule.getCapsuleListByAction(params)
        .then((data) => {
          this.exerAlreadyList = data.list
        })
    },
    getList () {
      var _this = this
      // var params = {
      //   offset: (this.page - 1) * 20,
      //   length: 10,
      //   labelTarget: 0,
      //   orderType: 'downtime',
      //   labelScene: ''
      // }
      api.newCapsule.filterNewCapsuleList()
        .then((data) => {
          data.forEach(function (item) {
            item.labelScene_title = []
            item.authorInfo = _this.authorTable[item.authorId]
            item.labelTarget_title = labelModule.getThemeLabel(item.labelTarget).replace(/ \/ /g, '|').split('|')
            item.isExerciseAlready = false
            item.description = _this.hashTable[item.labelTarget].description
            for (var a = 0; a < _this.exerAlreadyList.length; a++) {
              if (_this.exerAlreadyList[a].id === item.id) {
                item.isExerciseAlready = true
                break
              }
            }
            for (var i = 0; i < item.labelScene.length; i++) {
              item.labelScene_title.push(_this.hashTable[item.labelScene[i]].title)
            }
            if (item.labelAge.length === 1) {
              item.labelAge_title = _this.hashTable[item.labelAge[0]].title
            } else {
              var hashTable = _this.hashTable
              var temp = []
              var temp1 = hashTable[item.labelAge[0]].code.split(/_/).splice(0, 2)
              var temp2 = hashTable[item.labelAge[1]].code.split(/_/).splice(0, 2)
              if (temp1[0] > temp2[0]) {
                temp.push(temp2[0], temp1[1])
              } else {
                temp.push(temp1[0], temp2[1])
              }
              item.labelAge_title = temp.join('-') + '岁'
            }
            return item
          })
          console.log(data)
          this.capsuleList = data
          this.showLoading = false
        })
    },
    goto(url) {
      this.$router.push(url)
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
  background: #549EFF;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}
.center{
  font-family: Helvetica;
  box-sizing: border-box;
  padding: (10rem/16);
  width:100%;
  overflow: hidden;
  min-height: 100vh;
  position: relative;
  .itemList{
    transform: translateX(0rem);
    transition: 0.3s all;
    position: absolute;
    left: (10rem/16);
    top: (10rem/16);
    z-index: 100;
    white-space: nowrap;
  }
  .itemBoxLast{
    transition: 0.3s;
    margin-right: (16rem/16);
    width:21rem;
    display: inline-block;
    .title{
      white-space: normal;
      min-height:15vh;
      box-sizing: border-box;
      padding: (20rem/16) 0 0 (15rem/16);
      p{
        width:100%;
        color: #fff;
        font-size: (25rem/16);
      }
    }
    .card {
      min-height: 80vh;
      background: #fff;
      border-radius: (10rem/16);
      text-align: center;
      box-sizing: border-box;
      padding-top: 30%;
      .imgBox{
        width:100%;
        img{
          width:50%;
        }
      }
      .infoBox{
        margin-top: (30rem/16);
        p{
          color: #999;
          font-size: (16rem/16);
        }
      }
    }
  }
  .itemBox{
    transition: 0.3s;
    margin-right: (16rem/16);
    width:21rem;
    display: inline-block;
    .title{
      white-space: normal;
      min-height:15vh;
      box-sizing: border-box;
      padding: (5rem/16) 0 0 (15rem/16);
      p{
        width:100%;
        color: #fff;
        font-size: (18rem/16);
      }
      .authorInfo{
        color: #fff;
        display: flex;
        align-items: center;
        img{
          width:(20rem/16);
          height:(20rem/16);
          border-radius: 50% 50%;
          margin-right: (10rem/16);
        }
        span{
          font-size: (14rem/16);
        }
      }
    }
    .card{
      min-height:80vh;
      background: #fff;
      border-radius: (10rem/16);
      .imgBox{
        height:80%;
        position: relative;
        width:100%;
        img{
          width:100%;
          height:55vh;
        }
        .isExer{
          width:(70rem/16);
          position: absolute;
          top: 2%;
          right: 2%;
          height:auto;
        }
        .targetBox{
          position: absolute;
          left: 5%;
          top:5%;
          width:(100rem/16);
          span{
            display: block;
            &:first-child{
              color: #000;
              font-size: (20rem/16);
              line-height: 1.1;
            }
            &:last-child{
              color: #999;
              font-size: (14rem/16);
            }
          }
        }
      }

      .infoBox{
        white-space: normal;
        padding: (15rem/16);
        text-align: center;
        p{
          text-align: left;
          font-size: (14rem/16);
          color: #3C3C3C;
          span{
            font-weight: bold;
            color: #000;
          }
        }
        button{
          width:50%;
          height:(40rem/16);
          margin-top: (20rem/16);
          border-radius: (25rem/16);
          background: #6665FE;
          border: 0;
          color: #fff;
          font-size: (18rem/16);
        }
      }
    }
  }
}
</style>
