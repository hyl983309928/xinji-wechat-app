<template>
  <div @click="learnClick" v-if="showLearn">
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
          <p class="price">&nbsp;&nbsp;¥{{detail.price}}</p>
        </div>
        <div class="detail-content">
          <div class="favorite">
            <span slot="icon" :class="'iconfont icon-favorite ' + (detail.favorite ? 'focus' : '')" @click.stop="addFavorite"></span>
            <p>{{ detail.sell_num }}</p>
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
      showLearn: true,
      order: {}
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
      if (this.learn.order_status === 0) {
        result = this.learn.channel_id > 0 ? '未确认' : '未支付'
      } else if (this.learn.order_status === 0) {
        result = this.learn.channel_id > 0 ? '已确认' : '已支付'
      } else {
        result = this.$config.status.order[this.learn.order_status]
      }
      return result
    }
  },
  methods: {
    showBuy () {
      var that = this
      this.$vux.confirm.show({
        title: '是否支付 ¥' + this.detail.price,
        content: '购买本节共学线上课程',
        confirmText: '支付',
        cancelText: '取消',
        onCancel () {},
        onConfirm () {
          // confirmFun()
          that.buy()
        }
      })
    },
    buy () {
      this.pay()
    },
    learnClick () {
      if (this.detail.buy) {
        if (this.detail.submit) {
          this.$router.push('/parent/course/learn_after/' + this.detail.id)
        } else {
          this.$router.push('/parent/course/learn_detail/' + this.detail.id)
        }
      } else {
        this.showBuy()
      }
    },
    addFavorite () {
      if (this.detail.favorite) {
        this.$api.learn.deleteFavorite(this.detail.id).then(() => {
          this.detail.favorite = 0
        })
        return
      } else {
        this.$api.learn.addFavorite(this.detail.id).then(() => {
          this.detail.favorite = 1
        })
      }
    },
    pay () {
      this.$api.order.buyLearnCourse(this.detail.id).then((order) => {
        this.$router.push('/parent/course/pay/' + order.id)
      })
      // this.$router.push('/parent/learn/pay/' + this.learn.order_id)
    },
    goPay (payConfig) {
      this.$wechat.invoke(
        'getBrandWCPayRequest', payConfig, (res) => {
          switch (res.err_msg) {
            case 'get_brand_wcpay_request:cancel':
              // this.showError('用户取消支付！')
              break
            case 'get_brand_wcpay_request:fail':
              this.showError('支付失败！（' + res.err_desc + '）')
              this.$xLog(res.err_desc)
              break
            case 'get_brand_wcpay_request:ok':
              this.paySuccess()
              break
            default:
              this.showError('支付失败')
              // alert(JSON.stringify(res));
              break
          }
        }
      )
    },
    paySuccess () {
      this.$api.order.paySuccess(this.order.id).then(() => {
        // this.showSuccess('支付成功！')
        // setTimeout(() => {
        this.$router.push('/parent/course/my_learn/1')
        // }, 1000)
      }).catch((e) => {
        this.showError('支付失败')
      })
    },
    giveUp () {
      this.showConfirm('确定放弃课程吗？', () => {
        this.$api.order.giveUp(this.learn.order_id).then(() => {
          this.showSuccess('操作成功')
          // this.$router.push('/parent/learn/manage/2')
          this.showlearn = false
        }).catch((e) => {
          this.showError(e.message)
        })
      })
    },
    openlearn () {
      // 开始上课
      if (this.learn.status < 9) {
        this.$router.push('/parent/learn/learn_material/' + this.learn.id)
      } else {
        this.$router.push('/parent/learn/after_class/' + this.learn.id)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.r-detail-info{

  .cl-m-body{
    padding:0;
  }

  .detail-top{
    position: relative;
    min-height: 150px;

    img{
      width:100%;
    }
    .label-info{
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 12px;
      color: #fff;
      text-align: right;
    }
    .title{
      position: absolute;
      left: 15px;
      bottom:15px;
      font-size:18px;
      color: #fff;
      height:24px;
      line-height: 24px;
    }
    .price{
      position: absolute;
      right: 15px;
      bottom:15px;
      color:#fff;
    }
  }
  .detail-content{
    margin:15px;
    margin-top:13px;

    .description{
      float: left;
      width:80%;
      font-size: 14px;
      color:#323b46;
    }
    .favorite{
      float: right;
      width:17%;
      text-align: center;
      color:#c8d2dc;
      p{
        font-size: 14px;
      }

      .focus{
        color:#60c9cf;
      }
    }

    .icon-favorite{
      font-size: 22px;
    }
  }
}
</style>
