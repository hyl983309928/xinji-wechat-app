<template>
  <div class="study-page" :style="{height: pageSize + 'px'}" v-if="material.id !== undefined">
    <swipe :auto="0" class="slide-con" :showIndicators="false" :continuous="false">
      <swipe-item v-for="(homework, index) in material.homework">
        <div>
          <div class="progress">
            <div class="temop" :style="{width: ((index + 1)/(material.homework.length + 1) * 100) + '%'}">
            </div>
          </div>
          <div class="cl-module">
            <div class="cl-m-header">
              作业{{ index + 1 }}
            </div>
            <div class="cl-m-body">
              <div class="public">
                {{homework.homework}}
              </div>
              <hr>
              <div class="answer">
                <span>回答</span>
              </div>
              <div class="public">
                <x-textarea class="xj-textarea" :placeholder="homework.sug" v-model="homework.answer.content"></x-textarea>
              </div>
              <div class="port">
                <span slot="icon" class="iconfont icon-plus add-photo" @click="uploadImg(homework)"></span>
                <span class="preview">
                  <img v-if="homework.answer.photo" :src="homework.answer.photo">
                </span>
                <div class="clear"></div>
              </div>
              <x-button type="primary" @click.native="saveHomework(homework)">保存</x-button>
            </div>
          </div>
        </div>
      </swipe-item>
      <swipe-item>
        <div>
          <div class="progress">
            <div class="temop">
            </div>
          </div>
          <div class="cl-module">
            <div class="cl-m-body finish">
              <div>
                <img src="/static/img/work.png">
              </div>
              <div>
                <p>感谢完成本次课程课后作业</p>
                <p>请点击<strong>提交</strong>并可预览整体报告</p>
              </div>
              <x-button type="primary" @click.native="submit">提交</x-button>
            </div>
          </div>
        </div>
      </swipe-item>
    </swipe>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  Selector,
  XButton,
  XTextarea
} from 'vux'
import { Swipe, SwipeItem } from 'vue-swipe'
import _ from 'lodash'
// import FormData from 'form-data'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Selector,
    XButton,
    XTextarea,
    Swipe,
    SwipeItem
  },
  data () {
    return {
      id: 0,
      pageSize: 0,
      learn: {},
      material: {},
      answerList: {}
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.learn.find(id)
        .then((learn) => {
          // learn = this.$learn.formatLearn(learn)
          this.learn = learn
          // this.material = learn.material
          this.getHomework()
        })
    this.setPageSize()
  },
  mounted () {
  },
  methods: {
    setPageSize () {
      this.pageSize = window.innerHeight
    },
    swipeItemCreated () {
    },
    swipeItemDestroyed () {
      // console.log(e)
    },
    submit () {
      var answerList = []
      this.material.homework.forEach((item) => {
        var answer = item.answer
        answer.learn_homework_id = item.id
        answer.learn_id = item.learn_id
        answerList.push(answer)
      })
      var data = {
        learn_id: this.learn.id,
        answer_list: answerList
      }
      this.$api.learn.submitHomework(data).then((res) => {
        this.$vux.toast.show({
          text: '提交成功',
          type: 'success'
        })
        this.$router.push('/parent/course/learn_report/' + this.learn.id)
      }).catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    },
    saveHomework (homework) {
      console.log(homework)
      var answer = homework.answer
      answer.learn_id = this.id
      answer.homework_id = homework.id
      console.log(answer)
      this.$api.learn.saveUserHomework(answer).then((data) => {
        this.$xLog(data)
        answer.id = data.id
        this.$vux.toast.show({
          text: '保存成功',
          type: 'success'
        })
      })
      .catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    },
    getHomework () {
      this.$api.learn.getUserHomework(this.id)
        .then((data) => {
          var answerList = {}
          for (var i = 0; i < data.list.length; i++) {
            var answer = data.list[i]
            answerList[answer.learn_homework_id] = answer
          }
          this.answerList = answerList
          this.setUserAnswer()
        })
    },
    setUserAnswer () {
      var material = _.clone(this.learn)
      for (var i = 0; i < material.homework.length; i++) {
        var homework = material.homework[i]
        var id = homework.id
        if (this.answerList[id]) {
          homework.answer = this.answerList[id]
        } else {
          homework.answer = {
            photo: '',
            content: ''
          }
        }
      }
      console.log(material)
      this.material = material
    },
    uploadImg (homework) {
      var answer = homework.answer
      this.$wechat.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds

          var localId = localIds[0]
          window.xLog('localId:' + localId)
          answer.photo = localId

          this.$wechat.uploadImage({
            localId: localId,
            success: (res) => {
              var serverId = res.serverId
              window.xLog('serverId:' + serverId)
              this.$api.photo.downloadMedia(serverId).then((data) => {
                answer.photo = this.$helper.getImageUrl(data.url)
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~vue-swipe/dist/vue-swipe.css';
.study-page {
  // height: 1200px;
}
div.mint-swipe, div.mint-swipe-items-wrap{
  overflow: auto;
}

li{
  list-style: none;
}
.progress{
  background-color: #ffffff;
  height: 6px;
  margin:15px;
  border-radius: 3px;
}
.temop{
  background: #60c9cf;
  height: 6px;
  border-radius: 3px;
}
.label{
  .cl-module{
    padding-bottom: 60px;
  }
  .label{
    margin: 30px 20px;
    .detail li{
      text-align: right;
    }
  }
  img{
    width: 225px;
  }
  .cl-m-body{
    margin: 50px;
    .outline{
      text-align: center;
    }
    .title{
      p{
        margin-top: 20px;
      }
    }
  }
  ul{
    list-style: none;
  }
  li{
    margin-bottom: 10px;
  }
  .object{
    float: left;
    color: #00a6ac;
  }
  .detail{
    float: right;
  }
}
span{
  color: #60c9cf;
  margin-top: 5px;
  margin-left: 15px;
}
#tesk{
  color:#323b46;
  float: right;
  margin-right: 15px;
}
.finish{
  text-align: center;
div{
  margin: 50px 0;
  span{
    color: #00cac6;
    }
  }
}
hr{
  opacity: 0.3;
  margin: 15px;
}
.public{
  margin: 5px 15px;
  color:#323b46;
}
strong{
  color: #00a6ac;
}
.port{
  margin-bottom: 40px;
  span{
    width: 80px;
    height: 80px;
    margin-top: 15px;
    margin-left: 15px;
    display: inline-block;
    float:left;
  }
  .iconfont{
    line-height: 80px;
    text-align: center;
    color: #efeff4;
    border: solid 1px #efeff4;
  }
  .preview{
    margin-left: 30px;
    img{
      height: 80px;
    }
  }
}
.add-photo{
  font-size:60px;
}

</style>
