'use client';
import React from 'react';

interface BetType {
  slots: number;
  description: string;
}

interface BetSummaryProps {
  betAmount: number;
  betType: string;
  betTypes: Record<string, BetType>;
  selectedNumbers: number[];
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const BetSummary: React.FC<BetSummaryProps> = ({
  betAmount,
  betType,
  betTypes,
  selectedNumbers,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <div className="w-full md:w-1/3 mt-6 md:mt-0">
      <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-4 md:p-6 sticky top-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
        <h2 className="text-xl font-bold mb-4">Prix total</h2>
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600">Gains max.</div>
          <div className="text-xl font-bold text-green-600">{betAmount * 70} Fcfa</div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600">(Min: 100F - Max: 100.000F)</div>
          <div className="text-xl font-bold text-green-600">{betAmount} Fcfa</div>
        </div>

       

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            placeholder="8 ou 10 chiffres"
            className="w-full p-2 border border-gray-300 rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-4">
          <img src="/placeholder-mtn.png" alt="MTN" className="h-8" />
          <img src="/placeholder-moov.png" alt="Moov" className="h-8" />
        </div>

        <form>
          <button 
            type="submit"
            className={`w-full py-3 rounded text-center ${
              selectedNumbers.length === betTypes[betType].slots && phoneNumber
                ? 'bg-green-600 text-white' 
                : 'bg-gray-300 text-gray-600'
            }`}
            disabled={selectedNumbers.length !== betTypes[betType].slots || !phoneNumber}
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default BetSummary;
