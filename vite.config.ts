
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

// Cấu hình đã được đơn giản hóa.
// Chúng ta không còn cần phải đưa API key vào mã nguồn phía client nữa
// vì lệnh gọi API giờ đây được xử lý an toàn ở phía backend (Vercel Serverless Function).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.'),
    }
  }
});
