<template>
  <div class="statistics-component">
    <div class="component-header">
      <h2>統計分析</h2>
      <p>查看您的活動統計和趨勢</p>
    </div>

    <div class="component-content">
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.5em"
              viewBox="0 -960 960 960"
              width="1.5em"
              fill="#007bff">
              <path
                d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-number">156</div>
            <div class="stat-label">本月活動</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.5em"
              viewBox="0 -960 960 960"
              width="1.5em"
              fill="#28a745">
              <path
                d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-number">92%</div>
            <div class="stat-label">完成率</div>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <h3>本週活動趨勢</h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div class="chart-bar" style="height: 60%">
              <div class="bar-label">一</div>
            </div>
            <div class="chart-bar" style="height: 80%">
              <div class="bar-label">二</div>
            </div>
            <div class="chart-bar" style="height: 45%">
              <div class="bar-label">三</div>
            </div>
            <div class="chart-bar" style="height: 90%">
              <div class="bar-label">四</div>
            </div>
            <div class="chart-bar" style="height: 75%">
              <div class="bar-label">五</div>
            </div>
            <div class="chart-bar" style="height: 50%">
              <div class="bar-label">六</div>
            </div>
            <div class="chart-bar" style="height: 30%">
              <div class="bar-label">日</div>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-breakdown">
        <h3>活動分類</h3>
        <div class="breakdown-items">
          <div class="breakdown-item">
            <div class="breakdown-color" style="background: #007bff"></div>
            <div class="breakdown-text">工作</div>
            <div class="breakdown-percentage">45%</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-color" style="background: #28a745"></div>
            <div class="breakdown-text">運動</div>
            <div class="breakdown-percentage">25%</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-color" style="background: #ffc107"></div>
            <div class="breakdown-text">學習</div>
            <div class="breakdown-percentage">20%</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-color" style="background: #dc3545"></div>
            <div class="breakdown-text">休閒</div>
            <div class="breakdown-percentage">10%</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#1f1f1f">
            <path
              d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360Zm0-240q-33 0-56.5-23.5T400-640q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640q0 33-23.5 56.5T480-560Z" />
          </svg>
          詳細報告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 統計分析組件邏輯
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
</style>
