<template>
  <div>
    <label for="root-font-size">調整根字體大小:</label>
    <input type="range" id="root-font-size" min="10" max="30" v-model="rootFontSize" @input="updateRootFontSize" />
    <p>目前根字體大小: {{ rootFontSize }}px</p>

    <div :style="resizableStyle" class="resizable-element">這個標籤的大小會隨著根字體大小改變。</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rootFontSize: 16, // 初始的根字體大小
    };
  },
  computed: {
    resizableStyle() {
      // 動態設置 --base-size CSS 變數
      return {
        "--base-size": `${this.rootFontSize}px`,
      };
    },
  },
  methods: {
    updateRootFontSize() {
      // 當 input 值改變時，Vue 會自動更新 resizableStyle，進而更新 CSS 變數
      // 這裡不需要額外操作 DOM
    },
  },
  mounted() {
    // 首次載入時，將初始的 rootFontSize 設置為 CSS 變數
    document.documentElement.style.setProperty("--base-size", `${this.rootFontSize}px`);
  },
};
</script>

<style>
/* 這裡放你在步驟1定義的 CSS */
:root {
  --base-size: 16px;
}

.resizable-element {
  font-size: var(--base-size);
  padding: calc(var(--base-size) / 2);
  border: 1px solid black;
  display: inline-block;
  margin-top: 20px;
}
</style>
