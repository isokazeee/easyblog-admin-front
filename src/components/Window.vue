<script setup>
import { ref } from "vue";

const show = defineModel("show", {
  type: Boolean,
  default: true,
});
const props = defineProps({
  title: {
    type: String,
    default: "提示",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  buttons: {
    type: Array,
  },
});
</script>

<template>
  <div class="window" v-if="show">
    <div class="window-header">
      <el-icon size="60" v-if="props.showClose" @click="show = false"><Back /></el-icon>
    </div>
    <div class="window-body"><slot name="body"></slot></div>
    <div class="window-footer">
      <template v-if="buttons || showCancel">
        <el-button v-for="btn in props.buttons" size="large" :type="btn.type" @click="btn.click">{{
          btn.text
        }}</el-button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0; /* 添加 right: 0 使宽度自动计算 */
  height: calc(100vh - 80px);
  background: #fff;
  z-index: 3;
  .window-header {
    height: 60px;
    padding-bottom: 10px;

    .el-icon {
      cursor: pointer;
    }
  }
  .window-body {
    display: flex;
    flex-direction: column;
    height: calc(100% - 120px);
    gap: 10px;
    padding: 10px;
    overflow: auto;
  }
  .window-footer {
    padding-top: 10px;
    border-top: 1px solid #ddd;
    text-align: center;
    height: 60px;
  }
}
</style>
