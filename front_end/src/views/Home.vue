<template>
  <div>
    <DialogView />
    <LoadingView :progress="loadingProgress" />

    <KnightStatusView />
    <MenuBar
      @toggleWillPanel="toggleWillPanel"
      @toggleEquipmentPanel="toggleEquipmentPanel"
      @toggleAchievementPanel="toggleAchievementPanel"
    />
    <GameProgressView />
    <WillPanel :open="isWillPanelOpen" @close="toggleWillPanel" />
    <EquipmentPanel
      :open="isEquipmentPanelOpen"
      @close="toggleEquipmentPanel"
    />
    <AchievementPanel
      :open="isAchievementPanelOpen"
      @close="toggleAchievementPanel"
    />
    <el-tooltip class="item" effect="dark" content="Attack" placement="top">
      <el-button class="buttonAttack" @click="attack">
        <div>
          <img class="iconAttack" :src="ICON_ATTACK" alt="" srcset="" />
        </div>
      </el-button>
    </el-tooltip>
    <PixiCanvas
      @loading="updateLoadingProgress"
      :knight="knight"
      :monster="monster"
      :scene="scene"
      :camera="camera"
      :equipmentAnim="equipmentAnim"
    />
    <KnightChooser />
  </div>
</template>
<style scoped>
  .buttonAttack {
    border-radius: 100px;
    border: #000000 solid 5px;
    box-sizing: content-box;
    position: fixed;
    bottom: 30px;
    width: 80px;
    height: 40px;
    left: calc(50vw - 80px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
  }
  .buttonAttack:hover {
    transform: scale(1.1);
    transition: all 400ms;
  }
  .buttonAttack:active {
    transform: scale(0.7);
    transition: all 200ms;
  }
  .iconAttack {
    height: 40px;
  }

  @media screen and (max-width: 1200px) {
    .buttonAttack {
      left: 18px;
      bottom: 65px;
      height: 5px;
      width: 30px;
    }
    .iconAttack {
      position: relative;
      bottom: 5px;
      height: 20px;
    }
  }
</style>

<script>
  import start from 'stories/index.js';
  import KnightChooser from 'components/home/KnightChooser.vue';
  import LoadingView from 'components/LoadingView.vue';
  import DialogView from 'components/shared/DialogView.vue';
  import KnightStatusView from 'components/home/KnightStatusView.vue';
  import MenuBar from 'components/home/MenuBar.vue';
  import GameProgressView from 'components/home/GameProgressView.vue';
  import WillPanel from 'components/home/WillPanel/WillPanel.vue';
  import EquipmentPanel from 'components/home/EquipmentPanel/EquipmentPanel.vue';
  import AchievementPanel from 'components/home/AchievementPanel/AchievementPanel.vue';

  import PixiCanvas from '../components/home/PixiCanvas.vue';

  import { busPixi } from '../components/home/PixiCanvas.vue';

  import { ASSETS_UI } from 'assets';
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'home',
    components: {
      LoadingView,
      WillPanel,
      EquipmentPanel,
      PixiCanvas,
      DialogView,
      KnightStatusView,
      MenuBar,
      KnightChooser,
      GameProgressView,
      AchievementPanel
    },
    data() {
      return {
        loadingProgress: 0,
        isWillPanelOpen: false,
        isEquipmentPanelOpen: false,
        isAchievementPanelOpen: false,
        ICON_ATTACK: ASSETS_UI['IconAttack.png']
      };
    },
    computed: {
      camera() {
        return this.isWillPanelOpen ||
          this.isEquipmentPanelOpen ||
          this.isAchievementPanelOpen
          ? 0
          : 1;
      },
      knight() {
        return 'KnightFemale';
      },
      monster() {
        return 'Boss2';
      },
      scene() {
        return '2';
      },
      equipmentAnim() {
        return 'AttackMeleeHeavy';
      },
      ...mapState('auth', {
        isLoginSucceed: state => state.auth.user
      }),
      ...mapActions('auth', ['authenticate'])
    },
    methods: {
      updateLoadingProgress(progress) {
        this.loadingProgress = Math.round(progress);
      },
      toggleWillPanel() {
        this.isWillPanelOpen = !this.isWillPanelOpen;
        if (this.isEquipmentPanelOpen) {
          this.isEquipmentPanelOpen = false;
        }
        if (this.isAchievementPanelOpen) {
          this.isAchievementPanelOpen = false;
        }
      },
      toggleEquipmentPanel() {
        this.isEquipmentPanelOpen = !this.isEquipmentPanelOpen;
        if (this.isWillPanelOpen) {
          this.isWillPanelOpen = false;
        }
        if (this.isAchievementPanelOpen) {
          this.isAchievementPanelOpen = false;
        }
      },
      toggleAchievementPanel() {
        this.isAchievementPanelOpen = !this.isAchievementPanelOpen;
        if (this.isWillPanelOpen) {
          this.isWillPanelOpen = false;
        }
        if (this.isEquipmentPanelOpen) {
          this.isEquipmentPanelOpen = false;
        }
      },
      attack() {
        busPixi.$emit('knightAttack', 'attackMeleeHeavy');
      }
    },
    mounted() {
      if (!this.isLoginSucceed) {
        this.$router.push('/login');
      }
    }
  };
</script>
