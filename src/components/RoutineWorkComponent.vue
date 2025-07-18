<template>
  <div class="routine-container">
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
    <!-- 新增與修改按鈕並排 -->
    <div class="button-row">
      <FloatingAddButton />
      <EditButton @click="showPopup = true" />
      <DeleteButton @click="showDeletePopup = true" />
    </div>

    <!-- 修改彈窗 -->
    <div v-if="showPopup" class="popup-overlay" @click.self="handlePopupOutsideClick">
      <div class="edit-popup-content">
        <h3 class="popup-title">修改活動</h3>

        <!-- 活動卡片網格 -->
        <div class="edit-action-grid">
          <div
            v-for="(action, idx) in actions"
            :key="action.actionName"
            class="edit-action-card"
            @click="selectForDelete(action, idx)">
            <div class="action-icon" v-html="getIconSvg(action.actionIcon, action.actionColor)"></div>
            <div class="action-name">{{ action.actionName }}</div>
          </div>
        </div>

        <!-- 刪除確認區域 -->
        <div v-if="deletingAction.actionName" class="delete-confirmation-area-popup">
          <div class="delete-preview">
            <span class="delete-icon" v-html="getIconSvg(deletingAction.actionIcon, deletingAction.actionColor)"></span>
            <span class="delete-action-name">{{ deletingAction.actionName }}</span>
          </div>
          <div class="delete-actions">
            <button class="btn-cancel-delete" @click="cancelDelete">取消</button>
            <button class="btn-delete" @click="confirmDelete">確認刪除</button>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-cancel" @click="showPopup = false">關閉</button>
        </div>
      </div>
    </div>

    <!-- 刪除活動彈窗 -->
    <div v-if="showDeletePopup" class="popup-overlay" @click.self="handleDeletePopupOutsideClick">
      <div class="edit-popup-content">
        <h3 class="popup-title">刪除活動</h3>

        <!-- 活動卡片網格 -->
        <div class="edit-action-grid">
          <div
            v-for="(action, idx) in actions"
            :key="action.actionName"
            class="edit-action-card"
            @click="selectForDelete(action, idx)">
            <div class="action-icon" v-html="getIconSvg(action.actionIcon, action.actionColor)"></div>
            <div class="action-name">{{ action.actionName }}</div>
          </div>
        </div>

        <!-- 刪除確認區域 -->
        <div v-if="deletingAction.actionName" class="delete-confirmation-area-popup">
          <div class="delete-preview">
            <span class="delete-icon" v-html="getIconSvg(deletingAction.actionIcon, deletingAction.actionColor)"></span>
            <span class="delete-action-name">{{ deletingAction.actionName }}</span>
          </div>
          <div class="delete-actions">
            <button class="btn-cancel-delete" @click="cancelDelete">取消</button>
            <button class="btn-delete" @click="confirmDelete">確認刪除</button>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-cancel" @click="showDeletePopup = false">關閉</button>
        </div>
      </div>
    </div>

    <!-- 編輯活動彈窗 -->
    <div v-if="showEditPopup" class="popup-overlay" @click.self="showEditPopup = false">
      <div class="edit-popup-content">
        <h3 class="popup-title">編輯活動</h3>

        <!-- 活動名稱輸入 -->
        <div class="input-group">
          <label for="editActivityName">活動名稱：</label>
          <input
            id="editActivityName"
            v-model="editingAction.actionName"
            type="text"
            placeholder="請輸入活動名稱"
            class="activity-input" />
        </div>

        <!-- 顏色選擇 -->
        <div class="input-group">
          <label>選擇顏色：</label>
          <div class="color-grid">
            <div
              v-for="color in colors"
              :key="color.name"
              class="color-option"
              :class="{selected: editingAction.actionColor === color.value}"
              :style="{backgroundColor: color.value}"
              @click="editingAction.actionColor = color.value"
              :title="color.name"></div>
          </div>
        </div>

        <!-- 預覽 -->
        <div class="preview-section">
          <label>預覽：</label>
          <div class="activity-preview">
            <span
              v-html="icons[editingAction.actionIcon]"
              class="preview-icon"
              :style="{color: editingAction.actionColor, fill: editingAction.actionColor}"></span>
            <span class="preview-name" :style="{color: editingAction.actionColor}">{{
              editingAction.actionName || "活動名稱"
            }}</span>
            <div class="preview-color" :style="{backgroundColor: editingAction.actionColor}"></div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-cancel" @click="cancelEdit">取消</button>
          <button class="btn-save" @click="saveEdit" :disabled="!editingAction.actionName.trim()">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, inject} from "vue";
import FloatingAddButton from "./FloatingAddButton.vue";
import EditButton from "./EditButton.vue";
import DeleteButton from "./DeleteButton.vue";

const actions = ref([]);
const icons = ref([]);

// 編輯相關狀態
const showPopup = ref(false);
const showEditPopup = ref(false);
const editingAction = ref({});
const editingIndex = ref(-1);

// 刪除相關狀態
const showDeletePopup = ref(false);
const deletingAction = ref({});
const deletingIndex = ref(-1);

