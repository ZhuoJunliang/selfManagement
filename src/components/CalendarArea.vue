<template>
  <div class="calendar-area">
    <div class="calendar-header">
      <span class="calendar-title">{{ displayYear }}年{{ displayMonth + 1 }}月</span>
      <button class="arrow-btn" @click="changeDay(-1)">
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <button class="arrow-btn" @click="changeDay(1)">
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
    <table class="calendar-table">
      <thead>
        <tr>
          <th v-for="w in weekDays" :key="w">{{ w }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, wIdx) in calendarRows" :key="wIdx">
          <td v-for="(day, dIdx) in week" :key="dIdx">
            <div
              v-if="day"
              :class="[
                'calendar-day',
                isToday(day) ? 'today' : '',
                isSelected(day) ? 'selected' : '',
                isOtherMonth(day) ? 'other-month' : '',
              ]"
              @click="selectDate(day)">
              {{ day.getDate() }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {computed, inject} from "vue";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// 使用 inject 獲取共享的日期狀態
const selectedDate = inject("selectedDate");
const today = inject("today");
const selectDate = inject("selectDate");
const changeDay = inject("changeDay");

const displayYear = computed(() => selectedDate.value.getFullYear());
const displayMonth = computed(() => selectedDate.value.getMonth());

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isToday(day) {
  return isSameDay(day, today);
}

function isSelected(day) {
  return isSameDay(day, selectedDate.value);
}

function isOtherMonth(day) {
  return day.getMonth() !== displayMonth.value;
}

const calendarRows = computed(() => {
  const year = displayYear.value;
  const month = displayMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // 前面空格 - 補上個月的日期
  const firstDayOfWeek = firstDay.getDay();
  const prevMonth = new Date(year, month, 0); // 上個月的最後一天
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(year, month - 1, prevMonth.getDate() - i);
    days.push(day);
  }

  // 當月天數
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // 後面空格 - 補下個月的日期
  const lastDayOfWeek = lastDay.getDay();
  const remainingDays = 6 - lastDayOfWeek;
  for (let d = 1; d <= remainingDays; d++) {
    const day = new Date(year, month + 1, d);
    days.push(day);
  }

  // 確保總共有 6 行 7 列 (42 天)
  while (days.length < 42) {
    const lastDayInArray = days[days.length - 1];
    const nextDay = new Date(lastDayInArray);
    nextDay.setDate(nextDay.getDate() + 1);
    days.push(nextDay);
  }

  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }
  return rows;
});
</script>

<style scoped>
.calendar-area {
  background: #f7f9fb;
  border-radius: 10px;
  padding: 1.5em 1em;
  width: 270px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-family: inherit;
}
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  margin-bottom: 1em;
}
.calendar-title {
  font-size: 1.2em;
  font-weight: bold;
  flex: 1;
}
.arrow-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2em;
  border-radius: 50%;
  transition: background 0.2s;
}
.arrow-btn:hover {
  background: #e0e7ef;
}
.calendar-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}
.calendar-table th {
  color: #888;
  font-weight: 500;
  padding-bottom: 0.3em;
}
.calendar-table td {
  height: 2.2em;
  padding: 0;
}
.calendar-day {
  width: 2em;
  height: 2em;
  line-height: 2em;
  margin: 0 auto;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.calendar-day.today {
  background: #1565c0;
  color: #fff;
  font-weight: bold;
}
.calendar-day.selected {
  background: #e3f0ff;
  color: #1565c0;
  font-weight: bold;
}
.calendar-day.today.selected {
  box-shadow: 0 0 0 2px #1565c0;
}
.calendar-day.other-month {
  color: #ccc;
}
.calendar-day.other-month:hover {
  background: #f0f0f0;
  color: #666;
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  .calendar-area {
    width: 100%;
    margin: 0 1em;
  }

  .calendar-day {
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
  }

  .calendar-table td {
    height: 2.8em;
  }
}
</style>
