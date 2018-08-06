<template>
  <div class="page">
    <div class="content">
      <p class="top">陪伴胶囊提升孩子</p>
      <img src="/static/img/newCapsule/homeBg@2x.png" />
      <p class="bottom">孩子渴望每天和你玩游戏</p>
      <span>你有多久没有和孩子游戏？</span>
      <div @click="goList">开始陪伴</div>
    </div>
  </div>
</template>

<script>
import StatModel from 'lanmaLib/modules/statistics'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      childrenInfo: {},
      isChildrenInfo: false
    }
  },
  computed: {
  },
  created () {
    StatModel.activityAddStat(41)
    this.$api.user.getChildrenInfo()
      .then(data => {
        if (data.childrenList.length === 0) {
          this.$api.user.createChildren()
            .then(() => {
            })
        }
        if (data.childrenList.length !== 0 && data.childrenList[0].name && data.childrenList[0].birthday && (data.childrenList[0].sex === 0 || data.childrenList[0].sex === 1)) {
          this.isChildrenInfo = true
          this.countTime()
        }
      })
  },
  mounted () {
  },
  methods: {
    countTime () {
      var newCapsule = window.localStorage.getItem('newCapsule')
      if (newCapsule) {
        var nowDate = new Date()
        var oldDate = new Date(parseInt(newCapsule))
        var temp = nowDate.getTime() - oldDate.getTime()
        if (temp / (1000 * 60 * 60) < 24) {
          this.$router.push('/newCapsule/list')
        }
      }
    },
    goto (url) {
      this.$router.push(url)
    },
    goList () {
      if (this.isChildrenInfo) {
        var d = new Date()
        var time = d.getTime()
        window.localStorage.setItem('newCapsule', time)
        this.$router.push('/newCapsule/list')
      } else {
        this.$router.push('/newCapsule/register')
      }
      // this.$api.user.getChildrenInfo().then(data => {
      //   if (data.childrenList.length === 0) {
      //     this.$router.push('/newCapsule/register')
      //   } else {
      //     var d = new Date()
      //     var time = d.getTime()
      //     window.localStorage.setItem('newCapsule', time)
      //     this.$router.push('/newCapsule/list')
      //   }
      // })
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .page{
    width:100%;
    min-height: 100vh;
    box-sizing: border-box;
    background: #fff;
    padding: (30rem/16) 0 (50rem/16) 0 ;
  }
  .content{
    p{
      width:100%;
      text-align: center;
      color:#6397E1;
      font-size:1.2rem;
      font-weight: bold;
    }
    .top{
      margin-bottom: (60rem/16);
    }
    .bottom{
      margin-top: (20rem/16);
    }
    img{
      width:100%;
    }
    span{
      display: block;
      font-style: 1rem;
      color: #999;
      text-align: center;
      margin-top: (20rem/16);
    }
    div{
      background: #6665FF;
      text-align: center;
      color: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      right:0;
      height:(50rem/16);
      line-height: (50rem/16);
    }
  }
</style>
