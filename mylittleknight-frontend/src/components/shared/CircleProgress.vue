<template>
  <el-progress
    class="progressCircle"
    ref="progress"
    :color="
      progress >= total ? '#abe962' : progress <= 0 ? '#e96268' : '#62e9e3'
    "
    type="circle"
    :stroke-width="8"
    :percentage="
      total > 0
        ? progress >= 0
          ? progress > total
            ? 100
            : (progress / total) * 100
          : 100
        : 0
    "
    :width="size"
  ></el-progress>
</template>
<style scoped>
  .progressCircle {
    border-radius: 100px;
    background-color: #fdfdfd;
    transform: scale(1);

    transition: all 400ms;
  }
</style>

<script>
  export default {
    props: {
      progress: Number,
      total: Number,
      size: Number,
      inner: String
    },
    computed: {},
    watch: {
      progress() {
        this.$refs['progress'].$el.querySelector(
          '.el-progress__text'
        ).innerHTML = this.inner;
      },
      inner() {
        this.$refs['progress'].$el.querySelector(
          '.el-progress__text'
        ).innerHTML = this.inner;
      }
    },
    mounted() {
      this.$refs['progress'].$el.querySelector(
        '.el-progress__text'
      ).innerHTML = this.inner;
    }
  };
</script>
