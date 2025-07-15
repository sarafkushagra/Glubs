import React, { useState } from "react";
import { UploadCloud, Globe, Lock, Users, X } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

export default function HostBasicDetails() {
  const [logo, setLogo] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [mode, setMode] = useState("online");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "Coding", "Business", "Design", "Marketing", "Finance",
    "Art", "Robotics", "Public Speaking", "Analytics"
  ];

  const opportunityTypes = [
    "Hackathon", "Innovation Challenge", "Quiz", "Case Study",
    "Workshop", "Conference", "Creative Showcase"
  ];

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 bg-purple-50 rounded-xl shadow-2xl animate-fadeIn">
      <h2 className="text-5xl font-extrabold text-black text-center drop-shadow-md">🚀 Host Basic Details</h2>

      {/* Upload Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Opportunity Logo</label>
        <label className="border-dashed border-2 border-purple-400 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-purple-600 cursor-pointer transition">
          {logo ? (
            <img src={logo} alt="Uploaded Logo" className="h-28 object-contain rounded-md shadow-md" />
          ) : (
            <>
              <UploadCloud size={36} className="mb-2 opacity-70 text-purple-500" />
              <p className="font-medium">Click to upload Logo</p>
              <p className="text-xs text-gray-400">Max 1MB Image</p>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
        </label>
      </div>

      {/* Opportunity Type */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Opportunity Type</label>
        <select className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
          {opportunityTypes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Visibility */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Visibility</label>
        <div className="flex gap-3">
          {["public", "invite", "both"].map((value) => (
            <button
              key={value}
              onClick={() => setVisibility(value)}
              className={`flex-1 border rounded-lg p-3 text-sm font-medium transition duration-200 ${
                visibility === value
                  ? "border-purple-500 bg-purple-100 text-purple-700"
                  : "hover:border-purple-400 text-gray-600 bg-gray-50"
              }`}
            >
              {value === "public" && <Globe size={16} className="inline mr-2" />}
              {value === "invite" && <Lock size={16} className="inline mr-2" />}
              {value === "both" && <Users size={16} className="inline mr-2" />}
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Mode</label>
        <div className="flex gap-3">
          {["online", "offline"].map((value) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex-1 border rounded-lg p-3 text-sm font-medium transition duration-200 ${
                mode === value
                  ? "border-purple-500 bg-purple-100 text-purple-700"
                  : "hover:border-purple-400 text-gray-600 bg-gray-50"
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Categories (Multiple)</label>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => handleCategoryToggle(c)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
                selectedCategories.includes(c)
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((c, i) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {c}
              <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => handleCategoryToggle(c)} />
            </span>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-5">
        {[
          { label: "Opportunity Title", placeholder: "Opportunity Title" },
          { label: "Your Organisation", placeholder: "Organisation Name" },
          { label: "Website URL", placeholder: "https://" },
          { label: "Festival (Optional)", placeholder: "Festival Name" },
          { label: "Skills to be Assessed", placeholder: "Skills to be Assessed" },
        ].map(({ label, placeholder }, idx) => (
          <div key={idx}>
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <input
              className="w-full border border-purple-300 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      {/* Rich Text Editor */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Details about Opportunity</label>
        <Editor
          apiKey="dpcro49joeh8pwywnlvu6k14otdwd88tklll2pcvrw7z4vt5"
          init={{
            height: 300,
            menubar: false,
            plugins: ["link", "lists", "table", "code"],
            toolbar:
              "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link table | code",
            content_style: "body { font-family:Inter,sans-serif; font-size:14px }",
          }}
        />
      </div>

      <button className="w-full bg-purple-700 text-white rounded-2xl py-3 font-semibold text-lg hover:bg-purple-800 transition transform hover:scale-[1.02]">
        Continue
      </button>
    </div>
  );
}
