<template>
    <div>
      <div class="fill"></div>
      <div class="footer" :style="{backgroundColor:bgColor}">
        <span class="text" :style="{color:textColor}">{{ text }}</span>
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      bgColor: {
        type: String,
        default: '#00a6ac'
      },
      textColor: {
        type: String,
        default: '#fff'
      },
      text: {
        type: String,
        default: ''
      }
    },
    computed: {
      borderClass() {
        return this.border + '-border'
      }
    }
  }
</script>

<style scoped lang="scss">
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 17px;
  line-height: 50px;
  text-align: center;
}
.fill{
  height: 50px;
}
</style>
