<template>
  <div @click="readerClick" v-if="showReader">
    <div class="cl-module r-detail-info">
      <div class="cl-m-body">
        <div class="detail-top">
          <img :src="$helper.getImageUrl(detail.cover)" class="reader-cover-img" onerror="this.setAttribute('src', '/static/img/reader_cover.png')">
          <div class="mask"></div>
          <div class="label-info">
            <p>{{ detail.theme_title }}</p>
            <p>{{ detail.age_title }}</p>
          </div>
          <p class="title">
            {{ detail.title }}
          </p>
          <!-- <p class="price">已购&nbsp;&nbsp;¥5.00</p> -->
        </div>
        <div class="detail-content">
          <div class="favorite">
            <span slot="icon" :class="'iconfont icon-favorite ' + (detail.favorite ? 'focus' : '')" @click.stop="addFavorite"></span>
            <p>{{ detail.click_num }}</p>
          </div>
          <div class="description">{{detail.description}}</div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showReader: true
    }
  },
  props: {
    detail: {},
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
    readerClick () {
      if (this.linkDisabel) {
        return
      }
      this.$api.reader.click(this.detail.id).then(() => {
        console.log('readerClick')
        var url = this.detail.url
        if (!url || url === '') {
          url = 'http://mp.weixin.qq.com/s/J84G78CKcshifTMDHxw_rA'
        }
        console.log(url)
        // window.open(url)
        window.location.href = url
      })
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
.r-detail-info .detail-top .title {
  height: initial;
}
</style>
