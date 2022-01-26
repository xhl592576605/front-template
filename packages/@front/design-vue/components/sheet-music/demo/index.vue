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
