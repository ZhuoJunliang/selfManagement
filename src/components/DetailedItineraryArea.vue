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
  </div>
</template>

<script setup>
import {inject, computed, onMounted, watch} from "vue";
import {isLoading, error, loadData} from "../services/dataService.js";
import DayMode from "./DayMode.vue";
import WeekMode from "./WeekMode.vue";
import MonthMode from "./MonthMode.vue";

const selectedDate = inject("selectedDate");
const currentMode = inject("currentMode");

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
</script>

<style scoped>
.detailed-itinerary-area {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.2em 1em;
  flex-grow: 1;
  margin: 0 1em;
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
</style>
