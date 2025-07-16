<template>
  <div class="account-component">
    <div class="component-header">
      <h2>{{ isLoggedIn ? "帳戶設定" : "登入" }}</h2>
      <p>{{ isLoggedIn ? "管理您的個人資料和設定" : "請輸入您的帳號密碼" }}</p>
    </div>

    <div class="component-content">
      <!-- 登入表單 -->
      <div v-if="!isLoggedIn" class="login-section">
        <div class="login-form">
          <div class="form-group">
            <label for="username">帳號</label>
            <input
              type="text"
              id="username"
              v-model="loginForm.username"
              placeholder="請輸入帳號"
              @keyup.enter="handleLogin" />
          </div>
          <div class="form-group">
            <label for="password">密碼</label>
            <input
              type="password"
              id="password"
              v-model="loginForm.password"
              placeholder="請輸入密碼"
              @keyup.enter="handleLogin" />
          </div>
          <div v-if="loginError" class="error-message">
            {{ loginError }}
          </div>
          <button class="login-btn" @click="handleLogin">登入</button>
        </div>
      </div>

      <!-- 帳戶信息 -->
      <div v-else>
        <div class="profile-section">
          <div class="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 -960 960 960" width="3em" fill="#1f1f1f">
              <path
                d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
            </svg>
          </div>
          <div class="profile-info">
            <h3>{{ currentUser.userName }}</h3>
            <!-- <p>{{ currentUser.userName }}@example.com</p> -->
          </div>
        </div>

        <!-- <div class="settings-section">
          <h3>個人設定</h3>
          <div class="setting-items">
            <div class="setting-item">
              <div class="setting-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.2em"
                  viewBox="0 -960 960 960"
                  width="1.2em"
                  fill="#666">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.2em"
                  viewBox="0 -960 960 960"
                  width="1.2em"
                  fill="#666">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.2em"
                  viewBox="0 -960 960 960"
                  width="1.2em"
                  fill="#666">
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
        </div> -->

        <div class="account-actions">
          <button class="action-btn secondary" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#666">
              <path
                d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-240q-33 0-56.5-23.5T400-440q0-33 23.5-56.5T480-520q33 0 56.5 23.5T560-440q0 33-23.5 56.5T480-360Zm0-240q-33 0-56.5-23.5T400-640q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640q0 33-23.5 56.5T480-560Z" />
            </svg>
            登出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive, inject} from "vue";

// 注入全局登入狀態
const isLoggedIn = inject("isLoggedIn");
const currentUser = inject("currentUser");
const loginForm = reactive({
  username: "",
  password: "",
});
const loginError = ref("");
const autoFillUsername = ref(false);
const userInfo = ref([]);

// 從瀏覽器記憶體讀取用戶信息
const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("解析存儲的用戶信息失敗:", e);
      return null;
    }
  }
  return null;
};

// 保存用戶信息到瀏覽器記憶體
const saveUserToStorage = user => {
  localStorage.setItem("currentUser", JSON.stringify(user));
  // 同時保存最後登入的用戶名，用於下次自動填入
  localStorage.setItem("lastLoginUsername", user.userName);
};

// 清除瀏覽器記憶體中的用戶信息
const clearUserFromStorage = () => {
  localStorage.removeItem("currentUser");
  // 注意：不清除 lastLoginUsername，保留最後登入的用戶名
};

// 載入用戶信息文件
const loadUserInfo = async () => {
  try {
    const response = await fetch("http://localhost:3001/userInfo.txt");
    const data = await response.text();
    userInfo.value = JSON.parse(data);
  } catch (error) {
    console.error("載入用戶信息失敗:", error);
    userInfo.value = [];
  }
};

// 更新用戶信息文件
const updateUserInfoFile = async (username, loginSuccessful) => {
  try {
    console.log(`正在更新用戶 ${username} 的登入狀態為: ${loginSuccessful}`);

    // 發送更新請求到服務器
    const response = await fetch("http://localhost:3001/updateUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        loginSuccessful: loginSuccessful,
      }),
    });

    if (!response.ok) {
      console.error("更新用戶信息失敗");
      return false;
    }

    const result = await response.json();
    console.log("更新結果:", result);

    // 重新載入用戶信息以獲取最新狀態
    await loadUserInfo();
    console.log("用戶信息已重新載入");
    return true;
  } catch (error) {
    console.error("更新用戶信息失敗:", error);
    return false;
  }
};

