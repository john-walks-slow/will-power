<template>
  <div class="divContainer" v-if="open">
    <el-card class="card" :body-style="{ padding: '0px' }">
      <img :src="avatarMale" class="avatar" />
      <div style="padding: 14px;">
        <span>Male</span>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="chooseMale"
            >Choose</el-button
          >
        </div>
      </div>
    </el-card>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <img :src="avatarFemale" class="avatar" />
      <div style="padding: 14px;">
        <span>Female</span>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="chooseFemale"
            >Choose</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
  .divContainer {
    position: fixed;
    top: 30%;
    left: calc(50vw - 190px);
  }
  .avatar {
    width: 150px;
  }
  .card {
    padding: 20px;
    border-radius: 10px;
    display: inline-block;
    margin: 30px;
  }
</style>
<script>
  import { ASSETS_AVATAR } from 'assets';
  import Vue from 'vue';
  export const busKnightChooser = new Vue();
  export default {
    data() {
      return {
        open: false,
        avatarMale: ASSETS_AVATAR['KnightMale.gif'],
        avatarFemale: ASSETS_AVATAR['KnightFemale.gif']
      };
    },
    methods: {
      chooseMale() {
        // update knight data
        this.open = false;
      },
      chooseFemale() {
        // update knight data
        this.open = false;
      }
    },
    mounted() {
      busKnightChooser.$on('open', () => {
        this.open = true;
      });
    }
  };
</script>

