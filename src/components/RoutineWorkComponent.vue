<template>
  <div style="position: relative; min-height: 400px">
    <!-- 進行中活動顯示區 -->
    <div v-if="currentAction" class="current-action-bar">
      <span class="action-icon" v-html="getIconSvg(currentAction.actionIcon, currentAction.actionColor)"></span>
      <span class="action-name">{{ currentAction.actionName }}</span>
      <span class="timer">{{ timerDisplay }}</span>
      <button class="end-btn" @click="endAction">結束</button>
    </div>
    <div class="routine-action-grid">
      <div
        v-for="(action, idx) in actions"
        :key="action.actionName"
        class="action-grid-card"
        :class="{selected: currentAction && currentActionIdx === idx}"
        @click="startAction(action, idx)">
        <div class="action-icon" v-html="getIconSvg(action.actionIcon, action.actionColor)"></div>
        <div class="action-name">{{ action.actionName }}</div>
      </div>
    </div>
    <FloatingAddButton />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, inject} from "vue";
import FloatingAddButton from "./FloatingAddButton.vue";

const actions = ref([]);
const icons = ref([]);

const selectedDate = inject("selectedDate"); // 取得選定日期

function getDateTimeString(dateObj, timeObj) {
  // dateObj: Date (選定日期)
  // timeObj: Date (當下時間)
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = timeObj.getHours().toString().padStart(2, "0");
  const min = timeObj.getMinutes().toString().padStart(2, "0");
  const sec = timeObj.getSeconds().toString().padStart(2, "0");
  return `${year}/${month}/${day} ${hour}:${min}:${sec}`;
}

function getIconSvg(index, color) {
  if (!icons.value.length) return "";
  let svg = icons.value[index] || "";
  return svg.replace(/fill=\"actionColor\"/g, `fill=\"${color}\"`);
}

// 新增狀態
const currentAction = ref(null);
const currentActionIdx = ref(null);
const startTime = ref(null);
const timer = ref(0);
const timerInterval = ref(null);
const timerDisplay = ref("00:00:00");

function formatTimer(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function startAction(action, idx) {
  if (currentAction.value) return; // 只能同時一個
  currentAction.value = action;
  currentActionIdx.value = idx;
  const now = new Date();
  // 用選定日期 + 現在時間
  startTime.value = getDateTimeString(selectedDate.value, now);
  timer.value = 0;
  timerDisplay.value = "00:00:00";
  timerInterval.value = setInterval(() => {
    timer.value = Math.floor((new Date() - now) / 1000);
    timerDisplay.value = formatTimer(timer.value);
  }, 1000);
}

function endAction() {
  if (!currentAction.value) return;
  const now = new Date();
  const endTimeStr = getDateTimeString(selectedDate.value, now);
  const payload = {
    actions: currentActionIdx.value,
    startTime: startTime.value,
    endTime: endTimeStr,
  };

  // 先讀取現有資料
  fetch("/data.txt")
    .then(res => res.json())
    .then(existingData => {
      // 將新活動插入到正確的時間順序位置
      const newData = [...existingData];
      const insertIndex = findInsertIndex(newData, startTime.value);
      newData.splice(insertIndex, 0, payload);

      // 將更新後的資料寫回檔案
      return fetch("http://localhost:3001/api/updateData", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newData),
      });
    })
    .then(() => {
      // 通知父元件或 emit event
      window.dispatchEvent(new CustomEvent("action-finished"));
      // 重置狀態
      clearInterval(timerInterval.value);
      currentAction.value = null;
      currentActionIdx.value = null;
      startTime.value = null;
      timer.value = 0;
      timerDisplay.value = "00:00:00";
    })
    .catch(err => {
      alert("儲存失敗: " + err);
    });
}

// 找到新活動應該插入的位置（依照 startTime 排序）
function findInsertIndex(data, newStartTime) {
  // 將新活動的 startTime 轉換為 Date 物件
  const newTime = new Date(newStartTime.replace(/\//g, "-"));

  for (let i = 0; i < data.length; i++) {
    // 將現有資料的 startTime 轉換為 Date 物件
    const existingTime = new Date(data[i].startTime.replace(/\//g, "-"));

    // 比較時間
    if (newTime <= existingTime) {
      return i;
    }
  }
  return data.length; // 如果新活動時間最晚，插入到最後
}

onMounted(async () => {
  const res = await fetch("/actions.txt");
  const data = await res.json();
  actions.value = data.filter(a => a.validEvent === "true");
  const iconRes = await fetch("/icons.txt");
  icons.value = await iconRes.json();
});
onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
});
</script>

<style scoped>
.routine-action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px;
}
.action-grid-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 0 6px 0;
  min-height: 80px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s;
}
.action-grid-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #f8f9fa;
}
.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.action-name {
  font-size: 0.85em;
  color: #444;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
}
.current-action-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f7f7f7;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.timer {
  font-size: 1.1em;
  color: #1976d2;
  font-weight: bold;
}
.end-btn {
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 4px 12px;
  cursor: pointer;
  margin-left: 10px;
}
.action-grid-card.selected {
  border: 2px solid #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.12);
}
</style>
