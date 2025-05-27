<script setup>
import { ref, getCurrentInstance, reactive, nextTick } from "vue";
import message from "@/utils/Message.js";
import api from "@/api/api.js";
import confirm from "@/utils/Confirm.js";

const { proxy } = getCurrentInstance();
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "名称",
    prop: "categoryName",
    width: 200,
  },
  {
    label: "简介",
    prop: "categoryDesc",
  },
  {
    label: "博客数量",
    prop: "blogCount",
    width: 100,
  },
  {
    label: "操作",
    prop: "operation",
    width: 280,
    scopedSlots: "op",
  },
];
const tableData = reactive({});
const tableOptions = reactive({
  exHeight: 10,
  showIndex: false,
});
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  });
  if (!result) {
    return;
  }
  tableData.list = result.data;
  // console.log("tableData:", tableData.list);
};

const dialogConfig = reactive({
  title: "标题",
  buttons: [
    {
      text: "取消",
      type: "primary",
      click: () => {
        console.log("取消");
        dialogConfig.showDialog = false;
      },
    },
    {
      text: "确定",
      type: "success",
      click: () => {
        submitForm();
      },
    },
  ],
  showClose: true,
  showDialog: false,
});

// form 相关
// 新增、修改
const formData = reactive({});
const formDataRef = ref();
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称", trigger: [] }],
  cover: [{ required: false, message: "请输入封面", trigger: [] }],
  categoryDesc: [{ required: false, message: "请输入简介", trigger: [] }],
};
const showEdit = (type, data) => {
  dialogConfig.showDialog = true;
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

const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData);
    let result = await proxy.Request({
      url: api.saveCategory,
      params: params,
    });
    if (!result) {
      return;
    }
    dialogConfig.showDialog = false;
    message.success("保存成功");
    loadDataList();
  });
};

// 删除
const del = (data) => {
  confirm(`确定要删除${data.categoryName}吗？`, "info", async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: { categoryId: data.categoryId },
    });
    if (!result) {
      return;
    }
    message.success("删除成功");
    loadDataList();
  });
};

//排序
const changeSort = async (index, type) => {
  let categoryList = tableData.list;
  if ((type == "up" && index == 0) || (type == "down" && index == categoryList.length - 1)) {
    message.error("无法移动");
    return;
  }
  const number = type == "up" ? -1 : 1;
  const temp = categoryList[index];

  categoryList.splice(index, 1);
  categoryList.splice(index + number, 0, temp);

  const result = await proxy.Request({
    url: api.changeCategorySort,
    dataType: "json",
    params: categoryList,
  });

  if (!result) {
    return;
  }

  message.success("排序成功");
  loadDataList();
};
</script>

<template>
  <div>
    <el-button type="success" @click="showEdit('add')">新增分类</el-button>
    <Table
      :columns="columns"
      :showPagination="false"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <template #cover="{ index, row }">
        <cover :cover="row.cover"></cover>
      </template>
      <template #op="{ index, row }">
        <el-button type="primary" size="small" plain @click="showEdit('edit', row)">编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" plain @click="del(row)">删除</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          type="primary"
          size="small"
          plain
          :disabled="index == 0"
          @click="changeSort(index, 'up')"
          >上移</el-button
        >
        <el-divider direction="vertical"></el-divider>
        <el-button
          type="primary"
          size="small"
          plain
          :disabled="index == tableData.list.length - 1"
          @click="changeSort(index, 'down')"
          >下移</el-button
        >
      </template>
    </Table>
    <Dialog
      v-model:show="dialogConfig.showDialog"
      :title="dialogConfig.title"
      :showClose="dialogConfig.showClose"
      :buttons="dialogConfig.buttons"
    >
      <template #body>
        <el-form
          :model="formData"
          class="edit-form"
          :rules="rules"
          ref="formDataRef"
          label-width="auto"
        >
          <el-form-item prop="categoryName" label="名称">
            <el-input
              v-model="formData.categoryName"
              placeholder="请输入名称"
              prefix-icon=""
              size="large"
              @keyup.enter=""
            />
          </el-form-item>
          <el-form-item prop="cover" label="封面">
            <CoverUpload v-model="formData.cover"></CoverUpload>
          </el-form-item>
          <el-form-item prop="categoryDesc" label="简介">
            <el-input
              v-model="formData.categoryDesc"
              placeholder="请输入简介"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
              @keyup.enter=""
            />
          </el-form-item> </el-form
      ></template>
    </Dialog>
  </div>
</template>

<style scoped></style>
