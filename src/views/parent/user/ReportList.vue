<template>
  <div class="report-page grow-report-list">
    <group>
      <cell :title="report.year + '年' + report.month + '月成长报告'" is-link v-for="report in reportList" :link="'/parent/user/report/' + report.dateline">
        <span slot="icon" class="iconfont icon-log"></span>
      </cell>
    </group>
    <p class="start-info">
      - {{year}}年{{month}}月{{date}}日 你开启了 心迹 成长之路 -
    </p>
  </div>
</template>

<script>
import {
  Cell,
  Group
} from 'vux'

export default {
  components: {
    Cell,
    Group
  },
  data () {
    return {
      user: {},
      year: '',
      month: '',
      date: '',
      reportList: []
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
      this.user = userInfo
      var date = new Date(userInfo.created_at)
      // var datetime = date.getTime()
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.date = date.getDate()
    })
    this.$api.user.getMonthReportList().then((res) => {
      this.reportList = res.list
    })
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">

.grow-report-list{
  .weui-cell{
    // line-height: 32px;
    font-size: 13px;
  }

  .iconfont{
    display: inline-block;
    font-size: 24px;
    color:#00a6ac;
    margin-right:14px;
  }
  .start-info{
    margin-top:15px;
    line-height: 18px;
    font-size: 13px;
    color:#6c7b8a;
    text-align: center;
  }
}

</style>
