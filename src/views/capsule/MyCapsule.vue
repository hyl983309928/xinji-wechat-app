<template>
  <div class="myCapsule">
    <div class="tabBox">
      <tab :line-width="2" class="tab" v-model="index" :active-color="'#fff'" :bar-active-color="'#fff'" :defaultColor="'#fff'" :custom-bar-width="'40px'" >
        <tab-item class="tabItemStyle" :selected="tabItemSelect === 'exercise'"  @click.native="tabItemAction('exercise')" key="exercise">练习</tab-item>
        <tab-item class="tabItemStyle" :selected="tabItemSelect === 'praise'" @click.native="tabItemAction('praise')" key="praise">赞</tab-item>
      </tab>
    </div>
    <div class="capsuleList" v-if="loaded">
      <div class="listBox" v-for="capsuleItem in capsuleList" @click="action(capsuleItem.id)">
        <div class="listTop">
          <h4 class="listTitle">{{ capsuleItem.topic }}</h4>
          <div class="listTarget">
            {{ capsuleItem.labelTarget_title }}
          </div>
          <div>
            <span class="listPraiseNum">
              <img src="/static/img/capsule/点赞2.png" />{{ capsuleItem.praiseNum }}个赞
            </span>
            <span class="listExerNum">
              <img src="/static/img/capsule/人数.png" />
              {{ capsuleItem.exerciseNum }}人用过
            </span>
            <span class="listPrice">限时免费</span>
          </div>
        </div>
        <div class="listInfo">
          <div class="authorImg" v-if="capsuleItem.authorInfo">
            <img class="headImg" :src="capsuleItem.authorInfo.headImgUrl" />
            <img class="vImg" :src="capsuleItem.authorInfo.authorType !== 3?'/static/img/capsule/黄v.png':'/static/img/capsule/蓝v.png'">
          </div>
          <div class="listAuthorBox" v-if="capsuleItem.authorInfo">
            <div class="listAuthor">
              <span class="listAuthorName">{{ capsuleItem.authorInfo.author }}</span><span class="listAuthorTime">上传于{{ capsuleItem.updated_at }}</span>
            </div>
            <span class="listAuthorIdentity">{{ capsuleItem.authorInfo.identity }}</span>
          </div>
        </div>
      </div>
      <p class="emptySug" v-if="capsuleList.length === 0">{{ tabItemSelect === 'exercise'?'你和宝宝还没练习过任何胶囊呢。':'你还没有赞过任何胶囊呢。' }}<br /><a v-if="tabItemSelect === 'exercise'" @click="goto('/capsule/list/{}')">去试试 ></a></p>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
