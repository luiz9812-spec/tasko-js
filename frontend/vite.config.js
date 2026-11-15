import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  appType: "spa",
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/cadastrar' : 'http://localhost:3000',
      '/sessao' : 'http://localhost:3000',
      '/usuario' : 'http://localhost:3000',
      '/dias' : 'http://localhost:3000',
      '/tarefas' : 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      "^/rank$": "http://localhost:3000"
    },
  },
})
