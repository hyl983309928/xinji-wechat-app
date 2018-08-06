<template>
  <div class='reader-detail' v-if="loaded">
    <div class='title'>
      <h3>{{ reader.title }}</h3>
      <p class="read-count">阅读：{{ reader.click_num }}，原创：{{ reader.author }}</p>
      <div class="read-label">
        <p v-for="label in reader.theme_title.split(/[·\\/]/).slice(0, -1)">{{ label }}</p>
        <p v-for="label in reader.age_title">{{ label }}</p>
      </div>
    </div>
    <div class="lanma-word">
      <p class="lanma-say">懒妈说：</p>
      <p class="lanma-desc" v-if="reader.description" v-html="reader.description.replace(/\n/g, '<br />')"></p>
      <p class="cover"><img :src="reader.cover" alt=""></p>
    </div>
    <div class="lanma-second-title">
      <h4>{{ reader.title }}</h4>
    </div>
    <div class="word-count">
      <p>全文{{ reader.wordCount }}字</p>
      <p class="bold">此次阅读您将为孩子投入 {{ reader.readTime }}分钟</p>
      <p>如果你实在没有时间，也可以先看看下面的懒妈导读</p>
    </div>
    <div class='intro'>
      <p class="symbol">
        <img class="titie-img" src="/static/img/titie_img_left.png" alt="">
        <span>懒妈导读</span>
        <img class="titie-img" src="/static/img/titie_img_right.png" alt="">
      </p>
      <p class="intro-text" v-html="reader.introduction"></p>
    </div>
    <div class='main' :class="[contentTooLong ? 'max-height':'']">
      <p class="symbol">
        <img class="titie-img" src="/static/img/titie_img_left.png" alt="">
        <span>正文</span>
        <img class="titie-img" src="/static/img/titie_img_right.png" alt="">
      </p>
      <p class="main-text" v-html="reader.content"></p>
    </div>
    <div class="show-all" v-if="contentTooLong">
      <img src="/static/img/filterbg.png" alt="">
      <p @click="contentTooLong=false"><x-icon type="chevron-down" size="12" style="fill:#40E0D0"></x-icon> 展开阅读全文</p>
    </div>
    <div class='copyright'>
      <p>【版权归作者所有，懒妈学院整理发布】</p>
      <p>作者：{{ reader.author }}，{{ reader.authorDesc }}</p>
      <p><a :href="reader.url">点击查看原文</a>></p>
    </div>
    <div class='read-related' v-if="reader.starryPicUrl || reader.relationList.length>0">
      <p class="related-title" v-if="reader.starryPicUrl">
        <img class="titie-img" src="/static/img/titie_img_left.png" alt="">
        <img class="small-logo" src="/static/img/logo_samll.png" alt="">
        <span>全人成长星迹空间</span>
        <img class="titie-img" src="/static/img/titie_img_right.png" alt="">
      </p>
      <div class="sky-img" v-if="reader.starryPicUrl">
        <img :src="reader.starryPicUrl" alt="">
      </div>
      <div class="reader-item-wrap" v-if="reader.relationList.length>0">
        <p class="reader-item">关联阅读</p>
        <ReaderItem v-for="reader in reader.relationList" :detail="reader"></ReaderItem>
      </div>
    </div>
    <div class='bottom'>
      <div class="logo-img">
        <img src="/static/img/logo.png" alt="">
      </div>
      <p class="lanmaxueyuan">懒妈学院</p>
      <p style="color:#141414;">没有围墙的父母成长学校</p>
      <p class="lanma-desc">治轻松之学，享陪伴之乐，逐幸福之人生</p>
      <div class="qrcode-img">
        <img src="/static/img/qrcode-2.png" alt="">
      </div>
      <p class="qrcode">长按二维码，识别关注↑</p>
    </div>
  </div>
</template>

