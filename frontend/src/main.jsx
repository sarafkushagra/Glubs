import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/Context/userStore.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 9999 }}
        toastClassName="!bg-white !text-black dark:!bg-gray-800 dark:!text-white !rounded-md !shadow-lg !w-[300px]"
        bodyClassName="!text-sm"
      />

    </AuthProvider>
  </BrowserRouter>
)
