import App from './App'
import './styles/index.scss'
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'

const pinia = createPinia()

export function createApp () {
  const app = createSSRApp(App)
  app.use(pinia)

  return { app }
}
