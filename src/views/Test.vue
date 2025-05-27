<script setup>
import EditorHtml from "@/components/EditorHtml.vue";
import { ref } from "vue";

const htmlContent = ref("<p>这是一个测试内容</p>");
</script>

<template>
  <EditorHtml v-model:htmlContent="htmlContent"></EditorHtml>
  {{ htmlContent }}
</template>

<style scoped></style>
