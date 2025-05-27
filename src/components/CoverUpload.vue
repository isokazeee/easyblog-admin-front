<script setup>
import { ref, getCurrentInstance } from "vue";
import api from "@/api/api.js";

const { proxy } = getCurrentInstance();

const model = defineModel({
  type: String,
  default: "",
});

const uploadImage = async (file) => {
  let result = await proxy.Request({
    url: api.uploadUrl,
    dataType: "file",
    params: {
      file: file.file,
      type: 0,
    },
  });
  const fileName = result.data.fileName;

  model.value = fileName;

  console.log("modelValue:", model.value);
};
</script>

<template>
  <el-upload
    :show-file-list="false"
    name="file"
    accept="image/*"
    class="cover-uploader"
    :http-request="uploadImage"
  >
    <el-image
      v-if="modelValue"
      style="width: 178px; height: 178px"
      fit="cover"
      :src="api.imgUrl + '/' + modelValue"
    />
    <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<style scoped></style>
