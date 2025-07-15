<template>
  <div class="titleNav">
    <div class="titleNavLogo">
      <div @click="toggleCalendar" class="hamburger titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      </div>
      <h1><img src="./icons/logo_time.png" alt="自我管理系統" /></h1>
    </div>

    <div class="nowTime">
      <div @click="selectToday" class="nowTimeDay titleIconBtn">今天</div>
      <div @click="setDay(-1)" class="nowTimePreDay titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="-200 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
        </svg>
      </div>
      <div @click="setDay(1)" class="nowTimeNextDay titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="-50 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
        </svg>
      </div>
      <div @click="handleSelectedTimeClick" class="selectedTime">
        <span class="selectedTimeYear">{{ currentYear }}年</span
        ><span class="selectedTimeMonth">{{ currentMonth + 1 }}月</span
        ><span class="selectedTimeDay">{{ currentDay }}日</span>
      </div>
    </div>

    <!-- NOTE: 右側功能區 -->
    <div class="functionalArea">
      <div class="searchContainer">
        <div @click="toggleSearch" class="search titleIconBtn">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
            <path
              d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
        </div>
        <div v-if="searchVisible" class="searchInputContainer">
          <input
            ref="searchInputRef"
            v-model="searchValue"
            @keyup.enter="handleSearch"
            @blur="handleSearchBlur"
            type="text"
            placeholder="搜尋..."
            class="searchInput" />
        </div>
      </div>
      <!-- ref="modeListRef": 這是一個 Vue.js 的模板引用 (template ref)，用於在 JavaScript 程式碼中直接存取這個 DOM 元素。
       在這裡，它主要用於偵測點擊是否發生在這個元素外部，以便在點擊外部時關閉下拉選單。 -->
      <div class="modeList" ref="modeListRef">
        <p @click="toggleDropdown" class="titleIconBtn">{{ currentMode[currentModeIndex] }} ▼</p>
        <ul v-if="dropdownOpen" class="dropdown">
          <li v-for="(mode, idx) in currentMode" :key="mode" @click="selectMode(idx)">{{ mode }}</li>
        </ul>
      </div>
      <div @click="handleFunctionClick('schedule')" class="schedule titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
        </svg>
      </div>
      <div @click="handleFunctionClick('routineWork')" class="routineWork titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path
            d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
        </svg>
      </div>
      <div @click="handleFunctionClick('statistics')" class="statistics titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path
            d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
        </svg>
      </div>
      <div @click="handleFunctionClick('importantJob')" class="importantJob titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path
            d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
        </svg>
      </div>
      <div @click="handleFunctionClick('AccountCircle')" class="AccountCircle titleIconBtn">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960" width="1.5em" fill="#1f1f1f">
          <path
            d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, computed, inject} from "vue";

// 使用 inject 獲取共享的日期狀態
const selectedDate = inject("selectedDate");
const today = inject("today");
const changeDay = inject("changeDay");
const selectToday = inject("selectToday");
const toggleCalendar = inject("toggleCalendar");
const showSidebar = inject("showSidebar");
const showMainContent = inject("showMainContent");
const switchSidebarComponent = inject("switchSidebarComponent");

// 計算屬性來獲取當前日期的年月日
const currentYear = computed(() => selectedDate.value.getFullYear());
const currentMonth = computed(() => selectedDate.value.getMonth());
const currentDay = computed(() => selectedDate.value.getDate());

const currentMode = ref(["天", "週", "月"]);
const currentModeIndex = inject("currentModeIndex");

