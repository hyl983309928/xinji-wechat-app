<template>
  <div class="course-detail">
    <div class="c-top">
      <img :src="material.cover" class="course-cover-img">
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
    </div>
    <div class="cl-module module-top">
      <div class="cl-m-body">
        <p>
          <span>上课时间</span>
          <span>{{ course.lesson_time }}</span>
        </p>
        <p>
          <span>上课地点</span>
          <span>{{ course.lesson_location }}</span>
        </p>
      </div>
    </div>

    <div class="cl-module">
      <div class="cl-m-header">
        基本信息
      </div>
      <div class="cl-m-body">
        <div class="public">
          <input class="phone-input" type="text" v-model="phoneNumber" placeholder="请输入您的联系方式">
        </div>
      </div>
    </div>

    <div class="cl-module">
      <div class="cl-m-header">
        课程简介
      </div>
      <div class="cl-m-body">
        <div class="public" v-if="course.content" v-html="course.content.replace(/\n/g, '<br />')">
        </div>
      </div>
    </div>
    <!--<button class="page-submit-btn" v-if="signInfo.id === undefined && course.count_data.sign_up_num < course.total" @click="signUp">报名</button>-->
    <!--<button class="page-submit-btn" v-else @click="share">分享</button>-->

    <!--<router-link :to="'/parent/course/pay/' + id">-->

    <div style="padding: 20px;"></div>
    <div class="footer" @click="enter" v-if="!course.errorText" :style="{bottom: course.priceDesc && !hasPurse ? '30px':0}">
      <span class="commit" v-if="!hasPurse">
        <span v-if="couponCode==''">购买课程：¥{{ course.price }}</span>
        <span v-if="couponCode!='' && couponCodeAvaliable">免费领取</span>
        <span v-if="course.originalPrice && course.originalPrice!=course.price">
          （<i class="origin-price" >原价：¥{{ course.originalPrice }}</i>）
        </span>
      </span>
      <span class="commit" v-if="hasPurse || !couponCodeAvaliable">点击查看我的课程</span>
    </div>

    <div class="price-desc" v-if="course.priceDesc && !hasPurse">
      <span>{{ course.priceDesc }}</span>
    </div>

    <div class="error" v-if="course.errorText">
      <span v-if="course.errorText">{{ course.errorText }}</span>
    </div>
    <!--</router-link>-->

  </div>
</template>

<script>
export default {
  data () {
    return {
      phoneNumber: '',
      couponCode: '',
      couponCodeAvaliable: true,
      course: {},
      errorStatus: 0,
      material: {
        'cover': ''
      },
      intro: '',
      hasPurse: false,
      createErrorMap: {'ER_COURSE_USER_HAS_MAX': '课程人数已满', 'ER_COURSE_HAS_EXPIRED': '上课时间已过，无法购买'},
      errorStatusMap: ['', '课程已结束', '已开课，停止报名', '已满员，停止报名']
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.couponCode = this.$common.getShareParamter('couponCode')
    this.id = id
    if (this.couponCode) {
      this.$api.course.getCouponCodeInfo(this.couponCode).then((data) => {
        if (data.status === 1) {
          this.couponCodeAvaliable = true
        } else {
          this.couponCodeAvaliable = false
          this.showErrorMsg('二维码已失效，请联系销售人员。')
        }
        this.getCourseDetail(id)
      }).catch(() => {
        this.couponCodeAvaliable = false
        this.showErrorMsg('二维码已失效，请联系销售人员。')
      })
    } else {
      this.getCourseDetail(id)
    }
    this.$api.order.hasPurseCourse(id)
      .then((res) => {
        if (res) {
          this.hasPurse = true
          this.showErrorMsg('您已购买此课程')
        }
      })
    this.$api.getCurrentUserInfo().then((userInfo) => {
      this.phoneNumber = userInfo.mobile
    })
  },
  methods: {
    getCourseDetail (id) {
      this.$api.course.getDetail(id).then((course) => {
        course = this.$course.formatCourse(course)
        if (course.status > 8) {
          course.errorStatus = 1
        } else if ((Date.now() - Date.parse(course.lesson_time)) > 1800000) {
          course.errorStatus = 2
        } else if ((course.reserves + course.signinCount) >= course.total) {
          course.errorStatus = 3
        }
        course.errorText = this.errorStatusMap[course.errorStatus]
        this.course = course
        this.material = course.material
      })
    },
    enter () {
      if (this.hasPurse || (this.couponCode !== '' && !this.couponCodeAvaliable)) {
        this.$router.push('/parent/course/manage')
      } else if (this.couponCode !== '' && this.couponCodeAvaliable) {
        this.$api.course.getFreeCourse(this.id, this.couponCode).then((course) => {
          var _this = this
          this.showSuccess('领取成功')
          setTimeout(function() {
            _this.$router.push('/parent/course/pay_result/free')
          }, 1000)
        }).catch(() => {
          this.showErrorMsg('领取失败，请联系销售人员。')
        })
      } else {
        this.createOrder()
      }
    },
    createOrder () {
      if (!this.checkPhone()) {
        return
      }
      this.$api.order.createCourseOrder(this.id, this.phoneNumber)
        .then((res) => {
          if (res.orderId) {
            this.$router.push('/parent/course/pay/' + res.orderId)
          }
        }).catch((error) => {
          this.showErrorMsg(this.createErrorMap[error.msg] || '获取配置失败')
        })
    },
    checkPhone () {
      if (this.phoneNumber === '') {
        this.$vux.toast.show({
          text: '请输入联系方式',
          type: 'warn'
        })
        return false
      }
      if (!this.phoneNumber.match(/1[345789]\d{9}$/)) {
        this.$vux.toast.show({
          text: '请输入正确的手机号',
          type: 'warn'
        })
        return false
      }
      return true
    },
    signUp () {
      this.$router.push('/parent/course/sign_up/' + this.course.id)
    }
  }
}
</script>

<style scoped lang="scss">
.cl-module {
  margin-top: 0;
  font-size: 14px;
  color: #6c7b8a;
}
.cl-m-body {
  background-color: #fff;
  font-size: 13px;
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
  .public {
    input {
      font-size: 1.1em;
      padding: 0.5em;
      border: 1px solid #efeff4;
      -webkit-appearance: none;
    }
  }
}
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
}
.course-detail{
  padding-bottom: 90px;
}
.phone-input {
  width: 90%;
  /*height: px;*/
  padding: 5px;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 17px;
  line-height: 50px;
  text-align: center;
  background-color: #00a6ac;
  span{
    color: #fff;
  }
  .commit {
    margin-left: 0;
  }
}
.error {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 17px;
  line-height: 50px;
  text-align: center;
  color: #555;
  background-color: #aaa;  
}
.origin-price {
  text-decoration: line-through;
}
.price-desc {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 16px;
  color: #555;
  line-height: 30px;
  text-align: center;
  background-color: #ffc000;
}
</style>
