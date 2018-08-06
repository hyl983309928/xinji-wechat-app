<template>
  <div class="page">
    <div class="subscribe" v-if="isSubscribe">
      <icon type="success" is-msg></icon><br>
      <span>报名成功</span><br>
      <button class="goMyCourse" @click="goto('/parent/course/manage')">查看我的课程</button>
    </div>
    <div class="noSubscribe" v-else>
      <div class="success">
        <icon type="success" is-msg></icon>
        <span>报名成功</span>
      </div>
      <div class="qrcode">
        <p>请关注 『心迹教育』 公众号以便查看课程内容，接受课程提醒</p>
        <img src="/static/img/xinjiQRcode.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vux'
export default{
  components: {
    Icon
  },
  directives: {
  },
  data () {
    return {
      isSubscribe: false
    }
  },
  computed: {
  },
  created () {
    this.$api.user.isSubscribe()
      .then((res) => {
        this.isSubscribe = res
      })
  },
  mounted () {
  },
  methods: {
    goto (url) {
      this.$router.push(url)
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.page{
  background: #fff;
  min-height: 100vh;
  box-sizing: border-box;
}
.subscribe{
  padding-top: (70rem/16);
  width:100%;
  text-align: center;
  i{
    font-size: (70rem/16);
    margin-bottom: (20rem/16);
  }
  span{
    display: inline-block;
    margin-bottom: (20rem/16);
  }
  button{
    background: #30c2c2;
    border: 0px;
    color: #fff;
    padding: (10rem/16) (40rem/16);
    font-size: (14rem/16);
    border-radius: (5rem/16);
  }
}
.noSubscribe{
  width:100%;
  text-align: center;
  .success{
    width:100%;
    padding: (30rem/16) 0;
    border-bottom: 1px solid #4c4c4c;
    i{
      font-size: (50rem/16);
    }
    span{
      display: inline-block;
    }
  }
  .qrcode{
    margin-top: (20rem/16);
    width:100%;
    text-align: center;
    p{
      width:70%;
      margin-left: 15%;
    }
    img{
      margin-top: (10rem/16);
      width:40%;
    }
  }
}
</style>