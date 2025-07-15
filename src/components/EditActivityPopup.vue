<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="edit-popup-content" @click.stop>
      <div class="popup-header">
        <h3>編輯活動</h3>
        <button class="popup-close" @click="closePopup">×</button>
      </div>
      <div class="edit-popup-body">
        <div class="form-group">
          <label>選擇活動</label>
          <div class="icon-grid">
            <div
              v-for="(iconOption, index) in availableIcons"
              :key="index"
              class="icon-option"
              :class="{selected: editActivity.icon === iconOption.icon && editActivity.color === iconOption.color}"
              @click="selectActivity(iconOption)">
              <span v-html="iconOption.icon" class="icon-display" :style="{color: iconOption.color}"></span>
              <span class="icon-title">{{ iconOption.title }}</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>起始時間</label>
          <div class="time-input-group">
            <input v-model="editActivity.startDate" type="date" />
            <div class="time-picker-input" @click="showNumberPickerPopup('startHour')">
              {{ editActivity.startHour || "時" }}
            </div>
            <span>:</span>
            <div class="time-picker-input" @click="showNumberPickerPopup('startMinute')">
              {{ editActivity.startMinute || "分" }}
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>結束時間</label>
          <div class="time-input-group">
            <input v-model="editActivity.endDate" type="date" />
            <div class="time-picker-input" @click="showNumberPickerPopup('endHour')">
              {{ editActivity.endHour || "時" }}
            </div>
            <span>:</span>
            <div class="time-picker-input" @click="showNumberPickerPopup('endMinute')">
              {{ editActivity.endMinute || "分" }}
            </div>
          </div>
        </div>
        <div class="form-actions">
          <div v-if="formValidation && !formValidation.isValid" class="form-errors">
            {{ formValidation.errors.join("、") }}
          </div>
          <div v-if="saveError" class="form-errors">
            {{ saveError }}
          </div>
          <div class="form-buttons">
            <button class="btn-delete" @click="deleteActivity" :disabled="isDeleting">
              {{ isDeleting ? "刪除中..." : "刪除" }}
            </button>
            <button class="btn-cancel" @click="closePopup">取消</button>
            <button
              class="btn-save"
              @click="saveActivity"
              :disabled="!formValidation || !formValidation.isValid || isSaving">
              {{ isSaving ? "儲存中..." : "儲存" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 數字選擇視窗 -->
    <div v-if="showNumberPicker" class="popup-overlay" @click="closeNumberPicker">
      <div class="number-picker-content" @click.stop>
        <div class="number-picker-header">
          <h3>{{ numberPickerType.includes("Hour") ? "選擇小時" : "選擇分鐘" }}</h3>
          <button class="popup-close" @click="closeNumberPicker">×</button>
        </div>
        <div class="number-picker-body">
          <div class="number-display">{{ numberPickerValue || "請選擇" }}</div>
          <div class="number-grid">
            <div
              v-for="number in numberPickerMax + 1"
              :key="number - 1"
              class="number-option"
              :class="{selected: numberPickerValue === (number - 1).toString().padStart(2, '0')}"
              @click="selectNumber(number - 1)">
              {{ (number - 1).toString().padStart(2, "0") }}
            </div>
          </div>
          <div class="number-picker-actions">
            <button class="btn-cancel" @click="closeNumberPicker">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {itineraryData, saveNewActivity} from "../services/dataService.js";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  availableIcons: {
    type: Array,
    required: true,
  },
  activityToEdit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "saved", "deleted"]);

// 編輯活動狀態
const editActivity = ref({
  title: "",
  icon: "",
  color: "",
  startDate: "",
  startHour: "",
  startMinute: "",
  endDate: "",
  endHour: "",
  endMinute: "",
  originalIndex: -1, // 原始數據中的索引
});

// 數字選擇視窗狀態
const showNumberPicker = ref(false);
const numberPickerType = ref(""); // 'startHour', 'startMinute', 'endHour', 'endMinute'
const numberPickerValue = ref("");
const numberPickerMax = ref(59);

// 保存狀態
const isSaving = ref(false);
const isDeleting = ref(false);
const saveError = ref("");

// 時間驗證
const isEndTimeValid = computed(() => {
  if (!editActivity.value.startDate || !editActivity.value.endDate) return true;
  if (
    !editActivity.value.startHour ||
    !editActivity.value.startMinute ||
    !editActivity.value.endHour ||
    !editActivity.value.endMinute
  )
    return true;

  const startDate = new Date(editActivity.value.startDate);
  const endDate = new Date(editActivity.value.endDate);

  // 設定時間
  startDate.setHours(parseInt(editActivity.value.startHour), parseInt(editActivity.value.startMinute), 0);
  endDate.setHours(parseInt(editActivity.value.endHour), parseInt(editActivity.value.endMinute), 0);

  return endDate >= startDate;
});

