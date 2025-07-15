<template>
  <div class="routine-work-component">
    <div class="component-header">
      <h2>例行工作</h2>
      <p>設定和管理日常例行工作</p>
    </div>

    <div class="component-content">
      <div class="routine-stats">
        <div class="stat-card">
          <div class="stat-number">12</div>
          <div class="stat-label">今日完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">85%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>

      <div class="routine-list">
        <h3>今日例行工作</h3>
        <div class="routine-items">
          <div class="routine-item completed">
            <div class="routine-checkbox">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#28a745">
                <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
              </svg>
            </div>
            <div class="routine-text">晨間運動</div>
            <div class="routine-time">07:00</div>
          </div>

          <div class="routine-item completed">
            <div class="routine-checkbox">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#28a745">
                <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
              </svg>
            </div>
            <div class="routine-text">閱讀時間</div>
            <div class="routine-time">08:30</div>
          </div>

          <div class="routine-item">
            <div class="routine-checkbox"></div>
            <div class="routine-text">工作會議</div>
            <div class="routine-time">10:00</div>
          </div>

          <div class="routine-item">
            <div class="routine-checkbox"></div>
            <div class="routine-text">午休時間</div>
            <div class="routine-time">12:00</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#fff">
            <path
              d="M440-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h240q17 0 28.5 11.5T480-480q0 17-11.5 28.5T440-440Zm160-160v-120q0-17 11.5-28.5T640-760q17 0 28.5 11.5T680-720v120q0 17-11.5 28.5T640-560q-17 0-28.5-11.5T600-600Zm0 240v-120q0-17 11.5-28.5T640-520q17 0 28.5 11.5T680-480v120q0 17-11.5 28.5T640-320q-17 0-28.5-11.5T600-360Z" />
          </svg>
          新增例行工作
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 例行工作組件邏輯
</script>

<style scoped>
.routine-work-component {
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

.routine-stats {
  display: flex;
  gap: 1em;
}

.stat-card {
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1em;
  text-align: center;
}

.stat-number {
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.3em;
}

.stat-label {
  font-size: 0.8em;
  color: #666;
}

.routine-list h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.routine-items {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
}

.routine-item {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.8em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;
}

.routine-item.completed {
  background: #f8fff9;
  border-color: #28a745;
}

.routine-checkbox {
  width: 1.2em;
  height: 1.2em;
  border: 2px solid #e0e0e0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.routine-item.completed .routine-checkbox {
  border-color: #28a745;
  background: #28a745;
}

.routine-text {
  flex: 1;
  font-size: 0.9em;
  color: #333;
}

.routine-item.completed .routine-text {
  text-decoration: line-through;
  color: #666;
}

.routine-time {
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
  background: #007bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
  color: #fff;
}

.action-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.action-btn svg {
  flex-shrink: 0;
}
</style>
