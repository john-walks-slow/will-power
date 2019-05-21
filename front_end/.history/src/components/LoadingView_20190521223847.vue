<template>
  <transition name="fade">
    <el-container v-if="show" id="backgroundLoading">
      <div id="divLoading">
        <img class="logo" :src="LOGO" alt="" srcset="" />
        <el-progress
          color="#b0f4f1"
          :show-text="false"
          :stroke-width="5"
          :percentage="(progress / total) * 100"
        ></el-progress>
      </div>
    </el-container>
  </transition>
</template>
<style scoped>
  #backgroundLoading {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 500;
  }
  .logo {
    display: block;
    margin: auto;
    padding-bottom: 10px;
    width: 250px;
  }
  #divLoading {
    width: 70vw;
  }
</style>

<script>
  import { ASSETS_UI } from 'assets';
  export default {
    props: {
      progress: Number,
      total: Number
    },
    data() {
      return {
        show: true,
        LOGO: ASSETS_UI['logo.png']
      };
    },
    watch: {
      progress(val) {
        if (val === this.total) {
          setTimeout(() => {
            console.log('test');
            this.show = false;
          }, 0);
        }
      }
    }
  };
</script>
