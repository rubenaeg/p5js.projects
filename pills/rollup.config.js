import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

module.exports = defineConfig({
  input: 'dist/index.js',
  output: {
    dir: 'public/bundle/',
    format: 'iife'
  },
  plugins: [resolve(), commonjs()]
})
