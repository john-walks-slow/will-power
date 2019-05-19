<template>
  <div id="divContainer">
    <el-button class="buttonBossFight" v-if="levelProgress == 10"
      >Fight the boss</el-button
    >
    <el-button class="buttonBossFight" v-if="levelProgress > 10"
      >Give Up</el-button
    >
    <span id="spanStage"
      >LEVEL {{ level }}
      <span v-if="levelProgress <= 10">{{ levelProgress }}/10</span>

      <span v-if="levelProgress > 10">BOSS </span>
    </span>

    <div>
      <el-progress
        class="barMonsterHp"
        :percentage="Math.round((monsterHp / monsterMaxHp) * 100)"
        :stroke-width="27"
        :text-inside="true"
        color="#a062e9"
      />
      <span class="spanBar">{{ monsterHp }}/{{ monsterMaxHp }} HP</span>
    </div>
  </div>
</template>
<style scoped>
  .buttonBossFight {
    /* position: relative;
                                                                                                                                                                                                                          bottom: 10px; */
    border: none;
    background-color: black;
    color: white;
    font-family: 'silom';
    padding: 8px;
    font-size: 1rem;
    margin-bottom: 10px;
  }
  #divContainer {
    bottom: 20px;
    right: 30px;
    z-index: 0;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  #spanStage {
    font-family: 'silom';

    font-size: 3rem;
  }
  .spanBar {
    position: absolute;
    color: #000000;
    font-size: 14pt;
    right: 16px;
    bottom: 7px;
    font-family: 'silom';
  }
  .barMonsterHp {
    width: 300px;
    max-width: 40vw;
    margin-top: 10px;
  }
  .barMonsterHp /deep/ div /deep/ .el-progress-bar__outer {
    border: 5px solid white;
    border-radius: 12px;
    background-color: #fff4f4;
  }
  .barMonsterHp
    /deep/
    div
    /deep/
    .el-progress-bar__outer
    .el-progress-bar__inner {
    border-radius: 10px;
  }
  .barMonsterHp
    /deep/
    div
    /deep/
    div
    /deep/
    div
    /deep/
    .el-progress-bar__innerText {
    display: none;
  }
  @media screen and (max-width: 1200px) {
    #spanStage {
      font-size: 1.5rem;
    }
    #divContainer {
      bottom: 15px;
      right: 10px;
    }
  }
</style>
<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    data() {
      return {
        gameProgress: null
      };
    },
    computed: {
      ...mapGetters('users', { user: 'current' }),
      level() {
        return this.gameProgress ? this.gameProgress.level : 0;
      },
      levelProgress() {
        return this.gameProgress ? this.gameProgress.levelProgress : 0;
      },
      monsterHp() {
        return this.$store.state.monster.hp;
      },
      monsterMaxHp() {
        return this.$store.state.monster.maxHp;
      }
    },
    methods: {
      ...mapActions('game-progress', { findGameProgress: 'find' })
    },
    mounted() {
      this.findGameProgress({
        query: {
          userId: this.user._id
        }
      }).then(v => {
        this.gameProgress = v.data[0];
      });
    }
  };
</script>