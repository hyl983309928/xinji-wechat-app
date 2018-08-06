<template>
  <div class="sid-page" v-if="show">
    <div class="head arrow" @click="goto('/parent/user/info')">
      <img :src="headimgurl" alt="" class="headimg">
      <p>
        <span class="student_name">{{ name }}</span><br>
        <span class="student_id">学号：{{ sid }}</span>
      </p>
    </div>
    <ul class="link_item">
      <li @click="goto('/parent/user/account')" class="account">
        <img src="/static/img/recharge/account.png" alt="" class="iconimg">
        <p>
          <span>账户</span>
          <span class="gray">（充值、消费明细）</span>
        </p>
      </li>
      <li @click="goto('/parent/course/manage')">
          <img src="/static/img/recharge/course.png" alt="" class="iconimg">
          <span>我的课程</span>
      </li>
      <li @click="goto('/capsule/myCapsule')">
          <img src="/static/img/capsule/jiaonang.png" alt="" class="iconimg">
          <span>我的胶囊</span>
      </li>
      <li @click="goto('/parent/user/info')">
          <img src="/static/img/recharge/info.png" alt="" class="iconimg">
          <span>我的资料</span>
      </li>
      <li @click="goto('/parent/user/grow_diary')">
          <img src="/static/img/growDiary/date-icon.png" alt="" class="iconimg">
          <span>成长日记</span>
      </li>
      <!-- <li @click="goto('/parent/user/welfare')">
          <img src="/static/img/recharge/welfare.png" alt="" class="iconimg">
          <p>
            <span>我的福利站</span>
            <span class="gray">（各种奖品、卡券）</span>
          </p>
      </li> -->
    </ul>
    <div class="bottom_btn">
      <span @click="goto('/parent/user/contact_kf')" class="button">联系我们</span>
      <span @click="goto('/agency/course')" class="button">老师入口</span>
    </div>
  </div>
</template>

<script>
import { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'

export default {
  components: { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch },
  data () {
    return {
      show: false,
      info: {}
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  computed: {
    name() {
      try {
        return this.info.childrenList[0].name
      } catch (error) {
        return '宝宝名字'
      }
    },
    headimgurl() {
      try {
        if (this.info.childrenList[0].headimgUrl) {
          return this.info.childrenList[0].headimgUrl
        }
        if (this.info.childrenList[0].sex === null) {
          return '/static/img/boy.png'
        } else {
          return this.info.childrenList[0].sex ? '/static/img/girl.png' : '/static/img/boy.png'
        }
      } catch (error) {
        return '/static/img/boy.png'
      }
    },
    sid() {
      try {
        return String(this.info.childrenList[0].studentId).replace(/\d{10}/, '$&-').replace(/\d{6}/, '$&-')
      } catch (error) {
        return ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init() {
      this.$user.hasChildren(this)
      this.getChildrenInfo()
    },
    getChildrenInfo() {
      this.$api.user.getChildrenInfo().then(data => {
        this.show = true
        this.info = data
      })
    },
    goto(link) {
      this.$router.push(link)
    }
  }
}
</script>

<style scoped lang="scss">
  .head{
    display: flex;
    align-items: center;
    padding: 20px;
    margin-bottom: 10px;
    background-color: #fff;
    position: relative;
    img{
      margin-left: 8px;
      margin-right: 33px;
    }
  }
  .student_name{
    font-weight: bold;
    font-size: 19px;
  }
  .student_id{
    color: #F5A623;
    font-size: 14px;
  }
  .headimg{
    width: 60px;
    height: 60px;
  }
  .iconimg{
    width: 20.5px;
    margin-left: 25px;
    margin-right: 25px;
  }
  .link_item li{
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    font-size: 18px;
    border-top: 1px solid #eee;
    position: relative;
  }
  .account{
    margin-bottom: 20px; 
  }
  .link_item li::after,
  .arrow::after{
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    -ms-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 20px;
  }
  .gray{
    color: #ccc;
    font-size: 14px;
  }
  .bottom_btn{
    width:100%;
    position: fixed;
    bottom: (30rem/16);
    text-align: center;
    .button{
      display: inline-block;
      font-size: (14rem/16);
      font-weight: 550;
      color: #999;
      padding: (10rem/16) (15rem/16);
      border: 1.5px solid #999;
      background: rgba(0,0,0,0);
      border-radius: (30rem/16);
      line-height: 1;
    }
    .button:active{
      background: #ccc;
    }
    .button:first-child{
      margin-right: (20rem/16);
    }
  }
</style>
