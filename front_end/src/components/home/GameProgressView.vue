<template>
  <div id="divContainer">
    <el-button
      class="buttonBossFight"
      v-if="levelProgress == 5"
      @click="enterBossFight()"
      >Fight the boss</el-button
    >
    <el-button
      class="buttonBossFight"
      v-if="levelProgress > 5"
      @click="giveUpBossFight()"
      >Give Up</el-button
    >
    <span id="spanStage">
      LEVEL {{ level }}
      <span v-if="levelProgress <= 5">{{ levelProgress }}/5</span>

      <span v-if="levelProgress > 5">BOSS </span>
    </span>
    <span>
      <span class="spanMonsterName">{{ name }}</span>
      <img class="iconDamage" :src="ICON_DAMAGE" alt="" />
      <span class="spanDamage">{{ damage }}</span>
    </span>
    <Bar class="barMonsterHp" type="monsterHp" :value="hp" :maxValue="maxHp" />
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
    display: block;
    font-size: 2.6rem;
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
    width: 240px;
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
  .iconDamage {
    width: 15px;
    height: 15px;
  }
  .spanMonsterName {
    position: fixed;
    font-family: 'silom';
    font-size: 1em;
    right: 65px;
  }
  .spanDamage {
    font-family: 'silom';

    color: #661666;
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
  import { mapFields } from '../../utils';
  import { ASSETS_UI } from 'assets';
  import Bar from 'components/shared/Bar.vue';
  export default {
    components: { Bar },
    data() {
      return {
        ICON_DAMAGE: ASSETS_UI['IconSkull.png']
      };
    },
    computed: {
      ...mapGetters('users', { user: 'current' }),
      ...mapGetters('battles', { battle: 'current' }),
      ...mapFields('battle', [
        'hp',
        'maxHp',
        'level',
        'levelProgress',
        'name',
        'damage'
      ])
    },
    methods: {
      ...mapActions('battles', { patchBattle: 'patch' }),
      enterBossFight() {
        this.patchBattle([
          this.user._id,
          {},
          { query: { action: 'enterBossFight' } }
        ]);
      },
      giveUpBossFight() {
        this.patchBattle([
          this.user._id,
          {},
          { query: { action: 'giveUpBossFight' } }
        ]);
      }
    },
    mounted() {}
  };
</script>
