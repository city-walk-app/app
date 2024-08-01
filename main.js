import App from './App'
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import './styles/index.scss'

const pinia = createPinia()

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)

  return { app }
}
