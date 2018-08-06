<template>
  <div class="study-page">
    <div class="label">
      <div class="progress">
        <div class="bar">
        </div>
      </div>
      <div class="cl-module">
        <div class="cl-m-body">
          <div class="outline">
            <div>
              <img src="#">
            </div>
            <div class="title">
              {{title}}
            </div>
          </div>
          <ul v-for="item in detail">
            <li>
              <span>{{item.title}}</span>
              <span class="span">{{item.key}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="goal">
      <div class="progress">
        <div class="bar">
        </div>
      </div>
      <div class="cl-module">
        <div class="cl-m-header">
          课程目标
        </div>
        <div class="cl-m-body">
          <span>观察</span>
          <hr>
          <div class="public">
            {{watch}}
          </div>
        </div>
      </div>
    </div>

    <div class="tesk">
      <div class="progress">
        <div class="bar">
        </div>
      </div>
      <div class="cl-module">
        <div class="cl-m-header">
          任务1
        </div>
        <div class="cl-m-body">
          <div>
            <span id="title">孩子
            </span>
            <span class="normal">普通任务
            </span>
          </div>
          <hr>
          <div>
            <span>
              任务描述
            </span>
            <hr>
            <div class="public">
              {{describe}}
            </div>
            </div>
            <br>
          <div>
            <span>
              任务道具
            </span>
            <hr>
            <div class="public">
              {{scene}}
            </div>
           </div>
        </div>
      </div>
    </div>

    <div>
      <div class="progress">
        <div class="bar">
        </div>
      </div>
      <div class="cl-module tesk">
        <div class="cl-m-header">
          任务1
        </div>
        <div class="cl-m-body">
            <div class="public">
              它的外形是怎么样的？（在观察时，包括颜色、长相、几条腿、有没有毛，个头大小都要如实写出来）
            </div>
            <div class="student">
              <hr>
            <span class="answer">回答</span>
            <div>
              <ul class="nav">
                <li>编号</li>
                <li>学员</li>
                <li>回答</li>
              </ul>
            </div>
            <div>
              <ul v-for="applys in apply">
                <li class="rel">
                  {{applys.id}}
                </li>
                <li>
                  <span>
                    <img :src="applys.head">
                  </span>
                  <span class="name">{{applys.name}}</span>
                </li>
                <li>
                  {{applys.answer}}
                </li>
              </ul>
            </div>
            <div class="content">
              <div class="apply">
                {{response}}
              </div>
              <div>
                <span><img src=""></soan>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="progress">
        <div class="bar">
        </div>
      </div>
      <div class="cl-module">
        <div class="cl-m-header">
          任务1
        </div>
        <div class="cl-m-body">
          <div class="public">给孩子们带来的好处</div>
          <hr>
          <div class="public">
            {{benefit}}
          </div>
        </div>
      </div>
    </div>

    <div class="finish">
      <div class="progress">
        <div class="bar">
        </div>
      </div>
      <div class="cl-module">
        <div class="cl-m-body afterclass">
          <div>
            <img src="/static/img/work.png">
          </div>
          <div>
            <p>感谢完成心迹教育课程授课</p>
            <p>请点击<strong>下课</strong>结束并进入总结</p>
          </div>
          <x-button type="primary" v-link="{path:'/agency/conclusion'}">下课</x-button>
        </div>
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
  XTextarea,
  XButton
} from 'vux'
// const version = require('../package.json').version
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
      title: '标题',
      detail: [
        {
          title: '孩子年龄',
          key: '7-9岁'
        },
        {
          title: '课程主题',
          key: '观察'
        },
        {
          title: '参与对象',
          key: '亲子'
        },
        {
          title: '课程时长',
          key: '一天'
        }
      ],
      apply: [
        {
          id: '1',
          name: '微信名称',
          answer: '-',
          head: ''
        },
        {
          id: '2',
          name: '微信名称',
          answer: '-',
          head: ''
        }
      ],
      watch: '课程目标课程目标',
      benefit: '训练孩子们的思维能力和表达能力',
      answer: '抓住特点',
      describe: '任务描述任务描述',
      scene: '任务道具任务道具',
      response: '回答内容回答内容'
    }
  }
}
</script>

<style scoped lang="scss">
span:nth-child(odd),.answer{
  color: #00a6ac;
  margin-left: 15px;
}
.public{
  margin-left: 15px;
  color:#323b46;
}
.normal{
  float:right;
  margin-right: 10px;
  color: #323b46;
}
#title,.student{
  color: #323b46;
}
.label{
  img{
    height: 120px;
    width: 225px;
  }
  .cl-m-body{
    margin: 50px;
  }
  .outline{
    margin-bottom: 30px;
    text-align: center;
    .title{
      margin-top: 30px;
    }
  }
  ul{
    list-style: none;
  }
  li{
    margin-bottom: 10px;
  }
  .span{
    float: right;
  }
}
.tesk{
  ul{
    list-style: none;
    text-align: center;
    li{
      float: left;
      margin-bottom: 10px;
      width: 30%;
      height: 40px;
    }
  }
}
.progress{
  background-color: #ffffff;
  height: 6px;
  border-radius: 3px;
  margin: 15px;
  .bar{
    background-color: #60c9cf;
    height: 6px;
    width: 16%;
    border-radius: 3px;
  }
}
hr{
  opacity:0.3;
  margin: 10px 15px;
}
.afterclass{
  text-align: center;
  div{
    margin: 50px 0;
    strong{
      color: #00cac6;
    }
  }
  .bar{
    width: 100%;
  }
}
.study-page{
  div:nth-child(2){
    .bar{
      width: 32%;
    }
  }
  div:nth-child(3){
    .bar{
      width: 48%;
    }
  }
  div:nth-child(4){
    .bar{
      width: 64%;
    }
    .content{
      height: 90px;
      width: auto;
      border: solid 1px #efeff4;
      padding-top: 15px;
      padding-left: 10px;
      margin: 140px 15px 15px;
      color: #323b46;
      div:nth-child(1){
        float: left;
        width: 80%;
      }
      img{
        height: 60px;
        width: 60px;
        margin-right: 10px;
      }
    }
    ul{
      img{
        height: 24px;
        width: 24px;
        border-radius: 10px;
      }
      .name{
        position: relative;
        top: -7px;
      }
    }
  }
  div:nth-child(5){
    .bar{
      width: 82%;
    }
  }
  div:nth-child(6){
    .bar{
      width: 100%;
    }
  }
}
</style>