function setDay(value) {
  // 根據當前模式調整日期增減幅度
  let dayChange = value;

  if (currentModeIndex.value === 1) {
    // 週模式：增減7天
    dayChange = value * 7;
  } else if (currentModeIndex.value === 2) {
    // 月模式：增減一個月
    const currentDate = new Date(selectedDate.value);
    if (value > 0) {
      // 下個月
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      // 上個月
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    // 更新選定的日期
    selectedDate.value = currentDate;
    return; // 直接返回，不需要調用 changeDay
  }

  // 天模式和週模式使用原有的 changeDay 函數
  changeDay(dayChange);
}

// NOTE: 下拉選單
const dropdownOpen = ref(false);
//建立一個名為 modeListRef 的響應式參考，初始值為 null。
// 它將與 HTML 模板中的 ref="modeListRef" 綁定，以便在 JavaScript 中引用 div.modeList 這個 DOM 元素。
const modeListRef = ref(null);

// NOTE: 搜尋功能
const searchVisible = ref(false);
const searchValue = ref("");
const searchInputRef = ref(null);

function toggleSearch() {
  searchVisible.value = !searchVisible.value;
  if (searchVisible.value) {
    // 使用 nextTick 確保 DOM 更新後再聚焦
    nextTick(() => {
      searchInputRef.value?.focus(); //searchInputRef.value有值才執行.focus()
    });
  }
}

function handleSearch() {
  if (searchValue.value.trim()) {
    console.log("搜尋內容:", searchValue.value);
    // 這裡可以添加實際的搜尋邏輯
    searchValue.value = "";
    searchVisible.value = false;
  }
}

//為什麼要延遲？ 因為如果用戶點擊搜尋框外的其他地方，我們需要讓點擊事件先處理完，避免搜尋框立即關閉導致點擊事件無法正常執行
function handleSearchBlur() {
  setTimeout(() => {
    searchVisible.value = false;
  }, 200);
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectMode(idx) {
  currentModeIndex.value = idx;
  dropdownOpen.value = false;
}

function handleFunctionClick(functionType) {
  console.log(`點擊了 ${functionType} 功能`);
  switchSidebarComponent(functionType);
}

function handleSelectedTimeClick() {
  console.log("點擊了選定時間");
  showMainContent();
}

function handleClickOutside(event) {
  // 如果 modeListRef 存在 (元素已掛載) 且點擊事件的目標不在 modeListRef 內部
  if (modeListRef.value && !modeListRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }

  // 處理搜尋框外部點擊
  const searchContainer = event.target.closest(".searchContainer");
  if (!searchContainer) {
    searchValue.value = "";
    searchVisible.value = false;
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
@media (min-width: 576px) {
}

@media (min-width: 992px) {
}

.titleNav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 1em;
  background-color: #f0f0f0;
}

h1 img {
  user-select: none;
}

.titleIconBtn {
  padding: 0.5em;
  border-radius: 50%;
  /* background-color: hsl(0, 0%, 50%); */
  display: flex;
  align-items: center; /* 垂直置中 */
  justify-content: center; /* 水平置中 */
  user-select: none; /* 防止文字被反白選取 */
  cursor: pointer;
}

.titleIconBtn:hover {
  background-color: hsl(0, 0%, 80%);
}

.titleIconBtn:active {
  background-color: hsl(0, 0%, 60%);
}

/* NOTE: 左側logo */
.titleNavLogo {
  flex-basis: 20%;
  display: flex;
  align-items: center; /* 垂直置中 */
}

.hamburger {
  margin-right: 1em;
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

/* NOTE: 中央日期 */
.nowTime {
  flex-basis: 40%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.selectedTime {
  cursor: pointer;
  padding: 0.5em;
  border-radius: 8px;
  transition: background 0.2s;
  user-select: none;
}

.selectedTime:hover {
  background: hsl(0, 0%, 80%);
}

.selectedTime:active {
  background: hsl(0, 0%, 60%);
}

/* NOTE: 右側功能區 */
.functionalArea {
  flex-basis: 40%;
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
  background: hsl(0, 0%, 80%);
}

.dropdown li:active {
  background: hsl(0, 0%, 60%);
}

/* NOTE: 搜尋功能樣式 */
.searchContainer {
  position: relative;
}

.searchInputContainer {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  margin-top: 0.5em;
}

.searchInput {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
  min-width: 200px;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.searchInput:focus {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

/* NOTE: 小螢幕樣式 */
@media (max-width: 576px) {
  .titleNav {
    flex-wrap: wrap;
  }

  .titleNavLogo {
    flex-basis: 20%;
  }

  .nowTime {
    flex-basis: 70%;
  }

  .functionalArea {
    flex-basis: 100%;
  }
}
</style>
