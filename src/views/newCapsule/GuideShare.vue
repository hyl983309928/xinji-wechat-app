<template>
<div class="page">
  <div class="card">
    <div class="top">
      <div>
        <p style="text-align: right;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{userLavel.wxName}}</p>
      </div>
      <div class="imgBox">
        <img :src="userLavel.headimgurl" />
      </div>
      <div>
        <p>等级<span style="">Lv{{userLavel.level}}</span></p>
        <!--<span>打卡{{activeRateInfo.ansCount}}次</span><br>-->
        <!--<span>超越{{activeRateInfo.rate}}%</span>-->
      </div>
    </div>
    <div class="center">
      <p>连续打卡</p>
      <p>第 <span>{{activeRateInfo.continueNum}}</span> 天</p>
      <p>
        <span>打卡<span style="color: #6768EB;">{{activeRateInfo.ansCount}}</span>次</span>
        <span>超越<span style="color: #6768EB;">{{activeRateInfo.rate}}%</span></span>
      </p>
    </div>
    <div id="radar">
    </div>
  </div>
  <div class="footBox" v-if="userLavel.wxName" @click="showShare=true">
    <button>分享</button>
  </div>
  <div class="masker" v-if="showShare" @click="showShare=!showShare">
    <masker>
      <div slot="content" class="m-title">
        <img class="model-img" src="/static/img/shareintro.png" alt="">
      </div>
    </masker>
    <p class="share-text">请点击右上角，分享给朋友们~</p>
  </div>
</div>
</template>

