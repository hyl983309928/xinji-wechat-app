<template>
  <div class="page">
    <div class="itemBox">
      <div class="title">
        <div class="headImg">
          <img :src="info.headimgurl" />
        </div>
        <div class="info">
          <p>
            我在心迹践行高质量陪伴
          </p>
          <div>
            <p>第<span>{{info.continueNum}}</span>天</p>
            <div>
              <span>
                超越{{info.rate}}%的用户
              </span><br/>
              <span>
                等级V{{info.level}}
              </span>
            </div>
            <div class="particular" @click="goto('/newCapsule/guideShareBack/' + encodeURIComponent(JSON.stringify(info)))">详情</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="imgBox">
          <div class="targetBox" v-if="capsuleInfo.labelTarget_title">
            <span>{{capsuleInfo.labelTarget_title[1]}}</span>
            <span>{{capsuleInfo.labelTarget_title[2]}}</span>
          </div>
          <img :src="capsuleInfo.cover" />
          <!--<img class="isExer" v-if="capsuleInfo.isExerciseAlready" src="/static/img/newCapsule/isdaka@3x.png" />-->
        </div>
        <div class="infoBox">
          <p>
            <span>目标：</span>{{capsuleInfo.description}}
          </p>
          <button @click="goto('/newCapsule/list/')">查看更多游戏</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import common from 'src/common'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import StatModel from 'lanmaLib/modules/statistics'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      userId: 0,
      info: {},
      capsuleId: 0,
      hashTable: {},
      capsuleInfo: {}
    }
  },
  computed: {
  },
  created () {
    StatModel.activityAddStat(45)
    this.userId = common.getShareParamter('source')
    this.info = JSON.parse(common.getShareParamter('info'))
    this.info.userId = this.userId
    this.getLabelList()
    var capsuleId = parseInt(this.$route.params.id)
    if (isNaN(capsuleId) || capsuleId < 0) {
      capsuleId = 0
    }
    this.capsuleId = capsuleId
    this.$axios.all([this.getLabelList()])
      .then(() => {
        this.getCapsuleInfo()
      })
  },
  mounted () {
  },
  methods: {
    goto(url) {
      this.$router.push(url)
    },
    getLabelList () {
      return labelModule.getLabelList()
        .then((labelList) => {
          this.hashTable = labelModule.getHashTable(labelList)
        })
    },
    getCapsuleInfo () {
      api.capsule.getCapsule(this.capsuleId)
        .then((data) => {
          data.labelScene_title = []
          data.labelAge_title = []
          data.labelTarget_title = labelModule.getThemeLabel(data.labelTarget).replace(/ \/ /g, '|').split('|')
          data.guide = this.hashTable[data.labelTarget].guide
          data.description = this.hashTable[data.labelTarget].description
          for (var i = 0; i < data.labelScene.length; i++) {
            data.labelScene_title.push(this.hashTable[data.labelScene[i]].title)
          }
          this.capsuleInfo = data
        })
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .page{
    width:100%;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #549EFF;
    background: url("/static/img/newCapsule/bg.png") #549EFF no-repeat;
    background-size: 100% 100%;
    padding: (25rem/16) (25rem/16) (0rem/16) (25rem/16);
  }
  .itemBox{
    width:100%;
    display: inline-block;
    .title{
      white-space: normal;
      min-height:15vh;
      box-sizing: border-box;
      background: #fff;
      padding-left: (70rem/16);
      border-radius: (10rem/16);
      margin-bottom: (20rem/16);
      position: relative;
      .headImg{
        position: absolute;
        top: (-20rem/16);
        left:(-20rem/16);
        width:(80rem/16);
        height:(80rem/16);
        img{
          border-radius: 50% 50%;
          width:100%;
        }
      }
      .info{
        &>p{
          color: #999;
          font-size: (14rem/16);
          padding: (10rem/16) 0;
        }
        &>div{
          &>p{
            display: inline-block;
            color: #999;
            font-size: (25rem/16);
            span{
              color: #6867F0;
              font-size: (35rem/16);
            }
          }
          &>div{
            display: inline-block;
            color: #999;
            font-size: (14rem/16);
          }
          .particular{
            color: #000;
            font-size: (18rem/16);
            vertical-align: top;
          }
        }
      }
    }

    .card{
      min-height:70vh;
      background: #fff;
      border-radius: (10rem/16);
      .imgBox{
        height:80%;
        position: relative;
        width:100%;
        img{
          width:100%;
          height:55vh;
        }
        .isExer{
          width:(70rem/16);
          position: absolute;
          top: 2%;
          right: 2%;
          height:auto;
        }
        .targetBox{
          position: absolute;
          left: 5%;
          top:5%;
          width:(100rem/16);
          span{
            display: block;
            &:first-child{
              color: #000;
              font-size: (20rem/16);
              line-height: 1.1;
            }
            &:last-child{
              color: #999;
              font-size: (14rem/16);
            }
          }
        }
      }

      .infoBox{
        white-space: normal;
        padding: (5rem/16) (15rem/16);
        text-align: center;
        p{
          text-align: left;
          font-size: (14rem/16);
          color: #3C3C3C;
          span{
            font-weight: bold;
            color: #000;
          }
        }
        button{
          width:50%;
          height:(40rem/16);
          margin-top: (10rem/16);
          margin-bottom: (10rem/16);
          border-radius: (25rem/16);
          background: #6665FE;
          border: 0;
          color: #fff;
          font-size: (18rem/16);
        }
      }
    }
  }
</style>
