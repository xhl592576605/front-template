<docs>
---
order: 0
title:
  zh-CN: 按钮类型
  en-US: Type
---

## zh-CN

按钮有五种类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮。主按钮在同一个操作区域最多出现一次。

## en-US

There are `primary` button, `default` button, `dashed` button, `text` button and `link` button in antd.

</docs>
<template>
  <div class="sheet-music-demo">
    <sheet-music></sheet-music>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SheetMusicDemo',
  setup() {
    return{};
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sheet-music-demo {
  width: 100%;
  height: 100%;
}
</style>

