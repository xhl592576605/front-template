<template>
  <div>
    <Button @click="onClick(1)">第一个</Button>
    <Button @click="onClick(2)">第二个</Button>
    <Button @click="onClick(3)">第三个</Button>
  </div>
</template>

<script setup>
const onClick = (num) => { console.log(`我是第 ${num} 个自定义按钮`) }
</script>
