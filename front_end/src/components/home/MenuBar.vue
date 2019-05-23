<template>
  <div id="divContainer">
    <el-tooltip class="item" effect="dark" content="Equipments" placement="top">
      <el-button
        class="buttonMenu"
        id="buttonEquipmentPanel"
        @click="toggleEquipmentPanel"
        circle
        ><img class="imgButton" :src="ICON_EQUIPMENT" alt="" srcset=""
      /></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="Leaderboard"
      placement="top"
    >
      <el-button
        class="buttonMenu"
        id="buttonLeaderboardPanel"
        @click="toggleLeaderboardPanel"
        circle
        ><img class="imgButton" :src="ICON_LEADERBOARD" alt="" srcset=""
      /></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="Achievements"
      placement="top"
    >
      <el-button
        class="buttonMenu"
        id="buttonAchievementPanel"
        circle
        @click="toggleAchievementPanel"
        ><img class="imgButton" :src="ICON_ACHIEVEMENT" alt="" srcset=""
      /></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="Wills" placement="top">
      <el-button
        class="buttonMenu"
        id="buttonWillPanel"
        @click="toggleWillPanel"
        circle
        ><img class="imgButton" :src="ICON_WILL" alt="" srcset=""
      /></el-button>
    </el-tooltip>
  </div>
</template>
<style scoped>
  #divContainer {
    position: fixed;
    /* left: 380px;
                                                                                                                                                                                                                                                                                      top: 40px; */
    bottom: 30px;
    left: 30px;
  }
  .buttonMenu {
    width: 64px;
    height: 64px;

    z-index: 102;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
    margin: 5px !important;
  }
  #buttonWillPanel {
    border: 4px solid #62e9e3;
  }
  #buttonEquipmentPanel {
    border: 4px solid #e96268;
  }
  #buttonLeaderboardPanel {
    border: 4px solid #ffeb3b;
  }
  #buttonEquipmentPanel .imgButton {
    position: relative;
    right: 2px;
  }

  #buttonAchievementPanel {
    border: 4px solid rgb(229, 123, 255);
  }
  .imgButton {
    width: 32px;
    height: 32px;
    position: relative;
  }
  @media screen and (max-width: 1200px) {
    .buttonMenu {
      width: 44px;
      height: 44px;
    }
    #buttonEquipmentPanel .imgButton {
      position: relative;
      right: 6px;
    }
    .imgButton {
      width: 22px;
      height: 22px;
      right: 5px;
      bottom: 5px;
      position: relative;
    }
    #divContainer {
      left: 10px;
      bottom: 10px;
    }
  }
</style>

<script>
  import { ASSETS_UI } from 'assets';
  export default {
    data() {
      return {
        ICON_EQUIPMENT: ASSETS_UI['IconEquipment.png'],
        ICON_WILL: ASSETS_UI['IconWill.png'],
        ICON_ACHIEVEMENT: ASSETS_UI['IconAchievement.png'],
        ICON_LEADERBOARD: ASSETS_UI['IconLeaderboard.png'],
        ICON_TREASURE: ASSETS_UI['IconTreasure.png']
      };
    },
    methods: {
      toggleWillPanel() {
        this.$emit('toggleWillPanel');
      },
      toggleEquipmentPanel() {
        this.$emit('toggleEquipmentPanel');
      },
      toggleAchievementPanel() {
        this.$emit('toggleAchievementPanel');
      },
      toggleLeaderboardPanel() {
        this.$emit('toggleLeaderboardPanel');
      }
    },
    mounted() {}
  };
</script>
