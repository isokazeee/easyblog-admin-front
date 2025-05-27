<script setup>
import { progressProps } from "element-plus";
import { ref, getCurrentInstance, reactive, nextTick } from "vue";
import api from "@/api/api.js";

import Editor from "./Editor.vue";
const { proxy } = getCurrentInstance();

// 搜索
const rules = {
  titleFuzzy: [{ required: false }],
  status: [{ required: false }],
  categoryId: [{ required: false }],
};

const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "文章信息",
    prop: "blogInfo",
    scopedSlots: "blogInfo",
  },
  {
    label: "编辑器",
    prop: "editorTypeName",
    width: 100,
  },
  {
    label: "类型",
    prop: "type",
    width: 200,
    scopedSlots: "type",
  },
  {
    label: "评论",
    prop: "allowCommentTypeName",
    width: 100,
  },
  {
    label: "状态",
    prop: "statusName",
    width: 100,
  },
  {
    label: "时间",
    prop: "time",
    width: 300,
    scopedSlots: "time",
  },
  {
    label: "操作",
    prop: "opration",
    width: 280,
    scopedSlots: "op",
  },
];
const tableData = reactive({});
const tableOptions = reactive({
  exHeight: 60,
  showIndex: false,
});
const loadDataList = async () => {
  let params = {
    pageNo: tableData.pageNo,
    pageSize: tableData.pageSize,
    ...searchFormData,
  };
  let result = await proxy.Request({
    url: api.loadBlog,
    params: params,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData, result.data);
  console.log("tableData:", tableData.list);
};

const searchFormData = reactive({});
const categoryList = ref([]);

const loadCategoryList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  });
  if (!result) {
    return;
  }
  categoryList.value = result.data;
};
loadCategoryList();

// editorwindow
const windowConfig = reactive({
  title: "",
  buttons: [
    {
      text: "取消",
      type: "primary",
      click: () => {
        console.log("取消");
        windowConfig.showDialog = false;
      },
    },
    {
      text: "确定",
      type: "success",
      click: () => {
        // show settingDialog
      },
    },
  ],
  showClose: true,
  showDialog: false,
});

const content = ref("");

const showEditorWindow = (type, data) => {
  windowConfig.showDialog = true;
  nextTick(() => {
    // formDataRef.value.resetFields();
    // if (type === "add") {
    //   dialogConfig.title = "新增分类";
    // } else if (type === "edit") {
    //   dialogConfig.title = "编辑博客";
    //   Object.assign(formData, data);
    // }
  });
};
</script>

<template>
  <div class="top-panel">
    <el-form
      :model="searchFormData"
      class="search-form"
      :rules="rules"
      ref="searchFormDataRef"
      label-width="auto"
    >
      <el-row gutter="20">
        <el-col :span="4">
          <el-form-item prop="titleFuzzy" label="标题">
            <el-input
              v-model="searchFormData.titleFuzzy"
              placeholder="请输入标题"
              prefix-icon=""
              size="large"
              @keyup.enter=""
            /> </el-form-item
        ></el-col>
        <el-col :span="4">
          <el-form-item prop="status" label="状态">
            <el-select
              v-model="searchFormData.status"
              placeholder="请选择状态"
              @keyup.enter=""
              clearable
              size="large"
              style="width: 240px"
            >
              <el-option label="草稿" :value="0" />
              <el-option label="已发布" :value="1" />
            </el-select> </el-form-item></el-col
        ><el-col :span="4">
          <el-form-item prop="categoryId" label="分类">
            <el-select
              v-model="searchFormData.categoryId"
              placeholder="请选择分类"
              @keyup.enter=""
              clearable
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in categoryList"
                :label="item.categoryName"
                :value="item.categoryId"
              />
            </el-select> </el-form-item></el-col
        ><el-col :span="4">
          <el-form-item>
            <el-button type="success" @click="loadDataList">搜索</el-button>
          </el-form-item></el-col
        ><el-col :span="8" class="add-btn"
          ><el-button type="success" @click="showEditorWindow('add')">新增博客</el-button></el-col
        >
      </el-row>
    </el-form>
  </div>
  <div class="table">
    <Table
      :columns="columns"
      :showPagination="true"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <template #cover="{ index, row }">
        <cover :cover="row.cover"></cover>
      </template>
      <template #blogInfo="{ index, row }">
        <el-row> 标题：{{ row.title }} </el-row>
        <el-row> 分类：{{ row.categoryName }} </el-row>
        <el-row> 作者：{{ row.nickName }} </el-row>
      </template>
      <template #type="{ index, row }">
        <el-row> 类型：{{ row.type ? "转载" : "原创" }} </el-row>
        <el-row v-if="row.type"
          ><el-text truncated>
            转载地址：<el-link underline="hover">{{ row.reprintUrl }}</el-link>
          </el-text></el-row
        >
      </template>
      <template #time="{ index, row }">
        <el-row> 创建时间：{{ row.createTime }} </el-row>
        <el-row> 更新时间：{{ row.lastUpdateTime }} </el-row>
      </template>
      <template #op="{ index, row }">
        <el-button type="primary" size="small" plain @click="showEdit('edit', row)">编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" plain @click="del(row)">删除</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" plain @click="preview()">预览</el-button>
      </template>
    </Table>
    <Editor
      v-model:showDialog="windowConfig.showDialog"
      v-model:content="content"
      :title="windowConfig.title"
      :height="windowConfig.height"
      :showClose="windowConfig.showClose"
    ></Editor>
  </div>
</template>

<style scoped>
.right-main {
  height: calc(100vh - 180px);
}
.pagination {
  display: flex;
  justify-content: center;
}
.el-input {
  max-width: 240px;
}
.add-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
