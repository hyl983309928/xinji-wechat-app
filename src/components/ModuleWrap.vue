<template>
    <div class="cl-module" :style="{opacity:opacity}">
      <div class="cl-m-header" :style="{backgroundColor:headerColor}" v-if="!hideHeader">
        <slot name="header"></slot>
      </div>
      <div class="cl-m-body" :class="borderClass">
        <slot name="body"></slot>
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      hideHeader: '',
      headerColor: {
        type: String,
        default: '#60c9cf'
      },
      opacity: {
        type: String,
        default: '1'
      },
      border: {
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
.cl-module{
  background-color: #60c9cf;
}
.cl-m-header{
  padding: 0 30px;
}
.cl-m-body{
  background-color: #fff;
}
.left-border{
  margin-left: 6px;
}
.right-border{
  margin-right: 6px;
}
</style>
