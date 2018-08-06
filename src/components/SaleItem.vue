<template>
  <div v-if="showCourse">
    <TopCover :cover="goods.original.cover" :theme="goods.original.labelTheme" :age="goods.original.labelAge" :target="goods.original.labelTarget" :scene="goods.original.labelScene" :title="goods.name"></TopCover>
    <div class="cl-module c-detail-info">
      <div class="cl-m-body">
        <div @click="courseClick">
          <template v-if="goods.goodsType==1 || goods.goodsType==3">
            <p>
              <span>课程类型</span>
              <span>{{goods.goodsType==1?'体验坊':'游学营'}}</span>
            </p>
            <p>
              <span>上课机构</span>
              <span>心迹教育</span>
            </p>
            <p>
              <span>上课时间</span>
              <span>{{goods.goodsType==3? TimeModel.editStTime(goods.original.lesson_time,goods.original.lesson_time_end):TimeModel.editTime(goods.original.lesson_time, goods.original.duration)}}</span>
            </p>
            <p>
              <span>上课地点</span>
              <span>{{goods.goodsType==3?goods.original.lesson_location:backCourseSite(goods.original.channelName,goods.original.lesson_location) }}</span>
            </p>
          </template>
          <template v-if="goods.goodsType==2">
            <p>
              <span>课程类型</span>
              <span>课程组合</span>
            </p>
            <p>
              <span>课程数量</span>
              <span>{{ goods.original.courseList.length }}节</span>
            </p>
            <p>
              <span>开课时间</span>
              <span>{{ goods.original.lesson_time }}</span>
            </p>
          </template>
          <flexbox class="pay-wrap">
            <flexbox-item :span="7">
              <x-button class="signin" mini plain>立即报名</x-button>
            </flexbox-item>
            <flexbox-item>
              <flexbox orient="vertical"  class="text-box">
                <flexbox-item><span class="avaliable price" >¥<span>{{ goods.price }}</span></span></flexbox-item>
                <flexbox-item v-if="goods.price!==goods.originalPrice"><i class="originprice notallow" >原价：¥{{ goods.originalPrice }}</i></flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from 'vux'
import TopCover from 'components/TopCover'
import TimeModel from 'lanmaLib/time'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    TopCover
  },
  data () {
    return {
      showCourse: true,
      TimeModel
    }
  },
  props: {
    goods: {},
    linkDisabel: {
      default: false
    },
    tab: ''
  },
  computed: {},
  methods: {
    courseClick () {
      if (this.goods.goodsType === 1) {
        window.location.href = `./?#/parent/commodity/detail/${this.goods.id}`
      } else {
        window.location.href = `./?#/parent/commodity/detail/${this.goods.id}`
      }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.hasborder {
  padding-bottom: 20px;
  border-bottom: 1px solid #efeff4;
}

.sign {
  margin-top: 20px;
}

.pay-wrap {
  margin-top: 15px;
}

.signin {
  border-radius: 30px;
  color: #00a6ac;
  border-color: #00a6ac;
}

.notsignin {
  border-radius: 30px;
  border-color: #ccc;
}

.price {
  font-size: 1.1rem;
  line-height: 30px;
  float: right;
  span{
    font-size: 1.5rem;
  }
}

.originprice {
  float: right;
  font-size: 0.8125rem;
  text-decoration: line-through;
  margin-top: -15px;
}

.avaliable {
  color: #00a6ac;
}

.notallow {
  color: #ccc;
}

.manage-wrap{
  border-right: 1px solid #ccc;
  text-align: center;
}
.manage-wrap:last-of-type{
  border: 0;
}
.manage-btn{
  font-size: 17px;
  font-weight: bold;
  height: 17px;
  line-height: 17px;
  text-align: center;
  width: 60px;
  color: #00a6ac;
}

li {
    list-style: none;
}
.label-list li {
    float: left;
    color: #00a6ac;
    margin-right: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
}

div.c-detail-info{
  margin-top: -15px;
  background-color: #00a6ac;
}
.cl-m-body {
  padding-left: 21px;
  background-color: #fff;
  font-size: 13px;
  padding-top: 25px;
  .apply-detail {
    width: 250px;
  }
  p {
      margin: 5px 0 0 0;
      span {
          margin-right: 10px;
      }
      span:nth-child(odd) {
          color: #6c7b8a;
      }
      span:nth-child(even) {
          color: #323b46;
      }
  }
}
</style>
