<template>
  <n-layout-footer
    bordered
    class="footer"
    :class="{
      ['footer--centered']: centered
    }"
  >
    <div class="footer-links">
    </div>
    <n-divider class="footer-divider" />
    <div style="text-align: center; padding: 20px">
    </div>
  </n-layout-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { i18n } from '../../utils/composables'
import { push } from '../../store'
import { repoUrl } from '../../utils/github-url'

export default defineComponent({
  props: {
    centered: Boolean
  },
  setup () {
    return {
      repoUrl,
      push,
    }
  }
})
</script>

<style scoped>
.footer {
  --x-padding: 56px;
  margin-top: auto;
}

.footer.footer--centered .footer-links {
  margin: auto;
  max-width: 960px;
  --x-padding: 36px;
}

.footer-links {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: var(--x-padding);
  padding-bottom: 0;
  padding-top: 32px;
}

.footer-links-col {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  padding-bottom: 24px;
}

.col-header {
  white-space: nowrap;
}

@media only screen and (min-width: 1024px) {
  .footer.footer--centered .footer-links-col.footer-links-col--last {
    flex: 0 0 0;
  }
}

.footer.footer--centered .footer-links-col {
  width: initial;
}

.footer-divider {
  margin: 0;
  padding: 0 var(--x-padding);
}

.footer-links-col > * {
  line-height: 2;
}

.col-header {
  font-weight: 500;
}

.link {
  text-decoration: none;
}
</style>
