<script setup>
import { ref } from "vue";
import VueCookies from "vue-cookies";
import api from "@/api/api.js";
// const menuList = ref([
//   {
//     title: "博客",
//     icon: "icon-content",
//     open: true,
//     children: [
//       {
//         title: "博客管理",
//         path: "/blog/list",
//       },
//       {
//         title: "分类管理",
//         path: "/blog/category",
//       },
//     ],
//   },
//   {
//     title: "专题",
//     icon: "icon-zhuanti",
//     open: true,
//     children: [
//       {
//         title: "专题管理",
//         path: "/special/category",
//       },
//     ],
//   },
//   {
//     title: "设置",
//     icon: "icon-setting",
//     open: true,
//     children: [
//       {
//         title: "个人信息设置",
//         path: "/settring/my",
//       },
//       {
//         title: "博客成员",
//         path: "/settring/user",
//       },
//       {
//         title: "系统设置",
//         path: "/settring/sysSetting",
//         roleType: 1,
//       },
//     ],
//   },
//   {
//     title: "回收站",
//     icon: "icon-recovery",
//     open: true,
//     children: [
//       {
//         title: "回收站",
//         path: "/recovery/list",
//       },
//     ],
//   },
// ]);

const userInfo = ref({});

const init = () => {
  userInfo.value = VueCookies.get("userInfo");
  userInfo.value.avatar = api.imgUrl + "/" + userInfo.value.avatar;
  console.log("userInfo:", userInfo.value);
};
init();
</script>

<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <div class="logo">EasyBlog</div>
        <div class="user-info">
          <span>欢迎回来，</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ userInfo.nickName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-avatar :src="userInfo.avatar" />
          <img :src="userInfo.avatar" class="avatar" />
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="200px" class="left-aside">
          <div class="submit">
            <el-button class="submit-btn" type="success">发布</el-button>
          </div>
          <el-menu
            background-color="#f5f6f7"
            class="el-menu"
            :default-openeds="['1', '2', '3', '4']"
            default-active="1-1"
            router
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Document />
                </el-icon>
                <span>博客</span>
              </template>
              <el-menu-item style="padding-left: 49px" index="/blog/list">博客管理</el-menu-item>
              <el-menu-item style="padding-left: 49px" index="/blog/category"
                >分类管理</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon>
                <span>专题</span>
              </template>
              <el-menu-item index="/special/category" style="padding-left: 49px"
                >专题分类</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <el-icon>
                    <Setting />
                  </el-icon>
                </el-icon>
                <span>设置</span>
              </template>
              <el-menu-item style="padding-left: 49px" index="/setting/my"
                >个人信息设置</el-menu-item
              >
              <el-menu-item style="padding-left: 49px" index="/setting/user">博客成员</el-menu-item>
              <el-menu-item style="padding-left: 49px" index="/setting/sysSetting"
                >系统设置</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon>
                  <Delete />
                </el-icon>
                <span>回收站</span>
              </template>
              <el-menu-item style="padding-left: 49px" index="/recovery/list">回收站</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="right-main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.layout {
  .header {
    border-bottom: 1px solid #ddd;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      font-size: 30px;
      color: #333;
      font-weight: bold;
    }
    .user-info {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
  }
  .container {
    padding: 10px;
    background: #f5f6f7;
    height: calc(100vh - 60px);

    .left-aside {
      width: 250px;

      .submit {
        display: flex;
        margin: 0 auto;

        .submit-btn {
          width: 100%;
          height: 40px;
          margin: 15px;
        }
      }
    }
  }

  .right-main {
    margin-left: 10px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    position: relative;
  }
}
</style>