// 表單驗證
const formValidation = computed(() => {
  if (!editActivity.value) {
    return {
      isValid: false,
      errors: ["表單初始化中"],
    };
  }

  try {
    const errors = [];

    // 檢查是否選擇了活動
    if (!editActivity.value.title || !editActivity.value.icon || !editActivity.value.color) {
      errors.push("請選擇活動");
    }

    // 檢查起始時間
    if (!editActivity.value.startDate || !editActivity.value.startHour || !editActivity.value.startMinute) {
      errors.push("請設定起始時間");
    }

    // 檢查結束時間
    if (!editActivity.value.endDate || !editActivity.value.endHour || !editActivity.value.endMinute) {
      errors.push("請設定結束時間");
    }

    // 檢查時間邏輯
    if (!isEndTimeValid.value) {
      errors.push("結束時間不能早於起始時間");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  } catch (error) {
    console.error("表單驗證錯誤:", error);
    return {
      isValid: false,
      errors: ["表單驗證錯誤"],
    };
  }
});

function closePopup() {
  emit("close");
  saveError.value = "";
}

function selectActivity(activity) {
  console.log("選擇活動:", activity);
  editActivity.value.title = activity.title;
  editActivity.value.icon = activity.icon;
  editActivity.value.color = activity.color;
  console.log("更新後的活動:", editActivity.value);
}

async function saveActivity() {
  console.log("開始保存活動...");
  console.log("表單驗證狀態:", formValidation.value);
  console.log("活動數據:", editActivity.value);

  if (!formValidation.value || !formValidation.value.isValid) {
    console.log("表單驗證失敗，無法保存");
    return;
  }

  isSaving.value = true;
  saveError.value = "";

  try {
    // 先刪除原始活動
    await deleteActivityFromData();

    // 再保存新活動
    const success = await saveNewActivity(editActivity.value);
    if (success) {
      console.log("活動保存成功");
      emit("saved");
      closePopup();
    } else {
      console.error("活動保存失敗");
      saveError.value = "保存失敗，請重試";
    }
  } catch (error) {
    console.error("保存活動時發生錯誤:", error);
    saveError.value = "保存時發生錯誤：" + error.message;
  } finally {
    isSaving.value = false;
  }
}

async function deleteActivity() {
  if (!confirm("確定要刪除此活動嗎？")) {
    return;
  }

  isDeleting.value = true;
  saveError.value = "";

  try {
    await deleteActivityFromData();
    console.log("活動刪除成功");
    emit("deleted");
    closePopup();
  } catch (error) {
    console.error("刪除活動時發生錯誤:", error);
    saveError.value = "刪除時發生錯誤：" + error.message;
  } finally {
    isDeleting.value = false;
  }
}

async function deleteActivityFromData() {
  try {
    // 讀取現有的 data.txt
    const dataRes = await fetch("http://localhost:3001/data.txt");
    if (!dataRes.ok) {
      throw new Error("讀取 data.txt 失敗");
    }
    const existingData = await dataRes.json();

    // 找到要刪除的活動索引
    const activityToDelete = props.activityToEdit;
    const deleteIndex = existingData.findIndex(item => {
      const itemStart = new Date(item.startTime);
      const itemEnd = new Date(item.endTime);
      const targetStart = new Date(activityToDelete.startTime);
      const targetEnd = new Date(activityToDelete.endTime);

      return itemStart.getTime() === targetStart.getTime() && itemEnd.getTime() === targetEnd.getTime();
    });

    if (deleteIndex === -1) {
      throw new Error("找不到要刪除的活動");
    }

    // 刪除活動
    existingData.splice(deleteIndex, 1);

    // 儲存到 data.txt
    const saveRes = await fetch("http://localhost:3001/data.txt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingData, null, 2),
    });

    if (!saveRes.ok) {
      throw new Error("儲存到 data.txt 失敗");
    }

    console.log("活動已從 data.txt 刪除");
    return true;
  } catch (err) {
    console.error("刪除活動失敗:", err);
    throw err;
  }
}

function showNumberPickerPopup(type) {
  if (
    type.includes("end") &&
    (!editActivity.value.startDate || !editActivity.value.startHour || !editActivity.value.startMinute)
  ) {
    saveError.value = "請先設定起始時間";
    return;
  }

  numberPickerType.value = type;
  numberPickerValue.value = "";

  if (type.includes("Hour")) {
    numberPickerMax.value = 23;
  } else {
    numberPickerMax.value = 59;
  }

  showNumberPicker.value = true;
}

function closeNumberPicker() {
  showNumberPicker.value = false;
  numberPickerType.value = "";
  numberPickerValue.value = "";
}

