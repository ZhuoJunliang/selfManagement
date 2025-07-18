<template>
  <div class="important-job-component">
    <div class="component-header">
      <h2>重要工作</h2>
      <select v-model="selectedRange" class="statistics-range-select">
        <option value="day">天</option>
        <option value="week">週</option>
        <option value="month">月</option>
        <option value="year">年</option>
      </select>
    </div>
    <div style="margin-bottom: 0.5em; color: #666; font-size: 1.05em">
      <h3>{{ rangeTitle }}重要工作</h3>
    </div>
    <div class="component-content">
      <!-- 顯示 importantJob.txt 內容 -->
      <div v-if="importantJobs.length === 0">尚未設定重要工作</div>
      <ul v-else>
        <li v-for="(job, idx) in importantJobs" :key="idx">
          <span>
            {{ validActions.find(a => a.idx === job.actions)?.actionName || "未知工作" }}
            （{{ formatTime(job.targetTime) }}）
          </span>
          <div v-if="jobProgress[idx]">
            <span style="color: #007bff; font-size: 0.95em">
              完成：{{ formatTime(jobProgress[idx].done) }} / {{ formatTime(jobProgress[idx].target * rangeDays) }} （{{
                jobProgress[idx].target > 0
                  ? Math.round((jobProgress[idx].done / (jobProgress[idx].target * rangeDays)) * 100)
                  : 0
              }}%）
            </span>
          </div>
        </li>
      </ul>
    </div>
    <button class="add-btn" @click="openPopup">修改</button>
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h3>選擇重要工作</h3>
        <div class="actions-list">
          <div v-for="(action, idx) in validActions" :key="idx" class="action-item">
            <label>
              <input type="checkbox" v-model="selected[idx].checked" />
              <span>{{ action.actionName }}</span>
            </label>
            <div v-if="selected[idx].checked" class="time-inputs">
              <input type="number" min="0" v-model.number="selected[idx].hour" placeholder="小時" style="width: 3em" />
              <span>小時</span>
              <input
                type="number"
                min="0"
                max="59"
                v-model.number="selected[idx].minute"
                placeholder="分鐘"
                style="width: 3em" />
              <span>分鐘</span>
            </div>
          </div>
        </div>
        <div class="popup-actions">
          <button @click="saveImportantJobs">儲存</button>
          <button @click="showPopup = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, inject, watch, computed} from "vue";

const showPopup = ref(false);
const validActions = ref([]);
const selected = ref([]);
const importantJobs = ref([]); // 存放 importantJob.txt 內容
const selectedDate = inject("selectedDate"); // 取得當天日期
const jobProgress = ref([]); // 每個重要工作的完成分鐘數
const selectedRange = ref("day"); // 新增：天/週/月/年選擇
// 新增：根據選擇區間計算天數
const rangeDays = computed(() => {
  const base = selectedDate.value;
  if (selectedRange.value === "day") return 1;
  if (selectedRange.value === "week") return 7;
  if (selectedRange.value === "month") {
    return new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  }
  if (selectedRange.value === "year") {
    const year = base.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  }
  return 1;
});
// 新增：根據選擇區間顯示標題
const rangeTitle = computed(() => {
  if (selectedRange.value === "day") return "當日";
  if (selectedRange.value === "week") return "本週";
  if (selectedRange.value === "month") return "本月";
  if (selectedRange.value === "year") return "今年";
  return "";
});
// 輔助：取得 yyyy/M/d
function getDateStr(dateStr) {
  return dateStr.split(" ")[0];
}
// Date 物件轉 yyyy/M/d
function formatDateToYMD(date) {
  if (!(date instanceof Date)) return "";
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

// 格式化時間顯示：超過60分鐘顯示為小時和分鐘
function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes}分鐘`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}小時`;
    } else {
      return `${hours}小時${remainingMinutes}分鐘`;
    }
  }
}

