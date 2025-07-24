"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../Context/userStore"
import Navbar from "../Pages/Navbar"
import Footer from "../Pages/Footer"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Users,
  Globe,
  Eye,
  EyeOff,
  MapPin,
  Save,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react"

const EventRegistrationForm = () => {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Check if user has permission
  useEffect(() => {
    if (!user || (user.role !== "club-admin" && user.role !== "admin")) {
      navigate("/events")
      return
    }

    if (eventId) {
      setIsEditing(true)
      fetchEventData()
    }
  }, [user, eventId, navigate])

  // Form state
  const [formData, setFormData] = useState({
    // Basic Details
    title: "",
    description: "",
    details: "",
    eventType: "Hackathon",
    logo: "",
    website: "",
    festival: "",

    // Event Settings
    date: "",
    venue: "",
    mode: "online",
    visibility: "public",
    categories: [],
    skillsToBeAssessed: "",

    // Registration Details
    participationType: "Individual",
    teamMin: 2,
    teamMax: 5,
    registrationStart: "",
    registrationEnd: "",
    registrationLimit: "",
    hideContact: false,

    // Additional Fields
    prizePool: "",
    eligibility: "",
    rules: "",
    contactEmail: "",
    contactPhone: "",
  })

  const [errors, setErrors] = useState({})
  const [logoPreview, setLogoPreview] = useState("")

  const eventTypes = [
    "Hackathon",
    "Workshop",
    "Seminar",
    "Quiz",
    "Conference",
    "Case Study",
    "Creative Showcase",
    "Other",
  ]

  const allCategories = [
    "Coding",
    "Business",
    "Design",
    "Marketing",
    "Finance",
    "Art",
    "Robotics",
    "Public Speaking",
    "Analytics",
    "AI/ML",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
  ]

  const skillOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "Java",
    "C++",
    "Machine Learning",
    "Data Analysis",
    "UI/UX Design",
    "Marketing",
    "Business Strategy",
    "Public Speaking",
    "Leadership",
    "Teamwork",
  ]

  const fetchEventData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.API_BASE_URL}/event/${eventId}`, { withCredentials: true })
      const event = res.data.event

      setFormData({
        title: event.title || "",
        description: event.description || "",
        details: event.details || "",
        eventType: event.eventType || "Hackathon",
        logo: event.logo || "",
        website: event.website || "",
        festival: event.festival || "",
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
        venue: event.venue || "",
        mode: event.mode || "online",
        visibility: event.visibility || "public",
        categories: event.categories || [],
        skillsToBeAssessed: event.skillsToBeAssessed || "",
        participationType: event.participationType || "Individual",
        teamMin: event.teamMin || 2,
        teamMax: event.teamMax || 5,
        registrationStart: event.registrationStart ? new Date(event.registrationStart).toISOString().slice(0, 16) : "",
        registrationEnd: event.registrationEnd ? new Date(event.registrationEnd).toISOString().slice(0, 16) : "",
        registrationLimit: event.registrationLimit || "",
        hideContact: event.hideContact || false,
        prizePool: event.prizePool || "",
        eligibility: event.eligibility || "",
        rules: event.rules || "",
        contactEmail: event.contactEmail || "",
        contactPhone: event.contactPhone || "",
      })

      if (event.logo) {
        setLogoPreview(event.logo)
      }
    } catch (err) {
      console.error("Error fetching event:", err)
      alert("Error loading event data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSkillToggle = (skill) => {
    const currentSkills = formData.skillsToBeAssessed
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill]

    setFormData((prev) => ({
      ...prev,
      skillsToBeAssessed: updatedSkills.join(", "),
    }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit
        alert("File size should be less than 1MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        setFormData((prev) => ({ ...prev, logo: base64 }))
        setLogoPreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (!formData.eventType) newErrors.eventType = "Event type is required"
      if (!formData.date) newErrors.date = "Event date is required"
    }

    if (step === 2) {
      if (!formData.registrationStart) newErrors.registrationStart = "Registration start date is required"
      if (!formData.registrationEnd) newErrors.registrationEnd = "Registration end date is required"
      if (formData.participationType === "Team") {
        if (!formData.teamMin || formData.teamMin < 2) newErrors.teamMin = "Minimum team size should be at least 2"
        if (!formData.teamMax || formData.teamMax < formData.teamMin)
          newErrors.teamMax = "Maximum team size should be greater than minimum"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return
const token = localStorage.getItem('token');

    try {
      setLoading(true)
      const payload = {
        ...formData,
        createdBy: user._id,
        club: user.club,
        teamMin: formData.participationType === "Individual" ? null : formData.teamMin,
        teamMax: formData.participationType === "Individual" ? null : formData.teamMax,
      }
      if (isEditing) {
        await axios.put(`${process.env.API_BASE_URL}/event/${eventId}`, payload, { withCredentials: true })
        alert("Event updated successfully!")
      } else {
        await axios.post(`${process.env.API_BASE_URL}/event`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
          , withCredentials: true
        })
        alert("Event created successfully!")
      }

      navigate("/events")
    } catch (err) {
      console.error("Error saving event:", err)
      alert("Error saving event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return

    try {
      setLoading(true)
      await axios.delete(`${process.env.API_BASE_URL}/event/${eventId}`, { withCredentials: true })
      alert("Event deleted successfully!")
      navigate("/events")
    } catch (err) {
      console.error("Error deleting event:", err)
      alert("Error deleting event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-black via-gray-900 to-indigo-900"
      : "bg-gradient-to-br from-blue-50 via-white to-indigo-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    card: isDarkMode
      ? "bg-gray-900/40 backdrop-blur-sm border-gray-700"
      : "bg-white/80 backdrop-blur-sm border-gray-200",
    input: isDarkMode
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
      : "bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDarkMode
      ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
      : "bg-white/70 border-gray-300 text-gray-700 hover:bg-gray-100",
    primaryButton:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
    successButton:
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white",
    dangerButton: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white",
  }

  if (loading && isEditing) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/events")}
            className={`flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.text} mb-6 transition-colors group`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </button>

          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-2`}>
              {isEditing ? "Edit Event" : "Create New Event"}
            </h1>
            <p className={`${themeClasses.textSecondary} text-lg`}>
              {isEditing ? "Update your event details" : "Fill in the details to create an amazing event"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step <= currentStep
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : isDarkMode
                      ? "bg-gray-800 text-gray-400 border border-gray-700"
                      : "bg-gray-200 text-gray-500 border border-gray-300"
                    }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${step < currentStep
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                      : isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-16">
              {["Basic Details", "Registration", "Additional Info"].map((label, index) => (
                <div
                  key={label}
                  className={`text-sm font-medium transition-colors ${index + 1 <= currentStep ? themeClasses.text : themeClasses.textMuted
                    }`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className={`${themeClasses.card} border rounded-2xl p-8 shadow-2xl`}>
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Basic Details</h2>
                <p className={themeClasses.textSecondary}>Tell us about your event</p>
              </div>

              {/* Logo Upload */}
              <div className="text-center mb-8">
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-4`}>
                  Event Logo <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative w-32 h-32 mx-auto border-2 border-dashed ${isDarkMode ? "border-gray-600" : "border-gray-300"
                    } rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors group`}
                >
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-28 h-28 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setLogoPreview("")
                          setFormData((prev) => ({ ...prev, logo: "" }))
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload
                        className={`w-8 h-8 ${themeClasses.textMuted} group-hover:text-indigo-500 transition-colors mb-2`}
                      />
                      <p className={`text-sm ${themeClasses.textMuted} group-hover:text-indigo-500 transition-colors`}>
                        Click to upload
                      </p>
                      <p className={`text-xs ${themeClasses.textMuted} mt-1`}>Max 1MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title"
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of your event"
                  rows={4}
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Event Type and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => handleInputChange("eventType", e.target.value)}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  >
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Event Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
              </div>

              {/* Mode and Venue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Mode</label>
                  <div className="flex gap-2">
                    {["online", "offline", "hybrid"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleInputChange("mode", mode)}
                        className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${formData.mode === mode
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg"
                          : `${themeClasses.button} border`
                          }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {mode === "online" && <Globe className="w-4 h-4" />}
                          {mode === "offline" && <MapPin className="w-4 h-4" />}
                          {mode === "hybrid" && <Users className="w-4 h-4" />}
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Venue {formData.mode !== "online" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder={formData.mode === "online" ? "Online platform (optional)" : "Enter venue location"}
                    disabled={formData.mode === "online"}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${formData.mode === "online" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  />
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Visibility</label>
                <div className="flex gap-2">
                  {[
                    { value: "public", label: "Public", icon: Eye },
                    { value: "invite", label: "Invite Only", icon: EyeOff },
                    { value: "both", label: "Both", icon: Users },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange("visibility", value)}
                      className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${formData.visibility === value
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg"
                        : `${themeClasses.button} border`
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Festival/Event Series
                  </label>
                  <input
                    type="text"
                    value={formData.festival}
                    onChange={(e) => handleInputChange("festival", e.target.value)}
                    placeholder="e.g., TechFest 2024"
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Registration Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Registration Details</h2>
                <p className={themeClasses.textSecondary}>Configure how participants can register</p>
              </div>

              {/* Participation Type */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-4`}>
                  Participation Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: "Individual", icon: Users, desc: "Single participant per registration" },
                    { value: "Team", icon: Users, desc: "Multiple participants per team" },
                  ].map(({ value, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange("participationType", value)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${formData.participationType === value
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : `border-gray-300 dark:border-gray-600 hover:border-indigo-300`
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          className={`w-5 h-5 ${formData.participationType === value ? "text-indigo-600" : themeClasses.textMuted}`}
                        />
                        <span
                          className={`font-semibold ${formData.participationType === value ? "text-indigo-600" : themeClasses.text}`}
                        >
                          {value}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${formData.participationType === value ? "text-indigo-600" : themeClasses.textMuted}`}
                      >
                        {desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Size (if Team is selected) */}
              {formData.participationType === "Team" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                      Minimum Team Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={formData.teamMin}
                      onChange={(e) => handleInputChange("teamMin", Number.parseInt(e.target.value))}
                      className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    />
                    {errors.teamMin && <p className="text-red-500 text-sm mt-1">{errors.teamMin}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                      Maximum Team Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={formData.teamMin}
                      value={formData.teamMax}
                      onChange={(e) => handleInputChange("teamMax", Number.parseInt(e.target.value))}
                      className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    />
                    {errors.teamMax && <p className="text-red-500 text-sm mt-1">{errors.teamMax}</p>}
                  </div>
                </div>
              )}

              {/* Registration Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Registration Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registrationStart}
                    onChange={(e) => handleInputChange("registrationStart", e.target.value)}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  {errors.registrationStart && <p className="text-red-500 text-sm mt-1">{errors.registrationStart}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Registration End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registrationEnd}
                    onChange={(e) => handleInputChange("registrationEnd", e.target.value)}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  {errors.registrationEnd && <p className="text-red-500 text-sm mt-1">{errors.registrationEnd}</p>}
                </div>
              </div>

              {/* Registration Limit */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                  Registration Limit (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.registrationLimit}
                  onChange={(e) => handleInputChange("registrationLimit", e.target.value)}
                  placeholder="Maximum number of registrations"
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
              </div>

              {/* Prize Pool */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                  Prize Pool (Optional)
                </label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`}>
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={formData.prizePool}
                    onChange={(e) => handleInputChange("prizePool", e.target.value)}
                    placeholder="0"
                    className={`w-full pl-8 pr-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              {/* Hide Contact */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hideContact"
                  checked={formData.hideContact}
                  onChange={(e) => handleInputChange("hideContact", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="hideContact" className={`text-sm ${themeClasses.textSecondary}`}>
                  Hide contact details from participants
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Additional Information</h2>
                <p className={themeClasses.textSecondary}>Add more details to make your event stand out</p>
              </div>

              {/* Categories */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-4`}>Categories</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-4 py-2 rounded-full border font-medium transition-all ${formData.categories.includes(category)
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg"
                        : `${themeClasses.button} border`
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills to be Assessed */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-4`}>
                  Skills to be Assessed
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillOptions.map((skill) => {
                    const isSelected = formData.skillsToBeAssessed
                      .split(",")
                      .map((s) => s.trim())
                      .includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1 rounded-full text-sm border font-medium transition-all ${isSelected
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-lg"
                          : `${themeClasses.button} border`
                          }`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
                <textarea
                  value={formData.skillsToBeAssessed}
                  onChange={(e) => handleInputChange("skillsToBeAssessed", e.target.value)}
                  placeholder="Enter skills separated by commas"
                  rows={2}
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                  Detailed Description
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => handleInputChange("details", e.target.value)}
                  placeholder="Provide detailed information about the event, rules, format, etc."
                  rows={6}
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="contact@example.com"
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="+91 9876543210"
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              {/* Rules and Eligibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Eligibility Criteria
                  </label>
                  <textarea
                    value={formData.eligibility}
                    onChange={(e) => handleInputChange("eligibility", e.target.value)}
                    placeholder="Who can participate in this event?"
                    rows={4}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                    Rules & Guidelines
                  </label>
                  <textarea
                    value={formData.rules}
                    onChange={(e) => handleInputChange("rules", e.target.value)}
                    placeholder="Important rules and guidelines for participants"
                    rows={4}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className={`flex items-center gap-2 px-6 py-3 ${themeClasses.button} border rounded-xl font-medium transition-all hover:shadow-lg`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}

              {isEditing && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 ${themeClasses.dangerButton} rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Event
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-3 ${themeClasses.primaryButton} rounded-xl font-medium transition-all hover:shadow-lg`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 ${themeClasses.successButton} rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEditing ? "Update Event" : "Create Event"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default EventRegistrationForm
