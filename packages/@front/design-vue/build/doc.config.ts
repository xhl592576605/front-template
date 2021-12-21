import { defineConfig } from 'vite';
import baseConfig from './base.config';
import { outputName } from '../package.json'

export default defineConfig({
  ...baseConfig,
  base: `/${outputName}`,
  build: {
    outDir: 'docs',
  },
});
