<template>
  <div>
    <transition name="zoom">
      <Panel
        title="LEADERBOARD"
        :imgSrc="ICON_LEADERBOARD"
        v-if="open"
        color="#ffeb3b"
        :closePanel="closePanel"
      >
        <div slot="content" class="divLeaderboardContainer">
          <div class="divListTitle">
            <span>Rank</span>
            <span>Nickname</span>
            <span>Level</span>
          </div>
          <el-divider class="dividerList" />
          <template v-for="(topUser, rank) in topUsers">
            <div
              class="divUserItem"
              :key="topUser._id"
              :class="{ me: topUser._id === user._id }"
            >
              <div style="margin-left:10px">{{ rank + 1 }}</div>
              <div class="nicknameItem">
                {{ topUser.nickname }}
              </div>
              <div style="margin-right:10px">{{ topUser.level }}</div>
            </div>
          </template>
        </div>
      </Panel>
    </transition>
  </div>
</template>
<style>
  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 5px 0;
  }
</style>

<style scoped>
  .divUserItem {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
  }
  .divListTitle {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
  }

  .divLeaderboardContainer {
    overflow-y: auto;
    height: calc(100% - 40px);
    padding: 10px;
  }
  .divUserItem.me {
    background-color: #fff8bc;
  }
</style>

<script>
  import Panel from 'components/shared/Panel.vue';
  import { ASSETS_UI, ASSETS_EQUIPMENT } from 'assets';
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { mapFields } from '../../../utils';

  export default {
    components: {
      Panel
    },
    props: {
      open: Boolean
    },
    data() {
      return {
        ICON_LEADERBOARD: ASSETS_UI['IconLeaderboard.png']
      };
    },
    computed: {
      ...mapGetters('users', { topUsers: 'list', user: 'current' })
    },
    methods: {
      closePanel() {
        this.$emit('close');
      }
    },
    mounted() {
      console.log(this.topUsers);
    }
  };
</script>

