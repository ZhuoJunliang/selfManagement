# 組件重構說明

## 概述

本次重構將 RightSidebar.vue 中的各個功能拆分為獨立的組件，實現了更清晰的代碼結構和更好的可維護性。

## 新增的組件

### 1. ScheduleComponent.vue

- **功能**: 行事曆功能組件
- **內容**: 行事曆預覽、快速操作按鈕
- **特色**: 簡潔的界面設計，包含新增活動和查看全部功能

### 2. RoutineWorkComponent.vue

- **功能**: 例行工作管理組件
- **內容**: 完成統計、今日例行工作列表
- **特色**: 可勾選的任務列表，完成狀態視覺化

### 3. StatisticsComponent.vue

- **功能**: 統計分析組件
- **內容**: 活動統計、週趨勢圖表、活動分類
- **特色**: 圖表化展示，包含柱狀圖和分類統計

### 4. ImportantJobComponent.vue

- **功能**: 重要工作管理組件
- **內容**: 優先級統計、待處理工作列表
- **特色**: 優先級顏色標識，截止時間提醒

### 5. AccountComponent.vue

- **功能**: 帳戶設定組件
- **內容**: 個人資料、設定選項、登出功能
- **特色**: 用戶友好的設定界面

## 架構變更

### App.vue 變更

- 新增 `currentSidebarComponent` 狀態管理當前顯示的組件
- 新增 `switchSidebarComponent` 函數處理組件切換
- 通過 provide/inject 機制共享狀態

### TitleNav.vue 變更

- 修改 `handleFunctionClick` 函數，使用新的組件切換機制
- 點擊功能按鈕時直接切換到對應組件

### RightSidebar.vue 變更

- 簡化為純容器組件
- 根據 `currentSidebarComponent` 狀態動態顯示對應組件
- 移除原有的功能選單邏輯

## 使用方式

1. **預設顯示**: 應用啟動時預設顯示 `schedule` 組件
2. **組件切換**: 點擊 TitleNav.vue 中的功能按鈕即可切換組件
3. **響應式設計**: 所有組件都支援小螢幕適配

## 技術特點

- **組件化**: 每個功能都是獨立的 Vue 組件
- **狀態管理**: 使用 Vue 3 的 provide/inject 進行狀態共享
- **響應式**: 支援不同螢幕尺寸
- **可擴展**: 易於添加新的功能組件

## 文件結構

```
src/components/
├── RightSidebar.vue (主容器)
├── ScheduleComponent.vue (行事曆)
├── RoutineWorkComponent.vue (例行工作)
├── StatisticsComponent.vue (統計分析)
├── ImportantJobComponent.vue (重要工作)
└── AccountComponent.vue (帳戶設定)
```

## 未來擴展

- 可以為每個組件添加更豐富的功能
- 可以實現組件間的數據共享
- 可以添加動畫效果提升用戶體驗
- 可以實現組件的懶加載優化性能
