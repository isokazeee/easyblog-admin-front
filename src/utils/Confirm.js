import { ElMessageBox } from "element-plus";

const confirm = (message, type, okfun) => {
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: type,
  })
    .then(() => {
      okfun();
    })
    .catch(() => {});
};

export default confirm;
