<template>
  <div class="schedule-component">
    <!-- <div class="component-header">
      <h2>行事曆</h2>
    </div> -->

    <div class="component-content">
      <div class="calendar-preview">
        <div class="calendar-grid">
          <div class="calendar-list">
            <table
              v-if="filteredSchedules.unfinished.length > 0 || filteredSchedules.finished.length > 0"
              class="schedule-table">
              <thead>
                <tr>
                  <th><h2>行事曆</h2></th>
                </tr>
              </thead>
              <tbody>
                <!-- 未完成行程 -->
                <tr v-for="(item, idx) in filteredSchedules.unfinished" :key="'unf-' + idx">
                  <td @click="openEdit(item._index)" class="schedule-name-cell">{{ item.scheduleName }}</td>
                </tr>
                <!-- 已完成行程（分隔線）-->
                <tr v-if="filteredSchedules.unfinished.length > 0 && filteredSchedules.finished.length > 0">
                  <td style="border-top: 2px solid #e0e0e0"></td>
                </tr>
                <!-- 已完成行程 -->
                <tr v-for="(item, idx) in filteredSchedules.finished" :key="'fin-' + idx">
                  <td
                    @click="openEdit(item._index)"
                    class="schedule-name-cell"
                    style="color: #aaa; text-decoration: line-through">
                    {{ item.scheduleName }}
                  </td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
            <div v-else class="calendar-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 -960 960 960" width="3em" fill="#1f1f1f">
                <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
              </svg>
              <p>當天沒有行程，請新增！</p>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <!-- <h3>快速操作</h3> -->
        <div class="action-buttons">
          <div class="action-btn" @click="openAdd" tabindex="0" role="button">新增活動</div>
        </div>
      </div>

      <!-- 新增/編輯彈窗 -->
      <div v-if="showForm" class="modal-bg" @click.self="handleModalBgClick">
        <div class="modal">
          <h3>{{ editIdx === null ? "新增行程" : "編輯行程" }}</h3>
          <form @submit.prevent="submitForm">
            <div class="form-row">
              <label>日期：</label>
              <input v-model="form.dateInput" type="date" required />
            </div>
            <div class="form-row">
              <label>行程名稱：</label>
              <input v-model="form.scheduleName" type="text" required />
            </div>
            <!-- 新增：已完成勾選欄位 -->
            <div class="form-row">
              <label style="width: auto"> <input type="checkbox" v-model="form.completed" /> 已完成 </label>
            </div>
            <div class="form-actions">
              <div class="action-btn" @click="submitForm">{{ editIdx === null ? "新增" : "儲存" }}</div>
              <div class="action-btn" @click="handleCancel">取消</div>
            </div>
            <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
          </form>
          <div v-if="editIdx !== null" class="delete-row">
            <div v-if="confirmDeleteIdx !== editIdx" class="action-btn delete-btn" @click="askDelete(editIdx)">
              刪除
            </div>
            <div v-else class="action-btn delete-btn confirm" @click="doDelete(editIdx)">確認刪除？</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, computed, inject} from "vue";
import {watch} from "vue";

const schedules = ref([]);
const showForm = ref(false);
const editIdx = ref(null); // null: 新增, 數字: 編輯
const form = reactive({date: "", scheduleName: "", dateInput: "", completed: false});
const errorMsg = ref("");
const confirmDeleteIdx = ref(null); // 用於記錄要確認刪除的 index

// 取得全域 selectedDate
const selectedDate = inject("selectedDate");

const fetchSchedules = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/schedule");
    // 加入 _index 屬性，方便反查原始 index
    const arr = await res.json();
    schedules.value = arr.map((item, idx) => ({...item, _index: idx}));
  } catch (e) {
    schedules.value = [];
  }
};

onMounted(fetchSchedules);

const filteredSchedules = computed(() => {
  // 依據 selectedDate 顯示行程，允許日期有無補零都能比對
  const d = selectedDate?.value instanceof Date ? selectedDate.value : new Date();
  const yyyy = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  const dateVariants = [
    `${yyyy}/${m}/${dd}`,
    `${yyyy}/${m < 10 ? "0" + m : m}/${dd}`,
    `${yyyy}/${m}/${dd < 10 ? "0" + dd : dd}`,
    `${yyyy}/${m < 10 ? "0" + m : m}/${dd < 10 ? "0" + dd : dd}`,
  ];
  // 先依日期篩選
  const todaySchedules = schedules.value.filter(item => dateVariants.includes(item.date));
  // 分組：未完成在上，已完成在下
  const unfinished = todaySchedules.filter(item => !item.completed);
  const finished = todaySchedules.filter(item => item.completed);
  return {unfinished, finished};
});

function openAdd() {
  // 新增活動預設為目前 selectedDate
  const d = selectedDate?.value instanceof Date ? selectedDate.value : new Date();
  const yyyy = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  // 儲存格式與 schedule.txt 一致（不補零）
  form.date = `${yyyy}/${m}/${dd}`;
  form.dateInput = `${yyyy}-${m < 10 ? "0" + m : m}-${dd < 10 ? "0" + dd : dd}`;
  form.scheduleName = "";
  form.completed = false;
  editIdx.value = null;
  errorMsg.value = "";
  showForm.value = true;
}

