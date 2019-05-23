<template>
  <el-dialog :title="title" :visible="currentMessage" width="30%">
    <span>{{ message }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="
          dialogVisible = false;
          removeMessage(_id);
        "
        >{{ button }}</el-button
      >
    </span>
  </el-dialog>
</template>

<style scoped>
</style>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { mapFields } from '../../utils';
  export default {
    computed: {
      ...mapGetters('messages', { messages: 'list' }),
      currentMessage() {
        return this.messages.length >= 1 ? this.messages[0] : null;
      },
      ...mapFields('currentMessage', ['title', 'message', 'button', '_id'])
    },
    methods: {
      ...mapActions('messages', { removeMessage: 'remove' })
    }
  };
</script>
