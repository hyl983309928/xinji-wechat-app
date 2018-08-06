<template>
  <div class="study-page">
    <div class="cl-module course-user-list">
      <ul>
        <li class="rel">编号</li>
        <li class="draw">学员</li>
        <li>回答</li>
        <!--<li>作业</li>-->
      </ul>
      <br>
      <hr>
      <div class="apply">
        <ul v-for="(user, index) in list">
          <li class="rel">
            {{user.id}}
          </li>
          <li class="draw">
            <span>
              <img :src="user.headimgurl">
            </span>
            <span class="name">{{user.name}}</span>
          </li>
          <li @click="checkAnswer(answer[index][taskIndex], user)" v-if="type=='photo'">
            {{answer.length>0 && answer[index].length>0 && answer[index][taskIndex].length>0 ? '√' : '-'}}
          </li>
          <li @click="checkAnswerSound(answer[index][taskIndex], user)" v-if="type=='sound'">
            {{answer.length>0 && answer[index].length>0 && answer[index][taskIndex].length>0 && answer[index][taskIndex][0].url ? '√' : '-'}}
          </li>
          <li @click="user.showAnswer = !user.showAnswer" v-if="type=='choose' || type=='mulchoose'">
            {{answer.length>0 && answer[index].length>0 && answer[index][taskIndex].length>0 ? answer[index][taskIndex].join(",") : '-'}}
          </li>
          <template v-if="answer.length>0 && answer[index][taskIndex].length>0 && user.showAnswer && type=='photo'">
            <img :src="i" alt="" v-for="i in answer[index][taskIndex]" class="photo">
          </template>

          <template v-if="user.showAnswer && type==='sound'">
            <flexbox>
              <flexbox-item>
                <button class="voice-button weui-btn weui-btn_default" @click="playRecord($event)">
                  <audio :src="answer[index][taskIndex][0].url"></audio>
                  <img class="img-left left" src="/static/img/voice_gray.png" alt="">
                  <span class="time-left" v-if="answer.length>0 && answer[index][taskIndex].length>0 && answer[index][taskIndex][0].url">{{ answer[index][taskIndex][0].totalTime }}s</span>
                </button>
              </flexbox-item>
            </flexbox>
          </template>
          <!--<li>
            {{user.homework ? '√' : '-'}}
          </li>-->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  Flexbox,
  FlexboxItem
} from 'vux'
import _ from 'lodash'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Flexbox,
    FlexboxItem
  },
  props: ['type', 'answer', 'methodIndex', 'taskIndex'],
  data () {
    return {
      id: 0,
      list: []
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    console.log(this.type)
    this.id = id
    // this.$api.course.courseUserList(id).then((data) => {
    //   this.list = data.list
    // })
    this.$api.course.getCourseUser(id).then((data) => {
      console.log(data)
      this.list = data.list.map(item => {
        item.showAnswer = false
        return item
      })
    })
  },
  methods: {
    playRecord(event) {
      event.target.firstChild.play()
    },
    checkAnswer(answer, user) {
      if (!_.isEmpty(answer)) {
        user.showAnswer = !user.showAnswer
      }
    },
    checkAnswerSound(answer, user) {
      if (!_.isEmpty(answer) && answer[0].url) {
        user.showAnswer = !user.showAnswer
      }
    }
  }
}
</script>

<style scoped lang="scss">
.course-user-list {
  margin: 0;
}
.course-user-list ul{
  list-style: none;
  text-align: center;
  li{
    float:left;
    height: 30px;
    margin-top: 15px;
    margin-bottom: 10px;
    width: 30%;
    color:#6c7b8a;
    overflow: hidden;
  }
  li.draw{
    width:40%;
    text-align: left;
  }
}
.draw{
  img{
    height: 24px;
    width: 24px;
    margin-right: 15px;
  }
  span{
    width: 40%;
    text-align: center;
  }
  .name{
    position: relative;
    font-size:14px;
    top: -7px;
    width: 60%;
  }
}
hr{
  margin: 30px 30px 0 30px;
  opacity: 0.3;
}

.photo {
  width: 200px;
}

.voice-button {
  width: 231px;
  height: 42px;
  margin-bottom: 5px;
  /*box-shadow: 1px 1px 4px #888888;*/
  font-size: 13px;
  color: #c8d2dc;
  background-color: #fff;
  .img-left {
    float: left;
    margin-top: 2px;
  }
  .time-left {
    float: left;
    margin-top: 1px;
    color: #c8d2dc;
    margin-left: 10px;
  }
}
</style>
