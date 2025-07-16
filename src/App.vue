<template>
  <TitleNav ref="titleNavRef" />
  <main :style="{paddingTop: mainPaddingTop + 'px'}">
    <CalendarArea v-if="calendarVisible" />
    <!-- <MyTest /> -->
    <DetailedItineraryArea v-if="detailedItineraryVisible" />
    <RightSidebar v-if="sidebarVisible" />
  </main>
</template>

<script setup>
import {ref, provide, watch, onMounted, onUnmounted, nextTick} from "vue";
import TitleNav from "./components/TitleNav.vue";
import RightSidebar from "./components/RightSidebar.vue";

// 從 sessionStorage 讀取初始資料的函數
function loadFromSessionStorage() {
  try {
    // 讀取選定的日期
    const savedDate = sessionStorage.getItem("selectedDate");
    if (savedDate) {
      return new Date(parseInt(savedDate));
    }
  } catch (error) {
    console.error("讀取 sessionStorage 中的日期失敗:", error);
  }
  return new Date();
}

// 從 sessionStorage 讀取模式索引
function loadModeIndexFromSessionStorage() {
  try {
    const savedModeIndex = sessionStorage.getItem("currentModeIndex");
    if (savedModeIndex !== null) {
      const index = parseInt(savedModeIndex);
      return index >= 0 && index <= 2 ? index : 0;
    }
  } catch (error) {
    console.error("讀取 sessionStorage 中的模式索引失敗:", error);
  }
  return 0;
}

// 共享的日期狀態 - 從 sessionStorage 初始化
const selectedDate = ref(loadFromSessionStorage());
const today = new Date();

// 控制 CalendarArea 和 DetailedItineraryArea 顯示/隱藏的狀態
const calendarVisible = ref(true);
const detailedItineraryVisible = ref(true);
const sidebarVisible = ref(false);

// 控制 RightSidebar 中顯示的組件
const currentSidebarComponent = ref("schedule");

// 登入狀態管理
const isLoggedIn = ref(false);
const currentUser = ref(null);

// 螢幕寬度狀態
const isSmallScreen = ref(false);

// 檢查螢幕寬度並更新狀態
function checkScreenSize() {
  const wasSmallScreen = isSmallScreen.value;
  isSmallScreen.value = window.innerWidth < 576;

  if (isSmallScreen.value) {
    // 小螢幕時預設只顯示詳細行程區域
    calendarVisible.value = false;
    detailedItineraryVisible.value = true;
    sidebarVisible.value = false;
  } else {
    // 大螢幕時兩個區域都顯示，並自動顯示側邊欄
    calendarVisible.value = true;
    detailedItineraryVisible.value = true;
    // 大螢幕時自動顯示側邊欄
    sidebarVisible.value = true;
  }
}

// 提供給子組件的日期操作函數
const selectDate = date => {
  selectedDate.value = new Date(date);
};

const changeDay = delta => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + delta);
  selectedDate.value = newDate;
};

const selectToday = () => {
  selectedDate.value = new Date(today);
};

// 切換 CalendarArea 和 DetailedItineraryArea 顯示/隱藏的函數
const toggleCalendar = () => {
  if (isSmallScreen.value) {
    // 小螢幕時只顯示 CalendarArea
    calendarVisible.value = true;
    detailedItineraryVisible.value = false;
    sidebarVisible.value = false;
  } else {
    // 大螢幕時切換 CalendarArea 的顯示/隱藏
    calendarVisible.value = !calendarVisible.value;
  }
};

// 顯示側邊欄並隱藏主要內容
const showSidebar = () => {
  sidebarVisible.value = true;
  if (isSmallScreen.value) {
    // 小螢幕時只顯示 RightSidebar
    calendarVisible.value = false;
    detailedItineraryVisible.value = false;
  }
  // 注意：不隱藏TitleNav.vue，讓它保持顯示
};

