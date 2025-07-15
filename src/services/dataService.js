import {ref, watch} from "vue";

const itineraryData = ref([]);
const isLoading = ref(false);
const error = ref(null);

// 載入所有資料並組合
async function loadData() {
  try {
    isLoading.value = true;
    error.value = null;

    console.log("開始載入資料...");

    // 並行 fetch 三個檔案
    const [dataRes, actionsRes, iconsRes] = await Promise.all([
      fetch("http://localhost:3001/data.txt"),
      fetch("http://localhost:3001/actions.txt"),
      fetch("http://localhost:3001/icons.txt"),
    ]);

    console.log("API 回應狀態:", {
      data: dataRes.status,
      actions: actionsRes.status,
      icons: iconsRes.status,
    });

    if (!dataRes.ok || !actionsRes.ok || !iconsRes.ok) {
      const errorMsg = `載入資料失敗: data(${dataRes.status}), actions(${actionsRes.status}), icons(${iconsRes.status})`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const [data, actions, icons] = await Promise.all([dataRes.json(), actionsRes.json(), iconsRes.json()]);

    console.log("成功載入資料:", {
      dataLength: data.length,
      actionsLength: actions.length,
      iconsLength: icons.length,
    });

    // 組合資料
    itineraryData.value = data
      .map(item => {
        const action = actions[item.actions];
        if (!action) {
          console.warn(`找不到對應的 action: ${item.actions}`);
          return null;
        }

        const iconSvg = icons[action.actionIcon]
          ? icons[action.actionIcon].replace(/fill=\"actionColor\"/g, `fill=\"${action.actionColor}\"`)
          : "";
        // 只顯示到分鐘，使用24小時制
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);
        const pad = n => n.toString().padStart(2, "0");
        const formatHM = d => {
          const h = d.getHours();
          const m = d.getMinutes();
          return `${pad(h)}:${pad(m)}`;
        };
        // 持續時間（分鐘）
        const diffMs = end - start;
        const diffMin = Math.floor(diffMs / 60000);
        const duration = `${pad(Math.floor(diffMin / 60))}:${pad(diffMin % 60)}`;
        return {
          iconType: "svg",
          icon: iconSvg,
          title: action.actionName,
          timeRange: `${formatHM(start)} - ${formatHM(end)}`,
          duration,
          color: action.actionColor,
          startTime: item.startTime,
          endTime: item.endTime,
        };
      })
      .filter(item => item !== null); // 過濾掉 null 項目

    console.log("資料組合完成，共", itineraryData.value.length, "個活動");
  } catch (err) {
    console.error("讀取資料檔案失敗:", err);
    error.value = err.message;
    itineraryData.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 保存新活動
async function saveNewActivity(activityData) {
  try {
    // 構建新的活動數據
    const startDateTime = new Date(activityData.startDate);
    startDateTime.setHours(parseInt(activityData.startHour), parseInt(activityData.startMinute), 0, 0);

    const endDateTime = new Date(activityData.endDate);
    endDateTime.setHours(parseInt(activityData.endHour), parseInt(activityData.endMinute), 0, 0);

    // 格式化時間為 data.txt 的格式 (YYYY/M/D HH:mm:ss)
    const formatDateTime = date => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    // 讀取 actions.txt 來找到對應的 actions 索引
    const actionsRes = await fetch("http://localhost:3001/actions.txt");
    if (!actionsRes.ok) {
      throw new Error("讀取 actions.txt 失敗");
    }
    const actions = await actionsRes.json();

    // 根據活動名稱找到對應的 actions 索引
    const actionIndex = actions.findIndex(action => action.actionName === activityData.title);
    if (actionIndex === -1) {
      throw new Error(`找不到對應的活動類型: ${activityData.title}`);
    }

    // 創建符合 data.txt 格式的新活動
    const newDataItem = {
      actions: actionIndex,
      startTime: formatDateTime(startDateTime),
      endTime: formatDateTime(endDateTime),
    };

    // 讀取現有的 data.txt
    const dataRes = await fetch("http://localhost:3001/data.txt");
    if (!dataRes.ok) {
      throw new Error("讀取 data.txt 失敗");
    }
    const existingData = await dataRes.json();

    // 找到插入位置（按 startTime 排序）
    let insertIndex = existingData.length;
    for (let i = 0; i < existingData.length; i++) {
      if (new Date(newDataItem.startTime) < new Date(existingData[i].startTime)) {
        insertIndex = i;
        break;
      }
    }

    // 插入新活動
    existingData.splice(insertIndex, 0, newDataItem);

    // 儲存到 data.txt
    const saveRes = await fetch("http://localhost:3001/data.txt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingData, null, 2),
    });

    if (!saveRes.ok) {
      throw new Error("儲存到 data.txt 失敗");
    }

    // 重新載入資料以更新顯示
    await loadData();

    console.log("活動已保存到 data.txt:", newDataItem);
    return true;
  } catch (err) {
    console.error("保存活動失敗:", err);
    error.value = err.message;
    return false;
  }
}

// 重新載入數據
async function reloadData() {
  await loadData();
}

// 只載入一次
loadData();

export {itineraryData, isLoading, error, loadData, saveNewActivity, reloadData};
