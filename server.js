import express from "express";
import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from "url";
import cors from "cors";

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
app.use(cors());

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

// 新增 API 儲存 action
app.post("/api/saveAction", async (req, res) => {
  try {
    console.log("收到 /api/saveAction", req.body);
    const {actions, startTime, endTime} = req.body;
    const dataPath = path.join(__dirname, "public", "data.txt");
    let arr = [];
    try {
      const content = await fs.readFile(dataPath, "utf8");
      arr = JSON.parse(content);
    } catch (e) {
      arr = [];
    }
    arr.push({actions, startTime, endTime});
    await fs.writeFile(dataPath, JSON.stringify(arr, null, 2), "utf8");
    console.log("寫入成功");
    res.json({success: true});
  } catch (err) {
    console.log("寫入失敗", err);
    res.status(500).json({error: "寫入檔案失敗"});
  }
});

// 更新 data.txt 的 API（支援按時間順序插入）
app.post("/api/updateData", async (req, res) => {
  try {
    console.log("收到 /api/updateData", req.body);
    const newData = req.body;
    const dataPath = path.join(__dirname, "public", "data.txt");

    // 直接寫入新的資料陣列
    await fs.writeFile(dataPath, JSON.stringify(newData, null, 2), "utf8");
    console.log("更新成功");
    res.json({success: true});
  } catch (err) {
    console.log("更新失敗", err);
    res.status(500).json({error: "更新檔案失敗"});
  }
});

// ===== actions.txt 新增活動 API =====
const actionsFilePath = path.join(__dirname, "public", "actions.txt");

// 新增活動到 actions.txt
app.post("/api/add-action", async (req, res) => {
  try {
    console.log("收到新增活動請求:", req.body);

    const {actionName, actionIcon, actionColor} = req.body;

    // 驗證必要欄位
    if (!actionName || actionIcon === undefined || !actionColor) {
      return res.status(400).json({
        success: false,
        message: "缺少必要欄位：actionName, actionIcon, actionColor",
      });
    }

    // 讀取現有的活動資料
    let actions = [];
    try {
      const data = await fs.readFile(actionsFilePath, "utf8");
      actions = JSON.parse(data);
    } catch (error) {
      // 如果檔案不存在或格式錯誤，使用空陣列
      console.log("actions.txt 檔案不存在或格式錯誤，將建立新檔案");
      actions = [];
    }

    // 建立新的活動物件
    const newAction = {
      actionName: actionName.trim(),
      actionIcon: parseInt(actionIcon),
      actionColor: actionColor,
      validEvent: "true",
    };

    // 檢查是否已存在相同名稱的活動
    const existingActionIndex = actions.findIndex(action => action.actionName === newAction.actionName);

    if (existingActionIndex !== -1) {
      return res.status(409).json({
        success: false,
        message: "已存在相同名稱的活動",
      });
    }

    // 新增活動到陣列
    actions.push(newAction);

    // 寫入檔案
    await fs.writeFile(actionsFilePath, JSON.stringify(actions, null, 2), "utf8");

    console.log("活動新增成功:", newAction);
    res.json({
      success: true,
      message: "活動新增成功",
      data: newAction,
    });
  } catch (error) {
    console.error("新增活動失敗:", error);
    res.status(500).json({
      success: false,
      message: "新增活動失敗",
      error: error.message,
    });
  }
});

// 取得所有活動
app.get("/api/actions", async (req, res) => {
  try {
    const data = await fs.readFile(actionsFilePath, "utf8");
    const actions = JSON.parse(data);
    res.json(actions);
  } catch (error) {
    if (error.code === "ENOENT") {
      // 檔案不存在，回傳空陣列
      res.json([]);
    } else {
      console.error("讀取活動失敗:", error);
      res.status(500).json({
        success: false,
        message: "讀取活動失敗",
      });
    }
  }
});

// 修改活動
app.post("/api/update-action", async (req, res) => {
  try {
    console.log("收到修改活動請求:", req.body);
    const {index, action} = req.body;

    // 驗證必要欄位
    if (
      index === undefined ||
      !action ||
      !action.actionName ||
      action.actionIcon === undefined ||
      !action.actionColor
    ) {
      return res.status(400).json({
        success: false,
        message: "缺少必要欄位",
      });
    }

    // 讀取現有的活動資料
    let actions = [];
    try {
      const data = await fs.readFile(actionsFilePath, "utf8");
      actions = JSON.parse(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "讀取活動資料失敗",
      });
    }

    // 檢查索引是否有效
    if (index < 0 || index >= actions.length) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的活動",
      });
    }

    // 檢查是否與其他活動名稱重複（排除自己）
    const existingActionIndex = actions.findIndex((a, i) => i !== index && a.actionName === action.actionName);

    if (existingActionIndex !== -1) {
      return res.status(409).json({
        success: false,
        message: "已存在相同名稱的活動",
      });
    }

    // 更新活動
    actions[index] = {
      actionName: action.actionName.trim(),
      actionIcon: parseInt(action.actionIcon),
      actionColor: action.actionColor,
      validEvent: "true",
    };

    // 寫入檔案
    await fs.writeFile(actionsFilePath, JSON.stringify(actions, null, 2), "utf8");

    console.log("活動修改成功:", actions[index]);
    res.json({
      success: true,
      message: "活動修改成功",
      data: actions[index],
    });
  } catch (error) {
    console.error("修改活動失敗:", error);
    res.status(500).json({
      success: false,
      message: "修改活動失敗",
      error: error.message,
    });
  }
});

// 刪除活動
app.post("/api/delete-action", async (req, res) => {
  try {
    console.log("收到刪除活動請求:", req.body);
    const {index} = req.body;

    // 驗證必要欄位
    if (index === undefined) {
      return res.status(400).json({
        success: false,
        message: "缺少索引欄位",
      });
    }

    // 讀取現有的活動資料
    let actions = [];
    try {
      const data = await fs.readFile(actionsFilePath, "utf8");
      actions = JSON.parse(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "讀取活動資料失敗",
      });
    }

    // 檢查索引是否有效
    if (index < 0 || index >= actions.length) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的活動",
      });
    }

    // 刪除活動
    const deletedAction = actions.splice(index, 1)[0];

    // 寫入檔案
    await fs.writeFile(actionsFilePath, JSON.stringify(actions, null, 2), "utf8");

    console.log("活動刪除成功:", deletedAction);
    res.json({
      success: true,
      message: "活動刪除成功",
      data: deletedAction,
    });
  } catch (error) {
    console.error("刪除活動失敗:", error);
    res.status(500).json({
      success: false,
      message: "刪除活動失敗",
      error: error.message,
    });
  }
});

// 啟動伺服器
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