<script>
import ReaderItem from 'components/ReaderItem'
import { Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    ReaderItem,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      loaded: false,
      reader: {},
      contentTooLong: false
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
      window.scrollTo(0, 0)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      this.$label.getLabelList().then((list) => {
        this.$api.reader.getDetail(id).then((data) => {
          data.theme_title = this.$label.getReaderThemeLabel(data.labels.slice(1))
          data.age_title = data.labels[0].map(item => {
            return this.$label.getLabel(item).title
          })
          data.introduction = data.introduction.replace(/<img src=/g, '<img style="width:100%;" src=')
          data.content = data.content.replace(/<img src=/g, '<img style="width:100%;" src=')
          this.reader = data
          this.reader.relationList = this.formatRelationList(data.relationList)
          this.setShare()
          this.loaded = true
          this.$nextTick(function () {
            var contentHeight = window.document.getElementsByClassName('main')[0].clientHeight
            console.log(contentHeight)
            if (contentHeight > 1400) {
              this.contentTooLong = true
            } else {
              this.contentTooLong = false
            }
          })
        }).catch(error => {
          if (error.msg === 'ER_CANT_FINd_ARTICLE') {
            window.location.href = 'https://mp.weixin.qq.com/s/J84G78CKcshifTMDHxw_rA'
          }
          if (error.msg === 'ER_STATUS_ERROR') {
            window.location.href = 'https://mp.weixin.qq.com/s/J84G78CKcshifTMDHxw_rA'
          }
        })
      })
    },
    formatRelationList (list) {
      list = list.filter(item => {
        if (item.id !== '') {
          return item
        }
      })
      for (var i = 0; i < list.length; i++) {
        var reader = list[i]
        reader.link = '/parent/reader/detail/' + reader.id
        reader.theme_title = this.$label.getReaderThemeLabel(reader.labels.slice(1))
        reader.age_title = this.$label.getLabel(reader.labels[0][0]).title
      }
      return list
    },
    signUp () {
      this.$router.push('/parent/course/sign_up/' + this.course.id)
    },
    share () {
      this.$vux.toast.show({
        text: '请点击微信右上角分享按钮进行分享',
        type: 'text'
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  .reader-detail{
    background-color: #fff;
    padding: 1rem;
    padding-bottom: 60px;
  }
  .title{
    h3{
      font-size: 1.4rem;
      color: #323232;
    }
    .read-count{
      margin-top: 0.75rem;
      font-size: 0.9rem;
      color: #9B9B9B;
    }
    .read-label{
      margin: 1rem -0.4rem 1.1rem 0;
      p{
        color: #9B9B9B;
        display: inline-block;
        font-size: 0.7rem;
        margin-right: 0.4rem;
        margin-top: 0.4rem;
        padding: 0.4rem 1.1rem;
        background: #F1F1F1;
        border-radius: 100px;
      }
    }
  }
  .lanma-second-title{
    margin-top: 1.4rem;
    color: #323232;
    font-size: 1.2rem;
  }
  .lanma-word{
    .lanma-say{
      font-size: 1.1rem;
      color: #232323;
      font-weight: bold;
    }
    .lanma-desc{
      padding: 0.85rem 0 2.07rem 0;
      font-size: 0.95rem;
    }
    .cover{
      img{
        width: 100%;
      }
    }
  }
  .word-count{
    text-align: center;
    margin: 1.5rem 0 1.4rem 0;
    font-size: 0.95rem;
    color: #9B9B9B;
    background: #F9F9F9;
    padding: 1rem 0.6rem;
    h4{
      font-size: 1.2rem;
      color: #323232;
    }
    .bold{
      color: #141414;
      font-weight: bold;
    }
  }
  .titie-img{
    height: 0.4rem;
    margin: 0 0.4rem;
  }
  .symbol{
    display:flex;
    align-items:center;
    justify-content:center;
    text-align: center;
    margin: 0 auto;
    font-size: 1.1rem;
    font-weight: bold;
    color: #323232;
  }
  /*.symbol-long{
    background: url("/static/img/reader_title_long_bg.png") 0 0.6rem no-repeat;
    width: 6.4rem;
  }*/
  .intro-text,
  .main-text{
    padding: 1.5rem 0.6rem;
    WORD-WRAP: break-word;
    TABLE-LAYOUT: fixed;
    word-break: break-all;
  }
  .max-height{
    max-height: 700px;
    overflow: hidden;
  }
  .show-all{
    position: relative;
    text-align: center;
    margin: 1rem -1rem;
    p{
      font-size: 0.9rem;
      color: #1EB7A8;
    }
    img{
      position: absolute;
      top: -45px;
      left: 0;
      width: 100%;
      height: 3rem;
      -webkit-filter: blur(0.7rem);
      filter: blur(0.7rem);
    }
  }
  .copyright{
    font-size: 0.9rem;
    line-height: 1.5rem;
    color: #9B9B9B;
    background: #F9F9F9;
    padding: 1rem 0.6rem;
    a{
      color: #9B9B9B;
    }
  }
  .read-related{
    margin: 2rem 0 2.25rem 0;
    font-size: 1.1rem;
    padding-top: 1.4rem;
    border: 1px solid #DDD;
    box-shadow: 0 5px 2px 0 rgba(0,0,0,0.06);
    .reader-item-wrap{
      color: #9B9B9B;
      margin: 0.375rem 0.375rem -1px 0.375rem;
    }
    .related-title{
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight: bold;
      color: #323232;
      .small-logo{
        height: 1.9rem;
      }
      span{
        margin-left: 0.38rem;
      }
    }
    .reader-item{
      font-size: 0.85rem;
    }
    .sky-img{
      margin: 1.15rem auto 1rem auto;
      img{
        width: 100%;
      }
    }
  }
  .bottom{
    text-align: center;
    img{
      display: block;
      width: 100%;
    }
    .logo-img,
    .qrcode-img{
      width: 7rem;
      height: 7rem;
      margin: 1.7rem auto 0 auto;
    }
    .lanmaxueyuan{
      font-weight: bold;
      font-size: 1.4rem;
      color: #1EB7A8;
    }
    .lanma-desc{
      font-size: 0.75rem;
      color: #9B9B9B;
    }
    .qrcode{
      text-align: center;
      padding-top: 2rem;
      color: #323232;
    }
  }
</style>
