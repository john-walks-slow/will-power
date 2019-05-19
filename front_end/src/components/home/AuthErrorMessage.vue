<template>
  <el-dialog
    title="Authentication error"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <span>Something went wrong. Please log in again</span>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="
          dialogVisible = false;
          $router.push('/login');
        "
        >Ok</el-button
      >
    </span>
  </el-dialog>
</template>
<style scoped>
</style>
<script>
  export default {};
</script>

