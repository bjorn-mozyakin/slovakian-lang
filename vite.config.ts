import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Репозиторий на GitHub Pages отдаётся не с корня домена, а с
  // /slovakian-lang/ — без этого пути к js/css в собранном index.html будут
  // сломаны.
  base: '/slovakian-lang/',
  plugins: [react()],
})
