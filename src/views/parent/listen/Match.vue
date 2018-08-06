<template>
  <div class="study-page">
    <div class="cl-module">
      <div class="cl-m-header">
        请选择孩子年龄
      </div>
      <div class="cl-m-body">
        <div class="ft-con">
          <div class="ft-btn-list">
            <x-button mini v-for="yLable in ageLabelList" :type="yLable.key == age ? 'primary' : 'default'" @click="age = yLable.key">{{ yLable.title }}</x-button>
          </div>
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        请选择主题标签
      </div>
      <div class="cl-m-body">
        <div class="ft-con" v-for="subSubject in subjectLabelList">
          <h5>{{ subSubject.title }}</h5>
          <div class="ft-btn-list">
            <x-button mini v-for="sLable in subSubject.childList" :type="sLable.key == subject[subSubject.key] ? 'primary' : 'default'" @click="subject[subSubject.key] = sLable.key">{{ sLable.title }}</x-button>
          </div>
        </div>
      </div>
    </div>
    <div class="record">
      <img src="../../../../static/img/match.png">
    </div>
    <x-button class="button">开始匹配</x-button>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton
} from 'vux'
// const version = require('../package.json').version
export default {
  name: 'filter',
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton
  },
  data () {
    return {
      //   version: version
      ageLabelList: [
        {
          title: '3-6岁',
          key: '3-6'
        },
        {
          title: '7-12岁',
          key: '7-12'
        },
        {
          title: '10-13岁',
          key: '10-13'
        }
      ],
      age: '',
      subjectLabelList: [
        {
          title: '学会学习',
          key: 'learn_study',
          childList: [
            {
              title: '思维',
              key: 'think'
            },
            {
              title: '想象',
              key: 'imagine'
            },
            {
              title: '观察',
              key: 'observe'
            }
          ]
        },
        {
          title: '学会做事',
          key: 'learn_work',
          childList: [
            {
              title: '情绪调节',
              key: 'emition'
            },
            {
              title: '心里倾向',
              key: 'mental'
            },
            {
              title: '认知风格',
              key: 'style'
            }
          ]
        },
        {
          title: '学会相处',
          key: 'learn_with',
          childList: [
            {
              title: '人际交往',
              key: 'contact'
            },
            {
              title: '团队合作',
              key: 'teamwork'
            }
          ]
        }
      ],
      subject: {}
    }
  }
}
</script>

<style scoped lang="scss">
.ft-con{
  margin-bottom: 15px;
}
.ft-con h5{
  height:20px;
  line-height: 20px;
  font-weight: normal;
  font-size:14px;
  color:#6c7b8a;
}
.ft-btn-list button{
  margin-right: 15px;
}
.record{
  float: right;
  margin: 80px 30px 30px 0;
  img{
    height: 60px;
    width: 60px;
  }
}
.button{
  background: #00a6ac;
  color: #ffffff;
}
</style>
