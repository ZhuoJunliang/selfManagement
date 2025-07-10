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

    <!-- 資料顯示 -->
    <div v-else>
      <div v-for="(item, idx) in itineraryList" :key="idx" class="itinerary-row">
        <div class="icon-area">
          <component :is="item.icon" v-if="item.iconType === 'component'" class="itinerary-icon" />
          <span v-else v-html="item.icon" class="itinerary-icon"></span>
        </div>
        <div class="content-area">
          <div class="content-title">{{ item.title }}</div>
          <div class="content-time">{{ item.timeRange }}</div>
        </div>
        <div class="duration-area">
          {{ item.duration }}
        </div>
      </div>

      <!-- 無資料狀態 -->
      <div v-if="itineraryList.length === 0" class="empty-state">
        <p>目前沒有行程資料</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {inject, computed, onMounted, onBeforeUnmount} from "vue";
import {itineraryData, isLoading, error, loadData, startAutoReload, stopAutoReload} from "../services/dataService.js";

// inject 選定日期
const selectedDate = inject("selectedDate");

// 日期格式化
const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
const formattedDate = computed(() => {
  const d = selectedDate.value;
  return `${d.getMonth() + 1}月${d.getDate()}日, 星期${weekMap[d.getDay()]}`;
});

// 使用資料服務中的行程資料
const itineraryList = computed(() => itineraryData.value);

// 組件掛載時啟動自動重新載入
onMounted(() => {
  startAutoReload();
});

// 組件卸載時停止自動重新載入
onBeforeUnmount(() => {
  stopAutoReload();
});
</script>

<style scoped>
.detailed-itinerary-area {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.2em 1em;
  max-width: 420px;
  margin: 1em auto;
}
.date-title {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5em;
  margin-bottom: 0.7em;
}
.itinerary-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0.7em 0;
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
  width: 24px;
  height: 24px;
  display: block;
}
.content-area {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.content-title {
  font-size: 1em;
  color: #222;
  font-weight: 500;
}
.content-time {
  font-size: 0.92em;
  color: #888;
  margin-top: 0.1em;
}
.duration-area {
  flex: 0 0 48px;
  text-align: right;
  font-size: 1.1em;
  color: #444;
  font-variant-numeric: tabular-nums;
}

/* 載入狀態樣式 */
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

/* 錯誤狀態樣式 */
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

/* 無資料狀態樣式 */
.empty-state {
  text-align: center;
  padding: 2em 0;
  color: #999;
}
</style>
