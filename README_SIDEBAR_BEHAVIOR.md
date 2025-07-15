# 側邊欄行為更新說明

## 新增功能

### 1. 大螢幕自動顯示側邊欄

- **觸發條件**: 螢幕寬度 ≥ 576px
- **行為**: 自動顯示 RightSidebar.vue
- **預設組件**: ScheduleComponent.vue

### 2. 組件切換邏輯

- **點擊不同組件**: 切換到對應組件並顯示側邊欄
- **點擊當前組件**:
  - 如果側邊欄顯示中 → 隱藏側邊欄
  - 如果側邊欄隱藏中 → 顯示側邊欄
- **適用組件**: schedule, routineWork, statistics, importantJob, AccountCircle

## 詳細行為說明

### 大螢幕行為 (≥ 576px)

1. **初始化**: 自動顯示側邊欄，預設顯示 ScheduleComponent
2. **組件切換**:
   - 點擊 TitleNav 中的功能按鈕
   - 如果點擊的是當前顯示的組件 → 切換側邊欄顯示/隱藏狀態
   - 如果點擊的是其他組件 → 切換組件並顯示側邊欄
3. **視窗調整**: 從小螢幕調整到大螢幕時自動顯示側邊欄

### 小螢幕行為 (< 576px)

1. **初始化**: 不顯示側邊欄
2. **組件切換**:
   - 點擊功能按鈕顯示對應組件
   - 點擊當前組件切換側邊欄顯示/隱藏狀態
3. **視窗調整**: 從大螢幕調整到小螢幕時隱藏側邊欄

## 使用範例

### 大螢幕使用流程

1. 打開應用 → 自動顯示 ScheduleComponent
2. 點擊 "例行工作" → 切換到 RoutineWorkComponent
3. 點擊 "例行工作" again → 隱藏側邊欄
4. 點擊 "例行工作" again → 重新顯示側邊欄
5. 點擊 "統計分析" → 切換到 StatisticsComponent

### 小螢幕使用流程

1. 打開應用 → 不顯示側邊欄
2. 點擊 "行事曆" → 顯示 ScheduleComponent
3. 點擊 "行事曆" again → 隱藏側邊欄
4. 點擊 "行事曆" again → 重新顯示側邊欄
5. 點擊 "重要工作" → 切換到 ImportantJobComponent

## 技術實現

### App.vue 變更

```javascript
// 組件切換邏輯
const switchSidebarComponent = componentName => {
  // 如果點擊的是當前顯示的組件
  if (currentSidebarComponent.value === componentName) {
    // 如果側邊欄當前是顯示的，則隱藏
    if (sidebarVisible.value) {
      closeSidebar();
    } else {
      // 如果側邊欄當前是隱藏的，則顯示
      showSidebar();
    }
  } else {
    // 否則切換到新組件並顯示側邊欄
    currentSidebarComponent.value = componentName;
    showSidebar();
  }
};

// 螢幕大小檢查
function checkScreenSize() {
  isSmallScreen.value = window.innerWidth < 576;

  if (isSmallScreen.value) {
    sidebarVisible.value = false;
  } else {
    sidebarVisible.value = true; // 大螢幕自動顯示
  }
}
```

### 初始化邏輯

```javascript
onMounted(() => {
  checkScreenSize();
  // 大螢幕時自動顯示側邊欄
  if (window.innerWidth >= 576) {
    sidebarVisible.value = true;
  }
});
```

## 用戶體驗改進

1. **直觀操作**: 點擊當前組件可以切換側邊欄顯示/隱藏狀態
2. **自動適配**: 大螢幕自動顯示，小螢幕按需顯示
3. **狀態記憶**: 組件切換時保持當前組件狀態
4. **響應式設計**: 視窗大小變化時自動調整顯示狀態

## 測試建議

1. **大螢幕測試**:

   - 確認初始化時自動顯示側邊欄
   - 測試組件切換功能
   - 測試點擊當前組件切換顯示/隱藏功能

2. **小螢幕測試**:

   - 確認初始化時不顯示側邊欄
   - 測試點擊按鈕顯示組件
   - 測試點擊當前組件切換顯示/隱藏功能

3. **視窗調整測試**:
   - 從大螢幕調整到小螢幕
   - 從小螢幕調整到大螢幕
   - 確認側邊欄狀態正確切換
