import React, { useState } from "react";
import HostBasicDetails from "./HostBasicDetails";
import RegistrationDetails from "./HostRegistration";
import { HiMiniHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";


export default function HostForm() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const steps = [
    { id: 1, label: "Basic Details" },
    { id: 2, label: "Registration Details" },
  ];
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl  mx-auto px-6 py-8">
      {/* Top Progress Indicator */}
      <div className="flex items-center space-x-4 mb-10">
        <div  onClick={() => navigate("/")} className="cursor-pointer text-3xl">
        <HiMiniHome className="text-3xl" />
        </div>
        <div className="flex items-center gap-4">
          {steps.map((s, index) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition
        ${step === s.id
                  ? s.id === 1
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-blue-700 text-white border-blue-700"
                  : "bg-gray-200 text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-300"
                }`}
              onClick={() => setStep(s.id)}
            >
              <span className="font-bold text-sm">{s.id}</span>
              <span className="text-sm">{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Step Content */}
      {step === 1 && <HostBasicDetails />}
      {step === 2 && <RegistrationDetails />}

      {/* Footer Buttons */}
      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <button
            onClick={back}
            className="px-6 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length ? (
          <button
            onClick={next}
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={() => alert("Submit logic goes here")}
            className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
