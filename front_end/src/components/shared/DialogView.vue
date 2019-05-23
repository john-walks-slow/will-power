<template>
  <transition name="fade">
    <el-main
      v-if="dialogContent"
      id="backgroundDialog"
      @click.native="nextPage"
    >
      <el-card id="cardDialog" shadow="always">
        <img id="imgAvatar" v-if="avatar" :src="avatar" />
        <div v-if="speaker" slot="header" class="clearfix">
          <b>{{ speaker }}</b>
        </div>
        <div id="divDialogContent">
          <vue-typed-js
            id="typedDialog"
            :key="currentPage"
            :strings="[sentence]"
            :autoInsertCss="true"
            :typeSpeed="10"
            :showCursor="false"
          >
            <p class="typing"></p>
          </vue-typed-js>
        </div>
      </el-card>
    </el-main>
  </transition>
</template>
<style scoped>
  #backgroundDialog {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #00000080;
    z-index: 100;
  }
  #divDialogContent {
    width: 100%;
    height: 100%;
    text-align: left;
  }
  .typing {
    overflow-wrap: break-word;
  }
  #cardDialog {
    overflow: visible;
    max-width: 700px;
    width: 60%;
    min-height: 150px;
    position: fixed;
    bottom: 5%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 101;
  }
  #imgAvatar {
    width: 150px;
    position: absolute;
    bottom: 150px;
    right: 0px;
    margin: auto;
    z-index: 102;
  }
</style>

<script>
  import dialogues from 'models/dialogues.js';
  import { ASSETS_AVATAR } from 'assets';
  import { mapGetters, mapActions } from 'vuex';
  import { mapFields } from '../../utils';
  export default {
    data() {
      return {
        currentPage: 1
      };
    },
    computed: {
      ...mapGetters('dialogues', { dialogues: 'list' }),
      currentDialog() {
        return this.dialogues.length >= 1 ? this.dialogues[0] : null;
      },
      ...mapFields('currentDialog', ['dialogId', '_id']),
      dialogContent() {
        return dialogues[this.dialogId];
      },
      currentContent() {
        return this.dialogContent && this.currentPage
          ? this.dialogContent[this.currentPage - 1]
          : null;
      },
      speaker() {
        return this.currentContent ? this.currentContent.speaker : null;
      },
      avatar() {
        if (this.speaker === 'Knight') {
          return ASSETS_AVATAR[`${this.$store.state.knight.id}.gif`];
        }
        return this.speaker
          ? ASSETS_AVATAR.hasOwnProperty(`${this.speaker}.png`)
            ? ASSETS_AVATAR[this.speaker]
            : null
          : null;
      },
      sentence() {
        return this.currentContent ? this.currentContent.sentence : null;
      }
    },
    methods: {
      ...mapActions('dialogues', { removeDialog: 'remove' }),
      async nextPage() {
        if (this.currentPage) {
          if (this.currentPage >= this.dialogContent.length) {
            this.currentPage = 1;
            await this.removeDialog(this._id);
          } else {
            this.currentPage++;
          }
        }
      }
    }
  };
</script>
