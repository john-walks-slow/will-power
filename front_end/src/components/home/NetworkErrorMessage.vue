<template>
  <el-dialog title="Network error" :visible.sync="dialogVisible" width="30%">
    <span>Something went wrong, please refresh the page.</span>
    <span slot="footer" class="dialog-footer">
      <el-button
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
    </span>
  </el-dialog>
</template>
<style scoped>
</style>
<script>
  export default {};
</script>
