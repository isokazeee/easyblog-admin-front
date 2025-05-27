<script setup>
import VueCookies from "vue-cookies";
import { getCurrentInstance, ref, watch } from "vue";
import { useRouter } from "vue-router";
import message from "@/utils/Message.js";
import md5 from "js-md5";
import api from "@/api/api.js";

const router = useRouter();
const { proxy } = getCurrentInstance();

// 表单数据
const loginForm = ref({
  account: "",
  password: "",
  checkCode: "",
  remenberMe: false,
});
const loginFormRef = ref();

// checkCode
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?random=" + Math.random();
};

const checkCodeUrl = ref(api.checkCode);

// init
const init = () => {
  const loginInfo = VueCookies.get("loginInfo");

  if (!loginInfo) {
    return;
  }
  Object.assign(loginForm.value, loginInfo);
};
init();

// 登录方法
const login = () => {
  console.log("登录信息:", loginForm.value);
  loginFormRef.value.validate(async (valid) => {
    if (!valid) {
      console.log("登录失败");

      return;
      // localStorage.setItem('loginForm', JSON.stringify(loginForm.value))
    }

    let result = await proxy.Request({
      url: api.login,
      params: {
        account: loginForm.value.account,
        password: md5(loginForm.value.password),
        checkCode: loginForm.value.checkCode,
      },
      errorCallback: () => {
        changeCheckCode();
      },
    });
    if (!result) {
      return;
    }

    message.success("登录成功");
    setTimeout(() => {
      router.replace({ path: "/" });
    }, 1000);
    const loginInfo = {
      account: loginForm.value.account,
      password: loginForm.value.password,
      remenberMe: loginForm.value.remenberMe,
    };
    // console.log('loginInfo:', loginInfo)
    // 0表示会话级别 浏览器关闭失效
    console.log("userInfo:", result);
    VueCookies.set("userInfo", result.data, 0);
    if (loginForm.value.remenberMe) {
      VueCookies.set("loginInfo", loginInfo, "7d");
    }
  });
};

const rules = {
  account: [{ required: true, message: "请输入用户名", trigger: [] }],
  password: [{ required: true, message: "请输入密码", trigger: [] }],
  checkCode: [{ required: true, message: "请输入验证码", trigger: [] }],
};
</script>

<template>
  <div class="login-body">
    <div class="login-container">
      <h2 class="login-title">个人博客登录</h2>
      <el-form :model="loginForm" class="login-form" :rules="rules" ref="loginFormRef">
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入用户名"
            prefix-icon="user"
            size="large"
            @keyup.enter="login"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
            prefix-icon="lock"
            size="large"
            @keyup.enter="login"
          />
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              v-model="loginForm.checkCode"
              placeholder="请输入验证码"
              prefix-icon="CircleCheck"
              size="large"
              @keyup.enter="login"
            />
            <img class="check-code-picture" :src="checkCodeUrl" @click="changeCheckCode" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remenberMe" type="primary">记住我</el-checkbox>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button class="btn" type="primary" block @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-body {
  background-color: #f5f5f5;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 360px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.login-btn {
  width: 100%;

  .el-button {
    width: 100%;
    display: block;
    margin: 0 auto;
  }
}

.check-code-panel {
  width: 100%;
  display: flex;
}

.check-code-picture {
  cursor: pointer;
  margin-left: 10px;
  border-radius: 3px;
}
</style>
