<template>
  <div class="routine-action-grid">
    <div v-for="action in actions" :key="action.actionName" class="action-grid-card">
      <div class="action-icon" v-html="getIconSvg(action.actionIcon, action.actionColor)"></div>
      <div class="action-name">{{ action.actionName }}</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

const actions = ref([]);
const icons = ref([]);

function getIconSvg(index, color) {
  if (!icons.value.length) return "";
  let svg = icons.value[index] || "";
  return svg.replace(/fill=\"actionColor\"/g, `fill=\"${color}\"`);
}

onMounted(async () => {
  const res = await fetch("/actions.txt");
  const data = await res.json();
  actions.value = data.filter(a => a.validEvent === "true");

  const iconRes = await fetch("/icons.txt");
  icons.value = await iconRes.json();
});
</script>

<style scoped>
.routine-action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px;
}
.action-grid-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 0 6px 0;
  min-height: 80px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s;
}
.action-grid-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.action-name {
  font-size: 0.85em;
  color: #444;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
}
</style>
