import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild' // Dòng lệnh "cứu giá" ép Vite dùng trình nén linh hoạt hơn
  }
})