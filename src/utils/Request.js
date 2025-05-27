import axios from "axios";
import { ElLoading } from "element-plus";
import message from "@/utils/Message.js";
import { useRouter } from "vue-router";

const router = useRouter();
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";
const request = (config) => {
  let { url, params, dataType = "form", showLoading = true } = config;

  let contentType = contentTypeForm;
  if (dataType == "json") {
    contentType = contentTypeJson;
  } else if (dataType == "file") {
    contentType = contentTypeFile;
    let param = new FormData();
    for (let key in params) {
      param.append(key, params[key]);
    }
    params = param;
  }

  const instantce = axios.create({
    baseURL: "",
    timeout: 10 * 1000,
    headers: {
      "Content-Type": contentType,
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  // 请求前拦截
  let loading = null;
  instantce.interceptors.request.use(
    (config) => {
      if (showLoading) {
        loading = ElLoading.service({
          lock: true,
          text: "加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
      }
      return config;
    },
    (error) => {
      if (showLoading && loading) {
        loading.close();
      }
      message.error("发送请求失败");
      return Promise.reject("发送请求失败");
    }
  );

  // 请求后拦截
  instantce.interceptors.response.use(
    (response) => {
      if (showLoading && loading) {
        loading.close();
      }
      const responseData = response.data;
      if (responseData.status === "error") {
        if (config.errorCallback) {
          config.errorCallback();
        }
        return Promise.reject(responseData.info);
      } else {
        if (responseData.code == 200) {
          return responseData;
        } else if (responseData.code == 901) {
          setTimeout(() => {
            router.push({
              path: "/login",
            });
          }, 2000);

          return Promise.reject("登陆超时");
        }
      }
    },
    (error) => {
      if (showLoading && loading) {
        loading.close();
      }
      return Promise.reject("网络异常");
    }
  );

  return instantce.post(url, params).catch((error) => {
    message.error(error);
    return null;
  });
};

export default request;
