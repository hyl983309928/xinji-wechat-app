<template>
  <div class="course-detail">
    <div class="c-top">
      <img :src="course.material.cover" class="course-cover-img">
      <div class="mask">
        <!--<div class="tag">
          <span>{{ course.targetLabel }}</span>
          <span>{{ course.ageLabel }}</span>
          <span>{{ course.sceneLabel}}</span>
        </div>-->
        <div class="title">
          <span>{{ course.title }}</span>
        </div>
      </div>
    </div>

    <ul class="course-list">
      <!--<li class="show-icon lanmacolor">展开查看全部课程 <span class="intro-bottom">></span></li>-->
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="list"><span class="lanmacolor">课程1</span> 希望人格之捕梦网 <span class="fr">></span></li>
      <li class="show-icon lanmacolor"><span class="intro-top">></span></li>
    </ul>

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
        组合简介
      </div>
      <div class="cl-m-body">
        <div class="public">
          {{ intro }}
        </div>
      </div>
    </div>
    <!--<button class="page-submit-btn" v-if="signInfo.id === undefined && course.count_data.sign_up_num < course.total" @click="signUp">报名</button>-->
    <!--<button class="page-submit-btn" v-else @click="share">分享</button>-->

    <router-link :to="'/parent/course/pay/' + id">
      <div class="footer">
        <span class="commit">进入购买（¥100{{ }}）</span>
      </div>
    </router-link>

  </div>
</template>

<script>
export default {
  data () {
    return {
      phoneNumber: '',
      course: {},
      material: {},
      intro: '课程简介'
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.course.getDetail(id)
        .then((course) => {
          course = this.$course.formatCourse(course)
          this.course = course
          this.material = course.material
        })
  },
  methods: {
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
    height: 40px;
    input {
      padding: 11px 15px;
      border: 1px solid #efeff4;
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
  margin-bottom: 60px;
}
.phone-input {
  width: 90%;
  /*height: px;*/
  padding: 5px;
}
.intro-bottom{
  display: inline-block;
  transform: rotate(90deg);
}
.intro-top{
  display: inline-block;
  transform: rotate(-90deg);
}
.course-list{
  font-size: 13px;
  background-color: #fff;
  margin-bottom: 20px;
  .show-icon{
    text-align: center;
  }
  .lanmacolor{
    color:#00a6ac;
  }
  li{
    margin: 0 15px;
    padding: 11px 0;
  }
  .list{
    margin: 0 15px;
    padding: 11px 0;
    border-bottom: 1px solid #efeff4;
  }
  .fr{
    color: #efeff4;
    float: right;
  }
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
</style>
