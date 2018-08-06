<template>
  <div @click="doClick">
    <div class="c-top">
      <img :src="material.cover" class="course-cover-img">
      <div class="mask"></div>
      <div class="details">
        <span class="price">
          {{ material.number }}
        </span>
      </div>
    </div>
    <div class="cl-module c-detail-info">
      <div class="cl-m-body">
        <div class="apply-detail">
          <p>
            {{ material.title }}
          </p>
          <ul class="label-list">
            <li>{{ material.ageLabel }}</li>
            <li>{{ material.themeLabel }}</li>
            <li>{{ material.targetLabel }}</li>
            <li>{{ material.sceneLabel }}</li>
          </ul>
          <div class="clear"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    material: {},
    linkDisabel: {
      default: false
    }
  },
  methods: {
    doClick () {
      if (this.linkDisabel) {
        return
      }
      console.log('courseClick')
      var url = this.material.link
      this.$router.push(url)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.c-top{
  position: relative;
  line-height: 0px;

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
    background-image: linear-gradient(bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%);
  }
  .details {
    position: absolute;
    width:100%;
    bottom:10px;
    color: #ffffff;
    z-index: 5;
    line-height: 20px;
  }
  .price {
    margin-left: 15px;
  }
  .sign {
    float: right;
    margin-right: 15px;
  }
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
    margin-left: 6px;
    padding-left: 21px;
    background-color: #fff;
    p {
        margin-top: 10px;
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
