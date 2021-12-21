<script lang="ts">
export default { name: '{{ compName }}' }
</script>
<script setup lang="ts">

</script>

<template>
  <div class="{{ compClassName }}">
    我是{{ compZhName }}组件
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.{{ compClassName }} {
  width: 60px;
  height: 40px;
}
</style>