<script>
import echarts from 'echarts'
import api from 'lanmaLib/common/api'
import userModule from 'lanmaLib/modules/user'
import { Masker, WechatPlugin } from 'vux'
import StatModel from 'lanmaLib/modules/statistics'
export default{
  components: {
    Masker
  },
  directives: {
  },
  data () {
    return {
      exerciseCapsuleList: [],
      showShare: false,
      userLavel: {},
      activeRateInfo: {},
      myChart: {}
    }
  },
  computed: {
  },
  created () {
    StatModel.activityAddStat(44)
    this.$axios.all([this.getUserLavel(), this.getActiveRate(), this.getCapsuleListByAction()])
      .then(() => {
        this.setShare()
      })
  },
  mounted () {
    this.myChart = echarts.init(document.getElementById('radar'))
    this.setRadar()
  },
  methods: {
    setRadar(radarList = []) {
      var temp = []
      var max = 0
      var maxCount
      if (radarList.length !== 0) {
        maxCount = radarList[0].count
        for (let i = 0; i < radarList.length; i++) {
          // max += radarList[i].count + 1
          if (maxCount < radarList[i].count) {
            maxCount = radarList[i].count
          }
        }
        max = maxCount + 1
        for (let i = 0; i < radarList.length; i++) {
          temp.push(radarList[i].count + 1)
        }
        radarList = temp
      } else {
        max = 100
      }
      console.log(max)
      console.log(maxCount)
      var option = {
        radar: {
          name: {
            formatter: '{value}',
            color: '#999'
          },
          radius: [70],
          shape: 'circle',
          splitArea: {
            areaStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          indicator: [
            {text: '学习过程', max: max},
            {text: '学习能力与方法', max: max},
            {text: '学习品质', max: max},
            {text: '实践与运用', max: max},
            {text: '人际交往', max: max},
            {text: '社会适应', max: max},
            {text: '身体关怀', max: max},
            {text: '情感管理', max: max},
            {text: '核心人格', max: max}
          ]
        },
        series: [{
          type: 'radar',
          itemStyle: {
            normal: {
              areaStyle: {type: 'default'},
              color: '#726EE5'
            }
          },
          label: {
            normal: {
              show: false
            }
          },
          areaStyle: {
            normal: {
              color: '#59D654'
            }
          },
          lineStyle: {
            normal: {
              color: '#7CCE7B'
            }
          },
          data: [
            {
              value: radarList,
              name: ''
            }
          ]
        }]
      }
      this.myChart.setOption(option)
    },
    getUserLavel () {
      return api.user.getUserLevel()
        .then((data) => {
          this.userLavel = data
        })
    },
    getActiveRate () {
      return api.newCapsule.getActiveRate()
        .then((data) => {
          this.activeRateInfo = data
          this.setRadar(data.radarList)
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
    setShare () {
      var info = {
        wxName: this.userLavel.wxName,
        headimgurl: this.userLavel.headimgurl,
        level: this.userLavel.level,
        continueNum: this.activeRateInfo.continueNum,
        ansCount: this.activeRateInfo.ansCount,
        rate: this.activeRateInfo.rate,
        radarList: this.activeRateInfo.radarList
      }
      var title = '我们不一样'
      var desc = `我已经连续打卡${this.activeRateInfo.continueNum}天，我希望每天用游戏陪伴孩子10分钟`
      var imgUrl = window.location.origin + '/static/img/newCapsule/panda2.png'
      this.setShareInfo(title, desc, imgUrl, info)
    },
    setShareInfo (title, desc, imgUrl, info) {
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
          url += '&info=' + encodeURIComponent(JSON.stringify(info))
          url = url.replace('/newCapsule/guideShare', '/newCapsule/guideShare_share')
          var date = new Date()
          var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
          url += '&time=' + encodeURIComponent(time)
          var shareInterval = setInterval(function() {
            WechatPlugin.$wechat.onMenuShareAppMessage({
              title: title, // 分享标题
              desc: desc,
              link: url,
              imgUrl: imgUrl,
              success: function (res) {
                WechatPlugin.$wechat.closeWindow()
              }
            })
            WechatPlugin.$wechat.onMenuShareTimeline({
              title: title, // 分享标题
              desc: desc,
              link: url,
              imgUrl: imgUrl,
              success: function (res) {
                WechatPlugin.$wechat.closeWindow()
              }
            })
          }, 1000)
          setTimeout(function() {
            clearInterval(shareInterval)
          }, 5000)
        })
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
    background-color: #549EFF;
    background: url("/static/img/newCapsule/bg.png") #549EFF no-repeat;
    background-size: 100% 100%;
    padding: (25rem/16);
  }
  .card{
    min-height: 80vh;
    background: #fff;
    padding: (20rem/16);
    box-sizing: border-box;
    border-radius: (10rem/16);
    position: relative;
    width:100%;
    .top{
      display: flex;
      width:100%;
      .imgBox{
        flex-grow: 0;
        justify-content: space-between;
        font-size: 0;
        margin-top: -(40rem/16);
        text-align: center;
        img{
          width:100%;
          border-radius: 50% 50%;
        }
      }
      &>div{
        width:33%;
        display: inline-block;
        flex-grow: 0;
        p{
        }
        span{
          color: #FF3C39;
          font-size: 16rem/16;
          font-weight: bold;
        }
      }
      &>div:last-child{
        padding-left: (15rem/16);
      }
      &>div:first-child{
        padding-right: (15rem/16);
      }
    }

    .center{
      padding-top: (40rem/16);
      p{
        text-align: center;
        color: #999;
        font-size: (20rem/16);
        line-height: 1.3;
      }
      p:last-child{
        font-size: (14rem/16);
        color: #999;
        text-align: center;
        margin-top: (10rem/16);
        span{
          font-size: (14rem/16);
          color: #999;
          font-weight: normal;
        }
      }
      span{
        color: #6768EB;
        font-size: (45rem/16);
        font-weight: bold;
      }
    }

    #radar{
      width:100%;
      height:(230rem/16);
      position: absolute;
      bottom: (20rem/16);
      left:0;
    }
  }
  .footBox{
    width:100%;
    button{
      margin-top: (20rem/16);
      margin-left: 5%;
      border: 0;
      width:90%;
      height:(50rem/16);
      color: #726EE5;
      background: #fff;
      border-radius: (25rem/16);
      font-size: (25rem/16);
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
</style>
