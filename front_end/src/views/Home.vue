<template>
  <div>
    <EffectCanvas />
    <DialogView />
    <LoadingView :progress="loadingProgress" :total="150" />
    <KnightStatusView />
    <MenuBar
      @toggleWillPanel="toggleWillPanel"
      @toggleEquipmentPanel="toggleEquipmentPanel"
      @toggleAchievementPanel="toggleAchievementPanel"
      @toggleLeaderboardPanel="toggleLeaderboardPanel"
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
    <LeaderboardPanel
      :open="isLeaderboardPanelOpen"
      @close="toggleLeaderboardPanel"
    />
    <!-- <el-tooltip class="item" effect="dark" content="Attack" placement="top">
      <el-button class="buttonAttack" @click="attack">
        <div>
          <img class="iconAttack" :src="ICON_ATTACK" alt="" srcset="" />
        </div>
      </el-button>
    </el-tooltip> -->
    <PixiCanvas @loading="updatePixiLoadingProgress" :camera="camera" />
    <KnightChooser />
    <ErrorMessage />
    <GameMessage />
  </div>
</template>
<style>
</style>

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
  import LoadingView from 'components/LoadingView.vue';
  import DialogView from 'components/shared/DialogView.vue';
  import KnightStatusView from 'components/home/KnightStatusView.vue';
  import MenuBar from 'components/home/MenuBar.vue';
  import GameProgressView from 'components/home/GameProgressView.vue';
  import WillPanel from 'components/home/WillPanel/WillPanel.vue';
  import EquipmentPanel from 'components/home/EquipmentPanel/EquipmentPanel.vue';
  import AchievementPanel from 'components/home/AchievementPanel/AchievementPanel.vue';
  import LeaderboardPanel from 'components/home/LeaderboardPanel/LeaderboardPanel.vue';
  import GameMessage from 'components/home/GameMessage.vue';
  import ErrorMessage from 'components/home/ErrorMessage.vue';
  import { busError } from 'components/home/ErrorMessage.vue';
  import PixiCanvas from '../components/home/PixiCanvas.vue';
  import EffectCanvas from 'components/home/EffectCanvas.vue';

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
      GameProgressView,
      AchievementPanel,
      ErrorMessage,
      GameMessage,
      EffectCanvas,
      LeaderboardPanel
    },
    data() {
      return {
        pixiLoadingProgress: 0,
        apiLoadingProgress: 0,
        isWillPanelOpen: false,
        isEquipmentPanelOpen: false,
        isAchievementPanelOpen: false,
        isLeaderboardPanelOpen: false,

        isError: false,
        errorMessage: '',
        errorType: ''
        // ICON_ATTACK: ASSETS_UI['IconAttack.png']
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
          this.isLeaderboardPanelOpen ||
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
        this.isEquipmentPanelOpen = false;
        this.isAchievementPanelOpen = false;
        this.isLeaderboardPanelOpen = false;
      },
      toggleEquipmentPanel() {
        this.isEquipmentPanelOpen = !this.isEquipmentPanelOpen;
        this.isWillPanelOpen = false;
        this.isAchievementPanelOpen = false;
        this.isLeaderboardPanelOpen = false;
      },
      toggleAchievementPanel() {
        this.isAchievementPanelOpen = !this.isAchievementPanelOpen;
        this.isEquipmentPanelOpen = false;
        this.isWillPanelOpen = false;
        this.isLeaderboardPanelOpen = false;
      },
      toggleLeaderboardPanel() {
        this.isLeaderboardPanelOpen = !this.isLeaderboardPanelOpen;
        this.isEquipmentPanelOpen = false;
        this.isWillPanelOpen = false;
        this.isAchievementPanelOpen = false;
      },
      ...mapActions('auth', ['authenticate']),
      ...mapActions('commitments', { findCommitments: 'find' }),
      ...mapActions('perseverances', { findPerseverances: 'find' }),
      ...mapActions('restraints', { findRestraints: 'find' }),
      ...mapActions('equipments', { findEquipments: 'find' }),
      ...mapActions('dialogues', { findDialogues: 'find' }),
      ...mapActions('messages', { findMessages: 'find' }),
      ...mapActions('knights', { getKnight: 'get', patchKnight: 'patch' }),
      ...mapActions('battles', { getBattle: 'get' }),
      ...mapActions('users', { findUsers: 'find' })
    },
    async mounted() {
      // window.document.body.style.cursor = `url(${ASSETS_UI['cursor.png']}), auto`;
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
          await this.findMessages({ query: { userId: this.user._id } });
          await this.findDialogues({ query: { userId: this.user._id } });
          await this.findUsers({ query: { leaderboard: true } });
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
