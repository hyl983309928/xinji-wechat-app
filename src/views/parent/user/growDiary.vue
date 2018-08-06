<template>
  <div class="page">
    <div class="top" v-if="loaded">
      <div class="title">
        {{childrenInfo.childrenList[0].name? childrenInfo.childrenList[0].name:userInfo.wxName}}の家庭成长日记
      </div>
      <div class="titleImg">
        <img src="/static/img/growDiary/title1.png" />
      </div>
      <div class="info">
        <div class="userHead">
          <img :src="headimgUrl" />
        </div>
        <div class="userInfo">
          <p>
            成长等级：<span>Lv{{level_label}}</span>
          </p>
          <p>
            课程时长：<span>{{sumTimeLength}}</span>
          </p>
          <p class="smallFont">
            成长是学习的累积。。让我们一起努力！
          </p>
        </div>
      </div>
    </div>
    <div class="diaryContent" v-if="loaded">
      <div class="timeLineBox">
        <div class="timeLineItem_first">
          <div class="timeNode">
            <span class="line"></span>
          </div>
        </div>
        <template v-for="item,index in timeLineList">
          <div class="timeLineItem_month" v-if="item.type == 'month'">
            <div class="timeNode">
              <span class="line"></span>
            </div>
            <div class="timeLineContent">
              <div class="timeBox">
                <span class="month">
                  {{item.time_title[1]}}月
                </span>
                <span class="year">
                  {{item.time_title[0]}}
                </span>
              </div>
              <div class="monthDiary">
                <div class="accompanyTime">
                	<!--本月{{index == 0 ? '已':''}}陪伴孩子：-->
                	本月学习时长：
                	<span class="time">
                	  {{item.time_length}}
                	</span>
                </div>
                <div class="surpass" v-html="item.percent_label">
                </div>
              </div>
            </div>
          </div>
          <div class="timeLineItem" v-else>
            <div class="timeNode">
              <span class="node" v-if="!timeLineList[index - 1] || item.time_title != timeLineList[index - 1].time_title"></span>
              <span class="line"></span>
            </div>
            <div class="timeLineContent">
              <div class="info">
                <div class="infoDate" v-if="!timeLineList[index - 1] || item.time_title != timeLineList[index - 1].time_title">
                  {{item.time_title}}
                </div>
                <div class="infoContent" :class="[item.type == 'capsule'? 'aqua' : item.userId!=1 ? 'yellow' : item.type == 'course'?'pink':'blue']" @click="goTarget(item.type,item.id)">
                  <div class="title">{{ item.title }}</div>
                  <div class="timeLength" v-if="item.type == 'tour'">目的地：{{item.lesson_location}}</div>
                  <div class="target" v-else>课程目标：{{ item.labelTarget_title }}</div>
                  <div class="timeLength">课程时长：+{{editDuration(item.duration)}}</div>
                  <div class="timeLength" v-if="item.userId!=1 && item.type != 'capsule'">上课机构：{{item.thirdPartyName}}</div>
                  <div class="type">
                    <span class="typeBox">
                      <img :src="[item.type == 'capsule'? '/static/img/growDiary/jiaonang.png' : item.userId!=1 ? '/static/img/growDiary/thirdParty.png' : item.type == 'course'?'/static/img/growDiary/tiyanfang.png':'/static/img/growDiary/tiyanying.png']" />
                      <span>{{item.type == 'capsule'? '胶囊' : item.userId!=1 ? '第三方机构' : item.type == 'course' ? '体验坊' : '体验营'}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </template>
        <div class="timeLineItem">
          <div class="timeNode">
            <span class="node"></span>
            <span class="line"></span>
          </div>
          <div class="timeLineContent">
            <div class="info">
              <div class="infoDate">
                {{createTime}}
              </div>
              <div class="timeLineLast">
                <p>欢迎加入心迹家庭成长社</p>
              </div>
            </div>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    </div>
    <loading :show="showLoading" :text="'加载中'"></loading>
  </div>
</template>
<script>
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import config from 'lanmaLib/config'
import userModule from 'lanmaLib/modules/user'
import {Loading} from 'vux'
import StatModel from 'lanmaLib/modules/statistics'
import common from 'src/common'

export default{
  components: {
    Loading
  },
  data () {
    return {
      hashTable: [],
      timeLineList: [],
      sumTimeLength: '',
      createTime: '',
      level_label: 0,
      showLoading: false,
      childrenInfo: {},
      loaded: false,
      headimgUrl: '',
      userInfo: {}
    }
  },
  created () {
    var statId = common.getShareParamter('statId')
    if (statId) {
      StatModel.activityAddStat(statId)
    }
    this.showLoading = true
    labelModule.getLabelList()
      .then((labelList) => {
        this.hashTable = labelModule.getHashTable(labelList)
        this.getUserTimeline()
      })
  },
  methods: {
    getHeadimgUrl (children) {
      try {
        if (children.headimgUrl && children.headimgUrl !== '') {
          this.headimgUrl = children.headimgUrl
        } else {
          if (children.sex) {
            this.headimgUrl = '/static/img/girl.png'
          } else {
            this.headimgUrl = '/static/img/boy.png'
          }
        }
      } catch (e) {
        this.headimgUrl = '/static/img/boy.png'
      }
    },
    getUserTimeline () {
      var _this = this
      api.user.getUserTimeline()
        .then((data) => {
          this.sumTimeLength = parseInt(data.minutes / 60) + '小时' + data.minutes % 60 + '分钟'
          this.createTime = this.countTime(data.createTime)
          this.level_label = data.level
          data.list.forEach(function (item) {
            item.labelTarget_title = labelModule.getThemeLabel(item.labelTarget).replace(/ \/ /g, '|')
            if (item.type === 'month') {
              item.realTime += ''
              item.time_title = item.realTime.split('-')
              item.time_length = parseInt(item.total / 60) + '小时' + item.total % 60 + '分钟'
              item.percent_label = _this.getMonthAssess(item.percent)
            } else {
              item.time_title = _this.countTime(item.time)
            }
          })
          this.timeLineList = data.list
          this.getUserInfo()
          this.showLoading = false
        })
        .catch(e => {
          console.log(e)
          this.showLoading = false
        })
    },
    getUserInfo () {
      userModule.getUserInfo()
        .then((data) => {
          this.userInfo = data
          console.log(data)
          api.user.getChildrenInfo()
            .then((data) => {
              this.loaded = true
              this.childrenInfo = data
              this.getHeadimgUrl(data.childrenList[0])
            })
            .catch(e => {
              this.loaded = true
            })
        })
    },
    getMonthAssess (percent) {
      var rule = config.diaryRule.monthAssess.rule
      var monthAssessLabel = config.diaryRule.monthAssess.label
      if (percent >= rule[rule.length - 1]) {
        return monthAssessLabel[monthAssessLabel.length - 1]
      }
      for (var i = 0; i < rule.length - 1; i++) {
        if (percent >= rule[i] && percent < rule[i + 1]) {
          return monthAssessLabel[i]
        }
      }
      return monthAssessLabel[0]
    },
    getLevel (time) {
      var rule = config.diaryRule.accompanyGrade.rule
      var levelLabel = config.diaryRule.accompanyGrade.level
      if (time >= rule[rule.length - 1]) {
        return levelLabel[levelLabel.length - 1]
      }
      for (var i = 0; i < rule.length - 1; i++) {
        if (time >= rule[i] && time < rule[i + 1]) {
          return levelLabel[i]
        }
      }
      return levelLabel[0]
    },
    countTime (time) {
      try {
        var temp = time.replace(/-/g, '/')
        var d = new Date(temp)
        var month = d.getMonth()
        var day = d.getDate()
        var week = d.getDay()
        var weekMap = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        var weekLabel = weekMap[week]
        var monthAndDayLabel = month + 1 + '-' + day
        return monthAndDayLabel + ' ' + weekLabel
      } catch (e) {
        return ''
      }
    },
    goTarget (type, id) {
      switch (type) {
        case 'capsule':
          this.$router.push('/capsule/exerciseEnd/' + id)
          break
        case 'course':
          this.$router.push('/parent/course/report/detail/' + id)
          break
        case 'tour':
          this.$router.push('/parent/course_tour/report/detail/' + id)
          break
        default:
          break
      }
    },
    editDuration (time) {
      try {
        var t = parseInt(time)
        var temp = ''
        if (parseInt(t / 60) !== 0) {
          temp += parseInt(t / 60) + '小时'
        }
        if (parseInt(t % 60) !== 0) {
          temp += parseInt(t % 60) + '分钟'
        }
        return temp
      } catch (e) {
        return ''
      }
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss">
.top{
  background: url(/static/img/growDiary/titlebg.png) no-repeat;
  background-size: 100% 100%;
  width: 100%;
  box-sizing: border-box;
  padding: (20rem/16);
  padding-left: (40rem/16);
  .title{
    width:90%;
    display: block;
    color: #06c5d0;
    font-size: (19rem/16);
    font-weight: bold;
  }
  .titleImg{
    width:100%;
    position: relative;
    line-height: 1;
    height:(20rem/16);
    img{
      width:100%;
      position: absolute;
      bottom:0;
    }
  }
  .info{
    margin-top: (10rem/16);
    .userHead{
      display: inline-block;
      vertical-align: top;
      width:(71rem/16);
      height:(71rem/16);
      img{
        width:100%;
        height:100%;
        border-radius: 50% 50%;
      }
    }
    .userInfo{
      margin-left: (10rem/16);
      width:(225rem/16);
      height:(71rem/16);
      display: inline-block;
      p{
        width:100%;
        color: #06c5d0;
        font-weight: bold;
        font-size:(15rem/16);
        span{
          color: #f5a623;
        }
      }
      .smallFont{
        font-weight: normal;
        font-size:(12rem/16);
      }
    }

  }
}
.diaryContent{
  box-sizing: border-box;
  padding: 0 (10rem/16);
  width:100%;
  .timeLineBox{
    width:100%;
    box-sizing: border-box;
    position: relative;
    .timeLineItem{
      width:100%;
      height:auto;
      position: relative;
      bottom: 0;
      top:0;
      .timeNode{
        text-align: center;
        display: inline-block;
        height:100%;
        position: absolute;
        bottom: 0;
        top:0;
        vertical-align: top;
        margin-left: (10rem/16);
        width:(14rem/16);
        .node{
          display: inline-block;
          width:(14rem/16);
          height:(14rem/16);
          border-radius: 50% 50%;
          background: #ccc;
          vertical-align: top;
        }
        .line{
          display: inline-block;
          width:(2rem/16);
          position: absolute;
          top:0;
          left: (6rem/16);
          height:100%;
          background: #ccc;
          bottom: 0;
        }
      }
      .timeLineContent{
        display: inline-block;
        width:92%;
        position: relative;
        margin-bottom: (20rem/16);
        float: right;
        .info{
          width: 100%;
          height:100%;
          .infoDate{
            color: #999;
            font-size: (15rem/16);
            line-height: (14rem/16);
            margin-bottom: (13rem/16);
          }
          .infoContent{
            background-size: 100% 100%;
            color: #fff;
            box-sizing: border-box;
            padding: (15rem/16) (15rem/16) (10rem/16) (15rem/16);
            font-family: PingFangSC-Medium;
            border-radius: (7.5rem/16);
            .title{
              font-size: (15rem/16);
              margin-bottom: (3rem/16);
              font-weight: bold;
            }
            .target{
              family: PingFangSC-Regular;
              font-size: (13rem/16);
              line-height: 1.3;
            }
            .timeLength{
              family: PingFangSC-Regular;
              font-size: (13rem/16);
              line-height: 1.3;
            }
            .type{
              margin-top: (11rem/16);
              height:(26rem/16);
              .typeBox{
                display: inline-block;
                text-align: center;
                box-sizing: border-box;
                padding: (6rem/16) (10rem/16);
                height:100%;
                border-radius: (50rem/16);
                img{
                  height:100%;
                  vertical-align: top;
                }
                span{
                  display: inline-block;
                  vertical-align: top;
                  font-size: (12rem/16);
                  line-height: (14rem/16);
                }
              }
            }
          }
          .pink{
            background: #FF858F no-repeat;
            .typeBox{
              background: rgb(229,119,128) no-repeat;
            }
          }
          .blue{
            background: #00b0f0 no-repeat;
            .typeBox{
              background: rgb(0,158,215) no-repeat;
            }
          }
          .aqua{
            background: #33cccc no-repeat;
            .typeBox{
              background: rgb(45,183,183) no-repeat;
            }
          }
          .yellow{
            background: #ffb070 no-repeat;
            .typeBox{
              background: #E59E65 no-repeat;
            }
          }
        }
      }
    }
    .timeLineItem_month{
      width:100%;
      position: relative;
      .timeNode{
        text-align: center;
        height:100%;
        width:(14rem/16);
        position: absolute;
        left: (10rem/16);
        z-index: -1;
        display: inline-block;
        .node{
          display: inline-block;
          width:(14rem/16);
          height:(14rem/16);
          border-radius: 50% 50%;
          background: #ccc;
          vertical-align: top;
        }
        .line{
          display: inline-block;
          width:(2rem/16);
          position: absolute;
          top:0;
          left: (6rem/16);
          background: #ccc;
          z-index: -1;
          bottom: 0;
        }
      }
      .timeLineContent{
        width:100%;
        background: #FFF;
        border-radius: (7.5rem/16);
        display: inline-block;
        box-sizing: border-box;
        padding: (10rem/16);
        z-index: 99;
        margin-bottom: (20rem/16);
        font-family: PingFangSC-Medium;
        .timeBox{
          width:(48rem/16);
          height:(46rem/16);
          background: url(/static/img/growDiary/date.png) no-repeat;
          background-size: 100% 100%;
          padding-top: (8rem/16);
          box-sizing: border-box;
          display: inline-block;
          vertical-align: top;
          text-align: center;
          .month{
            display: block;
            font-size: (19rem/16);
            line-height: 1;
            color: #FFF;
          }
          .year{
            display: block;
            font-size: (16rem/16);
            line-height: 1;
            color: #FFF;
          }
        }
        .monthDiary{
          display: inline-block;
          width:80%;
          .accompanyTime{
            color: #4a4a4a;
            font-size: (14rem/16);
            .time{
              color: #06C5D0;
            }
          }
          .surpass{
            color: #9b9b9b;
            font-size: (14rem/16);
            .percent{
              color: #06C5D0;
            }
          }
        }
      }
    }

    .timeLineItem_first{
      width:100%;
      height:1.5rem;
      position: relative;
      .timeNode{
        text-align: center;
        position: relative;
        margin-left: (10rem/16);
        height:100%;
        width:(14rem/16);
        .line{
          display: inline-block;
          width:(2rem/16);
          position: absolute;
          top:0;
          left: (6rem/16);
          background: #ccc;
          bottom: 0;
        }
      }
    }
    .timeLineLast{
      margin-top: (10rem/16);
      p{
        font-size: (14rem/16);
        color: #979797;
       }
    }
  }
}
</style>
