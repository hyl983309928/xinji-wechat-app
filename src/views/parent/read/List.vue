<template>
  <div class="study-page">
    <div class="top">
      <img src="/static/img/reader_banner.png" class="reader-cover-img">
      <div class="mask"></div>
      <div class="top-plan">
        <h3>懒妈·共读计划</h3>
        <p>为了帮助各位爸妈更全面、深入的认识孩子，从而给孩子提供更好的陪伴和教育，懒妈为大家精心准备了以下共读文章，供大家免费学习。</p>
      </div>
    </div>

    <div class="select-bar" v-if="labelLoaded">
      <sticky :offset="0" :check-sticky-support="false">
        <tab :line-width="0" :active-color="'#1EB7A8'" class="tab">
          <tab-item :selected="mainIndex === 0" class="vux-1px-r" @click.native="changeMainIndex(0)">{{ ageLabelList[ageIndex].value }}<x-icon class="arrow" :style="ageStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
          <tab-item :selected="mainIndex === 1" class="vux-1px-r" @click.native="changeMainIndex(1)">学习目标<x-icon class="arrow" :style="targetStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
          <tab-item :selected="mainIndex === 2" @click.native="changeMainIndex(2)">排序<x-icon class="arrow" :style="orderStyle" type="arrow-down-b" size="12"></x-icon></tab-item>
        </tab>
        <div class="age tab-item" v-if="mainIndex === 0">
          <p v-for="(age, index) in ageLabelList" @click="changeAgeIndex(index, age.id)" :class="[ageIndex===index ? 'age-selected':'']">
            <x-icon type="chevron-right" size="12" class="chevron-right" :style="{ visibility: getvisible(ageIndex, index)}"></x-icon>
            {{ age.title }}
          </p>
        </div>
        <div class="tab-item" v-if="mainIndex === 1">
          <tab :line-width="2" :active-color="'#1EB7A8'">
            <tab-item :selected="targetIndex === index" @click.native="changeTargetIndex(index)" v-for="(target, index) in targetLabelTree">{{ target.title }}</tab-item>
          </tab>
          <div class="target-left">
            <p :class="[targetLeftIndex===Lindex ? 'target-left-selected':'']" v-for="(left, Lindex) in targetLabelTree[targetIndex].childs" @click="changeTargetLeftIndex(Lindex, left.id)">{{ left.title }}</p>
          </div>
          <div class="target-right">
            <p :class="[targetRightIndex===0 ? 'target-right-selected':'']" @click="changeTargetRightIndex(0, targetLeftId)">
              <x-icon type="chevron-right" size="12" class="chevron-right" :style="{ visibility: getvisible(targetRightIndex, 0)}"></x-icon>
              全部
            </p>
            <p :class="[targetRightIndex===Rindex+1 ? 'target-right-selected':'']" v-for="(right, Rindex) in targetLabelTree[targetIndex].childs[targetLeftIndex].childs" @click="changeTargetRightIndex(Rindex+1, right.id)">
              <x-icon type="chevron-right" size="12" class="chevron-right" :style="{ visibility: getvisible(targetRightIndex, Rindex+1)}"></x-icon>
              {{ right.title }}
            </p>
          </div>
        </div>
        <div class="age tab-item" v-if="mainIndex === 2">
          <p v-for="(order, index) in orderLabelList" @click="changeOrderIndex(index, order.value)" :class="[orderIndex===index ? 'age-selected':'']">
            <x-icon type="chevron-right" size="12" class="chevron-right" :style="{ visibility: getvisible(orderIndex, index)}"></x-icon>
            {{ order.text }}
          </p>
        </div>
      </sticky>
    </div>

    <div class="read-list" v-if="loaded">
      <ReaderItem v-for="reader in list" :detail="reader" :needPadding="true" :needShowPublishTime="true" @click="">
      </ReaderItem>
      <p class="emptySug" v-if="list.length === 0">暂无相应的文章</p>
      <div class="article-mask" v-if="mainIndex!==-1 && canShowMask" @click="hideSelectBar"></div>
    </div>

    <div id="loading" v-if="list.length >= 20">
      <load-more :show-loading="loadingText=='正在加载'" :tip="loadingText" background-color="#fbf9fe"></load-more>
    </div>
  </div>
