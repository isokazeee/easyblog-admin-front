import { createRouter, createWebHistory } from "vue-router";
import VueCookies from "vue-cookies";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/test",
    component: () => import("../views/Test.vue"),
  },

  {
    path: "/",
    name: "Index",
    component: () => import("../views/Index.vue"),
    children: [
      {
        path: "",
        name: "Default",
        redirect: { name: "BlogList" },
        component: () => import("../views/Blog/List.vue"),
      },
      {
        path: "blog/list",
        name: "BlogList",
        component: () => import("../views/Blog/List.vue"),
      },
      {
        path: "blog/category",
        name: "BlogCategory",
        component: () => import("../views/Blog/Category.vue"),
      },
      {
        path: "special/category",
        name: "SpecialCategory",
        component: () => import("../views/Special/Category.vue"),
      },
      {
        path: "setting/my",
        name: "SettingMy",
        component: () => import("../views/Setting/My.vue"),
      },
      {
        path: "setting/user",
        name: "SettingUser",
        component: () => import("../views/Setting/User.vue"),
      },
      {
        path: "setting/sysSetting",
        name: "SettingSysSetting",
        component: () => import("../views/Setting/SysSetting.vue"),
      },
      {
        path: "recovery/list",
        name: "RecoveryList",
        component: () => import("../views/RecoveryList.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const userInfo = VueCookies.get("userInfo");
  if (
    // 检查用户是否已登录
    !userInfo &&
    // ❗️ 避免无限重定向
    to.name !== "Login"
  ) {
    // 将用户重定向到登录页面
    return { name: "Login" };
  }
});

export default router;
