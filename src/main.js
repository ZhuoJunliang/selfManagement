"use strict";

import {createApp} from "vue";
import App from "./App.vue";
import TitleNav from "./components/TitleNav.vue";
import MyTest from "./components/MyTest.vue";
import CalendarArea from "./components/CalendarArea.vue";
import DetailedItineraryArea from "./components/DetailedItineraryArea.vue";

const app = createApp(App);
app.component("TitleNav", TitleNav);
app.component("MyTest", MyTest);
app.component("CalendarArea", CalendarArea);
app.component("DetailedItineraryArea", DetailedItineraryArea);
app.mount("#app");
