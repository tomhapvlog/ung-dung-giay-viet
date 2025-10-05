import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// FIX: Import 'process' to provide type definitions for process.cwd()
import process from 'process';

// Cấu hình này hoàn nguyên về việc sử dụng GEMINI_API_KEY.
// Nó tải biến môi trường từ tệp .env (cho local) hoặc cài đặt môi trường (cho production)
// và cung cấp nó cho ứng dụng dưới dạng process.env.API_KEY.
export default defineConfig(({ mode }) => {
  // Tải các biến môi trường
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Chúng ta sẽ tìm GEMINI_API_KEY. Nếu không tìm thấy, giá trị mặc định là chuỗi rỗng.
      // Điều này khôi phục lại cấu hình cũ hơn để ổn định hóa.
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve('.'),
      }
    }
  };
});