<template>
  <TitleNav />
  <main>
    <CalendarArea v-if="calendarVisible" />
    <!-- <MyTest /> -->
    <DetailedItineraryArea />
  </main>
</template>

<script setup>
import {ref, provide, watch, onMounted} from "vue";

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

// 控制 CalendarArea 顯示/隱藏的狀態
const calendarVisible = ref(true);

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

// 切換 CalendarArea 顯示/隱藏的函數
const toggleCalendar = () => {
  calendarVisible.value = !calendarVisible.value;
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
}

DetailedItineraryArea {
  flex-grow: 1;
}
</style>
