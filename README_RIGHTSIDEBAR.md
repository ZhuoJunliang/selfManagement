# 右側功能區 (RightSidebar) 功能說明

## 概述

新增了一個右側功能區組件，提供額外的功能選單，包括行事曆、例行工作、統計分析、重要工作和帳戶設定等功能。

## 功能特點

### 1. 響應式設計

- **大螢幕 (>576px)**: 側邊欄固定在螢幕右側，寬度為 270px
- **小螢幕 (≤576px)**: 側邊欄自動收起，點擊功能按鈕時全螢幕顯示

### 2. 觸發方式

點擊導航欄右側的以下按鈕可以開啟側邊欄：

- 📅 **行事曆** (schedule)
- ⏰ **例行工作** (routineWork)
- 📊 **統計分析** (statistics)
- ⚠️ **重要工作** (importantJob)
- 👤 **帳戶設定** (AccountCircle)

### 3. 顯示邏輯

- 點擊功能按鈕時，會隱藏 `CalendarArea.vue` 和 `DetailedItineraryArea.vue`
- 顯示 `RightSidebar.vue` 組件
- 點擊側邊欄中的功能項目或關閉按鈕會關閉側邊欄並恢復主要內容顯示

### 4. 組件結構

#### RightSidebar.vue

- 位置：`src/components/RightSidebar.vue`
- 大小：比照 `CalendarArea.vue` (270px 寬度)
- 樣式：現代化的卡片設計，包含圖標和描述文字

#### 功能項目

每個功能項目包含：

- 功能圖標 (SVG)
- 功能標題
- 功能描述
- 懸停效果和點擊動畫

### 5. 技術實現

#### 狀態管理

- 使用 Vue 3 的 `provide/inject` 進行狀態共享
- 新增 `sidebarVisible` 狀態控制側邊欄顯示
- 新增 `showSidebar()`, `closeSidebar()`, `showMainContent()` 函數

#### 響應式處理

- 監聽視窗大小變化
- 小螢幕時自動隱藏側邊欄
- 大螢幕時保持原有佈局

### 6. 樣式特點

- 現代化的卡片設計
- 平滑的過渡動畫
- 懸停效果和陰影
- 響應式佈局適配不同螢幕尺寸

## 使用方法

1. 點擊導航欄右側的功能按鈕
2. 側邊欄會從右側滑入
3. 選擇所需功能或點擊關閉按鈕
4. 側邊欄會關閉並恢復主要內容顯示

## 檔案結構

```
src/
├── components/
│   ├── RightSidebar.vue          # 新增的右側功能區組件
│   ├── TitleNav.vue              # 修改：添加點擊事件
│   └── ...
├── App.vue                       # 修改：添加側邊欄邏輯
└── ...
```

## 未來擴展

- 可以為每個功能項目添加具體的實現邏輯
- 可以添加更多的功能選項
- 可以實現側邊欄的拖拽調整大小功能
- 可以添加側邊欄的記憶功能（記住上次選擇的功能）
