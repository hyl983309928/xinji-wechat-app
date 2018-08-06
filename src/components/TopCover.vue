<template>
  <div class="c-top">
    <img :src="cover" class="course-cover-img">
    <div class="mask">
      <!-- <div class="themetag tag">
        <span>{{ themeString }}</span>
      </div>
      <div class="othertag tag">
        <span>{{ targetString }}</span>
        <span>{{ ageString }}</span>
        <span>{{ sceneString }}</span>
      </div> -->
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <!-- <div class="price" v-if="price">
        <span>¥{{ price }}</span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: [String, Number],
      default: ''
    },
    age: {
      type: [String, Number],
      default: ''
    },
    target: {
      type: [String, Number],
      default: ''
    },
    scene: {
      type: [String, Number],
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    cover: {
      type: String,
      default: ''
    },
    price: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    // themeString () {
    //   return this.$label.getThemeLabel(this.theme)
    // },
    // ageString () {
    //   return this.$label.getLabel(this.age).title
    // },
    // targetString () {
    //   return this.$label.getLabel(this.target).title
    // },
    // sceneString () {
    //   return this.$label.getLabel(this.scene).title
    // }
  },
  data () {
    return {}
  },
  created () {
    // this.$label.getLabelList().then(() => {})
  }
}
</script>

<style scoped lang="scss">
.c-top{
  position: relative;
  img {
      width: 100%;
      z-index: 0;
  }
  .mask{
    width: 100%;
    height:100%;
    position: absolute;
    top: 0px;
    bottom:0px;
    z-index: 1;
    background-image: linear-gradient(bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%);
    .themetag {
      position: absolute;
      right: 20px;
      top: 18px;
    }
    .othertag {
      position: absolute;
      right: 20px;
      top: 40px;
      span{
        margin-left: 10px;
      }
    }
    .tag span {
      font-size: 11px;
      font-weight: 300;
      color: #fff;
      /* background-color: #555; */
    }
    .title {
      bottom: 7px;
      position: absolute;
      padding-left: 20px;
      width: 100%;
      background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
      box-sizing: border-box;
      /* background-color: #555; */
    }
    .title span,
    .price span {
      font-size: 17px;
      color: #fff;
      /* background-color: #555; */
    }
    .price{
      bottom: 25px;
      position: absolute;
      right: 20px;
    }
  }
}
</style>
