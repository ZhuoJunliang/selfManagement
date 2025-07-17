<template>
  <div class="statistics-component">
    <div class="component-header" style="display: flex; align-items: center; justify-content: space-between">
      <h2>統計分析</h2>
      <div style="display: flex; align-items: center; gap: 0.5em">
        <select class="statistics-range-select" v-model="selectedRange">
          <option value="day">天</option>
          <option value="week">週</option>
          <option value="month">月</option>
          <option value="year">年</option>
        </select>
      </div>
    </div>

    <div class="component-content">
      <div>
        <h3>{{ rangeTitle }}活動統計</h3>
        <div class="breakdown-items">
          <div v-for="item in stats.stats" :key="item.title" class="breakdown-item">
            <div
              class="breakdown-color"
              style="
                width: 2em;
                height: 2em;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              <span v-html="getIconSvg(item.actionIcon, item.actionColor)" style="width: 1.2em; height: 1.2em"></span>
            </div>
            <div class="breakdown-text">{{ item.title }}</div>
            <div class="breakdown-percentage">{{ formatHourMin(item.hours) }} ({{ item.percentage }}%)</div>
          </div>
          <div class="breakdown-item" v-if="untrackedHours > 0">
            <div
              class="breakdown-color"
              style="
                background: #e0e0e0;
                width: 2em;
                height: 2em;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              <span style="font-size: 1.2em; color: #888">?</span>
            </div>
            <div class="breakdown-text">未統計</div>
            <div class="breakdown-percentage">{{ formatHourMin(untrackedHours) }} ({{ untrackedPercent }}%)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, inject} from "vue";
import {itineraryData} from "../services/dataService";

const selectedRange = ref("day");
const selectedDate = inject("selectedDate");

const icons = ref([]);

onMounted(async () => {
  // 載入 icons.txt
  const res = await fetch("/icons.txt");
  icons.value = await res.json();
});

function getIconSvg(iconIndex, color) {
  if (!icons.value.length) return "";
  let svg = icons.value[iconIndex] || "";
  return svg.replace(/fill="actionColor"/g, `fill="${color}"`);
}

const stats = computed(() => {
  // 根據 selectedRange 決定統計範圍
  const base = selectedDate.value;
  let rangeStart, rangeEnd, totalHours;
  if (selectedRange.value === "day") {
    rangeStart = new Date(base);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd = new Date(base);
    rangeEnd.setHours(23, 59, 59, 999);
    totalHours = 24;
  } else if (selectedRange.value === "week") {
    // 週一為一週開始
    const day = base.getDay() || 7; // 週日為0，轉7
    rangeStart = new Date(base);
    rangeStart.setDate(base.getDate() - day + 1);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd = new Date(rangeStart);
    rangeEnd.setDate(rangeStart.getDate() + 6);
    rangeEnd.setHours(23, 59, 59, 999);
    totalHours = 24 * 7;
  } else if (selectedRange.value === "month") {
    rangeStart = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
    rangeEnd = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
    totalHours = 24 * rangeEnd.getDate();
  } else if (selectedRange.value === "year") {
    rangeStart = new Date(base.getFullYear(), 0, 1, 0, 0, 0, 0);
    rangeEnd = new Date(base.getFullYear(), 11, 31, 23, 59, 59, 999);
    // 計算今年天數
    const isLeap = (base.getFullYear() % 4 === 0 && base.getFullYear() % 100 !== 0) || base.getFullYear() % 400 === 0;
    totalHours = 24 * (isLeap ? 366 : 365);
  }

  // 篩選有重疊的活動
  const acts = itineraryData.value.filter(item => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    return end > rangeStart && start < rangeEnd;
  });
  // 分組
  const map = {};
  acts.forEach(item => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    // 計算與範圍重疊的時間
    const overlapStart = start > rangeStart ? start : rangeStart;
    const overlapEnd = end < rangeEnd ? end : rangeEnd;
    const overlapMs = Math.max(0, overlapEnd - overlapStart);
    const hours = overlapMs / 3600000;
    if (hours <= 0) return;
    if (!map[item.title]) {
      map[item.title] = {
        actionIcon: item.actionIcon,
        actionColor: item.color,
        title: item.title,
        hours: 0,
      };
    }
    map[item.title].hours += hours;
  });
  // 計算比例
  return {
    stats: Object.values(map).map(obj => ({
      ...obj,
      percentage: ((obj.hours / totalHours) * 100).toFixed(1),
    })),
    totalHours,
  };
});

const totalUsedHours = computed(() => stats.value.stats.reduce((sum, item) => sum + item.hours, 0));
const untrackedHours = computed(() => Math.max(0, stats.value.totalHours - totalUsedHours.value));
const untrackedPercent = computed(() => ((untrackedHours.value / stats.value.totalHours) * 100).toFixed(1));

// 新增 rangeTitle 計算屬性
const rangeTitle = computed(() => {
  if (selectedRange.value === "day") return "當日";
  if (selectedRange.value === "week") return "本週";
  if (selectedRange.value === "month") return "本月";
  if (selectedRange.value === "year") return "今年";
  return "";
});

// 將小時數轉為「X小時Y分鐘」
function formatHourMin(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h > 0 && m > 0) return `${h}小時${m}分鐘`;
  if (h > 0) return `${h}小時`;
  return `${m}分鐘`;
}
</script>

<style scoped>
.statistics-component {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component-header {
  margin-bottom: 1.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #e0e0e0;
}

.component-header h2 {
  font-size: 1.2em;
  color: #333;
  margin: 0 0 0.5em 0;
}

.component-header p {
  color: #666;
  margin: 0;
  font-size: 0.9em;
}

.component-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.stats-overview {
  display: flex;
  gap: 1em;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.8em;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1em;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.3em;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2em;
}

.stat-label {
  font-size: 0.8em;
  color: #666;
}

.chart-section h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1em;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 120px;
  gap: 0.5em;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #007bff, #0056b3);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-width: 20px;
}

.bar-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8em;
  color: #666;
}

.activity-breakdown h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.6em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.breakdown-color {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  flex-shrink: 0;
}

.breakdown-text {
  flex: 1;
  font-size: 0.9em;
  color: #333;
}

.breakdown-percentage {
  font-size: 0.8em;
  color: #666;
  font-weight: 500;
}

.quick-actions {
  margin-top: auto;
}

.action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8em;
  padding: 0.8em 1em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
  color: #333;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
  transform: translateY(-1px);
}

.action-btn svg {
  flex-shrink: 0;
}

.statistics-range-select {
  padding: 0.3em 1.2em 0.3em 0.7em;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95em;
  color: #333;
  background: #fff;
  outline: none;
  margin-left: 1em;
  transition: border-color 0.2s;
}
.statistics-range-select:focus {
  border-color: #007bff;
}
</style>
