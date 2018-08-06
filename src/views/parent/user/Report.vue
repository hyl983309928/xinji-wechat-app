<template>
  <div class="report-page" :style="{height: pageSize + 'px'}">
    <x-swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false" ref="slider">
      <x-swipe-item class="slide-item">
        <div class="cl-module">
          <div class="cl-m-header">
            成长统计
          </div>
          <div class="cl-m-body">
            <div class="chart-con" id="grow-chart" :style="{width: '100%', 'height': '600px'}">
            </div>
          </div>
        </div>
      </x-swipe-item>
      <x-swipe-item class="slide-item">
        <div class="cl-module">
          <div class="cl-m-body month-report">
            <p>
              <img class="banner" :src="$helper.getImageUrl(report.photo)">
            </p>
            <div class="content">
              <h3>{{report.title}}</h3>
              <p v-html="report.content.replace(/\n/g, '<br />')"></p>
            </div>

          </div>
        </div>
      </x-swipe-item>
    </x-swipe>
  </div>
</template>

<script>
import { XSwipe, XSwipeItem } from 'lib/swipe'
// import _ from 'lodash'
import echarts from 'echarts'
// require('echarts/chart/bar')

export default {
  components: {
    XSwipe,
    XSwipeItem
  },
  data () {
    return {
      id: 0,
      month: 1,
      report: {
        content: ''
      },
      stat_list: []
    }
  },
  created () {
    var month = parseInt(this.$route.params.month)
    if (isNaN(month) || month < 1) {
      month = 1
    }
    this.month = month
    this.setPageSize()

    this.$api.user.getMonthReport(month).then((report) => {
      this.report = report
    })
    // this.drawChart()
    return
  },
  mounted () {
    this.$api.user.monthExperience(this.month).then((list) => {
      // this.report = report
      var hash = {}
      list.forEach((item) => {
        hash[item.label_id] = item.experience
      })
      var statList = []
      var titleList = []
      var valueList = []
      this.$label.getLabelList().then((labelList) => {
        var labelTree = this.$label.getRootLabelTree()
        labelTree[0].childs.forEach((label) => {
          // console.log(label.title)
          if (label.code !== 'parent_theme') {
            label.childs.forEach((item) => {
              // console.log(item.title)
              var id = item.id
              var experience = hash[id] ? hash[id] : 0
              var title = item.title
              titleList.push(item.title)
              valueList.push(experience)
              statList.push({id, experience, title})
            })
          }
        })
        console.log('statList')
        // this.stat_list = statList
        console.log(statList)
        this.drawChart(titleList, valueList)
      })
    })
  },
  methods: {
    setPageSize () {
      this.pageSize = window.innerHeight
    },
    drawChart (titleList, valueList) {
      var option = {
        title: {text: ''},
        tooltip: {},
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: titleList
        },
        series: [{
          name: '销量',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#00a6ac',
              label: {
                show: true
                // position: 'inside'
              }
            }
          },
          data: valueList
        }]
      }
      var chart = echarts.init(document.getElementById('grow-chart'))
      chart.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~vue-swipe/dist/vue-swipe.css';
.study-page {
  // height: 1200px;
}
div.mint-swipe, div.mint-swipe-items-wrap{
  overflow: auto;
}

li{
  list-style: none;
}
.label{
  .cl-module{
    padding-bottom: 60px;
  }
  .label{
    margin: 30px 20px;
    .detail li{
      text-align: right;
    }
  }
  img{
    width: 225px;
  }
  .cl-m-body{
    margin: 50px;
    .outline{
      text-align: center;
    }
    .title{
      p{
        margin-top: 20px;
      }
    }
  }
  ul{
    list-style: none;
  }
  li{
    margin-bottom: 10px;
  }
  .object{
    float: left;
    color: #00a6ac;
  }
  .detail{
    float: right;
  }
}
span{
  color: #60c9cf;
  margin-top: 5px;
  margin-left: 15px;
}
#tesk{
  color:#323b46;
  float: right;
  margin-right: 15px;
}
.finish{
  text-align: center;
div{
  margin: 50px 0;
  span{
    color: #00cac6;
    }
  }
}
hr{
  opacity: 0.3;
  margin: 15px;
}
.public{
  margin: 5px 15px;
  color:#323b46;
}
strong{
  color: #00a6ac;
}
.port{
  margin-bottom: 40px;
  span{
    width: 80px;
    height: 80px;
    margin-top: 15px;
    margin-left: 15px;
    display: inline-block;
    float:left;
  }
  .iconfont{
    line-height: 80px;
    text-align: center;
    color: #efeff4;
    border: solid 1px #efeff4;
  }
  .preview{
    margin-left: 30px;
    img{
      height: 80px;
    }
  }
}
.add-photo{
  font-size:60px;
}

.month-report{
  padding:0;
  .banner{
   width:100%;
  }
  .content{
    margin:20px;
    font-size: 13px;
	  color: #323b46;
    h3{
      font-size: 17px;
  	  color: #00a6ac;
      line-height: 24px;
      margin-bottom: 20px;
      font-weight: normal;
    }
  }

}
#grow-chart{
  // height: 200px;
}

</style>
