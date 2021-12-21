import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import baseConfig from './base.config';
import { outputName } from '../package.json'

export default defineConfig({
  ...baseConfig,
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, '../components/index.ts'),
      name: `${outputName}`,
      fileName: (format) => `${outputName}.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [
    ...(baseConfig as any).plugins,
    dts(),
  ]
});
