<script setup>
import EditorHtml from "@/components/EditorHtml.vue";
import { getCurrentInstance, ref, reactive, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const formData = reactive({});
const formDataRef = ref();
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称", trigger: [] }],
  categoryDesc: [{ required: false, message: "请输入简介", trigger: [] }],
};
const showEdit = (type, data) => {
  nextTick(() => {
    formDataRef.value.resetFields();
    if (type === "add") {
      dialogConfig.title = "新增分类";
    } else if (type === "edit") {
      dialogConfig.title = "编辑分类";
      Object.assign(formData, data);
    }
  });
};
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
  <el-form :model="formData" class="edit-form" :rules="rules" ref="formDataRef" label-width="auto">
    <el-form-item prop="categoryName" label="名称">
      <el-input
        v-model="formData.categoryName"
        placeholder="请输入名称"
        prefix-icon=""
        size="large"
        @keyup.enter=""
      /> </el-form-item
    ><
    <el-form-item prop="categoryDesc" label="简介">
      <el-input
        v-model="formData.categoryDesc"
        placeholder="请输入简介"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 4 }"
        @keyup.enter=""
      />
    </el-form-item>
    <el-button type="primary" @click="showEdit">保存</el-button>
  </el-form>
</template>

<style scoped></style>
