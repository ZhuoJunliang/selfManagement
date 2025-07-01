"use strict";

import {createApp} from "vue";
import App from "./App.vue";
import TitleNav from "./components/TitleNav.vue";
import MyTest from "./components/MyTest.vue";

const app = createApp(App);
app.component("TitleNav", TitleNav);
app.component("MyTest", MyTest);
app.mount("#app");
