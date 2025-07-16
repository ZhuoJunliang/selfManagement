<template>
  <div class="month-mode-container">
    <div class="calendar-grid-wrapper">
      <div class="calendar-grid">
        <div v-for="day in monthDays" :key="day.key" class="calendar-cell">
          <div class="cell-date">{{ day.label }}</div>
          <div v-for="(item, i) in day.items.slice(0, 3)" :key="i" class="cell-item" @click="editActivity(item)">
            <div class="cell-title" :style="{color: item.color}">
              {{ item.title }} {{ formatStartTime(item.startTime) }}
            </div>
          </div>
          <div v-if="day.items.length > 1" class="cell-more" @click="showDayPopup($event, day)">
            還有 {{ day.items.length - 1 }} 個
          </div>
        </div>
      </div>
    </div>

    <!-- 浮動視窗 -->
    <div v-if="showPopup" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <div class="popup-header">
          <h3>{{ popupData?.label }}</h3>
          <button class="popup-close" @click="closePopup">×</button>
        </div>
        <div class="popup-body">
          <div v-for="(item, i) in popupData?.items" :key="i" class="popup-itinerary-row" @click="editActivity(item)">
            <div class="popup-icon-area">
              <span v-html="item.icon" class="popup-itinerary-icon" :style="{color: item.color}"></span>
            </div>
            <div class="popup-content-area">
              <div class="popup-content-title" :style="{color: item.color}">{{ item.title }}</div>
              <div class="popup-content-time">{{ formatTimeRange(item.timeRange) }}</div>
            </div>
            <div class="popup-duration-area">
              {{ item.duration }}
            </div>
          </div>
        </div>
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

// 浮動視窗狀態
const showPopup = ref(false);
const popupData = ref(null);
const popupPosition = ref({x: 0, y: 0});

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

const weekMap = ["日", "一", "二", "三", "四", "五", "六"];

function formatTimeRange(timeRange) {
  if (!timeRange) return "";
  // 直接返回時間，因為已經是24小時制格式
  return timeRange;
}

function formatStartTime(startTime) {
  if (!startTime) return "";
  const d = new Date(startTime);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function getMonthDays(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 1; i <= last.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return days;
}

function showDayPopup(event, dayData) {
  event.stopPropagation();
  const rect = event.target.getBoundingClientRect();
  popupPosition.value = {
    x: rect.left,
    y: rect.bottom + 5,
  };
  popupData.value = dayData;
  showPopup.value = true;
}

function closePopup() {
  showPopup.value = false;
  popupData.value = null;
}

function editActivity(activity) {
  console.log("編輯活動:", activity);
  activityToEdit.value = activity;
  showEditPopup.value = true;
  // 關閉當前的彈出視窗
  closePopup();
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

// 月曆格子資料
const monthDays = computed(() => {
  const days = getMonthDays(props.selectedDate);
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
</script>

<style scoped>
.month-mode-container {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

/* 新增 wrapper，負責橫向捲動 */
.calendar-grid-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* calendar-grid 設定最小寬度，7天*每格最小寬度 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5em;
  min-width: 840px; /* 7 * 120px，依你 min-width 調整 */
}

/* calendar-cell 設定最小寬度 */
.calendar-cell {
  min-width: 120px;
  background: #fafbfc;
  border-radius: 6px;
  min-height: 120px;
  padding: 0.5em 0.6em 0.7em 0.6em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 0.98em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  position: relative;
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
  flex: 1;
  min-height: 0;
  overflow: hidden;
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
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.05em;
}

.cell-duration {
  font-size: 0.85em;
  color: #888;
  font-variant-numeric: tabular-nums;
}

.cell-title {
  font-size: 0.95em;
  color: #222;
  line-height: 1.3;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.cell-more {
  font-size: 0.92em;
  color: #888;
  margin-top: auto;
  cursor: pointer;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  transition: background-color 0.2s;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.5em;
  line-height: 1.5em;
}

.cell-more:hover {
  background-color: #f0f0f0;
  color: #666;
}

/* 浮動視窗樣式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 1.2em;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.popup-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #333;
}

.popup-close {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-close:hover {
  color: #333;
}

.popup-body {
  padding: 1em;
  max-height: 60vh;
  overflow-y: auto;
}

.popup-itinerary-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0.7em 0.2em 0.7em 0.2em;
  min-height: 54px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.popup-itinerary-row:hover {
  background-color: #f8f9fa;
}

.popup-itinerary-row:last-child {
  border-bottom: none;
}

.popup-icon-area {
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.7em;
}

.popup-itinerary-icon {
  width: 28px;
  height: 28px;
  display: block;
}

.popup-content-area {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.popup-content-title {
  font-size: 1.08em;
  color: #222;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-content-time {
  font-size: 0.98em;
  color: #888;
  margin-top: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-duration-area {
  flex: 0 0 64px;
  text-align: right;
  font-size: 1.18em;
  color: #444;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  letter-spacing: 0.02em;
}
</style>
