import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import "@/assets/style.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import Request from "@/utils/Request.js";

import Cover from "@/components/Cover.vue";
import Table from "@/components/Table.vue";
import Dialog from "@/components/Dialog.vue";
import CoverUpload from "@/components/CoverUpload.vue";
import Window from "@/components/Window.vue";
import EditorMarkdown from "./components/EditorMarkdown.vue";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(router);
app.use(ElementPlus, { locale: "zh-cn" });
app.config.globalProperties.Request = Request;

app.component("Table", Table);
app.component("Cover", Cover);
app.component("Dialog", Dialog);
app.component("CoverUpload", CoverUpload);
app.component("Window", Window);
app.component("EditorMarkdown", EditorMarkdown);
app.mount("#app");