// 32種常見顏色
const colors = ref([
  {name: "黑色", value: "black"},
  {name: "紅色", value: "red"},
  {name: "藍色", value: "blue"},
  {name: "綠色", value: "green"},
  {name: "紫色", value: "purple"},
  {name: "橙色", value: "orange"},
  {name: "粉色", value: "pink"},
  {name: "棕色", value: "brown"},
  {name: "青色", value: "teal"},
  {name: "靛藍", value: "indigo"},
  {name: "黃色", value: "yellow"},
  {name: "珊瑚色", value: "coral"},
  {name: "灰色", value: "gray"},
  {name: "青檸色", value: "lime"},
  {name: "青色", value: "cyan"},
  {name: "洋紅色", value: "magenta"},
  {name: "薰衣草", value: "lavender"},
  {name: "金色", value: "gold"},
  {name: "鮭魚色", value: "salmon"},
  {name: "海軍藍", value: "navy"},
  {name: "銀色", value: "silver"},
  {name: "深紅色", value: "darkred"},
  {name: "深藍色", value: "darkblue"},
  {name: "深綠色", value: "darkgreen"},
  {name: "深紫色", value: "darkviolet"},
  {name: "深橙色", value: "darkorange"},
  {name: "深粉色", value: "deeppink"},
  {name: "深棕色", value: "saddlebrown"},
  {name: "深青色", value: "darkcyan"},
  {name: "深靛藍", value: "darkmagenta"},
  {name: "橄欖色", value: "olive"},
  {name: "深珊瑚色", value: "indianred"},
  {name: "深灰色", value: "darkslategray"},
  {name: "深青檸色", value: "darkolivegreen"},
  {name: "深青色", value: "darkturquoise"},
]);

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

// localStorage 相關函數
function saveCurrentActionToStorage() {
  if (currentAction.value) {
    const actionData = {
      action: currentAction.value,
      actionIdx: currentActionIdx.value,
      startTime: startTime.value,
      startTimestamp: new Date().getTime() - timer.value * 1000, // 計算實際開始時間戳
    };
    localStorage.setItem("currentAction", JSON.stringify(actionData));
  } else {
    localStorage.removeItem("currentAction");
  }
}

function loadCurrentActionFromStorage() {
  const savedData = localStorage.getItem("currentAction");
  if (savedData) {
    try {
      const actionData = JSON.parse(savedData);
      const now = new Date().getTime();
      const elapsedSeconds = Math.floor((now - actionData.startTimestamp) / 1000);

      // 恢復狀態
      currentAction.value = actionData.action;
      currentActionIdx.value = actionData.actionIdx;
      startTime.value = actionData.startTime;
      timer.value = elapsedSeconds;
      timerDisplay.value = formatTimer(elapsedSeconds);

      // 重新啟動計時器
      timerInterval.value = setInterval(() => {
        timer.value = Math.floor((new Date().getTime() - actionData.startTimestamp) / 1000);
        timerDisplay.value = formatTimer(timer.value);
      }, 1000);
    } catch (error) {
      console.error("載入儲存的活動狀態失敗:", error);
      localStorage.removeItem("currentAction");
    }
  }
}

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

  // 儲存到 localStorage
  saveCurrentActionToStorage();
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
  fetch("http://localhost:3001/api/data")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
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
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
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

      // 清除 localStorage
      localStorage.removeItem("currentAction");
    })
    .catch(err => {
      console.error("儲存失敗:", err);
      alert("儲存失敗: " + err.message);
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
  await loadActions();
  const iconRes = await fetch("/icons.txt");
  icons.value = await iconRes.json();

  // 載入儲存的活動狀態
  loadCurrentActionFromStorage();

  // 監聽活動更新事件
  window.addEventListener("action-updated", loadActions);

  // 監聽頁面可見性變更
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

// 處理頁面可見性變更
function handleVisibilityChange() {
  if (document.hidden) {
    // 頁面隱藏時，儲存當前狀態
    if (currentAction.value) {
      saveCurrentActionToStorage();
    }
  } else {
    // 頁面重新可見時，重新計算計時器
    if (currentAction.value && timerInterval.value) {
      clearInterval(timerInterval.value);
      loadCurrentActionFromStorage();
    }
  }
}

async function loadActions() {
  try {
    const response = await fetch("http://localhost:3001/api/actions");
    if (response.ok) {
      const data = await response.json();
      actions.value = data.filter(a => a.validEvent === "true");
    } else {
      console.error("載入活動失敗");
    }
  } catch (error) {
    console.error("載入活動時發生錯誤:", error);
  }
}

// 編輯相關函數
function editAction(action, idx) {
  editingAction.value = {...action};
  editingIndex.value = idx;
  showPopup.value = false;
  showEditPopup.value = true;
}

function cancelEdit() {
  showEditPopup.value = false;
  editingAction.value = {};
  editingIndex.value = -1;
}

async function saveEdit() {
  try {
    const response = await fetch("http://localhost:3001/api/update-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index: editingIndex.value,
        action: editingAction.value,
      }),
    });

    if (response.ok) {
      showEditPopup.value = false;
      // 重新載入活動列表
      await loadActions();
      // 通知父元件
      window.dispatchEvent(new CustomEvent("action-updated"));
    } else {
      const errorData = await response.json();
      alert(`修改失敗：${errorData.message || "請稍後再試"}`);
    }
  } catch (error) {
    console.error("修改活動時發生錯誤:", error);
    alert("修改失敗，請稍後再試");
  }
}

