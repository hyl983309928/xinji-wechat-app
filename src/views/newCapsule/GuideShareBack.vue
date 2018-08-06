<template>
  <div class="page">
    <div class="card">
      <div class="top">
        <div>
          <p style="text-align: right;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{info.wxName}}</p>
        </div>
        <div class="imgBox">
          <img :src="info.headimgurl" />
        </div>
        <div>
          <p>等级<span style="">Lv{{info.level}}</span></p>
        </div>
      </div>
      <div class="center">
        <p>连续打卡</p>
        <p>第 <span>{{info.continueNum}}</span> 天</p>
        <p>
          <span>打卡<span style="color: #6768EB;">{{info.ansCount}}</span>次</span>
          <span>超越<span style="color: #6768EB;">{{info.rate}}%</span></span>
        </p>
      </div>
      <div id="radar">
      </div>
    </div>
    <div class="footBox" @click="goBack">
      <button>确定</button>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import api from 'lanmaLib/common/api'
  import { Masker } from 'vux'
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
        myChart: {},
        info: {}
      }
    },
    computed: {
    },
    created () {
      StatModel.activityAddStat(44)
      this.info = JSON.parse(this.$route.params.info)
    },
    mounted () {
      this.myChart = echarts.init(document.getElementById('radar'))
      this.setRadar(this.info.radarList)
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      goto(url) {
        this.$router.push(url)
      },
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
      getCapsuleListByAction () {
        var params = {
          actionType: 'exercise'
        }
        api.capsule.getCapsuleListByAction(params)
          .then((data) => {
            this.exerciseCapsuleList = data.list
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
