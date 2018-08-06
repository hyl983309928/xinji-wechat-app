<template>
  <div class="preview-page" :style="{height: pageSize + 'px'}">
    <div class="c-top">
      <img :src="material.cover" class="course-cover-img">
      <div class="mask">
        <div class="tag">
          <span>{{ material.targetLabel }}</span>
          <span>{{ material.ageLabel }}</span>
          <span>{{ material.sceneLabel}}</span>
        </div>
        <div class="title">
          <span>{{ courseTitle }}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="cl-module">
        <div class="cl-m-header">
          课程导入
        </div>
        <div class="cl-m-body">
          <div class="public" v-if="!material.interest && !material.targetDesc">
            该游学课程无课程导入内容
          </div>
          <div v-if="material.interest">
            <span>激发兴趣</span>
          </div>
          <div v-if="material.interest" >
            <div class="public" v-html="material.interest.replace(/\n/g, '<br />')">
            </div>
          </div>
          <div v-if="material.targetDesc">
            <span>课程目标介绍</span>
          </div>
          <div v-if="material.targetDesc">
            <div class="public" v-html="material.targetDesc.replace(/\n/g, '<br />')">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <a @click="classBegin(course.id, '/agency' + (course.materialType=='2'?'_tour':'') + '/course_intro/' + course.id)">
      <div class="footer">
        <span>开始上课</span>
      </div>
    </a>
  </div>
</template>

<script>
  // import {
  //   Tabbar,
  //   Cell,
  //   Group,
  //   Badge,
  //   Selector,
  //   XButton,
  //   XTextarea
  // } from 'vux'

  export default {
    // components: {
    //   Tabbar,
    //   Cell,
    //   Group,
    //   Badge,
    //   Selector,
    //   XButton,
    //   XTextarea
    // },
    data() {
      return {
        id: 0,
        material: {},
        courseTitle: '',
        course: {}
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      this.$api.courseTour.getDetail(id)
        .then((course) => {
          this.course = course
          var material = this.$material.formatMaterial(course.material)
          this.material = material
          this.courseTitle = course.title
          if (!material.interest && !material.targetDesc) {
            this.$router.push('/agency_tour/course_control/' + id)
          }
          // this.setPageLength()
        })
      this.$label.getLabelList().then((labelList) => {
        this.$label.getLabelTree(labelList)
      })
      this.setPageSize()
    },
    mounted() {
    },
    methods: {
      setPageSize() {
        this.pageSize = window.innerHeight
      },
      setPageLength() {
        var numHash = {}
        var num = 2
        this.material.tasks.forEach((task, index) => {
          num++
          numHash[index] = num
          task.asks.forEach((ask, aIndex) => {
            num++
            numHash[index + '_a_' + aIndex] = num
          })
          task.summaries.forEach((summary, sIndex) => {
            num++
            numHash[index + '_s_' + sIndex] = num
          })
        })
        num++
        this.totalPage = num
        this.numHash = numHash
      },
      swipeItemCreated() {
      },
      swipeItemDestroyed() {
        // console.log(e)
      },
      classBegin (id, url) {
        if (this.course.status >= 8) {
          this.$router.push('/agency_tour/course_control/' + this.course.id + '/0')
          return
        }
        var _this = this
        var a = this.course.lesson_time.split(/[^0-9]/)
        var time = new Date(a[0], a[1] - 1, a[2], a[3], a[4])
        var remain = time - new Date()
        if (remain < 3600000) {
          this.$vux.confirm.show({
            title: '确认开始上课？',
            content: this.$t('点击确认，家长将收到开课提醒，正式进入上课流程。<br><br>确认开始上课？'),
            confirmText: '确认开始',
            onConfirm () {
              _this.$api.course.classBegin(_this.course.id).then((res) => {
                var url = '/agency_tour/course_control/' + _this.course.id + '/0'
                _this.$router.push(url)
              }).catch((e) => {
                _this.$vux.toast.show({
                  text: e.message,
                  type: 'warn'
                })
              })
            }
          })
        } else {
          this.$vux.alert.show({
            title: '还没到上课时间哟',
            content: this.$t('距离预定上课时间还有很久，请耐心等待。如有问题，请联系工作人员。')
          })
        }
      }

    }
  }

</script>

<style scoped lang="scss">
  /*@import '~vue-swipe/dist/vue-swipe.css';*/

  .c-top {
    position: relative;
    line-height: 0px;
    img {
      width: 100%;
      z-index: 0;
    }
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0px;
      bottom: 0px;
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

  .study-page {
    height: 1200px;
  }

  /*.intro{
    padding-bottom: 70px;
  }*/
  .cl-module {
    position: relative;
    overflow: visible;
    span {
      font-size: 17px;
      color: #60c9cf;
      margin-top: 5px;
      margin-left: 15px;
    }
  }

  .cl-m-header {
    border-radius: 6px 6px 0 0;
  }

  hr {
    opacity: 0.3;
    margin: 15px;
  }

  .public {
    font-size: 13px;
    margin: 5px 15px;
    color: #323b46;
  }

  .module-split {
    margin-top: 15px;
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
  }

</style>