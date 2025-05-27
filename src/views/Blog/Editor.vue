<script setup>
import { reactive, ref, nextTick, getCurrentInstance } from "vue";
import Window from "@/components/Window.vue";
import EditorHtml from "@/components/EditorHtml.vue";
import EditorMarkdown from "@/components/EditorMarkdown.vue";
import api from "@/api/api";

const { proxy } = getCurrentInstance();

const showDialog = defineModel("showDialog", {
  type: Boolean,
  default: false,
});

const content = defineModel("content", {
  type: String,
  default: "",
});

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
});

const formDataRef = ref();
const formData = reactive({});

//setting dialog
const settingFormData = reactive({});
const settingFormDataRef = ref();
const settingDialogConfig = reactive({
  title: "",
  buttons: [
    {
      text: "取消",
      type: "primary",
      click: () => {
        console.log("取消");
        settingDialogConfig.showDialog = false;
      },
    },
    {
      text: "确定",
      type: "success",
      click: () => {
        //submit
      },
    },
  ],
  showClose: true,
  showDialog: false,
});

const rules = {
  categoryId: [{ required: true, message: "请选择分类", trigger: "blur" }],
  cover: [{ required: false, message: "请上传封面", trigger: "blur" }],
  type: [
    {
      required: true,
      validator: (rule, value, callback) => {
        // 当类型为转载(假设值为2)时，转载地址必填
        if (settingFormData.type === 2 && !value) {
          callback(new Error("转载类型必须填写转载地址"));
        } else {
          callback();
        }
      },
      message: "请选择类型",
      trigger: "blur",
    },
  ],
  reprintUrl: [{ required: true, message: "请输入转载地址", trigger: "blur" }],
  allowComment: [{ required: true, message: "请选择评论", trigger: "blur" }],
  summary: [{ required: false, message: "请输入内容", trigger: "" }],
  tags: [{ required: false, message: "请输入标签", trigger: "blur" }],
};

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

// editorwindow buttons
const buttons = reactive([
  {
    text: "取消",
    type: "primary",
    click: () => {
      console.log("window取消");
      showDialog.value = false;
    },
  },
  {
    text: "确定",
    type: "success",
    click: () => {
      // show settingDialog
      showSettingDialog();
    },
  },
]);
const showSettingDialog = (type, data) => {
  settingDialogConfig.showDialog = true;
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
  <Window v-model:show="showDialog" :buttons="buttons">
    <template #body>
      <el-form ref="formDataRef" :model="formData">
        <el-form-item prop="title">
          <el-input v-model.trim="props.title" size="large" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item prop="title">
          <!-- <EditorMarkdown v-model:markdownContent="content" :height="props.height"></EditorMarkdown> -->
          <EditorHtml v-model:htmlContent="formData.content" :height="props.height"></EditorHtml>
        </el-form-item>
      </el-form>
    </template>
  </Window>
  <Dialog
    v-model:show="settingDialogConfig.showDialog"
    :title="settingDialogConfig.title"
    :showClose="settingDialogConfig.showClose"
    :buttons="settingDialogConfig.buttons"
    :width="700"
  >
    <template #body>
      <el-form
        :model="settingFormData"
        class="setting-dialog-edit-form"
        :rules="rules"
        ref="settingFormDataRef"
        label-width="100px"
      >
        <el-form-item prop="categoryId" label="分类">
          <el-select
            v-model="settingFormData.categoryId"
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
          </el-select>
        </el-form-item>
        <el-form-item prop="cover" label="封面">
          <CoverUpload v-model="settingFormData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item prop="type" label="博客类型">
          <el-radio-group v-model="settingFormData.type">
            <el-radio value="0">原创</el-radio>
            <el-radio value="1">转载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="reprintUrl" label="转载地址" v-if="settingFormData.type === '1'">
          <el-input v-model="settingFormData.reprintUrl" placeholder="请输入转载地址" />
        </el-form-item>
        <el-form-item prop="allowComment" label="评论">
          <el-radio-group v-model="settingFormData.allowComment">
            <el-radio value="允许">允许</el-radio>
            <el-radio value="不允许">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="summary" label="博客摘要">
          <el-input
            v-model="settingFormData.summary"
            placeholder="未输入摘要，会读取部分原文内容作为摘要"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            @keyup.enter=""
          />
        </el-form-item>
        <el-form-item prop="tags" label="博客 标签">
          <el-input-tag
            v-model="input"
            placeholder="添加标签更容易被搜索引擎收录"
            aria-label="Please click the Enter key after input"
          />
        </el-form-item> </el-form
    ></template>
  </Dialog>
</template>

<style scoped></style>
