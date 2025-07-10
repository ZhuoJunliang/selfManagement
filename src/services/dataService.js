import {ref, watch} from "vue";
import IconCommunity from "../components/icons/IconCommunity.vue";

// 響應式資料
const itineraryData = ref([]);
const isLoading = ref(false);
const error = ref(null);

// 圖標映射
const iconMap = {
  IconCommunity: IconCommunity,
};

// 讀取資料檔案
async function loadData() {
  try {
    isLoading.value = true;
    error.value = null;

    // 使用 fetch 讀取 public 目錄下的檔案
    const response = await fetch("/data.txt");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    // 處理圖標組件映射
    if (data.itineraryData) {
      itineraryData.value = data.itineraryData.map(item => ({
        ...item,
        icon: item.iconType === "component" ? iconMap[item.icon] : item.icon,
      }));
    }
  } catch (err) {
    console.error("讀取資料檔案失敗:", err);
    error.value = err.message;
    // 如果讀取失敗，使用預設資料
    itineraryData.value = [
      {
        iconType: "svg",
        icon: `<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#1f1f1f'><path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z'/></svg>`,
        title: "休息",
        timeRange: "08:27 上午 - 09:12 上午",
        duration: "00:45",
      },
      {
        iconType: "component",
        icon: IconCommunity,
        title: "學習專業",
        timeRange: "08:01 上午 - 08:27 上午",
        duration: "00:25",
      },
      {
        iconType: "svg",
        icon: `<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#1f1f1f'><path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z'/></svg>`,
        title: "休息",
        timeRange: "06:44 上午 - 08:01 上午",
        duration: "01:16",
      },
    ];
  } finally {
    isLoading.value = false;
  }
}

// 自動重新載入資料（在開發模式下）
let reloadInterval = null;

function startAutoReload() {
  // 只在開發模式下啟用自動重新載入
  if (import.meta.env.DEV) {
    // 每 2 秒檢查一次檔案變化
    reloadInterval = setInterval(loadData, 2000);
  }
}

function stopAutoReload() {
  if (reloadInterval) {
    clearInterval(reloadInterval);
    reloadInterval = null;
  }
}

// 初始化
loadData();
startAutoReload();

// 導出響應式資料和函數
export {itineraryData, isLoading, error, loadData, startAutoReload, stopAutoReload};
