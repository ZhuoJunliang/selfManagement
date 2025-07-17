# 刪除活動功能說明

## 功能概述

新增了刪除活動功能，允許用戶將活動標記為無效（軟刪除），而不是完全移除活動記錄。

## 新增組件

### DeleteButton.vue

- 位置：`src/components/DeleteButton.vue`
- 功能：刪除按鈕組件，樣式與 EditButton 相似
- 特色：紅色邊框，懸停時變為紅色背景

## 功能流程

1. **點擊刪除按鈕**：在 RoutineWorkComponent 中點擊刪除按鈕
2. **選擇活動**：彈出活動選擇彈窗，點擊要刪除的活動
3. **確認刪除**：頁面底部出現確認區域，顯示選中的活動和確認按鈕
4. **執行刪除**：點擊確認刪除後，將該活動的 `validEvent` 設為 `false`

## API 端點

### POST /api/delete-action

- 功能：將指定活動的 `validEvent` 設為 `false`
- 參數：`{ index: number }`
- 返回：成功訊息和更新後的活動資料

## 檔案修改

### 修改的檔案

1. `src/components/RoutineWorkComponent.vue` - 整合刪除功能
2. `server.js` - 修改刪除 API 為軟刪除
3. `src/components/DeleteButton.vue` - 新增刪除按鈕組件

### 新增的狀態變數

- `showDeletePopup` - 控制刪除彈窗顯示
- `deletingAction` - 儲存要刪除的活動
- `deletingIndex` - 儲存要刪除的活動索引

### 新增的函數

- `selectForDelete(action, idx)` - 選擇要刪除的活動
- `confirmDelete()` - 確認刪除操作

## 樣式特色

- 刪除按鈕使用紅色主題
- 刪除確認區域位於頁面底部，帶有滑入動畫
- 三個按鈕（新增、修改、刪除）統一高度和樣式

## 使用方式

1. 在 RoutineWorkComponent 中點擊刪除按鈕
2. 在彈出的活動列表中選擇要刪除的活動
3. 頁面底部會出現確認區域
4. 點擊「確認刪除」完成操作
5. 被刪除的活動將不再顯示在活動列表中（因為 `validEvent` 為 `false`）

## 注意事項

- 刪除操作是軟刪除，活動記錄仍然保留在 `actions.txt` 中
- 只有 `validEvent` 為 `true` 的活動會顯示在活動列表中
- 刪除操作不可逆，需要手動修改 `actions.txt` 才能恢復活動
