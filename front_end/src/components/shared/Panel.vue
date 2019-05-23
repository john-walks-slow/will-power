<template>
  <div id="panel" :style="styleBorder">
    <div class="divTitle">
      <img class="img" :src="imgSrc" alt="" srcset="" />
      <span class="title">{{ title }}</span>
    </div>
    <el-button
      class="buttonClose"
      icon="el-icon-close"
      circle
      @click="closePanel"
    ></el-button>
    <slot name="content" class="slotContent" />
  </div>
</template>
<style scoped>
  .divTitle {
    display: flex;
    font-weight: 200;
    justify-content: flex-start;
    align-items: center;
  }
  .buttonClose {
    position: absolute;
    right: 5px;
    top: 13px;
    border: transparent none;
    background-color: transparent;
    font-size: 25px;
  }
  .title {
    font-size: 1.5rem;
    margin-left: 10px;
  }
  .img {
    display: inline;
    position: relative;
    width: 35px;
    height: 35px;
    bottom: 5px;
  }
  #panel {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    position: absolute;
    width: 40%;
    top: 150px;
    height: calc(100vh - 270px);
    left: 50px;
    overflow-y: auto;
    box-sizing: border-box;
    box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 1200px) {
    #panel {
      width: 80%;
      left: 10%;
    }
  }
</style>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      title: String,
      imgSrc: String,
      color: String,
      closePanel: Function
    },
    computed: {
      styleBorder() {
        return `border: ${this.color ? this.color : 'transparent'} solid 8px;`;
      }
    },
    methods: {}
  };
</script>