// 統計當天每個重要工作的完成分鐘數
async function calcJobProgress() {
  if (!selectedDate?.value) return;
  try {
    const res = await fetch("/data.txt");
    const data = await res.json();
    // 根據 selectedRange 決定統計範圍
    const base = selectedDate.value;
    let rangeStart, rangeEnd;
    if (selectedRange.value === "day") {
      rangeStart = new Date(base);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(base);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (selectedRange.value === "week") {
      const day = base.getDay(); // 0=週日, 1=週一, ..., 6=週六
      rangeStart = new Date(base);
      rangeStart.setDate(base.getDate() - day);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (selectedRange.value === "month") {
      rangeStart = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
      rangeEnd = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (selectedRange.value === "year") {
      rangeStart = new Date(base.getFullYear(), 0, 1, 0, 0, 0, 0);
      rangeEnd = new Date(base.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
    // 初始化
    const progressArr = importantJobs.value.map(job => ({actions: job.actions, done: 0, target: job.targetTime}));
    data.forEach(item => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const idx = progressArr.findIndex(j => j.actions === item.actions);
      // 計算與區間重疊的時間
      const overlapStart = start > rangeStart ? start : rangeStart;
      const overlapEnd = end < rangeEnd ? end : rangeEnd;
      const overlapMs = overlapEnd - overlapStart;
      if (overlapMs > 0 && idx !== -1 && end > rangeStart && start < rangeEnd) {
        const min = Math.round(overlapMs / 60000);
        progressArr[idx].done += min;
      }
    });
    jobProgress.value = progressArr;
  } catch (e) {
    jobProgress.value = importantJobs.value.map(job => ({actions: job.actions, done: 0, target: job.targetTime}));
  }
}

// 新增：載入 importantJob.txt 並預設勾選，並存到 importantJobs
async function loadImportantJobs() {
  try {
    const res = await fetch("http://localhost:3001/importantJob.txt");
    if (!res.ok) return;
    const jobs = await res.json();
    importantJobs.value = jobs; // 存到 importantJobs
    // jobs: [{ actions: idx, targetTime: min }, ...]
    jobs.forEach(job => {
      const idx = validActions.value.findIndex(a => a.idx === job.actions);
      if (idx !== -1) {
        selected.value[idx].checked = true;
        selected.value[idx].hour = Math.floor(job.targetTime / 60);
        selected.value[idx].minute = job.targetTime % 60;
      }
    });
    await calcJobProgress(); // 載入後統計
  } catch (e) {
    importantJobs.value = [];
    jobProgress.value = [];
    // 檔案不存在或格式錯誤可忽略
  }
}

onMounted(async () => {
  // 載入 actions.txt
  const res = await fetch("/actions.txt");
  const actions = await res.json();
  validActions.value = actions.map((a, idx) => ({...a, idx})).filter(a => a.validEvent === "true");
  selected.value = validActions.value.map(() => ({checked: false, hour: 0, minute: 0}));
  // 載入 importantJob.txt 的預設值
  await loadImportantJobs();
});

// 監聽 selectedRange 變動時也要重新統計
watch([selectedDate, selectedRange], async () => {
  await calcJobProgress();
});

function openPopup() {
  showPopup.value = true;
  // 每次打開都重新載入 importantJob.txt
  selected.value = validActions.value.map(() => ({checked: false, hour: 0, minute: 0}));
  loadImportantJobs();
}

async function saveImportantJobs() {
  // 組合要儲存的資料
  const jobs = [];
  selected.value.forEach((sel, i) => {
    if (sel.checked) {
      const totalMin = (Number(sel.hour) || 0) * 60 + (Number(sel.minute) || 0);
      if (totalMin > 0) {
        jobs.push({actions: validActions.value[i].idx, targetTime: totalMin});
      }
    }
  });
  // 儲存到 importantJob.txt
  await fetch("http://localhost:3001/importantJob.txt", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(jobs, null, 2),
  });
  showPopup.value = false;
  await loadImportantJobs(); // 儲存後重新載入顯示
  // 可加載入/刷新顯示邏輯
}
</script>

<style scoped>
.important-job-component {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.component-header {
  margin-bottom: 1.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1em;
}
.add-btn {
  margin-top: auto;
  width: 100%;
  padding: 0.8em 0;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #0056b3;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup {
  background: #fff;
  border-radius: 8px;
  padding: 2em;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}
.actions-list {
  margin: 1em 0;
  max-height: 300px;
  overflow-y: auto;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.8em;
}
.time-inputs {
  display: flex;
  align-items: center;
  gap: 0.3em;
}
.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  margin-top: 1.5em;
}
.statistics-range-select {
  padding: 0.3em 1.2em 0.3em 0.7em;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95em;
  color: #333;
  background: #fff;
  outline: none;
  margin-left: 1em;
  transition: border-color 0.2s;
}
.statistics-range-select:focus {
  border-color: #007bff;
}
</style>
