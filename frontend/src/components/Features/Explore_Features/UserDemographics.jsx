import React from 'react';

const UserDemographics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] to-[#1c1444] text-white p-10">
      <h1 className="text-4xl font-bold text-indigo-300 mb-6">User Demographics</h1>
      <ul className="text-lg space-y-4">
        <li>• Course & year data</li>
        <li>• Gender & participation ratio</li>
      </ul>
    </div>
  );
};

export default UserDemographics;
