import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Репозиторий на GitHub Pages отдаётся не с корня домена, а с
  // /slovakian-lang/ — без этого пути к js/css в собранном index.html будут
  // сломаны. При локальной разработке (`vite`, а не `vite build`) base не
  // нужен — иначе пришлось бы открывать localhost с лишним префиксом в пути.
  base: command === 'build' ? '/slovakian-lang/' : '/',
  plugins: [react()],
}))
