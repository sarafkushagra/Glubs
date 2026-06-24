"use client"

import { useState, useEffect } from "react"
import Router from "./components/Router"
import LogoWithRipples from "./components/UI/LogoWithRipples"
import "./splash.css"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <LogoWithRipples />
      </div>
    )
  }

  return <Router />
}

export default App
