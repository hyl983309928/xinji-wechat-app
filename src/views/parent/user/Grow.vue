<template>
  <div class="grow-page">
    <div class="grow-banner">
      <p class="label">本月成长</p>
      <p class="exp">{{user.parent.month_experience}}</p>
      <div class="exp-detail">
        <div class="exp-item">
          <div class="title">总成长</div>
          <div class="number">{{user.parent.experience}}</div>
        </div>
        <div class="exp-item">
          <div class="title">今日活跃</div>
          <div class="number">{{user.parent.date_active_experience}}/40</div>
        </div>
      </div>
    </div>
    <group>
      <cell title="月成长报告" link="/parent/user/report_list" is-link>
        <span slot="icon" class="iconfont icon-log"></span>
      </cell>
      <cell class="rule-link" title="点击了解 心迹教育 成长规则" link="/parent/user/rule" is-link>
      </cell>
    </group>

    <div class="credit-log-list">
      <div class="credit-log" v-for="log in list">
        <div class="dateline">{{log.created_at}}</div>
        <div class="title">{{log.action_title}}</div>
        <div :class="'number ' + (log.credit_num < 0 ? 'error' : '')">{{log.credit_num > 0 ? '+' : ''}}{{log.credit_num}}</div>
      </div>
    </div>

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
      list: [],
      user: {
        wechat_user: {},
        parent: {
          month_experience: 0
        }
      }
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
      this.user = userInfo
    })
    this.$api.credit.getList().then(result => {
      this.list = result.list
    })
  },
  methods: {}
}
</script>

<style>
.grow-page .weui-cells{
  background:transparent;
  margin-top:0px;
  margin-right:15px;
}
.grow-page .weui-cell{
  font-size: 13px;
  line-height: 36px;
}
.grow-page .vux-cell-bd{
  color:#323b46;
}
.grow-page .rule-link .vux-cell-bd{
  color:#00a6ac;
  margin-left:15px;
}
</style>

<style scoped lang="scss">
.grow-page{
  background: #fff;
  font-size: 13px;
  color:#323b46;
}

.grow-banner{
  width: 100%;
  height:64vw;
  background-image: url(/static/img/grow-bg.png);
  background-size: 100% 100%;
  color: #fff;
  font-size: 13px;
  line-height: 4.8vw;
  overflow: hidden;
  text-align: center;
  .label{
    margin-top:16.3vw;
  }
  .exp{
    line-height:21.3vw;
    font-size: 64px;
  }
  .exp-detail{
    display: flex;
    margin:auto 30px;
    margin-top:13.6vw;
  }
  .exp-item{
    width:49%;
    display: flex;
    div{
      width:47%;
      justify-content: center;
    }
  }
  .exp-item:first-child{
    border-right: 1px solid #fff;
  }
  .exp-item:nth-child(2){
    margin-left: 4%;
  }
}

.weui-cell .iconfont{
  display: inline-block;
  font-size: 24px;
  color:#00a6ac;
  margin-right:14px;
  margin-left:15px;
}

.credit-log-list{
  margin:30px;
  margin-top:10px;
}
.credit-log{
  display: flex;
  line-height: 40px;
  .dateline{
    width:40%;
  }
  .title{
    width:40%;
    text-align: center;
  }
  .number{
    width:20%;
    text-align: right;
    color:#00a6ac;
    font-size: 17px;
  }
  .number.error{
    color:#c96060;
  }
}


</style>
