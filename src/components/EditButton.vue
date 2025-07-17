<template>
  <div class="edit-button-container">
    <button class="edit-button" @click="$emit('click')">
      <span class="edit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 -960 960 960" width="1.2em" fill="#FFFFFF">
          <path
            d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
        </svg>
      </span>
      <span class="button-text">修改</span>
    </button>
  </div>
</template>

<script setup>
// 組件不需要額外的邏輯，只負責觸發點擊事件
</script>

<style scoped>
.edit-button-container {
  margin-top: 0;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  background: #ff9800;
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

.edit-button:hover {
  background: #f57c00;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.edit-icon {
  font-size: 1.2em;
  line-height: 1;
}

.button-text {
  font-size: 0.95em;
}
</style>
