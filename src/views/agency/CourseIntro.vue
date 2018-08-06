<template>
  <div class="preview-page">
    <TopCover :cover="material.cover" :theme="material.labelTheme" :age="material.labelAge" :target="material.labelTarget" :scene="material.labelScene" :title="material.title || material.name"></TopCover>
    <div>
      <div class="cl-module intro">
        <div class="cl-m-header">
          课程导入
        </div>
        <div class="cl-m-body">
          <div>
            <span>激发兴趣</span>
          </div>
          <div class="public" v-if="material.interest" v-html="material.interest.replace(/\n/g, '<br />')">
          </div>
          <div class="module-split">
            <span>目标解释</span>
          </div>
          <div class="public" v-if="material.targetDesc" v-html="material.targetDesc.replace(/\n/g, '<br />')">
          </div>
        </div>
      </div>
    </div>
    
    <div style="padding: 20px;"></div>
    <!-- <router-link :to="'/agency/course_control/' + id"> -->
    <div class="footer" @click="courseStart">
      <span>开始上课</span>
    </div>
    <!-- </router-link> -->
  </div>
</template>

<script>
  import TopCover from 'components/TopCover'
  export default {
    components: {
      TopCover
    },
    data() {
      return {
        id: 0,
        course: {},
        material: {},
        courseTitle: ''
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      this.$api.course.getDetail(id)
        .then((course) => {
          this.course = course
          var material = this.$material.formatMaterial(course.material)
          this.material = material
          this.courseTitle = course.title
        })
      this.$label.getLabelList().then((labelList) => {
        this.$label.getLabelTree(labelList)
      })
    },
    mounted() {
    },
    methods: {
      courseStart() {
        if (this.course.status >= 8) {
          this.$router.push('/agency/course_control/' + this.course.id + '/0')
          return
        }
        var _this = this
        var remain = new Date(this.course.lesson_time) - new Date()
        if (remain < 3600000) {
          this.$vux.confirm.show({
            title: '确认开始上课？',
            content: this.$t('点击确认，家长将收到开课提醒，正式进入上课流程。<br><br>确认开始上课？'),
            confirmText: '确认开始',
            onConfirm () {
              _this.$api.course.classBegin(_this.id).then((res) => {
                var url = '/agency/course_control/' + _this.course.id + '/0'
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