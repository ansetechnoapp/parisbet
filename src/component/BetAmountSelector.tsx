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
  pricingNote
}) => {
  const [manualAmount, setManualAmount] = useState<string>(betAmount.toString());
  const [isManualMode, setIsManualMode] = useState<boolean>(true);

  // Update manual input field when betAmount changes from outside
  useEffect(() => {
    setManualAmount(betAmount.toString());
  }, [betAmount]);

  const handleManualChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setManualAmount(value);
  };

  const handleManualBlur = () => {
    const amount = parseInt(manualAmount);
    if (!isNaN(amount) && amount >= 50) {
      setBetAmount(amount);
    } else {
      // Reset to minimum if invalid
      setBetAmount(50);
      setManualAmount('50');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleManualBlur();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium">Entre ta mise</h2>
        <button
          onClick={() => setIsManualMode(!isManualMode)}
          className="text-sm px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700"
        >
          {isManualMode ? 'Mode prédéfini' : 'Mode manuel'}
        </button>
      </div>
      
      {isManualMode ? (
        <div className="mb-4 flex">
          <div className="relative flex-grow">
            <input
              type="text"
              value={manualAmount}
              onChange={handleManualChange}
              onBlur={handleManualBlur}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-right focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Entrez le montant"
            />
          </div>
          <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 flex items-center">
            Fcfa
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-4">Sélectionnez un montant prédéfini :</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[50, 100, 200, 500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setBetAmount(amount);
                  setManualAmount(amount.toString());
                }}
                className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
                  betAmount === amount 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </>
      )}

      <input
        type="range"
        min="50"
        max="10000"
        step="50"
        value={betAmount}
        onChange={(e) => {
          const newAmount = parseInt(e.target.value);
          setBetAmount(newAmount);
          setManualAmount(newAmount.toString());
        }}
        className="w-full"
      />
      <div className="text-sm text-gray-600 mt-2 flex items-center">
        <span className="mr-2">(Mise minimale : 50 Fcfa)</span>
        <div className="relative group">
          <FaInfoCircle className="text-gray-500 cursor-pointer hover:text-green-600 transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[calc(100vw-2rem)] md:w-64 p-2 bg-white shadow-lg rounded-md text-xs text-gray-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10">
            {pricingNote}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetAmountSelector;
