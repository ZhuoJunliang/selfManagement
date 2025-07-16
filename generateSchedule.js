// generateSchedule.js
import fs from "fs";

const activities = [
  "和朋友吃飯",
  "交電費",
  "買燈管",
  "運動",
  "看電影",
  "逛街",
  "閱讀",
  "寫作業",
  "打掃",
  "洗衣服",
  "買菜",
  "煮飯",
  "遛狗",
  "看醫生",
  "剪頭髮",
  "聚餐",
  "開會",
  "學習新技能",
  "網購",
  "整理房間",
  "拜訪親友",
  "參加活動",
  "看展覽",
  "喝咖啡",
  "散步",
  "修電腦",
  "追劇",
  "寫日記",
  "繳房租",
  "銀行辦事",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}

let schedules = [];

for (let month = 6; month <= 8; month++) {
  let daysInMonth = new Date(2025, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    let numSchedules = getRandomInt(1, 5);
    let used = new Set();
    for (let i = 0; i < numSchedules; i++) {
      let idx;
      do {
        idx = getRandomInt(0, activities.length - 1);
      } while (used.has(idx));
      used.add(idx);
      schedules.push({
        date: `2025/${month}/${pad(day)}`,
        scheduleName: activities[idx],
        completed: Math.random() < 0.5,
      });
    }
  }
}

fs.writeFileSync("public/schedule.txt", JSON.stringify(schedules, null, 2), "utf8");
console.log("已產生 public/schedule.txt");
