<template>
  <div @click="readerClick(detail.link)" v-if="showReader" class="readerItem" :style="needPadding ? 'padding:0.6rem;':'padding:0.6rem 0;'">
    <flexbox>
      <flexbox-item>
        <flexbox orient="vertical"  class="text-box">
          <flexbox-item><h3>{{ detail.title }}</h3></flexbox-item>
          <flexbox-item><p class="label-string">{{ detail.theme_title }}{{ detail.age_title }}</p></flexbox-item>
          <flexbox-item style="margin-top:0" v-if="needShowPublishTime"><p class="label-string">阅读数：{{ detail.click_num }}，更新：{{ detail.publishedTime }}</p></flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item :span="4">
        <div class="img-box">
          <img :src="$helper.getImageUrl(detail.smallCover)" class="reader-cover-img" onerror="this.setAttribute('src', '/static/img/reader_cover.png')">
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      showReader: true
    }
  },
  props: {
    detail: {},
    needPadding: {
      default: false
    },
    needShowPublishTime: {
      default: false
    },
    linkDisabel: {
      default: false
    }
  },
  computed: {
    orderTitle () {
      var result = ''
      if (this.reader.order_status === 0) {
        result = this.reader.channel_id > 0 ? '未确认' : '未支付'
      } else if (this.reader.order_status === 0) {
        result = this.reader.channel_id > 0 ? '已确认' : '已支付'
      } else {
        result = this.$config.status.order[this.reader.order_status]
      }
      return result
    }
  },
  methods: {
    readerClick (link) {
      window.location.href = window.location.origin + window.location.pathname + '#' + link
      // this.$router.push(link)
    },
    addFavorite () {
      if (this.detail.favorite) {
        this.$api.reader.deleteFavorite(this.detail.id).then(() => {
          this.detail.favorite = 0
        })
        return
      } else {
        this.$api.reader.addFavorite(this.detail.id).then(() => {
          this.detail.favorite = 1
        })
      }
    },
    pay () {
      window.location.href = 'http://wx.xinjijiaoyu.com/#/parent/reader/pay/' + this.reader.order_id
      // this.$router.push('/parent/reader/pay/' + this.reader.order_id)
    },
    giveUp () {
      this.showConfirm('确定放弃课程吗？', () => {
        this.$api.order.giveUp(this.reader.order_id).then(() => {
          this.showSuccess('操作成功')
          // this.$router.push('/parent/reader/manage/2')
          this.showreader = false
        }).catch((e) => {
          this.showError(e.message)
        })
      })
    },
    openreader () {
      // 开始上课
      if (this.reader.status < 9) {
        this.$router.push('/parent/reader/reader_material/' + this.reader.id)
      } else {
        this.$router.push('/parent/reader/after_class/' + this.reader.id)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.readerItem{
  position: relative;
  padding: 0.6rem 0;
  border-bottom: 1px solid #ddd;
}
.text-box{
  h3{
    color: #323232;
    font-size: 1.1325rem;
    line-height: 1.5rem;
    font-weight: normal;
  }
  p{
    font-size: 0.85rem;
    color: #9b9b9b;
  }
}
.label-string{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.img-box img{
  width: 100%;
  height: 5.625rem;
}
</style>
