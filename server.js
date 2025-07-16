import express from "express";
import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// CORS 中間件 - 必須在所有其他中間件之前
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // 處理預檢請求
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});

// 其他中間件
app.use(express.json());
app.use(express.static("public"));

// 處理 data.txt 的寫入
app.post("/data.txt", async (req, res) => {
  try {
    const data = req.body;
    const filePath = path.join(__dirname, "public", "data.txt");

    // 將資料格式化為 JSON 字串
    const jsonData = JSON.stringify(data, null, 2);

    // 寫入檔案
    await fs.writeFile(filePath, jsonData, "utf8");

    res.json({success: true, message: "資料已成功儲存"});
  } catch (error) {
    console.error("儲存資料失敗:", error);
    res.status(500).json({success: false, message: "儲存資料失敗"});
  }
});

// ===== schedule.txt CRUD API =====
const scheduleFilePath = path.join(__dirname, "public", "schedule.txt");

// 取得所有行程
app.get("/api/schedule", async (req, res) => {
  try {
    const data = await fs.readFile(scheduleFilePath, "utf8");
    const schedules = JSON.parse(data);
    res.json(schedules);
  } catch (err) {
    res.status(500).json({error: "讀取失敗"});
  }
});

// 新增行程
app.post("/api/schedule", async (req, res) => {
  const {date, scheduleName, completed} = req.body;
  if (!date || !scheduleName) return res.status(400).json({error: "缺少欄位"});
  try {
    const data = await fs.readFile(scheduleFilePath, "utf8");
    const schedules = JSON.parse(data);
    schedules.push({date, scheduleName, completed: completed === true});
    await fs.writeFile(scheduleFilePath, JSON.stringify(schedules, null, 2), "utf8");
    res.json({success: true});
  } catch (err) {
    res.status(500).json({error: "寫入失敗"});
  }
});

// 修改行程
app.put("/api/schedule/:index", async (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const {date, scheduleName, completed} = req.body;
  if (!date || !scheduleName) return res.status(400).json({error: "缺少欄位"});
  try {
    const data = await fs.readFile(scheduleFilePath, "utf8");
    const schedules = JSON.parse(data);
    if (idx < 0 || idx >= schedules.length) return res.status(404).json({error: "找不到行程"});
    schedules[idx] = {date, scheduleName, completed: completed === true};
    await fs.writeFile(scheduleFilePath, JSON.stringify(schedules, null, 2), "utf8");
    res.json({success: true});
  } catch (err) {
    res.status(500).json({error: "寫入失敗"});
  }
});

// 刪除行程
app.delete("/api/schedule/:index", async (req, res) => {
  const idx = parseInt(req.params.index, 10);
  try {
    const data = await fs.readFile(scheduleFilePath, "utf8");
    const schedules = JSON.parse(data);
    if (idx < 0 || idx >= schedules.length) return res.status(404).json({error: "找不到行程"});
    schedules.splice(idx, 1);
    await fs.writeFile(scheduleFilePath, JSON.stringify(schedules, null, 2), "utf8");
    res.json({success: true});
  } catch (err) {
    res.status(500).json({error: "寫入失敗"});
  }
});

// ===== userInfo.txt 更新 API =====
const userInfoFilePath = path.join(__dirname, "public", "userInfo.txt");

// 更新用戶登入狀態
app.post("/updateUserInfo", async (req, res) => {
  try {
    const {username, loginSuccessful} = req.body;

    if (!username || loginSuccessful === undefined) {
      return res.status(400).json({error: "缺少必要欄位"});
    }

    // 讀取現有的用戶信息
    const data = await fs.readFile(userInfoFilePath, "utf8");
    const users = JSON.parse(data);

    // 找到對應的用戶並更新狀態
    const userIndex = users.findIndex(user => user.userName === username);
    if (userIndex === -1) {
      return res.status(404).json({error: "找不到用戶"});
    }

    // 更新用戶的登入狀態
    users[userIndex].loginSuccessful = loginSuccessful;

    // 寫入更新後的文件
    await fs.writeFile(userInfoFilePath, JSON.stringify(users, null, 2), "utf8");

    res.json({success: true, message: "用戶狀態已更新"});
  } catch (error) {
    console.error("更新用戶信息失敗:", error);
    res.status(500).json({error: "更新用戶信息失敗"});
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
