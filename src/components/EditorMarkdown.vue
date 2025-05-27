<script setup>
import { ref, getCurrentInstance } from "vue";
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

import api from "@/api/api.js";

const { proxy } = getCurrentInstance();
// highlightjs
import hljs from "highlight.js";

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

const markdownContent = defineModel("markdownContent", {
  type: String,
  default: "",
});

const props = defineProps({
  height: {
    type: String,
    default: "400px",
  },
});

// 上传图片
const handleUploadImage = async (event, insertImage, files) => {
  let result = await proxy.Request({
    url: "/api/file/uploadImage",

    dataType: "file",
    params: {
      file: files[0],
      type: 1,
    },
  });

  if (!result) {
    return;
  }

  const url = api.imgUrl + "/" + result.data.fileName;
  insertImage({
    url,
    desc: "图片",
  });
};
</script>

<template>
  <v-md-editor
    v-model="markdownContent"
    :height="props.height"
    :disabled-menus="[]"
    :include-level="[1, 2, 3, 4, 5, 6]"
    @upload-image="handleUploadImage"
  ></v-md-editor>
</template>

<style scoped>
.v-md-editor {
  flex: 1;
  padding: 10px;
}
</style>
