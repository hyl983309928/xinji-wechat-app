<template>
  <div v-if="showCourse">
    <!--<div class="c-top" @click="courseClick">
      <img :src="course.cover" class="course-cover-img">
      <div class="mask">
        <div class="tag">
          <span>{{ course.targetLabel }}</span>
          <span>{{ course.ageLabel }}</span>
          <span>{{ course.sceneLabel}}</span>
        </div>
        <div class="title">
          <span>{{ course.title }}</span>
        </div>
      </div>
    </div>-->

    <div class="cl-module" @click="goToOrder(order.orderId)">
      <div class="cl-m-header">
        待支付订单
      </div>
      <div class="cl-m-body">
        <div class="order-field">
          <span>订单编号</span>&nbsp;
          <span>{{order.orderId}}</span>
        </div>
        <div class="order-field">
          <span>商品名称</span>&nbsp;
          <span>{{order.title}}</span>
        </div>
        <div class="order-field">
          <span>商品类型</span>&nbsp;
          <span>{{order.orderType}}</span>
        </div>
        <div class="order-field">
          <span>订单金额</span>&nbsp;
          <span>{{order.price}} 元</span>
        </div>
        <div class="order-field">
          <span>上课时间</span>&nbsp;
          <span>{{order.lesson_time}}</span>
        </div>
        <div class="order-field">
          <span>手机号码</span>&nbsp;
          <span>{{order.telephone}}</span>
        </div>
        <div class="pay-click">
          点击进入支付 &nbsp;>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      showCourse: true
    }
  },
  props: {
    order: {},
    linkDisabel: {
      default: false
    },
    tab: ''
  },
  computed: {
    orderTitle () {
      var result = ''
      if (this.course.order_status === 0) {
        result = this.course.channel_id > 0 ? '未确认' : '未支付'
      } else if (this.course.order_status === 0) {
        result = this.course.channel_id > 0 ? '已确认' : '已支付'
      } else {
        result = this.$config.status.order[this.course.order_status]
      }
      return result
    }
  },
  methods: {
    goToOrder (orderId) {
      window.location.href = './?#/parent/commodity/pay/' + orderId
    },
    courseClick () {
      if (this.linkDisabel) {
        return
      }
      console.log('courseClick')
      var url = this.course.link
      this.$router.push(url)
    },
    pay () {
      window.location.href = 'http://wx.xinjijiaoyu.com/#/parent/course/pay/' + this.course.order_id
      // this.$router.push('/parent/course/pay/' + this.course.order_id)
    },
    giveUp () {
      this.showConfirm('确定放弃课程吗？', () => {
        this.$api.order.giveUp(this.course.order_id).then(() => {
          this.showSuccess('操作成功')
          // this.$router.push('/parent/course/manage/2')
          this.showCourse = false
        }).catch((e) => {
          this.showError(e.message)
        })
      })
    },
    openCourse () {
      // 开始上课
      if (this.course.status < 9) {
        this.$router.push('/parent/course/course_material/' + this.course.id)
      } else {
        this.$router.push('/parent/course/after_class/' + this.course.id)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.c-top{
  position: relative;
  line-height: 0px;

  img {
      width: 100%;
      z-index: 0;
  }
  .mask{
    width: 100%;
    height:100%;
    position: absolute;
    top: 0px;
    bottom:0px;
    z-index: 1;
    background-image: linear-gradient(bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%);
    .tag {
      position: absolute;
      right: 15px;
      top: 17px;
    }
    .tag span {
      font-size: 11px;
      color: #fff;
    }
    .title {
      bottom: 20px;
      position: absolute;
      left: 15px;
    }
    .title span {
      font-size: 17px;
      color: #fff;
    }
  }
  .details {
    position: absolute;
    width:100%;
    bottom:10px;
    color: #ffffff;
    z-index: 5;
    line-height: 30px;
  }
  .price {
    margin-left: 15px;
  }
  /*.sign {
    float: right;
    margin-right: 15px;
  }*/
}

.order-field{
  margin:10px 15px;
  font-size: 13px;
  span:first-of-type{
    color: #6c7b8a;
  }
  span:last-of-type{
    color: #323b46;
  }
  span.lanma-color{
    color: #00a6ac;
  }
}

.pay-click{
  text-align: right;
  color: #c8d2dc;
}

.hasborder {
  padding-bottom: 20px;
  border-bottom: 1px solid #efeff4;
}

.sign {
  margin-top: 20px;
}

.manage-wrap{
  border-right: 1px solid #ccc;
  text-align: center;
}
.manage-wrap:last-of-type{
  border: 0;
}
.manage-btn{
  font-size: 17px;
  font-weight: bold;
  height: 17px;
  line-height: 17px;
  text-align: center;
  width: 60px;
  color: #00a6ac;
}

li {
    list-style: none;
}
.label-list li {
    float: left;
    color: #00a6ac;
    margin-right: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
}

div.c-detail-info{
  margin-top: -15px;
  background-color: #00a6ac;
}
.cl-m-body {
  padding-left: 21px;
  background-color: #fff;
  font-size: 13px;
  .apply-detail {
    width: 250px;
  }
  p {
      margin: 5px 0 0 0;
      span {
          margin-right: 10px;
      }
      span:nth-child(odd) {
          color: #6c7b8a;
      }
      span:nth-child(even) {
          color: #323b46;
      }
  }
}
.applydetail{
  position: relative;
}
.course-btn{
  background-color: #00a6ac;
  position: absolute;
  width: 64px;
  right: -74px;
  top: -15px;
  height: 120px;

}
.course-btn span{
  display: inline-block;
  text-align: center;
  color: #fff;
  width: 20px;
  color: #fff;
  font-size: 17px;
  margin: 10px 0 0 20px;
}
.course-btn .order-btn{
  /*box-shadow: 0 -1px 2px 0 #60c9cf;*/
  /*border-radius: 50px;*/
}
</style>
