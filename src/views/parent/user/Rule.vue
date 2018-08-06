<template>
  <div class="rule-page">
    <div class="rule-header">
      成长值由<em>日常活跃</em>和<em>消费行为</em>进行累积<br>
成长值累积的同时获得<em>同值积分</em><br>
积分可用于<em>兑换卡券</em>
    </div>
    <h4>
      日常活跃<em>（每日获取上限：40 ）</em>
    </h4>
    <div class="rule-list">
      <div class="rule-item">
        <div class="title">每日登录</div>
        <div class="credit">+10</div>
      </div>
      <div class="rule-item">
        <div class="title">连续七日登录</div>
        <div class="credit">+10</div>
      </div>
      <div class="rule-item">
        <div class="title">共读阅读</div>
        <div class="credit">+5</div>
      </div>
      <div class="rule-item">
        <div class="title">共读收藏</div>
        <div class="credit">+5</div>
      </div>
      <div class="rule-item">
        <div class="title">共学收藏</div>
        <div class="credit">+5</div>
      </div>
      <div class="rule-item">
        <div class="title">共玩报名</div>
        <div class="credit">+5</div>
      </div>
      <div class="rule-item">
        <div class="title">共玩报告</div>
        <div class="credit">+10</div>
      </div>
    </div>
    <h4>
      消费行为<em>（无上限）</em>
    </h4>
    <div class="rule-list">
      <div class="rule-item">
        <div class="title">共学购买</div>
        <div class="credit">+50</div>
      </div>
      <div class="rule-item">
        <div class="title">共玩确认</div>
        <div class="credit">+800</div>
      </div>
      <div class="rule-item">
        <div class="title">上课签到</div>
        <div class="credit">+20</div>
      </div>
      <div class="rule-item">
        <div class="title">任务提交</div>
        <div class="credit">+20</div>
      </div>
      <div class="rule-item">
        <div class="title">作业提交</div>
        <div class="credit">+20</div>
      </div>
      <div class="rule-item">
        <div class="title">共玩取消</div>
        <div class="credit"><em>-800</em></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
    })
    this.$api.coupon.userCoupon().then((data) => {
      this.list = data.list
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">

em{
  font-style: normal;
}
h4{
  font-weight: normal;
}
.rule-page{
  padding:30px;
  background: #fff;
  font-size: 13px;
  h4{
    height:40px;
    line-height: 40px;
    font-size: 13px;
    em{
      color:#c8d2dc;
    }
  }
}
.rule-header{
  margin-bottom: 20px;
  text-align: center;
  color: #323b46;
  line-height: 36px;
  em{
    color:#00a6ac;
  }
}

.rule-list{
  display: flex;
  flex-flow: row wrap;
}
.rule-item{
  display: flex;
  line-height: 40px;
  width:50%;
  .title{
    width:64%;
  }
  .credit{
    width:36%;
    font-size: 16px;
    color: #00a6ac;
    em{
      color:#c96060;
    }
  }
}
</style>