// 刪除相關函數
function selectForDelete(action, idx) {
  deletingAction.value = {...action};
  deletingIndex.value = idx;
  // 如果是在修改彈窗中點擊，則關閉修改彈窗
  if (showPopup.value) {
    showPopup.value = false;
  }
  // 如果是在刪除彈窗中點擊，保持彈窗開啟
}

function cancelDelete() {
  deletingAction.value = {};
  deletingIndex.value = -1;
}

function handlePopupOutsideClick() {
  showPopup.value = false;
  // 如果有選中的刪除項目，也要取消
  if (deletingAction.value.actionName) {
    cancelDelete();
  }
}

function handleDeletePopupOutsideClick() {
  showDeletePopup.value = false;
  // 如果有選中的刪除項目，也要取消
  if (deletingAction.value.actionName) {
    cancelDelete();
  }
}

async function confirmDelete() {
  try {
    const response = await fetch("http://localhost:3001/api/delete-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index: deletingIndex.value,
      }),
    });

    if (response.ok) {
      // 重置刪除狀態
      deletingAction.value = {};
      deletingIndex.value = -1;
      // 重新載入活動列表
      await loadActions();
      // 通知父元件
      window.dispatchEvent(new CustomEvent("action-updated"));
      // 關閉所有彈窗
      showPopup.value = false;
      showDeletePopup.value = false;
    } else {
      const errorData = await response.json();
      alert(`刪除失敗：${errorData.message || "請稍後再試"}`);
    }
  } catch (error) {
    console.error("刪除活動時發生錯誤:", error);
    alert("刪除失敗，請稍後再試");
  }
}
onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
  // 移除事件監聽器
  window.removeEventListener("action-updated", loadActions);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<style scoped>
.routine-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
.routine-action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px;
  flex: 1;
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
  cursor: pointer;
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

/* 彈窗樣式 */
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

.edit-popup-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5em 1.2em 1.2em 1.2em;
}

.popup-title {
  margin: 0 0 1em 0;
  color: #333;
  font-size: 1.2em;
  text-align: center;
}

.edit-action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.edit-action-card {
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
  cursor: pointer;
}

.edit-action-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #f8f9fa;
}

/* 輸入表單樣式 */
.input-group {
  margin-bottom: 1.5em;
}

.input-group label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: 500;
  color: #333;
}

.activity-input {
  width: 100%;
  padding: 0.8em;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.activity-input:focus {
  outline: none;
  border-color: #3498db;
}

/* 顏色選擇網格 */
.color-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5em;
  max-height: 200px;
  overflow-y: auto;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.color-option:hover {
  transform: scale(1.1);
  border-color: #333;
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.1);
}

.color-option.selected::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* 預覽區域 */
.preview-section {
  margin-bottom: 1.5em;
  padding: 1em;
  background: #f8f9fa;
  border-radius: 6px;
}

.preview-section label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: 500;
  color: #333;
}

.activity-preview {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.8em;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.preview-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.preview-name {
  flex: 1;
  font-weight: 500;
}

.preview-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

/* 按鈕樣式 */
.form-actions {
  margin-top: 1.5em;
  text-align: right;
  display: flex;
  gap: 0.8em;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  background: #f8f9fa;
  color: #666;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-save {
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  background: #3498db;
  color: white;
  transition: background-color 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #2980b9;
}

.btn-save:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
.button-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
}

/* 覆蓋 FloatingAddButton 的容器樣式 */
.button-row .add-button-container {
  margin-top: 0;
}

/* 確保三個按鈕高度一致 */
.button-row .add-button,
.button-row .edit-button,
.button-row .delete-button {
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 統一按鈕內圖標和文字樣式 */
.button-row .add-button .plus,
.button-row .edit-button .edit-icon,
.button-row .delete-button .delete-icon {
  font-size: 1.2em !important;
  line-height: 1 !important;
  display: flex !important;
  align-items: center !important;
}

.button-row .add-button .button-text,
.button-row .edit-button .button-text,
.button-row .delete-button .button-text {
  font-size: 0.95em !important;
  line-height: 1 !important;
}

/* 刪除確認區域樣式 */
.delete-confirmation-area-popup {
  background: #fff;
  border: 2px solid #e74c3c;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 16px 0;
  animation: fadeIn 0.3s ease-out;
}

.delete-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delete-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-action-name {
  font-weight: 500;
  color: #333;
  font-size: 1.1em;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-cancel-delete {
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-cancel-delete:hover {
  background: #7f8c8d;
}
</style>
