# 文字檔案資料功能說明

## 功能概述

這個專案現在支援從外部文字檔案讀取行程資料，並會自動監控檔案變化進行更新。

## 檔案結構

```
public/
  └── data.txt          # 存放行程資料的文字檔案
src/
  └── services/
      └── dataService.js # 資料服務，負責讀取和監控檔案
```

## 資料格式

`public/data.txt` 檔案使用 JSON 格式，結構如下：

```json
{
  "itineraryData": [
    {
      "iconType": "svg",
      "icon": "<svg>...</svg>",
      "title": "活動標題",
      "timeRange": "開始時間 - 結束時間",
      "duration": "持續時間"
    },
    {
      "iconType": "component",
      "icon": "IconCommunity",
      "title": "學習專業",
      "timeRange": "08:01 上午 - 08:27 上午",
      "duration": "00:25"
    }
  ]
}
```

## 圖標類型

### SVG 圖標

- `iconType`: "svg"
- `icon`: SVG 字串

### Vue 組件圖標

- `iconType`: "component"
- `icon`: 組件名稱（需要在 dataService.js 中註冊）

## 自動更新功能

### 開發模式

- 每 2 秒自動檢查檔案變化
- 檔案修改後會自動重新載入資料

### 生產模式

- 不會自動重新載入
- 需要手動重新整理頁面

## 使用方法

1. **修改資料**：直接編輯 `public/data.txt` 檔案
2. **即時預覽**：在開發模式下，修改檔案後會自動更新頁面
3. **錯誤處理**：如果檔案讀取失敗，會顯示預設資料

## 注意事項

- 確保 JSON 格式正確，否則會導致解析錯誤
- 新增組件圖標時，需要在 `dataService.js` 的 `iconMap` 中註冊
- 檔案路徑必須是 `/data.txt`（相對於 public 目錄）

## 故障排除

### 檔案無法讀取

- 檢查檔案是否存在於 `public/data.txt`
- 確認 JSON 格式是否正確
- 查看瀏覽器開發者工具的網路標籤

### 圖標不顯示

- 檢查 `iconType` 是否正確
- 確認組件圖標已在 `iconMap` 中註冊
- 檢查 SVG 字串格式是否正確
