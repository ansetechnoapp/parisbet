'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface BetAmountSelectorProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  pricingNote: string;
}

const BetAmountSelector: React.FC<BetAmountSelectorProps> = ({
  betAmount,
  setBetAmount,
  pricingNote,
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      // Ensure the amount is between 50 and 100000
      const clampedValue = Math.min(Math.max(value, 50), 100000);
      setBetAmount(clampedValue);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="font-medium mb-2">MONTANT DU PARI</h2>
      <p className="text-sm text-gray-600 mb-4">
        {pricingNote}
      </p>

      <div className="flex items-center space-x-4">
        <input
          type="number"
          min="50"
          max="100000"
          value={betAmount}
          onChange={handleAmountChange}
          className="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <span className="text-gray-600">FCFA</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
          <button
            key={amount}
            onClick={() => setBetAmount(amount)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${betAmount === amount
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {amount} FCFA
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetAmountSelector;
