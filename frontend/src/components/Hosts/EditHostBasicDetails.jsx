import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Pages/Navbar";
import Footer from "../Pages/Footer";

export default function EditHostBasicDetails() {
  const { id } = useParams(); // eventId from URL
  const navigate = useNavigate();

  // State setup
  const [visibility, setVisibility] = useState("public");
  const [mode, setMode] = useState("online");
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [festival, setFestival] = useState("");
  const [skillsToBeAssessed, setSkillsToBeAssessed] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Hackathon");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [registrationFee, setRegistrationFee] = useState(0);

  const [participationType, setParticipationType] = useState("Individual");
  const [teamMin, setTeamMin] = useState(1);
  const [teamMax, setTeamMax] = useState(5);
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [registrationLimit, setRegistrationLimit] = useState("");
  const [hideContact, setHideContact] = useState(false);

  const allCategories = [
    "Coding", "Business", "Design", "Marketing", "Finance",
    "Art", "Robotics", "Public Speaking", "Analytics"
  ];

  const handleCategoryToggle = (c) => {
    if (categories.includes(c)) {
      setCategories(categories.filter(x => x !== c));
    } else {
      setCategories([...categories, c]);
    }
  };

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/event/${id}`);
        const e = res.data.event || res.data; // adjust based on your response structure
        setVisibility(e.visibility || "public");
        setMode(e.mode || "online");
        setCategories(e.categories || []);
        setTitle(e.title || "");
        setWebsite(e.website || "");
        setFestival(e.festival || "");
        setSkillsToBeAssessed(e.skillsToBeAssessed || "");
        setDescription(e.description || "");
        setEventType(e.eventType || "Hackathon");
        setVenue(e.venue || "");
        setDate(e.date ? new Date(e.date).toISOString().slice(0, 16) : ""); // format for input

        setParticipationType(e.participationType || "Individual");
        setTeamMin(e.teamMin || 1);
        setTeamMax(e.teamMax || 5);
        setRegistrationStart(e.registrationStart ? new Date(e.registrationStart).toISOString().slice(0, 16) : "");
        setRegistrationEnd(e.registrationEnd ? new Date(e.registrationEnd).toISOString().slice(0, 16) : "");
        setRegistrationLimit(e.registrationLimit || "");
        setHideContact(e.hideContact || false);
        setRegistrationFee(e.registrationFee || 0);
      } catch (err) {
        console.error("Error fetching event:", err);
        alert("Failed to load event details.");
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !eventType) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      title,
      description,
      eventType,
      date,
      venue,
      mode,
      visibility,
      categories,
      skillsToBeAssessed,
      website,
      festival,
      participationType,
      teamMin: participationType === "Individual" ? null : teamMin,
      teamMax: participationType === "Individual" ? null : teamMax,
      registrationStart,
      registrationEnd,
      registrationLimit,
      hideContact,
      registrationFee,
    };

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/event/${id}`, payload);
      alert("Event updated successfully!");
      navigate("/events"); // adjust to your desired redirect page
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Error updating event. Check console for details.");
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-20 mb-10 px-6 py-10 space-y-4 bg-purple-50 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-purple-800">✏️ Edit Event Details</h2>

        {/* Basic Fields */}
        <div className="bg-white rounded-2xl p-6 space-y-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border rounded-lg p-3" required />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border rounded-lg p-3" required />
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" className="w-full border rounded-lg p-3" />
          <input value={festival} onChange={(e) => setFestival(e.target.value)} placeholder="Festival (Optional)" className="w-full border rounded-lg p-3" />
          <input value={skillsToBeAssessed} onChange={(e) => setSkillsToBeAssessed(e.target.value)} placeholder="Skills to be assessed" className="w-full border rounded-lg p-3" />
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="w-full border rounded-lg p-3" />
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded-lg p-3" />
        </div>

        {/* Event Type */}
        <div className="bg-white rounded-2xl p-6">
          <label className="block mb-2">Event Type</label>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full border rounded-lg p-3" required>
            <option value="">Select Event Type</option>
            {["Hackathon", "Workshop", "Seminar", "Quiz", "Conference", "Case Study", "Creative Showcase", "Other"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl p-6">
          <label className="block mb-2">Visibility</label>
          <div className="flex gap-3">
            {["public", "invite", "both"].map((v) => (
              <button key={v} type="button"
                onClick={() => setVisibility(v)}
                className={`border p-3 rounded-lg ${visibility === v ? "bg-purple-200" : ""}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div className="bg-white rounded-2xl p-6">
          <label className="block mb-2">Mode</label>
          <div className="flex gap-3">
            {["online", "offline", "hybrid"].map((m) => (
              <button key={m} type="button"
                onClick={() => setMode(m)}
                className={`border p-3 rounded-lg ${mode === m ? "bg-purple-200" : ""}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-6">
          <label className="block mb-2">Categories</label>
          <div className="flex gap-2 flex-wrap">
            {allCategories.map(c => (
              <button type="button" key={c} onClick={() => handleCategoryToggle(c)}
                className={`px-3 py-1 border rounded-full ${categories.includes(c) ? "bg-purple-600 text-white" : ""}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Registration Details */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <label>Participation Type</label>
          <div className="flex gap-4">
            {["Individual", "Team"].map(type => (
              <button key={type} type="button" onClick={() => setParticipationType(type)}
                className={`border px-4 py-2 rounded-lg ${participationType === type ? "bg-blue-500 text-white" : ""}`}>
                {type}
              </button>
            ))}
          </div>

          {participationType === "Team" && (
            <div className="flex gap-2">
              <input type="number" value={teamMin} onChange={(e) => setTeamMin(e.target.value)} placeholder="Team Min" className="border rounded p-2" />
              <input type="number" value={teamMax} onChange={(e) => setTeamMax(e.target.value)} placeholder="Team Max" className="border rounded p-2" />
            </div>
          )}

          <label>Registration Start</label>
          <input type="datetime-local" value={registrationStart} onChange={(e) => setRegistrationStart(e.target.value)} className="w-full border rounded p-2" />

          <label>Registration End</label>
          <input type="datetime-local" value={registrationEnd} onChange={(e) => setRegistrationEnd(e.target.value)} className="w-full border rounded p-2" />

          <label>Registration Limit</label>
          <input type="number" value={registrationLimit} onChange={(e) => setRegistrationLimit(e.target.value)} placeholder="Max Registrations" className="w-full border rounded p-2" />

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={hideContact} onChange={() => setHideContact(!hideContact)} />
            Hide Contact Details
          </label>

          <label className="block mb-2">Registration Fee (INR)</label>
          <input
            type="number"
            min="0"
            value={registrationFee}
            onChange={(e) => setRegistrationFee(Number.parseFloat(e.target.value) || 0)}
            placeholder="Registration Fee"
            className="w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500">Set to 0 if the event is free.</p>
        </div>

        <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-full">Update Event</button>
      </form >
      <Footer />
    </>
  );
}
