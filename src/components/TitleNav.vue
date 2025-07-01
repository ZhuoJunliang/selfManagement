<template>
  <div class="titleNav">
    <div class="titleNavLogo">
      <div class="hamburger">≡</div>
      <h1><img src="./icons/logo_time.png" alt="自我管理系統" /></h1>
    </div>

    <div class="nowTime">
      <div class="nowTimeDay">今天</div>
      <div class="nowTimePreDay">
        <img src="./icons/arrow_back_ios_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="" />&lt;
      </div>
      <div class="nowTimeNextDay">
        <img src="./icons/arrow_forward_ios_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="" />&gt;
      </div>
      <div class="selectedTime">
        <span class="selectedTimeYear">{{ nowYear }}年</span><span class="selectedTimeMonth">{{ nowMonth + 1 }}月</span
        ><span class="selectedTimeDay">{{ nowDay }}日</span>
      </div>
    </div>

    <div class="dayMode">
      <div class="search">🔍</div>
      <!-- ref="modeListRef": 這是一個 Vue.js 的模板引用 (template ref)，用於在 JavaScript 程式碼中直接存取這個 DOM 元素。
       在這裡，它主要用於偵測點擊是否發生在這個元素外部，以便在點擊外部時關閉下拉選單。 -->
      <div class="modeList" ref="modeListRef">
        <p @click="toggleDropdown">{{ currentMode[currentModeIndex] }} ▼</p>
        <ul v-if="dropdownOpen" class="dropdown">
          <li v-for="(mode, idx) in currentMode" :key="mode" @click="selectMode(idx)">{{ mode }}</li>
        </ul>
      </div>
    </div>

    <div class="scheduleMode">
      <div class="schedule">📝</div>
      <div class="routineWork">⏰</div>
      <div class="statistics">📊</div>
      <div class="importantJob">❗</div>
    </div>
  </div>

  <p style="margin: 10% 40%">選擇的日期：{{ currentYear }}年{{ currentMonth + 1 }}月{{ currentDay }}日</p>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from "vue";

const today = ref(new Date());
const nowYear = ref(today.value.getFullYear());
const nowMonth = ref(today.value.getMonth());
const nowDay = ref(today.value.getDate());
let currentMode = ref(["天", "週", "月"]);
let currentModeIndex = ref(0);
let currentYear = nowYear.value;
let currentMonth = nowMonth.value;
let currentDay = nowDay.value;

const dropdownOpen = ref(false);
//建立一個名為 modeListRef 的響應式參考，初始值為 null。
// 它將與 HTML 模板中的 ref="modeListRef" 綁定，以便在 JavaScript 中引用 div.modeList 這個 DOM 元素。
const modeListRef = ref(null);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectMode(idx) {
  currentModeIndex.value = idx;
  dropdownOpen.value = false;
}

function handleClickOutside(event) {
  // 如果 modeListRef 存在 (元素已掛載) 且點擊事件的目標不在 modeListRef 內部
  if (modeListRef.value && !modeListRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  // 元件掛載後，為整個 document 註冊一個 mousedown 事件監聽器
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.titleNav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 1em;
  background-color: #f0f0f0;
}

/* 左側logo開始 */
.titleNavLogo {
  flex-basis: 20%;
  display: flex;
  align-items: center; /* 垂直置中 */
}

.hamburger {
  font-size: 2em;
  flex-basis: 20%;
}

.titleNavLogo h1 {
  display: flex;
  align-items: center;
}

.titleNavLogo img {
  width: 1em;
}

.titleNavLogo h1 {
  flex-basis: 80%;
}
/* 左側logo結束 */

/* 中央日期開始 */
.nowTime {
  flex-basis: 30%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
/* 中央日期結束 */

/* 中央模式開始 */
.dayMode {
  flex-basis: 30%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.modeList {
  position: relative;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 50px;
  padding: 0;
  margin: 0;
}
.dropdown li {
  list-style: none;
  padding: 0.5em 1em;
  cursor: pointer;
}
.dropdown li:hover {
  background: #f0f0f0;
}
/* 中央模式結束 */

/* 右側模式開始 */
.scheduleMode {
  flex-basis: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
/* 右側模式結束 */
</style>
