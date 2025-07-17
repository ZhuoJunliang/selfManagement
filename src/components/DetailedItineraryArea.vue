<template>
  <div class="detailed-itinerary-area">
    <!-- <div class="date-title">
      {{ formattedDate }}
    </div> -->

    <!-- 未登入狀態 -->
    <div v-if="!isLoggedIn" class="login-required-state">
      <div class="login-required-content">
        <div class="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 -960 960 960" width="4em" fill="#ccc">
            <path
              d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
          </svg>
        </div>
        <h3>請先登入</h3>
        <p>登入後即可查看和管理您的行程安排</p>
        <button @click="goToLogin" class="login-btn">前往登入</button>
      </div>
    </div>

    <!-- 已登入狀態 -->
    <div v-else>
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
  </div>
</template>

<script setup>
import {inject, computed, onMounted, watch, ref, onUnmounted} from "vue";
import {isLoading, error, loadData, reloadData, itineraryData} from "../services/dataService.js";
import DayMode from "./DayMode.vue";
import WeekMode from "./WeekMode.vue";
import MonthMode from "./MonthMode.vue";
import AddActivityPopup from "./AddActivityPopup.vue";

const selectedDate = inject("selectedDate");
const currentMode = inject("currentMode");
const isLoggedIn = inject("isLoggedIn");

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
  window.addEventListener("action-finished", reloadData);
});
onUnmounted(() => {
  window.removeEventListener("action-finished", reloadData);
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

// 注入切換側邊欄組件的函數
const switchSidebarComponent = inject("switchSidebarComponent");

function goToLogin() {
  // 切換到帳戶設定組件
  switchSidebarComponent("AccountCircle");
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
  height: calc(100vh - 150px);
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  .detailed-itinerary-area {
    flex-grow: 0;
    width: calc(100% - 2em);
    margin: 0 1em;
    min-height: unset;
    height: calc(100vh - 200px);
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
  height: calc(100vh - 190px);
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
  bottom: 6em;
  right: 2em;
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

/* 未登入狀態樣式 */
.login-required-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 250px);
  min-height: 400px;
}

.login-required-content {
  text-align: center;
  padding: 2em;
  max-width: 300px;
}

.login-icon {
  margin-bottom: 1em;
}

.login-required-content h3 {
  font-size: 1.2em;
  color: #333;
  margin: 0 0 0.5em 0;
}

.login-required-content p {
  color: #666;
  margin: 0 0 1.5em 0;
  font-size: 0.9em;
  line-height: 1.4;
}

.login-required-content .login-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.8em 1.5em;
  border-radius: 4px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-required-content .login-btn:hover {
  background: #0056b3;
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  .login-required-state {
    height: calc(100vh - 300px);
  }
}
</style>
