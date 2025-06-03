<script setup>
import { reactive, ref, nextTick, getCurrentInstance } from "vue";
import Window from "@/components/Window.vue";
import EditorHtml from "@/components/EditorHtml.vue";
import EditorMarkdown from "@/components/EditorMarkdown.vue";
import message from "@/utils/Message";
import api from "@/api/api";
import { rowContextKey } from "element-plus";

const { proxy } = getCurrentInstance();

const emit = defineEmits(["loadList"]);

// editorWindow表单
const blogFormDataRef = ref(null);
const blogFormData = ref({});

const windowConfig = reactive({
  title: "",
  content: "",
  buttons: [
    {
      text: "取消",
      type: "primary",
      click: () => {
        console.log("window取消");
        windowConfig.showDialog = false;
        emit("loadList");
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
    {
      text: "重置",
      type: "info",
      click: () => {
        blogFormDataRef.value.resetFields();
      },
    },
  ],
  showClose: true,
  showDialog: false,
});

const init = (type, data) => {
  windowConfig.showDialog = true;
  windowConfig.type = type;
  blogFormData.value = {};
  settingFormData.value = { tag: [] };

  nextTick(() => {
    if (!blogFormDataRef.value) {
      console.log("blogFormDataRef is null");
    }
    blogFormDataRef.value.resetFields();
    if (type === "add") {
      getUserInfo();
    } else if (type === "edit") {
      // console.log("data", data.blogId);
      getBlogContent(data.blogId);
    }
  });
};
defineExpose({
  init,
});

const getUserInfo = async () => {
  const result = await proxy.Request({
    url: api.getUserInfo,
  });

  if (!result) {
    return;
  }
  blogFormData.value.editorType = result.data.editorType;
  // console.log("result:", blogFormData.value);
};

const getBlogContent = async (blogId) => {
  const result = await proxy.Request({
    url: api.getBlog,
    params: {
      blogId,
    },
  });
  if (!result) {
    return;
  }
  blogFormData.value.blogId = result.data.blogId;
  blogFormData.value.title = result.data.title;
  blogFormData.value.content = result.data.content;
  blogFormData.value.markdownContent = result.data.markdownContent;
  blogFormData.value.editorType = result.data.editorType;
  settingFormData.value.categoryId = result.data.categoryId;
  settingFormData.value.cover = result.data.cover;
  settingFormData.value.summary = result.data.summary;
  settingFormData.value.tag = result.data.tag ? result.data.tag.split("|") : [];
  settingFormData.value.type = result.data.type;
  settingFormData.value.reprintUrl = result.data.reprintUrl;
  settingFormData.value.allowComment = result.data.allowComment;
  // console.log("settingFormData", settingFormData);
};

const setHtmlContent = (contenr, htmlContent) => {
  blogFormData.value.content = htmlContent;
};

//setting dialog
let settingFormData = ref({ tag: [] });
const settingFormDataRef = ref(null);
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
        submitBlog();
      },
    },
    {
      text: "重置",
      type: "info",
      click: () => {
        //save
        settingFormDataRef.value.resetFields();
      },
    },
  ],
  showClose: true,
  showDialog: false,
});

const blogFormRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  markdownContent: [{ required: true, message: "请输入内容", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
};
const settingFormRules = {
  categoryId: [{ required: true, message: "请选择博客分类", trigger: "blur" }],
  cover: [{ required: false, message: "请上传封面", trigger: "blur" }],
  type: [
    {
      required: true,

      message: "请选择博客类型",
      trigger: "blur",
    },
  ],
  reprintUrl: [{ required: true, message: "请输入转载地址", trigger: "blur" }],
  allowComment: [{ required: true, message: "请选择是否允许评论", trigger: "blur" }],
  summary: [{ required: false, message: "请输入内容", trigger: "" }],
  tag: [{ required: false, message: "请输入标签", trigger: "blur" }],
};

// 专题分类
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

const showSettingDialog = () => {
  blogFormDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    settingDialogConfig.showDialog = true;
    nextTick(() => {
      if (windowConfig.type == "add") {
        console.log("add");
        settingFormDataRef.value.resetFields();
      }
    });
  });
};

const submitBlog = () => {
  settingFormDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = {
      ...blogFormData.value,
      ...settingFormData.value,
    };
    console.log(params);
    params.tag = params.tag.join("|");
    let result = await proxy.Request({
      url: api.saveBlog,
      params,
    });

    if (!result) {
      return;
    }

    message.success("保存博客成功");
    settingDialogConfig.showDialog = false;
    windowConfig.showDialog = false;
    emit("loadList");
  });
};
</script>

<template>
  <Window v-model:show="windowConfig.showDialog" :buttons="windowConfig.buttons">
    <template #body>
      <el-form :model="blogFormData" :rules="blogFormRules" ref="blogFormDataRef">
        <el-form-item prop="title">
          <el-input v-model="blogFormData.title" size="large" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item prop="markdownContent" v-if="blogFormData.editorType">
          <EditorMarkdown
            v-model:markdownContent="blogFormData.markdownContent"
            :height="windowConfig.height"
            @htmlContent="setHtmlContent"
          ></EditorMarkdown>
        </el-form-item>
        <el-form-item prop="content" v-else>
          <EditorHtml
            v-model:htmlContent="blogFormData.content"
            :height="windowConfig.height"
          ></EditorHtml>
        </el-form-item>
      </el-form>
    </template>
  </Window>
  <Dialog
    v-model:show="settingDialogConfig.showDialog"
    :title="settingDialogConfig.title"
    :showClose="settingDialogConfig.showClose"
    :buttons="settingDialogConfig.buttons"
    width="700px"
  >
    <template #body>
      <el-form
        :model="settingFormData"
        class="setting-dialog-edit-form"
        :rules="settingFormRules"
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
          <el-radio-group v-model="settingFormData.type" :validate-event="false">
            <el-radio :value="0">原创</el-radio>
            <el-radio :value="1">转载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="reprintUrl" label="转载地址" v-if="settingFormData.type === 1">
          <el-input v-model="settingFormData.reprintUrl" placeholder="请输入转载地址" />
        </el-form-item>
        <el-form-item prop="allowComment" label="评论">
          <el-radio-group v-model="settingFormData.allowComment" :validate-event="false">
            <el-radio :value="1">允许</el-radio>
            <el-radio :value="0">不允许</el-radio>
            <span class="allow-comment-info">请先在评论设置里设置好相应参数，评论才会生效</span>
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
        <el-form-item prop="tag" label="博客标签">
          <el-input-tag
            v-model="settingFormData.tag"
            placeholder="添加标签更容易被搜索引擎收录"
            aria-label="Please click the Enter key after input"
          />
        </el-form-item> </el-form
    ></template>
  </Dialog>
</template>

<style scoped>
.allow-comment-info {
  font-size: 14px;
  color: #a4a3a3;
  margin-right: 5px;
}
</style>
