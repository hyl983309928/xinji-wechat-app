<template>
  <div class="page">
    <div class="head">
      <div class="date">
        <span @click="countMonth('down')"><img src="/static/img/course/dateBtn.png"/></span>
        <label>{{year}}年 {{month}}月</label>
        <span @click="countMonth('up')"><img src="/static/img/course/dateBtn.png" style="transform: rotate(180deg)"/></span>
      </div>
      <div class="all">
        <span @click="selectTime()">全部</span>
      </div>
    </div>
    <table class="myTable">
      <thead>
      <tr>
        <th v-for="item in weekMap">{{item}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item,trIndex in 6">
        <td @click="selectTime(days[trIndex*7 + tdIndex])" :class="[countIsAction(days[trIndex*7 + tdIndex])?'current':'', days[trIndex*7 + tdIndex].className]" v-for="value,tdIndex in 7" v-if="days[trIndex*7 + tdIndex]">
          {{days[trIndex*7 + tdIndex].showDate}}
          <span v-if="days[trIndex*7 + tdIndex].courseNum">{{days[trIndex*7 + tdIndex].courseNum}}节课</span>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="foot">课程持续更新ing，敬请关注！</div>
  </div>
</template>

<script>
/* eslint-disable */
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      year: '',
      month: '',
      days: [],
      weekMap: ['日', '一', '二', '三', '四', '五', '六'],
      action: {
        year: '',
        month: '',
        day: ''
      }
    }
  },
  props: {
    date: {
      type: String,
      default: ''
    },
    courseNum: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
  },
  created () {
    if (this.date) {
      var map = this.date.split('-')
      this.getMonthDate(map[0], map[1], map[2])
      this.action = {
        year: map[0],
        month: map[1],
        day: map[2]
      }
    } else {
      this.getMonthDate()
    }
  },
  mounted () {
  },
  methods: {
    getMonthDate (year, month, day) {
      var days = []
      var today = new Date()
      var isThisMonth = false  // 是否是本月
      if (today.getFullYear() == year && today.getMonth() + 1 == month) {
        isThisMonth = true
        day = today.getDate()
      }
      if (!year || !month) {
        year = today.getFullYear()
        month = today.getMonth() + 1
        day = today.getDate()
        isThisMonth = true
        // this.action = {
        //   year: year,
        //   month: month,
        //   day: day
        // }
      }
      // 获取该月第一天的Date对象
      var firstDateObj = new Date(year, month - 1, 1)
      // 获取该月第一天对应的星期几
      var firstDateWeekDay = firstDateObj.getDay()
      // 获取该月最后一天的Date对象
      var lastDateObj = new Date(year, month, 0)
      // 获取该月最后一天的日期
      var lastDate = lastDateObj.getDate()
      // 获取上一个月最后一天的Date对象
      var lastDateOfPrevMonthObj = new Date(year, month - 1, 0)
      // 获取上一个月最后一天的日期
      var lastDateOfPrevMonth = lastDateOfPrevMonthObj.getDate()
      // 上月
      for (let i = 0; i < firstDateWeekDay; i++) {
        let className = 'disabled'
        let thisMonth = month - 1
        let thisYear = year
        let date = lastDateOfPrevMonth - firstDateWeekDay + i + 1
        let courseNum = 0
        if (this.courseNum[thisYear + '-' + this.initNum(thisMonth)] && this.courseNum[thisYear + '-' + this.initNum(thisMonth)][date]) {
          courseNum = this.courseNum[thisYear + '-' + this.initNum(thisMonth)][date]
        }
        if (thisMonth === 0) {
          thisMonth = 12
          thisYear = parseInt(year) - 1
        }
        days.push({
          'date': date,
          'showDate': date,
          'thisMonth': thisMonth,
          'className': className,
          'thisYear': thisYear,
          'courseNum': courseNum
        })
      }
      // 本月
      for (let i = 0; i < lastDate; i++) {
        let className = 'available'
        let date = i + 1
        let thisMonth = month
        let thisYear = year
        if (isThisMonth) {
          if (date < day) {
            className = 'disabled'
          }
        } else {
          if (thisMonth < today.getMonth() + 1 || year < today.getFullYear()) {
            className = 'disabled'
          }
        }
        let courseNum = 0
        if (this.courseNum[thisYear + '-' + this.initNum(thisMonth)] && this.courseNum[thisYear + '-' + this.initNum(thisMonth)][date]) {
          courseNum = this.courseNum[thisYear + '-' + this.initNum(thisMonth)][date]
        }
        if (today.getDate() == date && today.getFullYear() == year && today.getMonth() + 1 === parseInt(month)) {
          days.push({
            'date': date,
            'showDate': '今天',
            'thisMonth': thisMonth,
            'className': className,
            'thisYear': thisYear,
            'courseNum': courseNum
          })
        } else {
          days.push({
            'date': date,
            'showDate': date,
            'thisMonth': thisMonth,
            'className': className,
            'thisYear': thisYear,
            'courseNum': courseNum
          })
        }
      }
      var nextMonthLength = days.length
      // 下月
      for (let i = 0; i < 7 * 6 - nextMonthLength; i++) {
        let className = 'disabled'
        let date = i + 1
        let thisMonth = month + 1
        let thisYear = year
        if (thisMonth == 13) {
          thisMonth = 1
          thisYear = parseInt(year) + 1
        }
        let courseNum = 0
        if (this.courseNum[thisYear + '-' + this.initNum(thisMonth)] && this.courseNum[thisYear + '-' + this.initNum(thisMonth)][date]) {
          courseNum = this.courseNum[thisYear + '-' + this.initNum(thisMonth)][date]
        }
        days.push({
          'date': date,
          'showDate': date,
          'thisMonth': thisMonth,
          'className': className,
          'thisYear': thisYear,
          'courseNum': courseNum
        })
      }
      this.year = firstDateObj.getFullYear()
      this.month = firstDateObj.getMonth() + 1
      this.days = days
    },
    countMonth (type) {
      switch (type) {
        case 'down':
          if (String(this.month) == '1') {
            this.month = '12'
            this.year = parseInt(this.year) - 1
          } else {
            this.month = parseInt(this.month) - 1
          }
          break
        case 'up':
          if (String(this.month) == '12') {
            this.month = '1'
            this.year = String(parseInt(this.year) + 1)
          } else {
            this.month = String(parseInt(this.month) + 1)
          }
          break
        default:
          break
      }
      this.getMonthDate(this.year, this.month)
    },
    countIsAction (item) {
      if (this.action.year == item.thisYear && this.action.month == item.thisMonth && this.action.day == item.date) {
        return true
      }
      return false
    },
    selectTime (item) {
      if (item) {
        if (item.className == 'disabled') {
          return
        }
        this.action = {
          'year': item.thisYear,
          'month': this.initNum(item.thisMonth),
          'day': this.initNum(item.date)
        }
        this.$emit('select', this.action)
      } else {
        this.$emit('select')
      }
    },
    initNum (num) {
      var temp
      if (parseInt(num) < 10) {
        return '0' + parseInt(num)
      } else {
        return num
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .page{
    padding: (15rem/16);
  }
  .head{
    position: relative;
    padding: (10rem/16) (15rem/16);
    margin-bottom: (10rem/16);
    .date{
      font-size: 0;
      label{
        font-size: (23rem/16);
        font-weight: bold;
        line-height: (25rem/16);
        margin-left: (20rem/16);
        display: inline-block;
      }
      text-align: center;
      position: relative;
      span{
        width:(25rem/16);
        height:(25rem/16);
        display: inline-block;
        vertical-align: middle;
        font-size: 0;
        border-radius: 50% 50%;
        overflow: hidden;
        img{
          width: 100%;
        }
        &:active{
          background: #C7C8CB;
        }
        &:first-child{
          position: absolute;
          left: 0;
        }
        &:last-child{
          position: absolute;
          right: 0;
        }
      }
    }
    .all{
      text-align: center;
      margin-top: (10rem/16);
      span{
        font-size: (13rem/16);
        text-align: center;
        color: #999;
        display: inline-block;
        padding: 0 (12rem/16);
        border: 1px solid #ccc;
        border-radius: (15rem/16);
        &:active{
          background: #eee;
        }
      }
    }

  }
  .myTable{
    width:100%;
    border-collapse:collapse;
    border-spacing: 0;
    font-size: (15rem/16);
    th{
      font-weight: normal;
      color: #929DA8;
    }
    td{
      position: relative;
      height: (50rem/16);
      span{
        display: block;
        position: absolute;
        bottom:(-5rem/16);
        left: 0;
        right: 0;
        text-align: center;
      }
    }
  }
  .disabled {
    cursor: not-allowed;
    font-size: (14rem/16);
    width: 32px;
    height: 32px;
    text-align: center;
    color:#e1e4e7;
    span{
      color:#e1e4e7;
    }
  }
  .available{
    font-size: (14rem/16);
    width: 32px;
    height: 32px;
    text-align: center;
    color:#7c86a2;
    span{
      color:#7c86a2;
    }
  }
  .current {
    color:#60c8cf !important;
    span{
      color:#60c8cf;
    }
  }
  .foot{
    font-size: (14rem/16);
    color: #bbb;
    text-align: center;
    margin-top: (20rem/16);
  }
</style>
