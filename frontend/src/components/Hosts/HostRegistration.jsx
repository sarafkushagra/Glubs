import React, { useState } from 'react';

export default function RegistrationDetails() {
  const [participationType, setParticipationType] = useState('Individual');
  const [teamMin, setTeamMin] = useState(1);
  const [teamMax, setTeamMax] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hideContact, setHideContact] = useState(false);
  const [registrationCount, setRegistrationCount] = useState('');

  return (
    <div className="p-8 max-w-5xl mx-auto bg-purple-50 shadow-xl rounded-2xl border border-purple-200">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Registration Details</h2>

      <p className="text-sm bg-yellow-100 text-yellow-900 p-3 mb-5 rounded-md border-l-4 border-yellow-400">
        For students, listing, assessment & download credits will be unlimited and applicable after the opportunity is approved. Do note, it is mandatory to take registrations on Unstop exclusively to enjoy these benefits.
      </p>

      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-800">Participation Type<span className="text-red-500"> *</span></label>
        <div className="flex gap-4">
          {['Individual', 'Participation as a team'].map(type => (
            <button
              key={type}
              onClick={() => setParticipationType(type)}
              className={`px-5 py-2 rounded-lg transition-all border font-medium ${
                participationType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {participationType === 'Participation as a team' && (
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">Team Size<span className="text-red-500"> *</span></label>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min"
              className="border p-2 rounded-md w-1/2 focus:outline-purple-500"
              value={teamMin}
              onChange={e => setTeamMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="border p-2 rounded-md w-1/2 focus:outline-purple-500"
              value={teamMax}
              onChange={e => setTeamMax(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-800">Registration Start Date & Time<span className="text-red-500"> *</span></label>
        <input
          type="datetime-local"
          className="border p-2 rounded-md w-full focus:outline-purple-500"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-800">Registration End Date & Time<span className="text-red-500"> *</span></label>
        <input
          type="datetime-local"
          className="border p-2 rounded-md w-full focus:outline-purple-500"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <label className="font-medium text-gray-800">Hide your contact details from the opportunity page?</label>
        <input
          type="checkbox"
          checked={hideContact}
          onChange={() => setHideContact(!hideContact)}
          className="w-5 h-5 accent-purple-600"
        />
      </div>

      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-800">Number of Registrations allowed</label>
        <input
          type="number"
          className="border p-2 rounded-md w-full focus:outline-purple-500"
          placeholder="Enter the count if only certain number of participants can apply"
          value={registrationCount}
          onChange={e => setRegistrationCount(e.target.value)}
        />
      </div>

    </div>
  );
}
