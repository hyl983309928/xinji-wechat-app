<template>
  <div class="page">
    <div class="topImgBox">
      <img :src="countSmallUrl(goods.cover, 'x3')" class="course-cover-img"/>
    </div>
    <div class="content" @click="courseClick">
      <div class="title">
        <p>{{goods.name}}<span :class="[goods.goodsType==1?'pink':goods.goodsType==2?'yellow':'blue']">{{goods.goodsType==1?'体验坊':goods.goodsType==2?'课程组合':'游学营'}}</span></p>
      </div>
      <div class="info">
        <div v-if="goods.goodsType==1">
          <img src="/static/img/course/target.png" />
          <span>{{goods.labelTheme_title.replace(/\//g, '|')}}</span>
        </div>
        <div v-if="goods.goodsType==3">
          <img src="/static/img/course/target.png" />
          <span>{{goods.labelTheme_title}}</span>
        </div>
        <div v-if="goods.goodsType==2">
          <img src="/static/img/course/num.png" />
          <span>共{{ goods.courseList.length }}节课</span>
        </div>
        <div>
          <img src="/static/img/course/time.png" />
          <span>{{goods.goodsType==1? TimeModel.editTime(goods.lesson_time, goods.duration):TimeModel.editStTime(goods.lesson_time,goods.lesson_time_end)}}</span>
        </div>
        <div>
          <img src="/static/img/course/age.png" />
          <span>{{goods.labelAge_title}}·{{goods.labelTarget_title}}</span>
        </div>
        <div>
          <img src="/static/img/course/site.png" />
          <span>{{goods.site_title}}</span>
        </div>
      </div>
      <div class="footBox">
        <div class="price">
          <span class="now"><span>￥</span>{{ goods.price }}</span>
          <span class="original" v-if="goods.price!=goods.originalPrice">原价：￥{{ goods.originalPrice }}</span>
        </div>
        <span>{{isOneDay(goods.stopSellTime)?'即将截止':'火热报名中'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import TimeModel from 'lanmaLib/time'
import ImgModel from 'lanmaLib/imgSize'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      TimeModel
    }
  },
  props: {
    goods: {}
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    countSmallUrl: ImgModel.countSmallUrl,
    courseClick () {
      if (this.goods.goodsType === 1) {
        window.location.href = `./?#/parent/commodity/detail/${this.goods.id}`
      } else {
        window.location.href = `./?#/parent/commodity/detail/${this.goods.id}`
      }
    },
    isOneDay (time) {
      var date = new Date()
      var stopDate = new Date(time)
      if (stopDate.getTime() - date.getTime() > 24 * 60 * 60 * 1000) {
        return false
      }
      return true
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .page{
    margin-bottom: (10rem/16);
    border-radius: (10rem/16);
    overflow: hidden;
    box-shadow:0 1px 4px 0 rgba(0,0,0,0.15);
  }
  .topImgBox{
    width:100%;
    font-size: 0;
    img{
      width:100%;
    }
  }
  .content{
    background: #fff;
    box-sizing: border-box;
    padding: (15rem/16);
    .title{
      margin-bottom: (10rem/16);
      p{
        font-size: (16rem/16);
        color: #444;
        font-weight: bold;
        line-height: 1;
      }
      span{
        line-height: 1;
        margin-left: (5rem/16);
        vertical-align: text-top;
        display: inline-block;
        padding: (3rem/16) (10rem/16);
        border-radius: (20rem/16);
        font-size: (12rem/16);
        color: #fff;
      }
      .pink{
        background: #f68590;
      }
      .blue{
        background: #3eb0ef;
      }
      .yellow{
        background: #ecd462;
      }
    }

    .info{
      div{
        display: flex;
        align-items: center;
        img{
          height:(10rem/16);
          margin-right: (5rem/16);
          line-height: (14rem/16);
        }
        span{
          color: #999;
          font-size: (14rem/16);
        }
      }
    }
    .footBox{
      margin-top: (15rem/16);
      position: relative;
      .price{
        display: inline-block;
        .now{
          line-height: 1;
          font-size: (28rem/16);
          font-weight: bold;
          color: #ff6868;
          span{
            font-size: (14rem/16);
          }
        }
        .original{
          line-height: 1;
          font-size: (14rem/16);
          color: #999;
        }
      }
      &>span{
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 0;
        color: #fff;
        font-size: (14rem/16);
        background: #ffaa43;
        padding: (2rem/16) (8rem/16);
        border-radius: (5rem/16);
      }
    }
  }
</style>
