<script setup>
import { ref } from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const editorRef = shallowRef();

// 内容 HTML
const htmlContent = defineModel("htmlContent", {
  type: String,
  default: "",
});

const props = defineProps({
  height: {
    type: Number,
    default: 500, // 默认高度为 500px
  },
});

const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 3 * 1024 * 1024, // 限制上传图片大小为 3MB
      server: "/api/file/uploadImage4WangEditor",
      customInsert(res, insertFn) {
        insertFn(res.data.url, "", "");
      },
    },
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const focus = () => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
};
</script>

<template>
  <div style="border: 1px solid #ccc" class="htmleditor">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="Editor"
      :style="{ 'min-height': '850px', 'overflow-y': 'hidden' }"
      v-model="htmlContent"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @click="focus"
    />
  </div>
</template>

<style scoped>
.htmleditor {
  flex: 1;
  .Editor {
    cursor: text;
  }
}
</style>
