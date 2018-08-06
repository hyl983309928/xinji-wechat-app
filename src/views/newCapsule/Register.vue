<template>
  <div class="page">
    <div class="content">
      <div class="headImg">
        <img src="/static/img/newCapsule/panda2.png" />
      </div>
      <div class="label">
        完善你和宝宝信息在生日我们将会为你送上惊喜
      </div>
      <div class="inputInfo">
        <div>
          <label>孩子昵称:</label>
          <input type="text" v-model="info.childrenList[0].name" />
        </div>
        <div @click="showSex=true">
          <label>孩子性别:</label>
          <div>{{info.childrenList[0].sex == 0? '男': info.childrenList[0].sex==1?'女':''}}</div>
        </div>
        <div @click="showPlugin">
          <label>孩子生日:</label>
          <div>{{info.childrenList[0].birthday}}</div>
        </div>
      </div>
    </div>
    <div class="footBox" @click="submit">
      <button>
        完成
      </button>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSex">
        <div class="popupSex">
          <p @click="hide(0)">男<icon v-if="info.childrenList[0].sex==0" class="icon" type="success-no-circle"></icon></p>
          <p @click="hide(1)">女<icon v-if="info.childrenList[0].sex==1" class="icon" type="success-no-circle"></icon></p>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Popup, TransferDom, Icon } from 'vux'
import StatModel from 'lanmaLib/modules/statistics'
export default{
  components: {
    Popup,
    Icon
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      id: 0,
      showSex: false,
      info: {
        childrenList: [
          {
            birthday: '',
            headimgUrl: '',
            name: '',
            sex: ''
          }
        ],
        identity: '',
        name: '',
        telephone: ''
      }
    }
  },
  computed: {
  },
  created () {
    StatModel.activityAddStat(46)
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.user.getChildrenInfo()
      .then(data => {
        this.info = data
      })
  },
  mounted () {
  },
  methods: {
    showPlugin () {
      var _this = this
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM-DD',
        value: _this.info.childrenList[0].birthday,
        onConfirm (val) {
          _this.info.childrenList[0].birthday = val
        },
        onShow () {
        },
        onHide () {
        }
      })
    },
    hide (sex) {
      this.info.childrenList[0].sex = parseInt(sex)
      this.showSex = false
    },
    checkData () {
      if (this.info.childrenList[0].name && this.info.childrenList[0].birthday && (this.info.childrenList[0].sex === 0 || this.info.childrenList[0].sex === 1)) {
        return true
      }
      this.showErrorMsg('请输入正确的孩子信息')
      return false
    },
    submit () {
      if (!this.checkData()) {
        return
      }
      this.$api.user.updateChildrenInfo(this.info)
        .then(res => {
          if (this.id) {
            this.$router.go(-1)
          } else {
            this.$router.push('/newCapsule/list')
          }
        })
        .catch(e => {
          this.showErrorMsg('添加失败，请重新添加')
        })
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
    background-color: #549EFF;
    background: url("/static/img/newCapsule/bg.png") #549EFF no-repeat;
    background-size: 100% 100%;
    padding: 30% (25rem/16) (25rem/16) (25rem/16);
  }
  .content{
    background: #fff;
    border-radius: (10rem/16);
    padding: (25rem/16);
    padding-top: (70rem/16);
    position: relative;
    .headImg{
      width:(80rem/16);
      height:(80rem/16);
      position: absolute;
      top: (-20rem/16);
      left: 50%;
      margin-left: -(40rem/16);
      img{
        border-radius: 50% 50%;
        width:100%;
        height:100%;
      }
    }
    .label{
      color: #999;
    }
    .inputInfo{
      margin-top: (30rem/16);
      &>div{
        margin-top: (10rem/16);
        padding: (15rem/16) 0;
        label{
          display: inline-block;
          color: #999;
          width:30%;
          text-align: left;
        }
        div{
          display: inline-block;
          width:65%;
          height:(25rem/16);
        }
        input[type='text']{
          width:65%;
          font-size: (16rem/16);
          border: 0px;
          border-bottom: 1px solid #ccc;
          outline:none;
        }
      }
    }
  }
  .vux-popup-dialog{
    overflow-y: visible;
  }
  .popupSex{
    p{
      box-sizing: border-box;
      position: relative;
      padding: (15rem/16);
      padding-left: (30rem/16);
      font-size: (20rem/16);
      border-bottom: 1px solid #ccc;
      background: #fff;
      width:100%;
      overflow: hidden;
    }
    p:last-child{
      border-bottom: 0px;
    }
    .icon{
      position: absolute;
      right: 0;
    }
  }
  .footBox{
    margin-top: (40rem/16);
    width:100%;
    button{
      margin-left: 5%;
      border: 0;
      width:90%;
      height:(50rem/16);
      color: #726EE5;
      background: #fff;
      border-radius: (25rem/16);
      font-size: (25rem/16);
    }
  }
</style>
