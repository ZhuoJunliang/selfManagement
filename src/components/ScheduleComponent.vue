<template>
  <div class="schedule-component">
    <div class="component-header">
      <h2>行事曆</h2>
      <p>查看和管理您的行事曆</p>
    </div>

    <div class="component-content">
      <div class="calendar-preview">
        <div class="calendar-header">
          <h3>本月行事曆</h3>
        </div>
        <div class="calendar-grid">
          <!-- 這裡可以放置行事曆預覽 -->
          <div class="calendar-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 -960 960 960" width="3em" fill="#1f1f1f">
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
            </svg>
            <p>行事曆功能開發中...</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3>快速操作</h3>
        <div class="action-buttons">
          <button class="action-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.2em"
              viewBox="0 -960 960 960"
              width="1.2em"
              fill="#1f1f1f">
              <path
                d="M440-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h240q17 0 28.5 11.5T480-480q0 17-11.5 28.5T440-440Zm160-160v-120q0-17 11.5-28.5T640-760q17 0 28.5 11.5T680-720v120q0 17-11.5 28.5T640-560q-17 0-28.5-11.5T600-600Zm0 240v-120q0-17 11.5-28.5T640-520q17 0 28.5 11.5T680-480v120q0 17-11.5 28.5T640-320q-17 0-28.5-11.5T600-360Z" />
            </svg>
            新增活動
          </button>
          <button class="action-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.2em"
              viewBox="0 -960 960 960"
              width="1.2em"
              fill="#1f1f1f">
              <path
                d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360Zm0-240q-33 0-56.5-23.5T400-640q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640q0 33-23.5 56.5T480-560Z" />
            </svg>
            查看全部
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 行事曆組件邏輯
</script>

<style scoped>
.schedule-component {
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

.calendar-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1em;
}

.calendar-header h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.calendar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
  color: #666;
  text-align: center;
}

.calendar-placeholder p {
  margin-top: 1em;
  font-size: 0.9em;
}

.quick-actions h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
}

.action-btn {
  display: flex;
  align-items: center;
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
</style>
