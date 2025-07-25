"use client"

import { useState, useEffect } from "react"
import Router from "./components/Router"
import LogoWithRipples from "./components/ui/LogoWithRipples"
import { ThemeProvider } from "./components/Context/ThemeContext"
import "./splash.css"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100) // 5 seconds splash
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <LogoWithRipples />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}

export default App
