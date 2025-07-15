<template>
  <div class="important-job-component">
    <div class="component-header">
      <h2>重要工作</h2>
      <p>管理優先級較高的工作項目</p>
    </div>

    <div class="component-content">
      <div class="priority-stats">
        <div class="priority-card high">
          <div class="priority-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.2em"
              viewBox="0 -960 960 960"
              width="1.2em"
              fill="#dc3545">
              <path
                d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Z" />
            </svg>
          </div>
          <div class="priority-info">
            <div class="priority-number">3</div>
            <div class="priority-label">高優先級</div>
          </div>
        </div>

        <div class="priority-card medium">
          <div class="priority-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.2em"
              viewBox="0 -960 960 960"
              width="1.2em"
              fill="#ffc107">
              <path
                d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Z" />
            </svg>
          </div>
          <div class="priority-info">
            <div class="priority-number">5</div>
            <div class="priority-label">中優先級</div>
          </div>
        </div>
      </div>

      <div class="job-list">
        <h3>待處理工作</h3>
        <div class="job-items">
          <div class="job-item high-priority">
            <div class="job-priority-indicator"></div>
            <div class="job-content">
              <div class="job-title">完成專案報告</div>
              <div class="job-details">
                <span class="job-deadline">今天 18:00</span>
                <span class="job-category">工作</span>
              </div>
            </div>
            <div class="job-actions">
              <button class="job-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#666">
                  <path
                    d="M200-200h56l345-345-56-56-345 345v56Zm-80 80v-128l400-400q23-23 56.5-23t56.5 23l15 15q23 23 23 56.5T648-520L248-120H120Zm400-400-56-56 56 56Zm-57-57-56-56 56 56Z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="job-item medium-priority">
            <div class="job-priority-indicator"></div>
            <div class="job-content">
              <div class="job-title">客戶會議準備</div>
              <div class="job-details">
                <span class="job-deadline">明天 10:00</span>
                <span class="job-category">會議</span>
              </div>
            </div>
            <div class="job-actions">
              <button class="job-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#666">
                  <path
                    d="M200-200h56l345-345-56-56-345 345v56Zm-80 80v-128l400-400q23-23 56.5-23t56.5 23l15 15q23 23 23 56.5T648-520L248-120H120Zm400-400-56-56 56 56Zm-57-57-56-56 56 56Z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="job-item high-priority">
            <div class="job-priority-indicator"></div>
            <div class="job-content">
              <div class="job-title">系統維護</div>
              <div class="job-details">
                <span class="job-deadline">今天 22:00</span>
                <span class="job-category">技術</span>
              </div>
            </div>
            <div class="job-actions">
              <button class="job-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#666">
                  <path
                    d="M200-200h56l345-345-56-56-345 345v56Zm-80 80v-128l400-400q23-23 56.5-23t56.5 23l15 15q23 23 23 56.5T648-520L248-120H120Zm400-400-56-56 56 56Zm-57-57-56-56 56 56Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#fff">
            <path
              d="M440-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h240q17 0 28.5 11.5T480-480q0 17-11.5 28.5T440-440Zm160-160v-120q0-17 11.5-28.5T640-760q17 0 28.5 11.5T680-720v120q0 17-11.5 28.5T640-560q-17 0-28.5-11.5T600-600Zm0 240v-120q0-17 11.5-28.5T640-520q17 0 28.5 11.5T680-480v120q0 17-11.5 28.5T640-320q-17 0-28.5-11.5T600-360Z" />
          </svg>
          新增重要工作
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 重要工作組件邏輯
</script>

<style scoped>
.important-job-component {
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

.priority-stats {
  display: flex;
  gap: 1em;
}

.priority-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.8em;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1em;
  border-left: 4px solid;
}

.priority-card.high {
  border-left-color: #dc3545;
}

.priority-card.medium {
  border-left-color: #ffc107;
}

.priority-icon {
  flex-shrink: 0;
}

.priority-info {
  flex: 1;
}

.priority-number {
  font-size: 1.3em;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2em;
}

.priority-label {
  font-size: 0.8em;
  color: #666;
}

.job-list h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.job-items {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
}

.job-item {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 1em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;
}

.job-item.high-priority {
  border-left: 4px solid #dc3545;
  background: #fff5f5;
}

.job-item.medium-priority {
  border-left: 4px solid #ffc107;
  background: #fffbf0;
}

.job-priority-indicator {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  flex-shrink: 0;
}

.job-item.high-priority .job-priority-indicator {
  background: #dc3545;
}

.job-item.medium-priority .job-priority-indicator {
  background: #ffc107;
}

.job-content {
  flex: 1;
}

.job-title {
  font-size: 0.9em;
  color: #333;
  font-weight: 500;
  margin-bottom: 0.3em;
}

.job-details {
  display: flex;
  gap: 1em;
  font-size: 0.8em;
  color: #666;
}

.job-deadline {
  color: #dc3545;
  font-weight: 500;
}

.job-category {
  background: #e9ecef;
  padding: 0.2em 0.5em;
  border-radius: 3px;
}

.job-actions {
  flex-shrink: 0;
}

.job-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3em;
  border-radius: 3px;
  transition: background 0.2s;
}

.job-action-btn:hover {
  background: #f0f0f0;
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
  background: #dc3545;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
  color: #fff;
}

.action-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.action-btn svg {
  flex-shrink: 0;
}
</style>
