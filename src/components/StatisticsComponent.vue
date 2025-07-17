<template>
  <div class="statistics-component">
    <div class="component-header">
      <h2>統計分析</h2>
    </div>

    <div class="component-content">
      <!-- 刪除 stats-overview 區塊 -->
      <!-- 刪除 chart-section 區塊 -->
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
