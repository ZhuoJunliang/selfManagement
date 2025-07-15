<template>
  <div class="week-mode-container">
    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day.key" class="calendar-cell">
        <div class="cell-date">{{ day.label }}</div>
        <div v-for="(item, i) in day.items" :key="i" class="cell-item" @click="editActivity(item)">
          <div class="cell-title" :style="{color: item.color}">{{ item.title }}</div>
          <div class="cell-time">{{ formatTimeRange(item.startTime) }} -</div>
          <div class="cell-time">{{ formatTimeRange(item.endTime) }}</div>
          <div class="cell-duration">{{ calculateDuration(item.startTime, item.endTime) }}</div>
        </div>
        <div v-if="day.items.length === 0" class="cell-more">—</div>
      </div>
    </div>

    <!-- 編輯活動視窗 -->
    <EditActivityPopup
      :show="showEditPopup"
      :available-icons="availableIcons"
      :activity-to-edit="activityToEdit"
      @close="closeEditPopup"
      @saved="handleActivitySaved"
      @deleted="handleActivityDeleted" />
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {itineraryData, reloadData} from "../services/dataService.js";
import EditActivityPopup from "./EditActivityPopup.vue";

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },
});

const weekMap = ["日", "一", "二", "三", "四", "五", "六"];

// 編輯活動視窗狀態
const showEditPopup = ref(false);
const activityToEdit = ref(null);

// 獲取所有可用的圖標選項
const availableIcons = computed(() => {
  const iconSet = new Set();
  const icons = [];

  itineraryData.value.forEach(item => {
    const key = `${item.icon}-${item.color}`;
    if (!iconSet.has(key)) {
      iconSet.add(key);
      icons.push({
        icon: item.icon,
        color: item.color,
        title: item.title,
      });
    }
  });

  return icons;
});

function formatTimeRange(timeRange) {
  if (!timeRange) return "";

  try {
    const date = new Date(timeRange);
    // 只顯示時:分 格式，使用24小時制
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    // 如果解析失敗，直接返回原始值
    return timeRange;
  }
}

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return "";

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}小時${diffMinutes > 0 ? diffMinutes + "分鐘" : ""}`;
  } else {
    return `${diffMinutes}分鐘`;
  }
}

function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - day);
  sunday.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayObj = new Date(sunday);
    dayObj.setDate(sunday.getDate() + i);
    days.push(dayObj);
  }
  return days;
}

// 週模式：一週七天分組
const weekDays = computed(() => {
  const days = getWeekRange(props.selectedDate);
  return days.map(day => {
    const key = `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, "0")}-${day
      .getDate()
      .toString()
      .padStart(2, "0")}`;
    const items = itineraryData.value.filter(item => {
      if (!item.startTime || !item.endTime) return false;
      const startDate = new Date(item.startTime);
      const endDate = new Date(item.endTime);
      return (
        (startDate.getFullYear() === day.getFullYear() &&
          startDate.getMonth() === day.getMonth() &&
          startDate.getDate() === day.getDate()) ||
        (endDate.getFullYear() === day.getFullYear() &&
          endDate.getMonth() === day.getMonth() &&
          endDate.getDate() === day.getDate())
      );
    });
    return {
      key,
      label: `${day.getMonth() + 1}/${day.getDate()} (${weekMap[day.getDay()]})`,
      items,
    };
  });
});

function editActivity(activity) {
  console.log("編輯活動:", activity);
  activityToEdit.value = activity;
  showEditPopup.value = true;
}

function closeEditPopup() {
  showEditPopup.value = false;
  activityToEdit.value = null;
}

async function handleActivitySaved() {
  console.log("活動已保存");
  await reloadData();
}

async function handleActivityDeleted() {
  console.log("活動已刪除");
  await reloadData();
}
</script>

<style scoped>
.week-mode-container {
  height: 100%;
  min-height: 400px;
  overflow-y: auto; /* 超出時可垂直捲動 */
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5em;
}

.calendar-cell {
  background: #fafbfc;
  border-radius: 6px;
  min-height: 120px;
  padding: 0.5em 0.6em 0.7em 0.6em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 0.98em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  /* 移除 max-height 與 overflow-y */
}

.cell-date {
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 0.2em;
  color: #333;
  flex-shrink: 0;
}

.cell-item {
  margin-bottom: 0.3em;
  padding: 0.2em 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  padding: 0.3em;
}

.cell-item:hover {
  background-color: #f0f0f0;
}

.cell-item:last-of-type {
  margin-bottom: 0.5em;
}

.cell-time {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 0.1em;
  line-height: 1.2;
}

.cell-duration {
  font-size: 0.8em;
  color: #888;
  font-variant-numeric: tabular-nums;
  margin-bottom: 0.1em;
  line-height: 1.2;
}

.cell-title {
  font-size: 0.95em;
  color: #222;
  line-height: 1.3;
  word-wrap: break-word;
}

.cell-more {
  font-size: 0.92em;
  color: #888;
  margin-top: auto;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.5em;
  line-height: 1.5em;
}
</style>
