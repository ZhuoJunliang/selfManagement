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

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