function openEdit(idx) {
  const item = schedules.value[idx];
  // 預設日期為目前 selectedDate
  const d = selectedDate?.value instanceof Date ? selectedDate.value : new Date();
  const yyyy = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  form.date = `${yyyy}/${m}/${dd}`;
  form.dateInput = `${yyyy}-${m < 10 ? "0" + m : m}-${dd < 10 ? "0" + dd : dd}`;
  form.scheduleName = item.scheduleName;
  form.completed = item.completed === true;
  editIdx.value = idx;
  errorMsg.value = "";
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

function handleCancel() {
  showForm.value = false;
  confirmDeleteIdx.value = null;
}
function handleModalBgClick() {
  showForm.value = false;
  confirmDeleteIdx.value = null;
}

// 監聽 form.date，初始化/切換時自動轉 yyyy/m/d -> yyyy-mm-dd
watch(
  () => form.date,
  val => {
    if (!val) return;
    // 將 yyyy/m/d 轉 yyyy-mm-dd
    const parts = val.split("/");
    if (parts.length === 3) {
      const yyyy = parts[0];
      const mm = parts[1].padStart(2, "0");
      const dd = parts[2].padStart(2, "0");
      form.dateInput = `${yyyy}-${mm}-${dd}`;
    }
  },
  {immediate: true}
);
// 送出時將 dateInput 轉回 yyyy/m/d
async function submitForm() {
  if (!form.scheduleName || !form.dateInput) {
    errorMsg.value = "請填寫日期與行程名稱";
    return;
  }
  // 轉回 yyyy/m/d
  const [yyyy, mm, dd] = form.dateInput.split("-");
  form.date = `${parseInt(yyyy)}/${parseInt(mm)}/${parseInt(dd)}`;
  errorMsg.value = "";
  try {
    if (editIdx.value === null) {
      // 新增
      const res = await fetch("http://localhost:3001/api/schedule", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("新增失敗");
    } else {
      // 編輯
      const res = await fetch(`http://localhost:3001/api/schedule/${editIdx.value}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("儲存失敗");
    }
    showForm.value = false;
    await fetchSchedules();
  } catch (e) {
    errorMsg.value = e.message || "操作失敗";
  }
}

async function deleteSchedule(idx) {
  if (!confirm("確定要刪除這個行程嗎？")) return;
  try {
    const res = await fetch(`http://localhost:3001/api/schedule/${idx}`, {method: "DELETE"});
    if (!res.ok) throw new Error("刪除失敗");
    await fetchSchedules();
  } catch (e) {
    alert(e.message || "刪除失敗");
  }
}

function askDelete(idx) {
  confirmDeleteIdx.value = idx;
}

async function doDelete(idx) {
  try {
    const res = await fetch(`http://localhost:3001/api/schedule/${idx}`, {method: "DELETE"});
    if (!res.ok) throw new Error("刪除失敗");
    await fetchSchedules();
    showForm.value = false;
    confirmDeleteIdx.value = null;
  } catch (e) {
    errorMsg.value = e.message || "刪除失敗";
  }
}
</script>
<style scoped>
.date-picker-row {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 1em;
  border: none;
}
.schedule-table th,
.schedule-table td {
  border: none;
  padding: 0.5em 0.8em;
  text-align: left;
}
.modal-bg {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 2em 2em 1em 2em;
  min-width: 300px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}
.form-row {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
}
.form-row label {
  width: 5em;
  color: #333;
}
.form-row input {
  flex: 1;
  padding: 0.4em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  gap: 1em;
  margin-top: 1em;
}
.error-msg {
  color: #c00;
  margin-top: 0.5em;
}
.schedule-name-cell {
  cursor: pointer;
  color: #333;
  font-weight: 500;
  transition: background 0.15s;
}
.schedule-name-cell:hover {
  background: #f0f4ff;
}
.action-btn {
  display: inline-block;
  width: 100%;
  margin-top: 1em;
  padding: 0.7em 1.5em;
  background: linear-gradient(90deg, #6a9cfb 0%, #4e7be7 100%);
  color: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(80, 120, 255, 0.08);
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  border: none;
  outline: none;
  transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
  text-align: center;
  user-select: none;
}
.action-btn:hover,
.action-btn:focus {
  background: linear-gradient(90deg, #4e7be7 0%, #6a9cfb 100%);
  box-shadow: 0 4px 16px rgba(80, 120, 255, 0.15);
  transform: translateY(-2px) scale(1.03);
}
.delete-btn {
  background: #fff0f0;
  color: #c00;
  border: 1px solid #f5c2c2;
  border-radius: 24px;
  padding: 0.5em 1.2em;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
  margin-left: 0.5em;
}
.delete-btn.confirm {
  background: #ffeaea;
  border-color: #e57373;
  color: #fff;
  font-weight: bold;
}
</style>
