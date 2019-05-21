<template>
  <div>
    <DialogView />
    <LoadingView :progress="loadingProgress" :total="150" />

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
    <PixiCanvas @loading="updatePixiLoadingProgress" :camera="camera" />
    <KnightChooser />
    <ErrorMessage
      v-if="isError"
      :errorMessage="errorMessage"
      :errorType="errorType"
    />
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
  import Vue from 'vue';
  import ErrorMessage from 'components/home/ErrorMessage.vue';
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
  export const busError = new Vue();
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
      AchievementPanel,
      ErrorMessage
    },
    data() {
      return {
        pixiLoadingProgress: 0,
        apiLoadingProgress: 0,
        isWillPanelOpen: false,
        isEquipmentPanelOpen: false,
        isAchievementPanelOpen: false,
        isError: false,
        errorMessage: '',
        errorType: '',
        ICON_ATTACK: ASSETS_UI['IconAttack.png']
      };
    },
    computed: {
      loadingProgress() {
        return this.pixiLoadingProgress + this.apiLoadingProgress;
      },
      camera() {
        if (this.loadingProgress !== 150) {
          return -1;
        }
        return this.isWillPanelOpen ||
          this.isEquipmentPanelOpen ||
          this.isAchievementPanelOpen
          ? 0
          : 1;
      },
      ...mapState('auth', ['accessToken', 'user'])
    },
    methods: {
      updatePixiLoadingProgress(progress) {
        this.pixiLoadingProgress = Math.round(progress);
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
        this.patchKnight([this.user._id, {}, { query: { action: 'attack' } }]);
      },
      ...mapActions('auth', ['authenticate']),
      ...mapActions('commitments', { findCommitments: 'find' }),
      ...mapActions('perseverances', { findPerseverances: 'find' }),
      ...mapActions('restraints', { findRestraints: 'find' }),
      ...mapActions('equipments', { findEquipments: 'find' }),
      ...mapActions('knights', { getKnight: 'get', patchKnight: 'patch' }),
      ...mapActions('battles', { getBattle: 'get' })
    },
    async mounted() {
      busError.$on('error', e => {
        this.isError = true;
        // this.errorMessage = e.errorMessage;
        this.errorType = e.message;
      });
      try {
        if (!this.accessToken && !window.localStorage.getItem('feathers-jwt')) {
          this.$router.push('/login');
        }
        try {
          let result = await this.authenticate();
          console.log('auth' + result);
        } catch (e) {
          if (e.message.includes('timed out')) {
            throw new Error('network');
          } else {
            throw new Error('authenticate');
          }
        }
        try {
          await this.findCommitments({ query: { userId: this.user._id } });
          await this.findPerseverances({ query: { userId: this.user._id } });
          await this.findRestraints({ query: { userId: this.user._id } });
          await this.getKnight(this.user._id);
          await this.getBattle(this.user._id);
          await this.findEquipments({ query: { userId: this.user._id } });
        } catch (e) {
          console.log(e.stack);
          throw new Error('network');
        }
      } catch (e) {
        busError.$emit('error', e);
        return;
      }
      this.apiLoadingProgress += 50;
    }
  };
</script>
