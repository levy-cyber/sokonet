import React from 'react';

const EmergencyAlert = ({ message }) => {
  return (
    <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
      <p className="font-semibold">Safety reminder</p>
      <p className="mt-2 text-gray-200">{message}</p>
    </div>
  );
};

export default EmergencyAlert;
