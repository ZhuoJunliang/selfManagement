<template>
  <div class="detailed-itinerary-area">
    <div class="date-title">
      {{ formattedDate }}
    </div>

    <!-- 載入狀態 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>載入中...</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="error-state">
      <p>載入失敗: {{ error }}</p>
      <button @click="loadData" class="retry-btn">重新載入</button>
    </div>

    <!-- 根據模式顯示不同組件 -->
    <div v-else class="mode-container">
      <DayMode v-if="currentMode === 'day'" :selected-date="selectedDate" />
      <WeekMode v-else-if="currentMode === 'week'" :selected-date="selectedDate" />
      <MonthMode v-else-if="currentMode === 'month'" :selected-date="selectedDate" />
    </div>

    <!-- 週模式和月模式的新增活動按鈕 -->
    <button
      v-if="currentMode === 'week' || currentMode === 'month'"
      class="add-activity-btn"
      @click="showAddActivityPopup">
      <span class="add-icon">+</span>
    </button>

    <!-- 新增活動視窗 -->
    <AddActivityPopup
      v-if="currentMode === 'week' || currentMode === 'month'"
      :show="showAddPopup"
      :available-icons="availableIcons"
      @close="closeAddPopup"
      @saved="handleActivitySaved" />
  </div>
</template>

<script setup>
import {inject, computed, onMounted, watch, ref} from "vue";
import {isLoading, error, loadData, reloadData, itineraryData} from "../services/dataService.js";
import DayMode from "./DayMode.vue";
import WeekMode from "./WeekMode.vue";
import MonthMode from "./MonthMode.vue";
import AddActivityPopup from "./AddActivityPopup.vue";

const selectedDate = inject("selectedDate");
const currentMode = inject("currentMode");

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

  return icons;
});

const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
const formattedDate = computed(() => {
  const d = selectedDate.value;
  return `${d.getMonth() + 1}月${d.getDate()}日, 星期${weekMap[d.getDay()]}`;
});

watch(selectedDate, () => {
  loadData();
});

onMounted(() => {
  loadData();
});

function showAddActivityPopup() {
  console.log("新增活動");
  showAddPopup.value = true;
}

function closeAddPopup() {
  showAddPopup.value = false;
}

async function handleActivitySaved() {
  console.log("活動已保存");
  await reloadData();
}
</script>

<style scoped>
.detailed-itinerary-area {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.2em 1em;
  flex-grow: 1;
  margin: 0 1em;
  position: relative;
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  .detailed-itinerary-area {
    flex-grow: 0;
    width: calc(100% - 2em);
    margin: 0 1em;
    min-height: calc(100vh - 200px);
  }
}

.date-title {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5em;
  margin-bottom: 0.7em;
}

.mode-container {
  height: calc(100vh - 250px);
  overflow: hidden;
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  .mode-container {
    height: calc(100vh - 300px);
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  color: #666;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5em;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  text-align: center;
  padding: 2em 0;
  color: #e74c3c;
}

.retry-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5em;
}

.retry-btn:hover {
  background: #2980b9;
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
