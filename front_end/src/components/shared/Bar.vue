<template>
  <div>
    <el-progress
      class="bar"
      :class="type"
      :percentage="value && maxValue ? Math.round((value / maxValue) * 100) : 0"
      :stroke-width="27"
      :text-inside="true"
      :color="color"
    />
    <span class="spanBar">{{ value }}/{{ maxValue }} {{ attributeName }}</span>
  </div>
</template>
<style scoped>
  .spanBar {
    position: absolute;
    color: #000000;
    font-size: 14pt;
    right: 16px;
    bottom: 7px;
    font-family: 'silom';
  }
  .bar.hp /deep/ div /deep/ .el-progress-bar__outer {
    border: 5px solid white;
    border-radius: 12px;
    background-color: #fff4f4;
  }
  .bar.wp /deep/ div /deep/ .el-progress-bar__outer {
    border: 5px solid white;
    border-radius: 12px;
    background-color: #d2fcff;
  }
  .bar.monsterHp /deep/ div /deep/ .el-progress-bar__outer {
    border: 5px solid white;
    border-radius: 12px;
    background-color: #ddc7f8;
  }
  .bar /deep/ div /deep/ .el-progress-bar__outer .el-progress-bar__inner {
    border-radius: 10px;
  }
  .bar /deep/ div /deep/ div /deep/ div /deep/ .el-progress-bar__innerText {
    display: none;
  }
</style>

<script>
  export default {
    props: {
      value: Number,
      maxValue: Number,
      type: String
    },
    computed: {
      color() {
        switch (this.type) {
          case 'hp':
            return '#e96268';
          case 'monsterHp':
            return '#a062e9';
          case 'wp':
            return '#62e9e3';
          default:
            return '';
        }
      },
      attributeName() {
        switch (this.type) {
          case 'hp':
            return 'HP';
          case 'monsterHp':
            return 'HP';
          case 'wp':
            return 'WP';
          default:
            return '';
        }
      }
    }
  };
</script>
