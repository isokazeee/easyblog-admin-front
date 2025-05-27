<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "提示",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  top: {
    type: String,
    default: "15vh",
  },
  width: {
    type: String,
    default: "500",
  },
  buttons: {
    type: Array,
  },
});

// 定义emit
const emit = defineEmits(["update:show"]);

// 使用计算属性处理双向绑定
const showDialog = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value); // 当值变化时，通知父组件
  },
});
</script>

<template>
  <div class="dialog">
    <el-dialog
      v-model="showDialog"
      :close-on-click-modal="false"
      :title="title"
      :show-close="showClose"
      :top="top"
      :width="width"
      align-center
      header-class="dialog-header"
    >
      <slot name="body" class="dialog-body"> </slot>
      <template #footer>
        <div class="dialog-footer" v-if="buttons">
          <el-button v-for="btn in buttons" :type="btn.type" @click="btn.click">{{
            btn.text
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.dialog {
  width: 100%;
  height: 100%;
  .dialog-body {
    padding: 10px;
    min-height: 80px;
    border-top: 1px solid #ddd;
  }
}
</style>
