
# aside
asda
<template>
  <demo-sort :cols="1">
    <basic />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import CN from '../index.zh-CN.md';
import US from '../index.zh-US.md';

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SheetMusicDemo',
  CN,
  US,
  components:{
    Basic,
  },
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
