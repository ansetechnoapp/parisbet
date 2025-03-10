'use client';
import React from 'react';

const MultipleBet: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="font-medium mb-4">Place un pari multiple</h2>
      <p className="text-sm text-gray-600 mb-4">
        Tu peux créer jusqu&apos;à 10 combinaisons par ticket
      </p>
      <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded">
        <span className="mr-2">+</span> Ajouter un pari
      </button>
    </div>
  );
};

export default MultipleBet;
