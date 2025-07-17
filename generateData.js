// 生成隨機事件數據的工具檔案
// 用於生成 data.txt 的內容

import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

// 獲取 __dirname 的 ES 模組等效
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateRandomData() {
  const data = [];

  // 定義月份範圍：1～12月
  const months = Array.from({length: 12}, (_, i) => i + 1); // 1~12
  const year = 2025;

  // 每個月的天數
  const daysInMonth = {
    1: 31,
    2: 28, // 不考慮閏年
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  // 為每一天生成隨機事件
  months.forEach(month => {
    const days = daysInMonth[month];

    for (let day = 1; day <= days; day++) {
      // 每天隨機生成 5-15 個事件
      const eventCount = Math.floor(Math.random() * 11) + 5; // 5-15

      for (let i = 0; i < eventCount; i++) {
        // 生成隨機開始時間（當天 00:00:00 到 23:59:59）
        const startHour = Math.floor(Math.random() * 24);
        const startMinute = Math.floor(Math.random() * 60);
        const startSecond = Math.floor(Math.random() * 60);

        // 格式化日期和時間
        const startDate = new Date(year, month - 1, day, startHour, startMinute, startSecond);
        const startTimeStr = startDate
          .toLocaleString("zh-TW", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(/\//g, "/");

        // 生成結束時間（開始時間後 30 分鐘到 2 小時）
        const durationMinutes = Math.floor(Math.random() * 91) + 30; // 30-120 分鐘
        const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
        const endTimeStr = endDate
          .toLocaleString("zh-TW", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(/\//g, "/");

        // 生成隨機 actions（0-19）
        const actions = Math.floor(Math.random() * 20);

        data.push({
          actions: actions,
          startTime: startTimeStr,
          endTime: endTimeStr,
        });
      }
    }
  });

  // 按時間排序
  data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return data;
}

// 將數據寫入 data.txt 檔案
function writeDataToFile() {
  try {
    const data = generateRandomData();
    const dataPath = path.join(__dirname, "public", "data.txt");

    // 格式化為 JSON 字串
    const jsonData = JSON.stringify(data, null, 2);

    // 寫入檔案
    fs.writeFileSync(dataPath, jsonData, "utf8");

    console.log("✅ 數據已成功生成並寫入 data.txt");
    console.log(`📊 總共生成了 ${data.length} 個事件`);
    console.log(`📅 涵蓋時間範圍：2025年1月1日 - 2025年12月31日`);

    // 顯示統計資訊
    const totalActions = data.reduce((sum, item) => sum + item.actions, 0);
    console.log(`🎯 總 actions 數：${totalActions}`);
    console.log(`📈 平均每個事件 actions：${(totalActions / data.length).toFixed(2)}`);
  } catch (error) {
    console.error("❌ 寫入檔案時發生錯誤：", error.message);
  }
}

// 如果直接執行此檔案，則生成數據
writeDataToFile();

// 導出函數供其他模組使用
export {generateRandomData, writeDataToFile};
