import { SystemStateProvider } from "./SystemState";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './handheld.css'
import './settings-layout.css'
import './whitelist-layout.css'
import './handheld-ued.css'
import './handheld-polish.css'
import './history-refinements.css'
import DevicePreview from './DevicePreview'

const isDeviceView = new URLSearchParams(window.location.search).has('device')
document.documentElement.classList.toggle('preview-host', !isDeviceView)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isDeviceView ? <SystemStateProvider><App /></SystemStateProvider> : <DevicePreview />}
  </React.StrictMode>,
)

import './handheld-redesign.css'
