import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'

import 'bootstrap/dist/js/bootstrap.js'
import 'jquery/dist/jquery.js'
import 'popper.js/dist/umd/popper.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
