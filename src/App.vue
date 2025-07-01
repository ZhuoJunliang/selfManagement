<template>
  <TitleNav />
  <!-- <MyTest /> -->
</template>

<script setup></script>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: sans-serif;
}

:root {
  box-sizing: border-box;
  font-size: calc(1vw + 0.6em); /* 基礎字號，會隨螢幕縮放 */
}

@media (min-width: 50em) {
  :root {
    font-size: 1.125em; /* 設定字號的上限 */
  }
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
</style>
