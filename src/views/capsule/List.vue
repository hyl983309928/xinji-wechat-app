<template>
  <div class="box">
    <div class="menu-mask" v-if="showGuideTwo" @click="showGuideTwoClick">
      <!--<span class="sceneMask"></span>-->
      <img src="/static/img/capsule/提示3.png" />
    </div>
    <div class="searchBox" v-show="false">
      <div class="search">
        <input type="text" placeholder="输入话题、场景、目标或作者" />
        <div class="searchImgBox">
          <img src="/static/img/capsule/搜索.png"  />
        </div>
      </div>
    </div>
    <div class="select-bar" v-if="labelLoaded">
      <sticky :offset="0" :check-sticky-support="false" class="sticky">
        <tab :line-width="0" :active-color="'#fff'" class="tab" v-if="capsuleScenneLabelList[scenneIndex]">
          <tab-item :class="{'maskItem':false}" :selected="mainIndex === 0" class="tabItemStyle" @click.native="changeMainIndex(0)">{{ capsuleScenneLabelList[scenneIndex].title }}<x-icon class="arrow" :style="ageStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
          <tab-item :selected="mainIndex === 1" class="tabItemStyle" @click.native="changeMainIndex(1)" v-if="hashTable[targetId] || targetId === ''">{{ hashTable[targetId] ? hashTable[targetId].title:'目标' }}<x-icon class="arrow" :style="targetStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
          <tab-item :selected="mainIndex === 2" class="tabItemStyle" @click.native="changeMainIndex(2)" v-if="orderLabelList[orderIndex]">{{ orderLabelList[orderIndex].label }}<x-icon class="arrow" :style="orderStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
          <tab-item v-show="false" :selected="mainIndex === 3" class="tabItemStyle" @click.native="changeMainIndex(3)">筛选<x-icon class="arrow" :style="filterStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
        </tab>
        <div class="age tab-item" v-if="mainIndex === 0">
          <p class="tabItemOption" v-for="(scenne, index) in capsuleScenneLabelList" @click="changeScenneIndex(index, scenne.id)" :class="[scenneIndex===index ? 'age-selected':'']">
            {{ index === 0 ? '全部' : scenne.title }}
          </p>
        </div>
        <div class="tab-item" v-if="mainIndex === 1">
          <tab :line-width="3" :active-color="'#1EB7A8'" class="tabTop">
            <tab-item :selected="targetIndex === index" @click.native="changeTargetIndex(index)" v-for="(target, index) in targetLabelTree">{{ target.title }}</tab-item>
          </tab>
          <div class="allTarget"  @click="allTargetClick" ><button>全部</button></div>
          <div class="target-left">
            <p :class="[targetLeftIndex===Lindex ? 'target-left-selected':'']" v-for="(left, Lindex) in targetLabelTree[targetIndex].childs" @click="changeTargetLeftIndex(Lindex, left.id)">{{ left.title }}</p>
          </div>
          <div class="target-right">
            <p class="tabItemOption" :class="[targetRightIndex===0 ? 'target-right-selected':'']" @click="changeTargetRightIndex(0, targetLeftId)">
              全部
            </p>
            <p class="tabItemOption" :class="[targetRightIndex===Rindex+1 ? 'target-right-selected':'']" v-for="(right, Rindex) in targetLabelTree[targetIndex].childs[targetLeftIndex].childs" @click="changeTargetRightIndex(Rindex+1, right.id)">
              {{ right.title }}
            </p>
          </div>
        </div>
        <div class="age tab-item" v-if="mainIndex === 2">
          <p class="tabItemOption" v-for="(order, index) in orderLabelList" @click="changeOrderIndex(index, order.value)" :class="[orderIndex===index ? 'age-selected':'']">
            <!--<x-icon type="chevron-right" size="12" class="chevron-right" :style="{ visibility: getvisible(orderIndex, index)}"></x-icon>-->
            {{ order.text }}
          </p>
        </div>
        <div class="age tab-item" v-if="mainIndex === 3">
          <p  v-for="(filter, index) in filterLabelList"  :class="[filterIndex===index ? 'age-selected':'']">
            <span>{{ filter.label }}</span><br />
            <button class="filterBtn" v-for="(item, itemIndex) in filter.childs" @click="changeFilterIndex(index, itemIndex, item.value)" :class="{'filterBtnSelect':filterIndex===index && filterChildIndex===itemIndex}">{{ item.text }}</button>
          </p>
        </div>
      </sticky>
    </div>
    <div class="capsuleList" v-if="loaded">
      <div class="listBox" v-for="capsuleItem in capsuleList" @click="action(capsuleItem.id)">
        <div class="exerAlready" v-if="capsuleItem.isExerciseAlready">
          <span>已练习</span>
        </div>
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
              {{ capsuleItem.exerciseAnsNum }}人用过
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
      <p class="emptySugTwo" v-if="capsuleList.length < 20 || showListEnd">更多胶囊即将上架，敬请期待</p>
      <p class="emptySug" v-if="capsuleList.length === 0">更多胶囊即将上架，<br />敬请期待...</p>
      <div class="article-mask" v-if="mainIndex!==-1 && canShowMask" @click="hideSelectBar"></div>
      <div class="article-mask" v-if="showGuideTwo"></div>
    </div>
    <div id="loading" v-if="capsuleList.length >= 20 && !showListEnd">
      <load-more class="loadingBox" :show-loading="loadingText=='正在加载'" :tip="loadingText" background-color="#5be1ed"></load-more>
    </div>
    <x-dialog v-model="showGuideOne" :hide-on-blur="true" @on-hide="hideDialog" :dialog-style="{'overflow': 'visible',width:'70%'}">
      <div class="dialogBox">
        <img class="dialogImg" src="/static/img/capsule/弹窗插画.png" />
        <img @click="closeDialogOne" class="close" src="/static/img/capsule/关闭.png" />
        <p>
        吃、穿、住、用、行…<br />
