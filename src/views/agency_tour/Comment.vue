<template>
  <div class="summary">
    <p class="top_suc" v-if="hasHomework">
      <span>作业推送成功√</span>
      <span class="push_again" @click="pushHomework">再次推送></span>
    </p>
    <div style="padding:15px;" v-if="hasHomework"></div>
    <!--<swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false">-->
      <!--<swipe-item class="slide-item">-->
        <div class="conclusion" transition="expand">
          <!--<div class="progress">
            <div class="bar">
            </div>
          </div>-->
          <div class="cl-module">
            <div class="cl-m-header">
              老师点评
            </div>
            <div class="cl-m-body">
              <x-textarea placeholder="请输入您对本次课程的点评" v-model="reviewAfter" class="textarea xj-textarea" :height="200"></x-textarea>
            </div>
          </div>
        </div>
      <!--</swipe-item>-->
      <!--<swipe-item class="slide-item">-->
        <!--<div class="survey" transition="expand">-->
          <!--<div class="progress">
            <div class="bar">
            </div>
          </div>-->
          <!--<div class="cl-module">
            <div class="cl-m-header">
              观察
            </div>
            <div class="cl-m-body">
              <x-textarea placeholder="请输入本次课程的观察" v-model="course.observe" class="textarea xj-textarea" :height="400"></x-textarea>
            </div>
          </div>
        </div>-->
      <!--</swipe-item>-->
      <!--<swipe-item class="slide-item">-->
        <div class="print" transition="expand">
          <!--<div class="progress">
            <div class="bar">
            </div>
          </div>-->
          <div class="cl-module">
            <div class="cl-m-header">
              现场照片
            </div>
            <div class="cl-m-body photo-list-box">
              <div class="photo-list">
                <div class="photo-item" v-for="(photo, index) in coursePics">
                  <img :src="photo">
                  <span class="iconfont icon-close delete-btn" @click="deletePhoto(photo)"></span>
                </div>
                <div class="photo-item" v-if="photoNum < 9" @click="uploadImg">
                  <span slot="icon" class="iconfont icon-plus upload-img-btn"></span>
                </div>
              </div>

              <div class="clear"></div>
            </div>
          </div>
        </div>
      <!--</swipe-item>-->
        <router-link :to="'/agency/course'">
          <button type="button" class="page-submit-btn" @click="submit">提交</button>
        </router-link>
    <!--</swipe>-->
  </div>
</template>

<script>
import { Tabbar, Cell, Group, Badge, XTextarea, XButton } from 'vux'
import _ from 'lodash'
// import { Swipe, SwipeItem } from 'vue-swipe'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XTextarea,
    XButton
  },
  data () {
    return {
      id: 0,
      course: {},
      pageSize: 500,
      coursePics: [],
      reviewAfter: '',
      photoNum: 0,
      hasHomework: false
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.setPageSize()
    this.setHomework()
  },
  methods: {
    setHomework() {
      this.$api.courseTour.getDetail(this.id).then((course) => {
        try {
          this.hasHomework = !_.isEmpty(course.material.homework.question)
        } catch (error) {
          this.hasHomework = false
        }
      })
    },
    uploadImg() {
      var count = 9 - this.photoNum
      this.$wechat.chooseImage({
        count: count, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds
          this.forUploadImg(0, localIds)
        }
      })
    },
    forUploadImg (index, urlList) {
      if (index >= urlList.length) {
        return
      }
      var localId = urlList[index]
      this.$wechat.uploadImage({
        localId: localId,
        success: (res) => {
          this.photoNum += 1
          var serverId = res.serverId
          this.$api.photo.uploadImg(serverId).then((data) => {
            this.coursePics.push(data.url)
            index++
            this.forUploadImg(index, urlList)
          })
          .catch(e => {
            this.photoNum -= 1
          })
        }
      })
    },
    deletePhoto (photo) {
      this.showConfirm('照片删除后将不能恢复，是否删除', () => {
        this.coursePics.forEach((_p, index) => {
          if (_p === photo) {
            this.coursePics.splice(index, 1)
            this.photoNum -= 1
          }
        })
      })
    },
    courseComplete() {
      this.$api.courseTour.courseCompleted(this.id).then(res => {
        console.log(res)
      })
    },
    swipeItemCreated () {
    },
    swipeItemDestroyed () {
      // console.log(e)
    },
    setPageSize () {
      this.pageSize = window.innerHeight
    },
    submit () {
      var _this = this
      this.$api.courseTour.setAgencySummary(this.id, this.reviewAfter, this.coursePics).then(() => {
        this.courseComplete()
        _this.showSuccess('提交成功')
      }).catch((e) => {
        _this.showError(e.message)
      })
    },
    showSuccess (msg) {
      this.$vux.toast.show({
        text: msg,
        type: 'success'
      })
    },
    showError (msg) {
      this.$vux.toast.show({
        text: msg,
        type: 'warn'
      })
    },
    pushHomework() {
      this.$api.courseTour.sendHomeworkMessage(this.id).then(() => {
        this.$vux.toast.show({
          text: '推送成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.top_suc{
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
  background-color: #ffff99;
  padding: 5px 20px;
  border-bottom: 1px solid #ccc;
  .push_again{
    text-decoration: underline;
    color: #0070c0;
  }
}
.summary{
  box-sizing: border-box;
  padding-bottom: 50px;
}
.expand-transition{
  transition: all .3s ease;
  overflow: hidden;
}
.expand-enter,.expand-leave{
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
.progress{
  background-color: #ffffff;
  height: 6px;
  margin:15px;
  border-radius: 3px;
}
.bar{
  height: 6px;
  border-radius: 3px;
  background: #60c9cf;
}
.textarea{
  height: auto;
  font-size: 16px;
}
.conclusion{
  .bar{
    width: 33%;
  }
}
.survey{
  .bar{
    width: 66%;
  }
}
.photo-item .upload-img-btn{
  font-size:40px;
}
.print{
  .bar{
    width:100%;
  }
  img{
    width: 90px;
  }
}
.photo-list-box{
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: (40rem/16);
}
.photo-item{
  float:left;
  width: (80rem/16);
  height: (80rem/16);
  margin-right:(10rem/16);
  border: solid 1px #efeff4;
  margin-top: (5rem/16);
  margin-bottom: (5rem/16);
  text-align: center;
  img{
    width: (80rem/16);
    height: (80rem/16);
  }
  span{
    color: #efeff4;
    line-height: (80rem/16);
    font-size:(17rem/16);
  }
}
.photo-item{
  position: relative;
}
.photo-item .delete-btn{
  position: absolute;
  width:17px;
  height:15px;
  bottom:0;
  left: 0;
  background-color: rgba(50, 59, 70, 0.5);
  /*border-radius: 15px;*/
  line-height: 17px;
}
</style>
