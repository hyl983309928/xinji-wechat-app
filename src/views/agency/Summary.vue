<template>
  <div class="preview-page" :style="{height: pageSize + 'px'}">
    <!-- <div class="cl-module">
      <div class="cl-m-header">
        课程总结
      </div>
      <div class="cl-m-body">
        <span>目标总结</span>
        <div class="public" v-if="material.summary" v-html="material.summary.replace(/\n/g, '<br />')">
        </div>
        <span>请家长关注教养建议和课后作业</span>
        <div class="public" v-if="material.proposal" v-html="material.proposal.replace(/\n/g, '<br />')">
        </div>
      </div>
    </div> -->

    <div class="cl-module homework" v-if="material.homework">
      <div class="cl-m-header">
        作业：{{ material.homework.title }}
      </div>
      <div class="cl-m-body">
        <span>参与对象</span>
        <div class="public">
          {{ material.homework.participant }}
        </div>
        <span v-if="material.homework.material">准备材料</span>
        <div class="public" v-if="material.homework.material" v-html="material.homework.material.replace(/\n/g, '<br />')">
        </div>
        <span v-if="material.homework.rule">游戏规则</span>
        <div class="public" v-if="material.homework.rule" v-html="material.homework.rule.replace(/\n/g, '<br />')">
        </div>
        <span v-if="material.homework.guide">游戏指引</span>
        <div class="public" v-if="material.homework.guide" v-html="material.homework.guide.replace(/\n/g, '<br />')">
        </div>
        <span>任务</span>

        <template v-for="(question, index) in material.homework.question">
          <template v-if="question.type==='photo'">
            <p class="question"  v-if="question.question"  v-html="index + 1 + ' ' + question.question.replace(/\n/g, '<br />')"></p>
            <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
              提示：
              <img src="/static/img/more.png" alt="">
            </p>
            <div class="public" v-if="question.showPrompt && question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
            </div>
            <hr v-if="index!==material.homework.question.length-1">
          </template>
          <template v-if="question.type==='choose' || question.type==='mulchoose'">
            <p class="question"  v-if="question.question"  v-html="index + 1 + ' ' + question.question.replace(/\n/g, '<br />')"></p>
            <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
              提示：
              <img src="/static/img/more.png" alt="">
            </p>
            <div class="public" v-if="question.showPrompt && question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
            </div>
            <p class="select-item" v-for="(item, index) in question.option" v-if="item">
              <span>{{ num2CharMap[index] }}</span> {{ item }}
            </p>
            <hr v-if="index!==material.homework.question.length-1">
          </template>
          <template v-if="question.type==='sound'">
            <p class="question" v-if="question.question" v-html="index + 1 + ' ' + question.question.replace(/\n/g, '<br />')"></p>
            <p class="idea" @click="question.showPrompt=!question.showPrompt" v-if="question.prompt">
              提示：
              <img src="/static/img/more.png" alt="">
            </p>
            <div class="public" v-if="question.showPrompt && question.prompt" v-html="question.prompt.replace(/\n/g, '<br />')">
            </div>
            <hr v-if="index!==material.homework.question.length-1">
          </template>
        </template>
      </div>
    </div>
    
    <div style="padding: 20px;"></div>
    <router-link :to="'/agency/comment/' + id">
      <div class="footer" @click="endClass">
        <span>下课并写点评</span>
      </div>
    </router-link>
  </div>
</template>

<script>
  import { Tabbar, Cell, Group, Badge, Selector, XButton, XTextarea } from 'vux'

  export default {
    components: {
      Tabbar,
      Cell,
      Group,
      Badge,
      Selector,
      XButton,
      XTextarea
    },
    data() {
      return {
        id: 0,
        preview: 0,
        pageSize: 0,
        totalPage: 5,
        course: {},
        material: {},
        num2CharMap: ['A', 'B', 'C', 'D']
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
          var material = this.$material.formatMaterial(course.material)
          this.material = material
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
      // goToEdit () {
      //   this.$router.push('/agency/edit_material/' + this.id)
      // },
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
      endClass() {
        this.$api.course.classEnd(this.id).then(res => {
          console.log(res)
        })
      }
    }
  }

</script>

<style scoped lang="scss">
  .question {
    color: #323b46;
    font-size: 13px;
    padding: 5px 15px 15px 15px;
  }

  .select-item {
    font-size: 13px;
    margin: 10px 0;
    span {
      font-size: 13px;
    }
  }

  .img-item {
    img {
      width: 80px;
      height: 80px;
    }
  }

  .idea {
    color: #6c7b8a;
    font-size: 13px;
    padding: 0 15px 0 15px;
    img {
      float: right;
      margin-top: 10px;
    }
  }

  .study-page {
    height: 1200px;
  }

  li {
    list-style: none;
  }

  .cl-module {
    position: relative;
    overflow: visible;
  }

  .cl-m-header {
    border-radius: 6px 6px 0 0;
  }

  span {
    font-size: 17px;
    color: #60c9cf;
    margin-top: 5px;
    margin-left: 15px;
  }

  .task-text {
    font-size: 13px;
    color: #323b46;
    margin: 15px 15px 0 15px;
  }

  .method {
    margin-bottom: 15px;
  }

  .finish {
    text-align: center;
    div {
      margin: 50px 0;
      span {
        color: #00cac6;
      }
    }
  }

  hr {
    opacity: 0.3;
    margin: 0 15px 15px 15px;
  }

  .public {
    font-size: 13px;
    margin: 5px 15px 15px 15px;
    color: #323b46;
  }

  strong {
    color: #00a6ac;
  }

  .homework {
    margin-bottom: 60px;
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