<template>
  <el-dialog
    title="Something went wrong"
    :visible.sync="dialogVisible"
    class="dialog"
    width="300px"
  >
    <span v-if="errorType === 'network'"
      >{{ errorMessage ? errorMessage : '' + '\n' }}Please check your network
      and refresh the page.
    </span>
    <span v-if="errorType === 'authenticate'">Please login again. </span>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="errorType === 'network'"
        type="primary"
        @click="
          dialogVisible = false;
          $router.go({
            path: $router.path,
            query: {
              t: +new Date()
            }
          });
        "
        >Ok</el-button
      >
      <el-button
        v-if="errorType === 'authenticate'"
        type="primary"
        @click="$router.push('/login')"
        >Ok</el-button
      >
    </span>
  </el-dialog>
</template>
<style scoped>
  .dialog /deep/ div {
    margin-top: calc(50vh - 150px) !important;
    margin-bottom: auto !important;
    height: 300px;
  }
</style>
<script>
  export default {
    props: {
      errorMessage: String,
      errorType: String
    },
    data() {
      return {
        dialogVisible: true
      };
    }
  };
</script>
