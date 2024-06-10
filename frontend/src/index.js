import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import App from './App'
import { LeadsContextProvider } from './context/LeadsContext'
import { AuthContextProvider } from './context/AuthContext'
import { UsersContextProvider } from './context/UsersContext'
import { EmailsContextProvider } from './context/EmailsContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <EmailsContextProvider>
        <UsersContextProvider>
          <LeadsContextProvider>
            <App />
          </LeadsContextProvider>
        </UsersContextProvider>
      </EmailsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)
