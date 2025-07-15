<template>
  <div class="account-component">
    <div class="component-header">
      <h2>帳戶設定</h2>
      <p>管理您的個人資料和設定</p>
    </div>

    <div class="component-content">
      <div class="profile-section">
        <div class="profile-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 -960 960 960" width="3em" fill="#1f1f1f">
            <path
              d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
          </svg>
        </div>
        <div class="profile-info">
          <h3>使用者名稱</h3>
          <p>user@example.com</p>
        </div>
      </div>

      <div class="settings-section">
        <h3>個人設定</h3>
        <div class="setting-items">
          <div class="setting-item">
            <div class="setting-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#666">
                <path
                  d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360Zm0-240q-33 0-56.5-23.5T400-640q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640q0 33-23.5 56.5T480-560Z" />
              </svg>
            </div>
            <div class="setting-text">編輯個人資料</div>
            <div class="setting-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#666">
                <path d="M321-80 0-401l71-71 250 250 250-250 71 71L321-80Z" />
              </svg>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#666">
                <path
                  d="M240-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-560q0-17-11.5-28.5T240-600q-17 0-28.5 11.5T200-560q0 17 11.5 28.5T240-520Zm240 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T520-560q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560q0 17 11.5 28.5T480-520Zm240 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T760-560q0-17-11.5-28.5T720-600q-17 0-28.5 11.5T680-560q0 17 11.5 28.5T720-520ZM240-200q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-400q0-17-11.5-28.5T240-440q-17 0-28.5 11.5T200-400q0 17 11.5 28.5T240-360Zm240 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T520-400q0-17-11.5-28.5T480-440q-17 0-28.5 11.5T440-400q0 17 11.5 28.5T480-360Zm240 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T760-400q0-17-11.5-28.5T720-440q-17 0-28.5 11.5T680-400q0 17 11.5 28.5T720-360Z" />
              </svg>
            </div>
            <div class="setting-text">通知設定</div>
            <div class="setting-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#666">
                <path d="M321-80 0-401l71-71 250 250 250-250 71 71L321-80Z" />
              </svg>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#666">
                <path
                  d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360Zm0-240q-33 0-56.5-23.5T400-640q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640q0 33-23.5 56.5T480-560Z" />
              </svg>
            </div>
            <div class="setting-text">隱私設定</div>
            <div class="setting-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#666">
                <path d="M321-80 0-401l71-71 250 250 250-250 71 71L321-80Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="account-actions">
        <button class="action-btn secondary">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#666">
            <path
              d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360Zm0-240q-33 0-56.5-23.5T400-640q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640q0 33-23.5 56.5T480-560Z" />
          </svg>
          登出
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 帳戶設定組件邏輯
</script>

<style scoped>
.account-component {
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

.profile-section {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 1em;
  background: #f8f9fa;
  border-radius: 8px;
}

.profile-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4em;
  height: 4em;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
}

.profile-info h3 {
  margin: 0 0 0.3em 0;
  font-size: 1em;
  color: #333;
}

.profile-info p {
  margin: 0;
  font-size: 0.9em;
  color: #666;
}

.settings-section h3 {
  margin: 0 0 1em 0;
  font-size: 1em;
  color: #333;
}

.setting-items {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.8em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.setting-item:hover {
  background: #f8f9fa;
  border-color: #007bff;
  transform: translateY(-1px);
}

.setting-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  background: #f8f9fa;
  border-radius: 4px;
}

.setting-text {
  flex: 1;
  font-size: 0.9em;
  color: #333;
}

.setting-arrow {
  flex-shrink: 0;
  transform: rotate(-90deg);
}

.account-actions {
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
  color: #666;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #dc3545;
  color: #dc3545;
  transform: translateY(-1px);
}

.action-btn svg {
  flex-shrink: 0;
}
</style>