// 驗證用戶登入
const validateUser = (username, password) => {
  const user = userInfo.value.find(u => u.userName === username);
  if (!user) {
    return {valid: false, message: "帳號不存在"};
  }
  if (user.password !== password) {
    return {valid: false, message: "密碼錯誤"};
  }
  return {valid: true, user};
};

// 處理登入
const handleLogin = async () => {
  loginError.value = "";

  if (!loginForm.username || !loginForm.password) {
    loginError.value = "請輸入帳號和密碼";
    return;
  }

  const validation = validateUser(loginForm.username, loginForm.password);

  if (validation.valid) {
    console.log("登入成功，用戶:", validation.user.userName);
    currentUser.value = validation.user;
    isLoggedIn.value = true;
    saveUserToStorage(validation.user);

    // 更新用戶的登入狀態為成功
    const updateResult = await updateUserInfoFile(validation.user.userName, "true");
    console.log("更新登入狀態結果:", updateResult);

    loginForm.username = "";
    loginForm.password = "";
    autoFillUsername.value = false;
  } else {
    loginError.value = validation.message;
  }
};

// 處理登出
const handleLogout = async () => {
  // 保存當前用戶名，以便在登出後自動填入
  const currentUsername = currentUser.value ? currentUser.value.userName : "";

  // 更新用戶的登入狀態為失敗
  if (currentUsername) {
    await updateUserInfoFile(currentUsername, "false");
  }

  isLoggedIn.value = false;
  currentUser.value = null;
  clearUserFromStorage();

  // 立即帶入剛才登出的用戶名（這個用戶名已經保存在 lastLoginUsername 中）
  loginForm.username = currentUsername;
  loginForm.password = "";
  autoFillUsername.value = false;
  loginError.value = "";
};

// 檢查登入狀態
const checkLoginStatus = () => {
  const storedUser = loadUserFromStorage();
  const lastLoginUsername = localStorage.getItem("lastLoginUsername");
  console.log("檢查登入狀態，存儲的用戶:", storedUser);
  console.log("最後登入的用戶名:", lastLoginUsername);
  console.log("當前用戶信息:", userInfo.value);

  if (storedUser) {
    // 檢查存儲的用戶是否在用戶列表中
    const user = userInfo.value.find(u => u.userName === storedUser.userName);
    console.log("找到的用戶:", user);

    if (user) {
      // 檢查登入狀態
      console.log("用戶登入狀態:", user.loginSuccessful);
      if (user.loginSuccessful === "true") {
        // 自動登入
        console.log("自動登入用戶:", user.userName);
        currentUser.value = user;
        isLoggedIn.value = true;
      } else {
        // 需要重新輸入密碼，自動填入用戶名
        console.log("需要重新輸入密碼");
        loginForm.username = storedUser.userName;
        autoFillUsername.value = true;
        loginError.value = "請重新輸入密碼";
      }
    } else {
      // 用戶不存在，清除存儲的信息
      console.log("用戶不存在，清除存儲信息");
      clearUserFromStorage();
    }
  } else {
    // 瀏覽器記憶體中沒有當前登入用戶信息
    if (lastLoginUsername) {
      // 優先使用最後登入的用戶名
      console.log("使用最後登入的用戶名:", lastLoginUsername);
      loginForm.username = lastLoginUsername;
      autoFillUsername.value = true;
    } else if (userInfo.value.length > 0) {
      // 如果沒有最後登入記錄，使用第一個用戶的用戶名
      console.log("自動填入第一個用戶名:", userInfo.value[0].userName);
      loginForm.username = userInfo.value[0].userName;
      autoFillUsername.value = true;
    }
  }
};

// 組件掛載時執行
onMounted(async () => {
  await loadUserInfo();
  checkLoginStatus();
});
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

/* 登入表單樣式 */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
  max-width: 300px;
  padding: 2em;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 1.5em;
}

.form-group label {
  display: block;
  margin-bottom: 0.5em;
  font-size: 0.9em;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  color: #dc3545;
  font-size: 0.85em;
  margin-bottom: 1em;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 0.8em;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background: #0056b3;
}

/* 原有的帳戶信息樣式 */
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
