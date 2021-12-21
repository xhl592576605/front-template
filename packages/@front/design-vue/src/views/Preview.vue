<script setup lang="ts">
import Prism from 'prismjs';
import {
  computed, nextTick, onMounted, ref
} from 'vue';
import '../assets/css/prism.css';
import { outputName } from '../../package.json'

const isDev = import.meta.env.MODE === 'development';

const props = defineProps({
  compName: {
    type: String,
    default: '',
    require: true,
  },
  demoName: {
    type: String,
    default: '',
    require: true,
  }
})

const sourceCode = ref('')
const codeVisible = ref(false)

const previewSourceCode = computed(() => sourceCode.value.replace(/'\.\.\/\.\.\/index'/g, '\'@tencent/my-kit\''))

onMounted(async () => {
  if (props.compName && props.demoName) {
    if (isDev) {
      sourceCode.value = (
        await import(/* @vite-ignore */ `../../components/${props.compName}/docs/${props.demoName}.vue?raw`)
      ).default;
    } else {
      sourceCode.value = await fetch(`${isDev ? '' : `/${outputName}`}/components/${props.compName}/docs/${props.demoName}.vue`).then((res) => res.text());
    }
  }
  await nextTick();
  Prism.highlightAll();
})

</script>

<template>
  <div class="preview">
    <section>
      <slot></slot>
    </section>

    <div v-show="codeVisible" class="source-code">
      <pre class="language-html"><code class="language-html">{{ previewSourceCode }}</code></pre>
    </div>

    <div class="preview-bottom">
      <span name="Code" @click="codeVisible = !codeVisible">查看代码</span>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
pre {
  line-height: 0;
}
.preview {
  border: 4px;
  border: 1px dashed #e7e7e7;
  padding: 10px;
  border-bottom: 1px dashed #e7e7e7;
  section {
    margin: 15px;
  }
  .source-code {
    max-height: 500px;
    .language-html {
      margin: 0;
      padding: 0 15px;
    }
  }
  .preview-bottom {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px dashed #e7e7e7;
  }
}
</style>
