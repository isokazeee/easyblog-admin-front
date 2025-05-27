<script setup>
import { RouterLink, RouterView } from "vue-router";
import { reactive } from "vue";
import zhCN from "element-plus/es/locale/lang/zh-cn";
import message from "./utils/Message";

const config = reactive({
  max: 1,
});
</script>

<template>
  <el-config-provider :locale="zhCN" :message="config">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
