<template>
  <CircleProgress
    class="cProgress"
    :progress="target - progress"
    :total="target"
    :inner="inner"
    :size="size || 150"
  />
</template>
<style>
  .iconMinusButton {
    display: block !important;
    position: relative;
    bottom: 10px;
    font-size: 30px;
  }
  .spanMinusName {
    font-size: 0.9rem;
    position: relative;
    display: block;
  }
  .spanCount {
    font-size: 0.9rem;
    position: relative;
    display: block;
    top: 10px;
  }
  .cProgress:hover {
    transform: scale(1.1);
    transition: all 400ms;
  }
  .cProgress:active {
    transform: scale(0.7);
    transition: all 200ms;
  }
</style>

<style scoped>
  .cProgress {
    /* pointer-events: all; */
    cursor: pointer;
    display: inline-block;
  }
</style>

<script>
  import CircleProgress from 'components/shared/CircleProgress.vue';
  export default {
    components: {
      CircleProgress
    },
    props: {
      minusName: String,
      progress: Number,
      target: Number,
      size: Number
    },
    data() {
      return {
        currentTime: new Date().getTime()
      };
    },
    computed: {
      inner() {
        return `<i class="el-icon-minus iconMinusButton"></i><span class="spanMinusName">${
          this.minusName
        }</span><span class="spanCount">${this.progress} / ${this.target}</span>`;
      }
    },
    mounted() {
      setInterval(() => {
        this.currentTime = new Date().getTime();
      }, 1000);
    }
  };
</script>
