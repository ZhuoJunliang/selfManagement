<template>
  <TitleNav />
  <main>
    <CalendarArea v-if="calendarVisible" />
    <!-- <MyTest /> -->
    <DetailedItineraryArea />
  </main>
</template>

<script setup>
import {ref, provide} from "vue";

// 共享的日期狀態
const selectedDate = ref(new Date());
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

// 提供給子組件使用的狀態和函數
provide("selectedDate", selectedDate);
provide("today", today);
provide("selectDate", selectDate);
provide("changeDay", changeDay);
provide("selectToday", selectToday);
provide("calendarVisible", calendarVisible);
provide("toggleCalendar", toggleCalendar);
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
</style>