陪伴，无处不在。<br />
<br />
陪伴胶囊，<br />
帮助你在不同场景下，<br />
轻松营造高质量的陪伴，<br />
引领孩子幸福成长。
        </p>
        <div class="btnBox">
          <x-button type="primary" @click.native="closeDialogOne">立即开始</x-button>
        </div>
      </div>
    </x-dialog>
    <loading :show="showLoading" :text="'加载中'"></loading>
    <div class="maskMask" v-if="showGuideOne"></div>
  </div>
</template>

<script>
import { Search, Sticky, Tab, TabItem, LoadMore, XDialog, Loading, XButton } from 'vux'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
export default {
  components: {
    Search,
    Tab,
    TabItem,
    LoadMore,
    XDialog,
    Sticky,
    Loading,
    XButton
  },
  data () {
    return {
      authorTable: {},
      hashTable: {},
      loadingText: '正在加载',
      clock: '',
      searchValue: '',
      labelLoaded: true,
      mainIndex: -1,
      canShowMask: true,
      rootLabel: [],
      capsuleScenneLabelList: [],
      capsuleScenneParent: 0,
      scenneId: 0,       // 场景ID
      scenneIndex: 0,
      scenneIdAll: [],
      page: 1,
      targetLabelTree: [],
      orderIndex: 2,
      orderValue: 'downtime',
      targetIndex: 0,
      targetLeftIndex: 0,
      targetLeftId: '',
      targetRightIndex: '',
      targetId: '',
      targetValue: '目标',
      targetIdAll: [],
      orderLabelList: [{'text': '好评', 'value': 'praise', 'label': '好评'}, {'text': '热度', 'value': 'hot', 'label': '热度'}, {'text': '上传时间从近到远', 'value': 'downtime', 'label': '最新'}, {'text': '上传时间从远到近', 'value': 'uptime', 'label': '最早'}],
      filterLabelList: [{'label': '价格', 'childs': [{'text': '免费', 'value': 'free'}, {'text': '付费', 'value': 'pay'}]}, {'label': '作者', 'childs': [{'text': '专家', 'value': 'expert'}, {'text': '老师', 'value': 'teacher'}, {'text': '资深爸妈', 'value': 'parent'}]}],
      filterId: '',
      filterIndex: '',
      filterChildIndex: '',
      capsuleList: [],
      showGuideOne: false,
      showGuideTwo: false,
      loadingList: false,
      loaded: false,
      exerAlreadyList: [],
      showLoading: false,
      showListEnd: false,
      scrollY: 0,
      listLength: 20,
      goInfo: false
    }
  },
  computed: {
    ageStyle () {
      return this.mainIndex === 0 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    targetStyle () {
      return this.mainIndex === 1 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    orderStyle () {
      return this.mainIndex === 2 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    filterStyle () {
      return this.mainIndex === 3 ? 'transform: rotate(180deg);fill: #fff;' : ''
    }
  },
  created () {
    var _this = this
    var filter = decodeURIComponent(this.$route.params.filter)
    this.setFilter(filter)
    this.activityAddStatld(1)
    this.showLoading = true
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
          var temp = [{'title': '场景', 'id': 0}]
          temp = temp.concat(labelModule.getLabel(this.capsuleScenneParent).childs)
          this.capsuleScenneLabelList = temp
          this.scenneId = this.capsuleScenneLabelList[this.scenneIndex].id
          this.getAuthorList()
          this.isInPage()
        })
      })
    window.onscroll = function () {
      _this.getMore()
    }
  },
  methods: {
    activityAddStatld (statId, capsuleId, shareUserId) {
      var params = {
        capsuleId: capsuleId,
        statId: statId,
        shareUserId: shareUserId
      }
      api.capsule.addActivityStat(params)
        .then((data) => {
        })
    },
    isInPage () {
      var flag = window.localStorage.getItem('isInPage')
      console.log(flag)
      if (!flag) {
        this.showGuideOne = true
      }
    },
    getExerList () {
      var params = {
        actionType: 'exercise'
      }
      api.capsule.getCapsuleListByAction(params)
        .then((data) => {
          console.log(data)
          this.exerAlreadyList = data.list
          this.getList()
        })
    },
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
          this.getExerList()
        })
    },
    getList () {
      var _this = this
      this.showLoading = true
      this.loadingList = true
      this.showListEnd = false
      var flag = this.goInfo
      var Y = this.scrollY
      this.goInfo = false
      var params = {}
      if (flag) {
        params = {
          offset: 0,
          length: this.listLength,
          labelTarget: this.targetId,
          orderType: this.orderValue
        }
      } else {
        params = {
          offset: (this.page - 1) * 20,
          length: 20,
          labelTarget: this.targetId,
          orderType: this.orderValue
        }
      }
      if (this.scenneId === 0) {
        params.labelScene = ''
      } else {
        params.labelScene = this.scenneId
      }
      api.capsule.filterCapsuleList(params)
        .then((data) => {
          this.saveFilter()
          data.forEach(function (item) {
            item.labelScene_title = []
            item.authorInfo = _this.authorTable[item.authorId]
            item.labelTarget_title = labelModule.getThemeLabel(item.labelTarget).replace(/ \/ /g, '|')
            item.isExerciseAlready = false
            for (var a = 0; a < _this.exerAlreadyList.length; a++) {
              if (_this.exerAlreadyList[a].id === item.id) {
                item.isExerciseAlready = true
                break
              }
            }
            for (var i = 0; i < item.labelScene.length; i++) {
              item.labelScene_title.push(_this.hashTable[item.labelScene[i]].title)
            }
            return item
          })
          if (flag) {
            this.capsuleList = data
            this.$nextTick(function () {
              window.scrollTo(0, Number(Y))
            })
          } else {
            this.capsuleList = this.page === 1 ? data : this.capsuleList.concat(data)
          }
          this.loadingText = data.length === 0 ? '更多胶囊即将上架,敬请期待' : '正在加载'
          if (data.length === 0) {
            this.showListEnd = true
            this.page -= 1
          }
          this.loadingList = false
          this.loaded = true
          this.showLoading = false
        })
    },
    setFilter (filter) {
      filter = JSON.parse(filter)
      if ('targetId' in filter) {
        this.scenneId = filter.scenneId
        this.targetId = filter.targetId
        this.scenneIndex = filter.scenneIndex
        this.targetIndex = filter.targetIndex
        this.targetLeftIndex = filter.targetLeftIndex
        this.targetRightIndex = filter.targetRightIndex
        this.orderIndex = filter.orderIndex
        this.orderValue = filter.orderValue
        this.scrollY = filter.scrollY
        this.goInfo = filter.goInfo
        this.listLength = filter.page * 20
        if (filter.goInfo) {
          this.page = filter.page
        }
        console.log(filter)
        console.log('3：' + this.scrollY)
      }
    },
    saveFilter (goInfo = false) {
      console.log('2：' + this.scrollY)
      var filter = {
        'scenneId': this.scenneId,
        'targetId': this.targetId,
        'scenneIndex': this.scenneIndex,
        'targetIndex': this.targetIndex,
        'targetLeftIndex': this.targetLeftIndex,
        'targetRightIndex': this.targetRightIndex,
        'orderValue': this.orderValue,
        'orderIndex': this.orderIndex,
        'page': this.page,
        'scrollY': this.scrollY,
        'goInfo': goInfo
      }
      console.log(filter)
      this.$router.push('/capsule/list/' + encodeURIComponent(JSON.stringify(filter)))
    },
    changeMainIndex (index) {
      if (this.mainIndex === index) {
        this.mainIndex = -1
        this.resetScroll()
        return
      }
      if (String(this.mainIndex) === '-1') {
        this.setScroll()
      }
      this.canShowMask = true
      this.mainIndex = index
    },
    hideSelectBar () {
      this.canShowMask = false
      this.mainIndex = -1
      this.resetScroll()
    },
    changeScenneIndex (index, id) {
      this.scenneIndex = index
      this.scenneId = id
      this.afterSelect()
      this.getList()
    },
    afterSelect () {
      var _this = this
      this.page = 1
      // setTimeout(function () {
      _this.mainIndex = -1
      this.setScroll()
      this.resetScroll()
      // }, 300)
    },
    getvisible (a, b) {
      if (a === b) {
        return 'visible'
      }
    },
    setScroll () {
      var height = document.getElementsByClassName('searchBox')[0].offsetHeight
      this.scrollYValue = window.scrollY
      document.getElementsByClassName('box')[0].style.position = 'fixed'
      document.getElementsByClassName('searchBox')[0].style.marginTop = this.scrollY >= height ? `-${height}px` : `-${this.scrollY}px`
      document.getElementsByClassName('box')[0].style.width = '100%'
    },
    resetScroll () {
      document.getElementsByClassName('box')[0].style.position = 'initial'
      document.getElementsByClassName('searchBox')[0].style.marginTop = 'initial'
      document.getElementsByClassName('box')[0].style.width = 'initial'
      window.scrollTo(0, Number(this.scrollYValue))
    },
    changeTargetIndex (index) { // 子序列：学习目标
      this.targetIndex = index
      this.targetLeftIndex = 0
      this.targetRightIndex = ''
    },
    changeOrderIndex(index, value) { // 子序列：排序
      this.orderIndex = index
      this.orderValue = value
      this.afterSelect()
      this.getList()
    },
    changeTargetLeftIndex (index, id) { // 学习目标子序列：左
      this.targetLeftIndex = index
      this.targetLeftId = id
      this.targetRightIndex = -1
    },
    changeTargetRightIndex (index, id) { // 学习目标子序列：右
      if (id === '') {
        id = 66
      }
      this.targetRightIndex = index
      this.targetId = id
      this.afterSelect()
      this.getList()
    },
    changeFilterIndex (index, childIndex, id) {
      this.filterIndex = index
      this.filterChildIndex = childIndex
      this.filterId = id
      this.afterSelect()
      this.getList()
    },
    getMore () {
      var _this = this
      var loadEl = document.getElementById('loading')
      if (!loadEl) {
        return
      }
      var nodeTop = loadEl.getBoundingClientRect().top
      if (this.clock) {
        clearTimeout(this.clock)
      }
      this.clock = setTimeout(function () {
        if (_this.loadingList) {
          return
        } else if (window.innerHeight > nodeTop) {
          _this.page++
          _this.getList()
          console.log('加载')
        }
      }, 400)
    },
    action (id) {
      this.scrollY = window.scrollY
      console.log('1：' + this.scrollY)
      this.saveFilter(true)
      this.$router.push('/capsule/info/' + id)
    },
    hideDialog () {
      this.showGuideTwo = true
    },
    showGuideTwoClick () {
      this.showGuideTwo = false
      window.localStorage.setItem('isInPage', 'true')
    },
    clickSearch () {
    },
    closeDialogOne () {
      this.showGuideOne = false
      this.showGuideTwo = true
    },
    allTargetClick () {
      this.targetIndex = 0
      this.targetLeftIndex = 0
      this.targetLeftId = ''
      this.targetRightIndex = ''
      this.targetId = ''
      this.targetValue = '目标'
      this.afterSelect()
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
  .box {
    background: #60c9cf;
    box-sizing: border-box;
    width:100%;
    padding-top: 45px;
    min-height: 100vh;
  }
  .sticky{
    width:100%;
    position: fixed;
    top:0
  }
  .searchBox{
    position: relative;
    box-sizing: border-box;
    padding: 10px 20px;
    height:50px;
    width:100%;
    background: #00a6ac;
    z-index: 500;
    .search{
      height:100%;
      width:100%;
      position: relative;
      display: inline-block;
      input{
        width:100%;
        height:100%;
        box-sizing: border-box;
        background: url(/static/img/capsule/bg2.png) no-repeat;
        background-size: 100% 100%;
        padding-right: 30px;
        padding-left: 10px;
        border: 0px;
      }
      .searchImgBox{
        width:30px;
        height:30px;
        position: absolute;
        right:0;
        top:0;
        box-sizing: border-box;
        padding-top: 5px;
        img{
          height:20px;
        }
      }
    }
  }
  .arrow{
  margin-left: 3px;
  transition: 0.5s;
  fill: #fff;
  color: #fff;
  }
.emptySug {
  background: #60C9CF;
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  padding-top: 150px;
  text-align: center;
  color: #fff;
  font-size: 1.1rem;
}
.emptySugTwo{
  color: #F9F9F9;
  text-align: center;
  padding:10px;
  padding-bottom: 20px;
}
.tabItemStyle{
  background: #00a6ac;
  color: #FFF;
}
/*.vux-1px-r:after {
  content: " ";
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-right: 1px solid #C7C7C7;
  color: #C7C7C7;
  transform-origin: 100% 0;
  transform: scaleX(0.5);
}*/
.tab{
  z-index: 500;
  background: #00a6ac;
  background-size: 100% 150%;
  color: #fff;
}
.tab-item{
  font-size: .9rem;
  position: absolute;
  z-index: 500;
  width: 100%;
  p{
    padding: 10px 10px 10px 20px;
  }
  .tabItemOption{
    border-bottom: 1px solid #e8e8e8;
  }
  .target-left{
    float: left;
    overflow: auto;
    height: 18.4rem;
    background-color: #fff;
    width: 40%;
    .target-left-selected{
      color: #1EB7A8;
      background-color: #f5f5f5;
    }
    p{
      padding-left: 30px;
    }
    p:last-child{
      padding-bottom: 10px;
    }
  }
  .target-right{
    display: inline-block;
    overflow: auto;
    height: 18.4rem;
    background-color: #f5f5f5;
    width: 60%;
    .target-right-selected{
      color: #1EB7A8;
    }
    p{
      padding-left: 30px;
    }
    p:last-child{
      padding-bottom: 10px;
    }
  }
},
.article-mask{
  position: fixed;
  background: rgba(0,0,0,.8);
  z-index: 400;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.age{
  background-color: #fff;
}
.age-selected{
  color: #1EB7A8;
}
.filterBtn {
  background: #FFF;
  border-width: 0px;
  border-radius: 5px;
  border:1px solid #999;
  padding: 5px 20px;
  margin-right: 10px;
}
.filterBtnSelect {
  border:1px solid #FF0000;
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
      top:20%;
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
        font-weight: bold;
      }
      .listTarget{
        font-size: .9rem;
        color: #666;
        margin: 5px 0;
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
.dialogBox{
  padding: 0 20px 10px 20px;
  padding-top: 40%;
  position: relative;
  background: #60c9cf;
  text-align: center;
  .dialogImg{
    z-index: 600;
    position: absolute;
    top: -15%;
    left: 0;
    width:67%;
  }
  .close{
    position: absolute;
    right: -5%;
    top: -5%;
    width:16%;
  }
  p{
    font-family: "microsoft yahei";
    color: #fff;
    font-size: 1.1rem;
  }
  .btnBox{
    width:67%;
    margin: 20px 0;
    margin-left: 16.5%;
    button{
      width:100%;
      background: #ffa800;
      color: #fff;
    }
  }
}
.dialogBoxTwo{
  z-index: 450;
}
.maskItem{
  border: 5px solid #0FCEFF !important;
  border-radius: 40px;
}
.menu-mask{
  position: fixed;
  background: rgba(0,0,0,0);
  z-index: 501;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .sceneMask{
    display: inline-block;
    width:25%;
    box-sizing: border-box;
    height:44px;
    border: 5px solid #F47A00;
    position: absolute;
    top:45px;
    border-radius: 30px;
  }
  img{
    width:70%;
    position: absolute;
    top:0px;
    left: 20px;
  }
}
.loadingBox{
  border: 0px solid #ccc;
  span{
    color: #fff;
  }
}
.allTarget{
  width:20%;
  background: #fff;
  position: fixed;
  right:0;
  top:44px;
  height:44px;
  line-height: 44px;
  box-sizing: border-box;
  flex-grow: 0;
  border-bottom: 1px solid #E8E8E8;
  button{
    width:40px;
    margin-right: 5px;
    margin-left: 10px;
    color: #666;
    background: #fff;
    border: 1px solid #666;
    box-sizing: content-box;
    font-size: 14px;
    padding: 2px 5px;
    border-radius: 10px;
  }
  button:active{
    background: #666;
  }
}
.tabTop{
  width:80%;
}
.maskMask{
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,.6);
  z-index: 600;
}
</style>
