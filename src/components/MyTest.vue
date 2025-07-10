<template>
  <div class="actions-container">
    <h2>動作列表</h2>
    <div class="actions-grid">
      <div v-for="action in actions" :key="action.actionIcon" class="action-item" :style="{borderColor: 'black'}">
        <div class="action-icon" v-html="getIcon(action.actionIcon)"></div>
        <div class="action-name">{{ action.actionName }}</div>
        <div class="action-color" :style="{backgroundColor: action.actionColor}"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyTest",
  data() {
    return {
      actions: [],
      icons: [],
    };
  },
  async mounted() {
    try {
      // 讀取圖示檔案
      const iconsResponse = await fetch("/icons.txt");
      const iconsText = await iconsResponse.text();
      this.icons = JSON.parse(iconsText);

      // 讀取動作檔案
      const actionsResponse = await fetch("/actions.txt");
      const actionsText = await actionsResponse.text();
      this.actions = JSON.parse(actionsText);

      console.log("圖示數量:", this.icons.length);
      console.log("動作數量:", this.actions.length);
    } catch (error) {
      console.error("讀取檔案時發生錯誤:", error);
    }
  },
  methods: {
    getIcon(iconIndex) {
      const iconSvg = this.icons[iconIndex] || "";
      const action = this.actions.find(a => a.actionIcon === iconIndex);

      if (action && action.actionColor) {
        // 將 SVG 中的 actionColor 佔位符替換為實際顏色
        return iconSvg.replace(/fill="actionColor"/g, `fill="${action.actionColor}"`);
      }

      return iconSvg;
    },
  },
};
</script>

<style scoped>
.actions-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.actions-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border: 3px solid;
  border-radius: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.action-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.action-icon {
  margin-bottom: 12px;
}

.action-icon svg {
  width: 48px;
  height: 48px;
}

.action-name {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.action-color {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .action-item {
    width: 140px;
    height: 140px;
  }

  .action-icon svg {
    width: 36px;
    height: 36px;
  }

  .action-name {
    font-size: 1em;
  }
}
</style>
