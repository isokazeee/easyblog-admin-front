<script setup>
import EditorHtml from "@/components/EditorHtml.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();

const test = async () => {
  let result = await proxy.Request({
    url: "/api/blog/getBlogById",
    params: {
      blogId: "IqACygRukt",
    },
  });
};
</script>

<template>
  <button @click="test">测试</button>
</template>

<style scoped></style>
