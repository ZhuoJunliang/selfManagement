<template>
  <div class="day-mode-container">
    <div class="day-content">
      <div v-for="(item, idx) in itineraryList" :key="idx" class="itinerary-row">
        <div class="icon-area">
          <span v-html="item.icon" class="itinerary-icon" :style="{color: item.color}"></span>
        </div>
        <div class="content-area">
          <div class="content-title" :style="{color: item.color}">{{ item.title }}</div>
          <div class="content-time">{{ formatTimeRange(item.timeRange) }}</div>
        </div>
        <div class="duration-area">
          {{ item.duration }}
        </div>
      </div>
      <div v-if="itineraryList.length === 0" class="empty-state">
        <p>目前沒有行程資料</p>
      </div>
    </div>
    <button class="add-activity-btn" @click="showAddActivityPopup">
      <span class="add-icon">+</span>
    </button>

    <!-- 新增活動視窗 -->
    <AddActivityPopup
      :show="showAddPopup"
      :available-icons="availableIcons"
      @close="closeAddPopup"
      @saved="handleActivitySaved" />
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {itineraryData} from "../services/dataService.js";
import AddActivityPopup from "./AddActivityPopup.vue";

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },
});

// 新增活動視窗狀態
const showAddPopup = ref(false);

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

  console.log("可用圖標:", icons);
  return icons;
});

// 當日行程列表
const itineraryList = computed(() => {
  const date = props.selectedDate;
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  return itineraryData.value.filter(item => {
    if (!item.startTime || !item.endTime) return false;
    const startDate = new Date(item.startTime);
    const endDate = new Date(item.endTime);
    return (
      (startDate.getFullYear() === y && startDate.getMonth() === m && startDate.getDate() === d) ||
      (endDate.getFullYear() === y && endDate.getMonth() === m && endDate.getDate() === d)
    );
  });
});

function formatTimeRange(timeRange) {
  if (!timeRange) return "";
  // 直接返回時間，因為已經是24小時制格式
  return timeRange;
}

function showAddActivityPopup() {
  showAddPopup.value = true;
}

function closeAddPopup() {
  showAddPopup.value = false;
}

function handleActivitySaved() {
  console.log("活動已保存");
  // 可以在這裡添加額外的處理邏輯，比如重新載入數據等
}
</script>

<style scoped>
.day-mode-container {
  position: relative;
  height: 100%;
  min-height: 400px;
}

.day-content {
  height: 100%;
  overflow-y: auto;
}

.itinerary-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0.7em 0.2em 0.7em 0.2em;
  min-height: 54px;
}

.itinerary-row:last-child {
  border-bottom: none;
}

.icon-area {
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.7em;
}

.itinerary-icon {
  width: 28px;
  height: 28px;
  display: block;
}

.content-area {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.content-title {
  font-size: 1.08em;
  color: #222;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-time {
  font-size: 0.98em;
  color: #888;
  margin-top: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.duration-area {
  flex: 0 0 64px;
  text-align: right;
  font-size: 1.18em;
  color: #444;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.empty-state {
  text-align: center;
  padding: 2em 0;
  color: #999;
}

/* 新增活動按鈕 */
.add-activity-btn {
  position: absolute;
  bottom: 1em;
  right: 1em;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-activity-btn:hover {
  background: #2980b9;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.add-icon {
  font-size: 1.5em;
  font-weight: bold;
}
</style>