export default{
  components: {
    Tab,
    TabItem
  },
  directives: {
  },
  data () {
    return {
      tabItemSelect: 'exercise',
      capsuleList: [],
      index: 0,
      rootLabel: [],
      capsuleScenneParent: [],
      targetLabelTree: [],
      hashTable: [],
      capsuleScenneLabelList: [],
      authorTable: [],
      loaded: false,
      page: 1
    }
  },
  computed: {
  },
  created () {
    api.label.getRootLabel()
      .then((data) => {
        this.rootLabel = data.list
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].code === 'capsuleScenne') {
            this.capsuleScenneParent = data.list[i].id
          }
        }
        labelModule.getLabelList().then((labelList) => {
          this.targetLabelTree = labelModule.getTargetTreee()
          this.hashTable = labelModule.getHashTable(labelList)
          var temp = labelModule.getLabel(this.capsuleScenneParent).childs
          temp.unshift({'title': '全部', 'id': 0})
          this.capsuleScenneLabelList = temp
          this.getAuthorList()
        })
      })
  },
  mounted () {
  },
  methods: {
    getAuthorList () {
      var authorParams = {
        offset: 0,
        length: 0,
        authorType: 0,
        authorTypeList: [0, 1, 2]
      }
      api.capsule.getCertificaList(authorParams)
        .then((data) => {
          var temp = {}
          data.list.forEach(function (item) {
            temp[item.id] = item
          })
          this.authorTable = temp
          this.getList()
        })
    },
    getList () {
      var _this = this
      var params = {
        actionType: this.tabItemSelect
      }
      api.capsule.getCapsuleListByAction(params)
        .then((data) => {
          console.log(data)
          data.list.forEach(function (item) {
            item.labelScene_title = []
            item.authorInfo = _this.authorTable[item.authorId]
            item.labelTarget_title = labelModule.getThemeLabel(item.labelTarget).replace(/ \/ /g, '|')
            for (var i = 0; i < item.labelScene.length; i++) {
              item.labelScene_title.push(_this.hashTable[item.labelScene[i]].title)
            }
            return item
          })
          this.capsuleList = data.list
          this.loaded = true
        })
    },
    tabItemAction (key) {
      if (key === this.tabItemSelect) {
        return
      }
      switch (key) {
        case 'exercise':
          this.tabItemSelect = 'exercise'
          this.getList()
          this.resetScoll()
          break
        case 'praise':
          this.tabItemSelect = 'praise'
          this.getList()
          this.resetScoll()
          break
        default:
          break
      }
    },
    resetScoll () {
      window.scrollTo(0, 0)
    },
    action (capsuleId) {
      this.$router.push('/capsule/info/' + capsuleId)
    },
    goto (url) {
      this.$router.push(url)
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.myCapsule{
  width:100%;
  box-sizing: border-box;
  padding-top: 50px;
  background: #60c9cf;
  min-height: 100vh;
  .tabBox{
    width:100%;
    background: #00a6ac;
    position: fixed;
    top: 0;
    z-index: 600;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.2);
  }
  .tab{
    width:60%;
    margin-left: 20%;
    background: #00a6ac;
    div{
      color:#fff;
    }
  }
}
.tabItemStyle{
  background: #00a6ac;
  color: #FFF;
}
.capsuleList {
  padding: 10px;
  width:100%;
  box-sizing: border-box;
  .loadMore{
    font-size: 16px;
    text-align: center;
  }
  .listBox{
    font-family: ﻿"microsoft yahei";
    width:100%;
    box-sizing: border-box;
    background: url(/static/img/capsule/bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 10px 20px;
    margin-bottom: 10px;
    position: relative;
    .exerAlready{
      position: absolute;
      right: 0;
      top:13%;
      background: url(/static/img/capsule/已练习.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      width:20%;
      span{
        display: inline-block;
        padding: 5px 0;
        font-size: .85rem;
        color: #FFF;
        font-weight: bold;
      }
    }
    .listTop{
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
      .listTitle{
        color: #087076;
        font-size: 1rem;
        font-family: ﻿'PingFangSC-Medium';
        font-weight: normal;
      }
      .listTarget{
        font-size: .9rem;
        color: #666;
        margin-bottom: 5px;
      }
      div{
        font-size: .8rem;
        .listPraiseNum{
          display: inline-block;
          margin-right: 30px;
          color: #999;
          img{
            vertical-align: text-top;
            height:.8rem;
            margin-right: 5px;
          }
        }
        .listExerNum{
          display: inline-block;
          color: #999;
          img{
            vertical-align: text-top;
            height:.8rem;
          }
        }
        .listPrice{
          float: right;
          color: #ffa800;
          font-size: .7rem;
          font-weight: bold;
        }
      }
    }
    .listInfo{
      padding-top: 10px;
      .authorImg{
        display: inline-block;
        width:40px;
        height:40px;
        position: relative;
        border-radius: 50%;
        vertical-align: top;
        .headImg{
          width:100%;
          border-radius: 50%;
          vertical-align: top;
          margin-top: 5px;
        }
        .vImg{
          width:40%;
          position: absolute;
          right:-3px;
          bottom: -10px;
        }
      }
      .listAuthorBox{
        margin-left: 5px;
        display: inline-block;
        .listAuthor{
          .listAuthorName{
            font-weight: normal;
            font-size: .9rem;
          }
          .listAuthorTime{
            font-size: .7rem;
            color: #999999;
            margin-left: 5px;
          }
        }
        .listAuthorIdentity{
          color: #666;
          font-size: .8rem;
        }
      }
    }
  }
}
.emptySug {
  background: #60C9CF;
  color: #fff;
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  padding-top: 150px;
  text-align: center;
  font-size: 1.1rem;
  a{
    text-decoration: underline;
  }
}
.emptySugTwo{
  padding: 10px;
  padding-bottom: 20px;
  color: #F9F9F9;
  text-align: center; 
}
</style>