<template>
  <div class="studyPage" v-if="loaded">
    <div @click="stickyIndex = 0;resetScroll()" class="swiperMark" v-if="stickyIndex != 0"></div>
    <swiper :list="imgList" v-model="swiperIndex" @on-click-list-item="clickImg" :dots-position="'center'" :aspect-ratio="6/16" :auto="true" :loop="true" :interval="3000" :dots-class="'swiper'"></swiper>
    <div class="screenBox">
      <div style="height:42px;">
      <Sticky :check-sticky-support="false">
        <div class="tab">
          <span @click="countSticky(1)">{{select.type==0?'类型':selectMap.type[select.type]}}<img src="/static/img/course/down.png" class="arrow" :style="oneStyle" /></span>
          <span @click="countSticky(2)">{{select.site==''?'区域':select.site}}<img src="/static/img/course/down.png" class="arrow" :style="twoStyle" /></span>
          <span @click="countSticky(3)">{{selectMap.time.month?parseInt(selectMap.time.month)+'月'+selectMap.time.day+'日':'时间'}}<img src="/static/img/course/down.png" class="arrow" :style="threeStyle" /></span>
          <span @click="countSticky(4)">{{select.target==0?'目标':hashTable[select.target].title}}<img src="/static/img/course/down.png" class="arrow" :style="fourStyle" /></span>
          <span @click="countSticky(5)">{{selectOrderMap[select.order]}}<img src="/static/img/course/down.png" class="arrow" :style="fiveStyle" /></span>
        </div>
        <div class="tabInfoBox">
          <div class="tabItem" v-if="stickyIndex==1">
            <p :class="{'blueFont':select.type == 0}" @click="changeSelect(0, 'type')">全部</p>
            <p :class="{'blueFont':select.type == key, 'disabled':!GoodsCount.typeCountObj[key]}" v-for="value,key in selectMap.type" @click="changeSelect(key, 'type', !GoodsCount.typeCountObj[key])">{{value}}</p>
          </div>
          <div class="tabItem siteItem" v-if="stickyIndex==2">
            <p :class="{'blueFont':select.site == ''}" @click="changeSelect('', 'site')"><span>全部</span></p>
            <template v-for="item,index in selectMap.site">
              <p class="siteCityBox" :class="{'blueFont':select.site == item.city}">
                <span class="siteCity" @click="changeSelect(item.city, 'site')">{{item.city}}</span>
                <span class="siteChild" v-if="item.list.length !== 0">
                  <span @click="changeSelect(childItem, 'site')" :class="{'blueBg':select.site == childItem}" v-for="childItem in item.list">{{childItem}}</span>
                </span>
              </p>
            </template>
            <div>其他省市和地区的课程即将上架，敬请期待！</div>
          </div>
          <div class="tabItem targetItem" v-if="stickyIndex==4">
            <p :class="{'blueFont':select.target == 0}" @click="changeSelect(0, 'target')">全部</p>
            <p :class="{'blueFont':select.target == item.id, 'disabled':!GoodsCount.targetCountList[index]}" v-for="item,index in selectMap.target" @click="changeSelect(item.id, 'target', !GoodsCount.targetCountList[index])">{{item.title}}</p>
          </div>
          <div class="tabItem orderItem" v-if="stickyIndex==5">
            <template v-for="item in selectMap.order">
              <p>
                <label>
                  {{item.title}}
                </label>
                <span :class="{'blueBg':select.order == key}" v-for="value,key in item.list" @click="changeSelect(key, 'order')">
                  {{value}}
                </span>
              </p>
            </template>
          </div>
          <div class="tabItem" v-if="stickyIndex==3">
            <DatePick :date="select.time" @select="datePickSelect" :courseNum="courseNum"></DatePick>
          </div>
        </div>
      </Sticky>
      </div>
    </div>
    <div class="courseInfoList">
      <div class="listBox" v-if="list.length > 0">
        <!--<SaleItem v-for="goods in list" :goods="goods">-->
        <!--</SaleItem>-->
        <CourseSaleItem v-for="goods in list" :goods="goods"></CourseSaleItem>
        <div class="intro">
          <p>更多精彩课程正在准备中。</p>
          <p>敬请期待...</p>
        </div>
      </div>
      <div v-if="list.length === 0">
        <div class="img-wrap">
          <img src="/static/img/course/noCourse.png" alt="">
        </div>
        <div class="text-wrap">
          <p>暂时没有找到合适的课程。</p>
          <p>课程持续更新ing，</p>
          <p>请保持关注：）</p>
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
  Actionsheet,
  Swiper,
  Sticky
} from 'vux'
import SaleItem from 'components/SaleItem'
import CourseSaleItem from 'components/course/CourseSaleItem'
import DatePick from 'components/DatePick'
import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'
import ImgModel from 'lanmaLib/imgSize'
import StatModel from 'lanmaLib/modules/statistics'
export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Actionsheet,
    SaleItem,
    CourseSaleItem,
    Swiper,
    Sticky,
    DatePick
  },
  data () {
    return {
      stickyIndex: 0,
      select: {
        type: 0,
        site: '',
        time: '',
        target: 0,
        order: 'upTime'
      },
      selectOrderMap: {
        'upTime': '距离↑',
        'downTime': '距离↓',
        'upPrice': '价格↑',
        'downPrice': '价格↓'
      },
      selectMap: {
        type: {
          1: '体验坊',
          2: '课程组合',
          3: '游学营'
        },
        site: [],
        time: {
        },
        target: {
        },
        order: [
          {
            title: '开课时间',
            list: {
              'upTime': '近—>远',
              'downTime': '远—>近'
            }
          },
          {
            title: '课程价格',
            list: {
              'upPrice': '低—>高',
              'downPrice': '高—>低'
            }
          }
        ]
      },
      swiperIndex: 0,
      imgList: [
        {url: 'javascript:', img: 'https://static.vux.li/demo/1.jpg'},
        {url: 'javascript:', img: 'https://static.vux.li/demo/2.jpg'}
      ],
      loaded: false,
      labelTree: {},
      filter: {},
      list: [],
      signInfo: {},
      menus: {},
      subMenus: {},
      menuId: 0,
      subMenuId: 0,
      showMenu: false,
      showSubMenu: false,
      errorStatusMap: ['立即报名', '已开课，停止报名', '已满员，停止报名'],
      hashTable: {},
      courseNum: {},
      GoodsCount: {
        targetCountList: [],
        typeCountObj: []
      }
    }
  },
  created () {
    var filterStr = this.$route.params.filter
    this.filter = JSON.parse(filterStr)
    labelModule.getLabelList().then((list) => {
      this.labelTree = labelModule.getLabelTree(list)
      this.hashTable = labelModule.getHashTable(list)
      this.selectMap.target = this.hashTable[1].childs
      console.log(this.hashTable)
      this.$axios.all([this.getAllCourseSite(), this.getAllCourseTime(), this.getGoodsCount(), this.getGoodsAdList()])
        .then(() => {
          this.getList()
        })
    })
  },
  mounted () {
  },
  computed: {
    oneStyle () {
      return this.stickyIndex === 1 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    twoStyle () {
      return this.stickyIndex === 2 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    threeStyle () {
      return this.stickyIndex === 3 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    fourStyle () {
      return this.stickyIndex === 4 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    fiveStyle () {
      return this.stickyIndex === 5 ? 'transform: rotate(180deg);fill: #fff;' : ''
    },
    params () {
      var params = {
        offset: 0,
        length: 0,
        sortby: this.select.order,
        goodsType: this.select.type,
        site: this.select.site,
        time: this.select.time,
        target: this.select.target
      }
      return params
    }
  },
  methods: {
    countSmallUrl: ImgModel.countSmallUrl,
    getList () {
      api.course.filterGoodsList(this.params).then((data) => {
        var list = data.list.map(item => {
          if (item.goodsType === 1) {
            item.labelTheme_title = labelModule.getThemeLabel(item.labelTheme)
            item.labelAge_title = this.hashTable[item.labelAge].title
            item.labelTarget_title = this.hashTable[item.labelTarget].title
            var siteMap = item.lesson_site.split('-')
            item.site_title = siteMap[1].replace(/市/, '') + '-' + siteMap[2].replace(/县|区/, '')
          } else if (item.goodsType === 3) {
            var temp = []
            if (item.labelThemes) {
              for (let i = 0; i < item.labelThemes.length; i++) {
                var themeItem = item.labelThemes[i]
                temp.push(this.hashTable[themeItem].title)
              }
              item.labelTheme_title = temp.join('、')
            } else {
              item.labelTheme_title = ''
            }
            item.labelAge_title = this.hashTable[item.labelAge].title
            item.labelTarget_title = this.hashTable[item.labelTarget].title
            item.site_title = item.lesson_location
          } else {
            item.labelTheme_title = ''
            item.labelAge_title = this.hashTable[item.labelAge].title
            item.labelTarget_title = this.hashTable[item.labelTarget].title
            item.site_title = item.location
          }
          var a = item.lesson_time.split(/[^0-9]/)
          item.time = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
          item.price = item.channelPrice
          return item
        })
        this.list = list
        this.loaded = true
      })
    },
    getAllCourseSite () {
      return this.$api.course.getAllCourseSite()
        .then((data) => {
          this.selectMap.site = data
        })
    },
    getGoodsAdList () {
      return this.$api.course.getGoodsAdList()
        .then((data) => {
          var imgList = []
          var params = {
            ids: []
          }
          for (let i = 0; i < data.length; i++) {
            let temp = {}
            temp.url = 'javascript:'
            temp.img = this.countSmallUrl(data[i].cover, 'x3')
            temp.link = data[i].link
            temp.id = data[i].id
            imgList.push(temp)
            params.ids.push(data[i].id)
          }
          this.imgList = imgList
          this.$api.course.addShowCount(params)
        })
    },
    getGoodsCount () {
      return this.$api.course.getGoodsCount()
        .then((data) => {
          this.GoodsCount = data
        })
    },
    getAllCourseTime () {
      return this.$api.course.getAllCourseTime()
        .then((data) => {
          this.courseNum = data
        })
    },
    backCourseSite (channelName, location) {
      var temp
      if (!channelName) {
        return location
      }
      try {
        temp = '心迹家庭成长社·' + channelName + '校区（' + location + '）'
      } catch (e) {
        temp = location
        console.log(e)
      }
      return temp
    },
    setScroll () {
      var swiperH = document.documentElement.clientWidth * 3 / 8
      var scrollTop = document.body.scrollTop
      var bodyH = document.documentElement.clientHeight
      var courseEl = document.getElementsByClassName('courseInfoList')[0]
      courseEl.style.minHeight = bodyH + 'px'
      if (scrollTop < swiperH) {
        window.scrollTo(0, swiperH)
      }
      document.querySelector('.studyPage').addEventListener('touchmove', function (event) {
        event.preventDefault()
      }, false)
    },
    resetScroll () {
      var courseEl = document.getElementsByClassName('courseInfoList')[0]
      courseEl.style.minHeight = 'auto'
      document.querySelector('.studyPage').addEventListener('touchmove', function (event) {
        event.returnValue = true
      }, false)
    },
    countSticky (index) {
      if (this.stickyIndex === index) {
        this.stickyIndex = 0
        this.resetScroll()
        return
      }
      if (String(this.stickyIndex) === '0') {
        this.setScroll()
      }
      this.stickyIndex = index
    },
    changeSelect (value, type, isDis) {
      if (isDis) {
        this.$vux.alert.show({
          title: '提醒',
          content: '暂时没有匹配到合适的课程。更多课程即将上架，敬请期待：）',
          buttonText: '我知道了',
          onShow () {
          },
          onHide () {
          }
        })
        return
      }
      if (type === 'order') {
      } else {
        this.select = {
          type: 0,
          site: '',
          time: '',
          target: 0,
          order: this.select.order
        }
        this.selectMap.time = ''
      }
      switch (type) {
        case 'type':
          this.select.type = value
          break
        case 'site':
          this.select.site = value
          break
        case 'target':
          this.select.target = value
          break
        case 'order':
          this.select.order = value
          break
        default:
          break
      }
      this.getList()
      this.stickyIndex = 0
      this.resetScroll()
    },
    datePickSelect (date) {
      this.select = {
        type: 0,
        site: '',
        time: '',
        target: 0,
        order: this.select.order
      }
      try {
        this.selectMap.time = date
        this.select.time = date.year + '-' + date.month + '-' + date.day
      } catch (e) {
        this.select.time = ''
        this.selectMap.time = {}
      }
      this.getList()
      this.stickyIndex = 0
      this.resetScroll()
    },
    clickImg (item) {
      StatModel.activityAddStat(51, item.id)
        .then(() => {
          window.location.href = item.link
        })
    }
  }
}
</script>

<style scoped lang="scss">
.studyPage{
  background: #60C8CF;
  min-height: 100vh;
  box-sizing: border-box;
}
.nav{
  height: 50px;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #cdcdcd;
  span{
    display: inline-block;
    float: left;
    height: 50px;
    line-height: 50px;
    width: 24.5%;
    border-right: 1px solid #cdcdcd;
    font-size: 16px;
    text-align: center;
    color:#353535;
  }
  span:last-child{
    border-right:none
  }
}
.listBox{
  padding: 0 (10rem/16);
  margin-top: (10rem/16);
}
img{
  height: auto;
  width: 100%;
}
.details{
  margin-top: -55px;
  margin-left: 10px;
  color: #ffffff;
}
.emptySug {
  line-height: 40px;
  text-align: center;
}
.intro {
  text-align: center;
  color: #fff;
  font-size: (14rem/16);
  padding: (40rem/16) 0 (50rem/16) 0;
}
.img-wrap {
  text-align: center;
  margin: 90px 0 10px 0;
  img{
    width:30%;
  }
}
.text-wrap {
  text-align: center;
  font-size: (14rem/16);
  color: #fff;
  p{
    margin-bottom: (2rem/16);
    &:first-child{
      margin-bottom: (10rem/16);
    }
  }
}
.arrow{
  height:(5rem/16);
  width:(10rem/16);
  margin-left: 3px;
  transition: 0.5s;
  color: #fff;
}
  .screenBox{
    z-index: 400;
    .tab{
      z-index: 400;
      padding: (10rem/16) 0;
      background: #f0f0f0;
      color: #444;
      font-size: (14rem/16);
      display: flex;
      justify-content: space-around;
      span{
        z-index: 400;
        display: flex;
        align-items: center;
      }
    }
    .tabItem{
      z-index: 400;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      min-height: (500rem/16);
      background: #fff;
      p{
        font-size: (14rem/16);
        color: #444;
        padding: (10rem/16) (20rem/16);
        border-bottom: 1px solid #eee;
        &:last-child{
          border-bottom: 1px solid #eee;
        }
      }
    }
    .tabInfoBox{
      position: relative;
    }
  }
  .swiperMark{
    position: fixed;
    top: (44rem/16);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    background: rgba(0,0,0,.4);
  }
  .blueFont{
    color: #60C8CF !important;
    border-bottom: 1px solid #60C8CF !important;
    .siteChild{
      color: #444;
    }
  }
  .blueBg{
    color: #fff !important;
    background: #60C8CF !important;
    border: 1px solid #60C8CF !important;
  }
  .siteItem{
    padding-bottom: (55rem/16);
    box-sizing: border-box;
    div{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      padding: (5rem/16);
      margin-bottom: (20rem/16);
      color: #bbb;
      font-size: (14rem/16);
      font-style: italic;
    }
    .siteCityBox{
      padding-bottom: (5rem/16) !important;
    }
    p{
      display: flex;
      align-items: center;
    }
    .siteCity{
      width: 20%;
      display: inline-block;
      margin-bottom: (5rem/16);
    }
    .siteChild{
      width: 80%;
      display: inline-block;
      span{
        display: inline-block;
        padding: 0 (20rem/16);
        border-radius: (5rem/16);
        border: 1px solid #ccc;
        margin-right: (5rem/16);
        margin-bottom: (5rem/16);
        &:active{
          background: #eee;
        }
      }
    }
  }
  .orderItem{
    p{
      label{
        color: #999;
        text-align: center;
        display: block;
        text-align: left;
        padding-left: (5rem/16);
        margin-bottom: (10rem/16);
      }
      span{
        text-align: center;
        display: inline-block;
        border: 1px solid #ccc;
        padding:0 (10rem/16);
        border-radius: (5rem/16);
        margin-right: (15rem/16);
        &:active{
          background: #eee;
        }
      }
    }
  }
  .disabled{
    color: #999 !important;
  }
</style>