// 切換側邊欄組件
const switchSidebarComponent = componentName => {
  if (currentSidebarComponent.value === componentName) {
    if (isSmallScreen.value) {
      // 小螢幕時，重複點擊同一個功能也要顯示側邊欄
      showSidebar();
    } else {
      // 大螢幕時，切換顯示/隱藏
      if (sidebarVisible.value) {
        closeSidebar();
      } else {
        showSidebar();
      }
    }
  } else {
    // 切換到新組件並顯示側邊欄
    currentSidebarComponent.value = componentName;
    showSidebar();
  }
};

// 關閉側邊欄
const closeSidebar = () => {
  sidebarVisible.value = false;
};

// 顯示主要內容
const showMainContent = () => {
  sidebarVisible.value = false;
  if (isSmallScreen.value) {
    // 小螢幕時只顯示 DetailedItineraryArea
    calendarVisible.value = false;
    detailedItineraryVisible.value = true;
  } else {
    // 大螢幕時兩個區域都顯示
    calendarVisible.value = true;
    detailedItineraryVisible.value = true;
  }
};

// 模式管理 - 從 sessionStorage 初始化
const modeMap = ["day", "week", "month"];
const currentModeIndex = ref(loadModeIndexFromSessionStorage());
const currentMode = ref(modeMap[currentModeIndex.value]);

// 監聽模式索引變更
watch(currentModeIndex, val => {
  currentMode.value = modeMap[val];
  // 儲存到 sessionStorage
  try {
    sessionStorage.setItem("currentModeIndex", val.toString());
  } catch (error) {
    console.error("儲存模式索引到 sessionStorage 失敗:", error);
  }
});

// 監聽選定日期變更並儲存到 sessionStorage
watch(
  selectedDate,
  newDate => {
    try {
      sessionStorage.setItem("selectedDate", newDate.getTime().toString());
    } catch (error) {
      console.error("儲存選定日期到 sessionStorage 失敗:", error);
    }
  },
  {deep: true}
);

// 提供給子組件使用的狀態和函數
provide("selectedDate", selectedDate);
provide("today", today);
provide("selectDate", selectDate);
provide("changeDay", changeDay);
provide("selectToday", selectToday);
provide("calendarVisible", calendarVisible);
provide("toggleCalendar", toggleCalendar);
provide("currentMode", currentMode);
provide("currentModeIndex", currentModeIndex);
provide("showSidebar", showSidebar);
provide("closeSidebar", closeSidebar);
provide("showMainContent", showMainContent);
provide("currentSidebarComponent", currentSidebarComponent);
provide("switchSidebarComponent", switchSidebarComponent);
provide("isLoggedIn", isLoggedIn);
provide("currentUser", currentUser);

// 檢查登入狀態
const checkLoginStatus = () => {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      currentUser.value = user;
      isLoggedIn.value = true;
    } catch (e) {
      console.error("解析存儲的用戶信息失敗:", e);
    }
  }
};

const titleNavRef = ref(null);
const mainPaddingTop = ref(60);

function updatePadding() {
  nextTick(() => {
    if (titleNavRef.value?.$el) {
      mainPaddingTop.value = titleNavRef.value.$el.offsetHeight;
    }
  });
}

// 監聽視窗大小變化
onMounted(() => {
  checkScreenSize();
  checkLoginStatus();
  // 如果初始螢幕寬度大於576px，自動顯示側邊欄
  if (window.innerWidth >= 576) {
    sidebarVisible.value = true;
  }
  updatePadding();
  window.addEventListener("resize", updatePadding);
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePadding);
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: sans-serif;
}

:root {
  box-sizing: border-box;
  font-size: calc(1vw + 0.6em); /* 基礎字號，會隨螢幕縮放 */
}

@media (min-width: 50em) {
  :root {
    font-size: 1.125em; /* 設定字號的上限 */
  }
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

main {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0;
  padding: 1em 0;
}

DetailedItineraryArea {
  flex-grow: 1;
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  main {
    flex-direction: column;
    padding: 0.5em 0;
  }

  .calendar-area {
    width: calc(100% - 2em) !important;
    margin: 0 1em;
  }

  .detailed-itinerary-area {
    margin: 0 1em;
    flex-grow: 0;
    width: calc(100% - 2em);
  }

  .right-sidebar {
    margin: 0 1em;
    width: calc(100% - 2em);
  }
}
</style>
