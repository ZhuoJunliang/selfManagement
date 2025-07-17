<template>
  <div class="fab-container">
    <!-- 浮動加號按鈕 -->
    <button class="fab" @click="showPopup = true">
      <span class="plus">+</span>
    </button>
    <!-- 第一個彈窗：選擇 icon -->
    <div v-if="showPopup" class="popup-overlay" @click.self="showPopup = false">
      <div class="add-popup-content">
        <h3 class="popup-title">選擇活動圖示</h3>
        <div class="icon-grid">
          <div v-for="(icon, idx) in icons" :key="idx" class="icon-option" @click="selectIcon(idx)">
            <span v-html="icon" class="icon-display"></span>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" @click="showPopup = false">關閉</button>
        </div>
      </div>
    </div>

    <!-- 第二個彈窗：輸入活動名稱和選擇顏色 -->
    <div v-if="showInputPopup" class="popup-overlay" @click.self="showInputPopup = false">
      <div class="add-popup-content">
        <h3 class="popup-title">新增活動</h3>

        <!-- 活動名稱輸入 -->
        <div class="input-group">
          <label for="activityName">活動名稱：</label>
          <input
            id="activityName"
            v-model="newActivity.actionName"
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
              :class="{selected: newActivity.actionColor === color.value}"
              :style="{backgroundColor: color.value}"
              @click="newActivity.actionColor = color.value"
              :title="color.name"></div>
          </div>
        </div>

        <!-- 預覽 -->
        <div class="preview-section">
          <label>預覽：</label>
          <div class="activity-preview">
            <span
              v-html="icons[selectedIconIndex]"
              class="preview-icon"
              :style="{color: newActivity.actionColor, fill: newActivity.actionColor}"></span>
            <span class="preview-name" :style="{color: newActivity.actionColor}">{{
              newActivity.actionName || "活動名稱"
            }}</span>
            <div class="preview-color" :style="{backgroundColor: newActivity.actionColor}"></div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-cancel" @click="cancelInput">取消</button>
          <button class="btn-save" @click="saveActivity" :disabled="!newActivity.actionName.trim()">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

const showPopup = ref(false);
const showInputPopup = ref(false);
const icons = ref([]);
const selectedIconIndex = ref(0);

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

// 新活動資料
const newActivity = ref({
  actionName: "",
  actionIcon: 0,
  actionColor: "black",
  validEvent: "true",
});

onMounted(async () => {
  const res = await fetch("/icons.txt");
  icons.value = await res.json();
});

// 選擇 icon
const selectIcon = iconIndex => {
  selectedIconIndex.value = iconIndex;
  newActivity.value.actionIcon = iconIndex;
  showPopup.value = false;
  showInputPopup.value = true;
};

// 取消輸入
const cancelInput = () => {
  showInputPopup.value = false;
  newActivity.value = {
    actionName: "",
    actionIcon: selectedIconIndex.value,
    actionColor: "black",
    validEvent: "true",
  };
};

// 儲存活動
const saveActivity = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/add-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newActivity.value),
    });

    if (response.ok) {
      alert("活動新增成功！");
      showInputPopup.value = false;
      // 重置表單
      newActivity.value = {
        actionName: "",
        actionIcon: 0,
        actionColor: "black",
        validEvent: "true",
      };
    } else {
      const errorData = await response.json();
      alert(`儲存失敗：${errorData.message || "請稍後再試"}`);
    }
  } catch (error) {
    console.error("儲存活動時發生錯誤:", error);
    alert("儲存失敗，請稍後再試");
  }
};
</script>

<style scoped>
.fab-container {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 20;
}
.fab {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #42a5f5;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: background 0.2s;
}
.fab:hover {
  background: #1976d2;
}
.plus {
  font-size: 1.2em;
  line-height: 1;
}
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
.add-popup-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
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
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.8em;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1.2em;
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
.icon-display {
  width: 24px;
  height: 24px;
  margin-bottom: 0.3em;
  display: block;
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
</style>