</template>

<script>
import { Cell, Group, LoadMore, Sticky, Tab, TabItem, Flexbox, FlexboxItem, Swiper, SwiperItem } from 'vux'
import ReaderItem from 'components/ReaderItem'

import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'

export default {
  components: {
    Cell,
    Group,
    LoadMore,
    Sticky,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    Swiper,
    SwiperItem,
    ReaderItem
  },
  data () {
    return {
      loaded: false,
      labelLoaded: false,
      loadingText: '正在加载',
      page: 1,
      mainIndex: -1,
      ageIndex: 0,
      ageId: '',
      orderIndex: 1,
      orderValue: 'downtime',
      targetIndex: 0,
      targetLeftIndex: 0,
      targetLeftId: '',
      targetRightIndex: '',
      targetId: '',
      ageLabelList: [],
      targetLabelTree: [],
      orderLabelList: [{'text': '最热', 'value': 'click'}, {'text': '时间（顺序）', 'value': 'downtime'}, {'text': '时间（倒序）', 'value': 'uptime'}],
      canShowMask: true,
      clock: '',
      loadingList: false,
      list: []
    }
  },
  computed: {
    ageStyle () {
      return this.mainIndex === 0 ? 'transform: rotate(180deg);fill: #1EB7A8;' : ''
    },
    targetStyle () {
      return this.mainIndex === 1 ? 'transform: rotate(180deg);fill: #1EB7A8;' : ''
    },
    orderStyle () {
      return this.mainIndex === 2 ? 'transform: rotate(180deg);fill: #1EB7A8;' : ''
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.initData()
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      var _this = this
      var filter = decodeURIComponent(this.$route.params.filter)
      this.setFilter(filter)
      labelModule.getLabelList().then((list) => {
        this.targetLabelTree = labelModule.getTargetTreee()
        this.ageLabelList = labelModule.getAgeLabel()
        this.ageLabelList = this.ageLabelList.map(item => {
          item.value = item.title
          return item
        })
        this.ageLabelList.unshift({'title': '全部年龄段', 'value': '年龄', 'id': ''})
        this.labelTree = labelModule.getLabelTree(list)
        this.getList()
        this.labelLoaded = true
        window.onscroll = function () {
          _this.getMore()
        }
      })
    },
    initData () {
      this.loaded = false
      this.labelLoaded = false
      this.loadingText = '正在加载'
      this.page = 1
      this.canShowMask = true
      this.clock = ''
      this.loadingList = false
    },
    setFilter (filter) {
      filter = JSON.parse(filter)
      if ('targetId' in filter) {
        this.ageId = filter.ageId
        this.targetId = filter.targetId
        this.ageIndex = filter.ageIndex
        this.targetIndex = filter.targetIndex
        this.targetLeftIndex = filter.targetLeftIndex
        this.targetRightIndex = filter.targetRightIndex
        this.orderIndex = filter.orderIndex
        this.orderValue = filter.orderValue
      }
    },
    saveFilter () {
      var filter = {
        'ageId': this.ageId,
        'targetId': this.targetId,
        'ageIndex': this.ageIndex,
        'targetIndex': this.targetIndex,
        'targetLeftIndex': this.targetLeftIndex,
        'targetRightIndex': this.targetRightIndex,
        'orderValue': this.orderValue,
        'orderIndex': this.orderIndex
      }
      this.$router.push('/parent/reader/list/' + encodeURIComponent(JSON.stringify(filter)))
    },
    changeMainIndex (index) { // 主序列：年龄、学习目标、排序
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
    changeAgeIndex(index, id) { // 子序列：年龄
      this.ageIndex = index
      this.ageId = id
      this.afterSelect()
      this.getList()
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
      this.targetRightIndex = index
      this.targetId = id
      this.afterSelect()
      this.getList()
    },
    afterSelect () {
      var _this = this
      this.page = 1
      // setTimeout(function () {
      _this.mainIndex = -1
      this.resetScroll()
      // }, 300)
    },
    getvisible (a, b) {
      if (a === b) {
        return 'visible'
      }
    },
    hideSelectBar () {
      this.canShowMask = false
      this.mainIndex = -1
      this.resetScroll()
    },
    setScroll () {
      var height = document.getElementsByClassName('top')[0].offsetHeight
      this.scrollY = window.scrollY
      document.getElementsByClassName('study-page')[0].style.position = 'fixed'
      document.getElementsByClassName('top')[0].style.marginTop = this.scrollY >= height ? `-${height}px` : `-${this.scrollY}px`
      document.getElementsByClassName('study-page')[0].style.width = '100%'
    },
    resetScroll () {
      document.getElementsByClassName('study-page')[0].style.position = 'initial'
      document.getElementsByClassName('top')[0].style.marginTop = 'initial'
      document.getElementsByClassName('study-page')[0].style.width = 'initial'
      window.scrollTo(0, Number(this.scrollY))
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
        }
      }, 400)
    },
    getList () {
      this.loadingList = true
      var labelArr = []
      if (this.ageId !== '') {
        labelArr.push(this.ageId)
      }
      if (this.targetId !== '') {
        labelArr.push(this.targetId)
      }
      var params = {
        'sortType': this.orderValue,
        'labels': labelArr,
        'offset': (this.page - 1) * 20,
        'length': 20
      }
      api.reader.getList(params).then((data) => {
        this.saveFilter()
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var reader = list[i]
          reader.link = '/parent/reader/detail/' + reader.id
          reader.theme_title = this.$label.getReaderThemeLabel(reader.labels.slice(1))
          reader.age_title = reader.labels[0].map(item => {
            return this.$label.getLabel(item).title
          }).join('·')
          try {
            reader.publishedTime = reader.publishedTime.split(' ')[0]
          } catch (e) {
            reader.publishedTime = ''
          }
        }
        this.list = this.page === 1 ? list : this.list.concat(list)
        this.loadingText = list.length === 0 ? '没有更多文章' : '正在加载'
        this.loaded = true
        this.loadingList = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(50, 59, 70, 0.1);
}
.top{
  position: relative;
  z-index: 500;
  color: #fff;
  img{
    display: block;
    width: 100%;
  }
  .top-plan{
    position: absolute;
    font-size: 12px;
    top: 0;
    left: 0;
    margin: 1rem;
  }
  h3{
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    color: #FFF35D;
  }
  p{
    font-size: 0.8rem;
  }
}
.hasborder{
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.arrow{
  margin-left: 3px;
  transition: 0.5s;
  fill: #9B9B9B;
}
.emptySug {
  line-height: 40px;
  text-align: center;
}
.vux-1px-r{
  position: relative;
}
.vux-1px-r:after {
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
}
.tab{
  z-index: 500;
}
.tab-item{
  font-size: 14px;
  position: absolute;
  z-index: 500;
  width: 100%;
  p{
    padding: 10px 10px 10px 20px;
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
}
.read-list{
  background-color: #fff;
}
.chevron-right{
  visibility: hidden;
  fill: #1EB7A8;
}
.age{
  background-color: #fff;
}
.age-selected{
  color: #1EB7A8;
}
.article-mask{
  position: fixed;
  background: rgba(0,0,0,.6);
  z-index: 400;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
::-webkit-scrollbar{
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-thumb:vertical {
  background-color: #a6a6a6;
  border-radius: 3px;
}
::-webkit-scrollbar-track-piece:vertical:decrement,
::-webkit-scrollbar-track-piece:vertical:increment {
  background-color: rgba(166, 166, 166, 0.5);
}
</style>
