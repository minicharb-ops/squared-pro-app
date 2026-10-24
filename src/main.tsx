import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { BillingProvider } from './BillingContext' 
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BillingProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </BillingProvider>
  </StrictMode>,
)