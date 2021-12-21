<script lang="ts">
export default { name: 'Button' }
</script>
<script setup lang="ts">
defineEmits(['click'])
</script>

<template>
  <button class="button" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  width: 60px;
  height: 40px;
}
</style>
