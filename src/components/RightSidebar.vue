<template>
  <div class="right-sidebar">
    <div class="sidebar-content">
      <!-- 根據當前組件顯示對應的內容 -->
      <ScheduleComponent v-if="currentSidebarComponent === 'schedule'" />
      <RoutineWorkComponent v-else-if="currentSidebarComponent === 'routineWork'" />
      <StatisticsComponent v-else-if="currentSidebarComponent === 'statistics'" />
      <ImportantJobComponent v-else-if="currentSidebarComponent === 'importantJob'" />
      <AccountComponent v-else-if="currentSidebarComponent === 'AccountCircle'" />
    </div>
  </div>
</template>

<script setup>
import {inject} from "vue";
import ScheduleComponent from "./ScheduleComponent.vue";
import RoutineWorkComponent from "./RoutineWorkComponent.vue";
import StatisticsComponent from "./StatisticsComponent.vue";
import ImportantJobComponent from "./ImportantJobComponent.vue";
import AccountComponent from "./AccountComponent.vue";

// 注入當前顯示的組件狀態
const currentSidebarComponent = inject("currentSidebarComponent");
</script>

<style scoped>
.right-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.2em 1em;
  width: 270px;
  height: calc(100vh - 250px);
  margin: 0 1em;
  overflow-y: auto;
}

.sidebar-content {
  height: 100%;
}

/* 小螢幕樣式 */
@media (max-width: 576px) {
  .right-sidebar {
    width: calc(100% - 2em);
    height: calc(100vh - 200px);
    margin: 0 1em;
  }
}
</style>