function selectNumber(number) {
  numberPickerValue.value = number.toString().padStart(2, "0");

  // 如果是結束時間，進行驗證
  if (numberPickerType.value.includes("end")) {
    const tempActivity = {...editActivity.value};
    tempActivity[numberPickerType.value] = numberPickerValue.value;

    // 檢查結束時間是否早於起始時間
    if (
      tempActivity.startDate &&
      tempActivity.endDate &&
      tempActivity.startHour &&
      tempActivity.startMinute &&
      tempActivity.endHour &&
      tempActivity.endMinute
    ) {
      const startDate = new Date(tempActivity.startDate);
      const endDate = new Date(tempActivity.endDate);

      startDate.setHours(parseInt(tempActivity.startHour), parseInt(tempActivity.startMinute), 0);
      endDate.setHours(parseInt(tempActivity.endHour), parseInt(tempActivity.endMinute), 0);

      if (endDate < startDate) {
        saveError.value = "結束時間不能早於起始時間";
        closeNumberPicker();
        return;
      }
    }
  }

  // 自動保存並關閉視窗
  if (numberPickerValue.value !== "") {
    editActivity.value[numberPickerType.value] = numberPickerValue.value;
    // 修正時間時自動清除錯誤訊息
    saveError.value = "";
    console.log("更新時間:", numberPickerType.value, numberPickerValue.value);
    console.log("更新後的活動:", editActivity.value);
  }
  closeNumberPicker();
}

// 在 <script setup> 內部加上這個 function
function formatDateToInputValue(dateObj) {
  const y = dateObj.getFullYear();
  const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const d = dateObj.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 監聽 show prop 變化，初始化表單
watch(
  () => props.show,
  newShow => {
    if (newShow && props.activityToEdit) {
      const activity = props.activityToEdit;
      const startDate = new Date(activity.startTime);
      const endDate = new Date(activity.endTime);

      editActivity.value = {
        title: activity.title,
        icon: activity.icon,
        color: activity.color,
        startDate: formatDateToInputValue(startDate),
        startHour: startDate.getHours().toString().padStart(2, "0"),
        startMinute: startDate.getMinutes().toString().padStart(2, "0"),
        endDate: formatDateToInputValue(endDate),
        endHour: endDate.getHours().toString().padStart(2, "0"),
        endMinute: endDate.getMinutes().toString().padStart(2, "0"),
        originalIndex: -1,
      };
      saveError.value = "";
    }
  }
);

// 監聽起始時間欄位，修正時自動清除 saveError
watch(
  [() => editActivity.value.startDate, () => editActivity.value.startHour, () => editActivity.value.startMinute],
  ([date, hour, minute]) => {
    if (date && hour && minute) {
      saveError.value = "";
    }
  }
);
</script>

<style scoped>
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

.edit-popup-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
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

.edit-popup-body {
  padding: 1.5em;
}

.form-group {
  margin-bottom: 1.2em;
}

.form-group label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.8em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.time-input-group input[type="date"] {
  flex: 1;
}

.time-input-group input[type="number"] {
  width: 60px;
  text-align: center;
}

.time-input-group span {
  font-size: 1.2em;
  color: #666;
  font-weight: bold;
}

.time-picker-input {
  width: 60px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  font-size: 1em;
  color: #333;
  transition: all 0.2s;
}

.time-picker-input:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.time-picker-input:empty::before {
  content: attr(placeholder);
  color: #999;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.8em;
  max-height: 200px;
  overflow-y: auto;
}

.icon-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8em 0.5em;
  border: 2px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.icon-option:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.icon-option.selected {
  border-color: #3498db;
  background: #e3f2fd;
}

.icon-display {
  width: 24px;
  height: 24px;
  margin-bottom: 0.3em;
  display: block;
}

.icon-title {
  font-size: 0.8em;
  color: #666;
  line-height: 1.2;
  word-break: break-word;
}

.form-actions {
  margin-top: 1.5em;
}

.form-errors {
  color: #e74c3c;
  font-size: 0.9em;
  margin-bottom: 1em;
  font-weight: 500;
  text-align: center;
}

.form-buttons {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save,
.btn-delete {
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-save {
  background: #3498db;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #2980b9;
}

.btn-save:disabled {
  background: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #c0392b;
}

.btn-delete:disabled {
  background: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
}

/* 數字選擇視窗 */
.number-picker-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.number-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 1.2em;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.number-picker-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #333;
}

.number-picker-body {
  padding: 1.5em;
}

.number-display {
  text-align: center;
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5em;
  padding: 0.5em;
  background: #f8f9fa;
  border-radius: 6px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.8em;
  margin-bottom: 1.5em;
  max-height: 300px;
  overflow-y: auto;
}

.number-option {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  transition: all 0.2s;
  background: white;
}

.number-option:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.number-option.selected {
  border-color: #3498db;
  background: #3498db;
  color: white;
}

.number-picker-actions {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
}
</style>
