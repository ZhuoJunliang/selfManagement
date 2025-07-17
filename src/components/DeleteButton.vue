<template>
  <div class="delete-button-container">
    <button class="delete-button" @click="$emit('click')">
      <span class="delete-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#FFFFFF">
          <path
            d="M280-720v520-520Zm170 600H280q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v172q-17-5-39.5-8.5T680-560v-160H280v520h132q6 21 16 41.5t22 38.5Zm-90-160h40q0-63 20-103.5l20-40.5v-216h-80v360Zm160-230q17-11 38.5-22t41.5-16v-92h-80v130ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm66-106 28-28-74-74v-112h-40v128l86 86Z" />
        </svg>
      </span>
      <span class="button-text">刪除</span>
    </button>
  </div>
</template>

<script setup>
// 組件邏輯
</script>

<style scoped>
.delete-button-container {
  margin-top: 0;
}

.delete-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  background: #e74c3c;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1em;
  font-weight: 500;
  height: 44px;
  min-height: 44px;
  max-height: 44px;
  box-sizing: border-box;
  line-height: 1;
}

.delete-button:hover {
  background: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.delete-icon {
  font-size: 1.2em;
  line-height: 1;
}

.button-text {
  font-size: 0.95em;
}
</style>
