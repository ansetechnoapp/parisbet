'use client';
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface BetType {
  slots: number;
  description: string;
}

interface BetTypeSelectorProps {
  betType: string;
  setBetType: (type: string) => void;
  betTypes: Record<string, BetType>;
  betExplanations: Record<string, string>;
  setSelectedNumbers: (numbers: number[]) => void;
}

const BetTypeSelector: React.FC<BetTypeSelectorProps> = ({
  betType,
  setBetType,
  betTypes,
  betExplanations,
  setSelectedNumbers
}) => {
  const [hoveredInfoType, setHoveredInfoType] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <div>
        <div className="flex items-center mb-3">
          <h2 className="font-semibold text-gray-800">TYPE DE PARI</h2>
          <div className="ml-2 relative">
            <FaInfoCircle 
              className="text-gray-500 cursor-pointer hover:text-green-600 transition-colors" 
              onMouseEnter={() => setHoveredInfoType('main')}
              onMouseLeave={() => setHoveredInfoType(null)}
            />
            {hoveredInfoType === 'main' && (
              <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-white shadow-lg rounded-md text-xs text-gray-700 z-50">
                <p className="mb-2 font-semibold">Types de paris disponibles :</p>
                {Object.entries(betExplanations).map(([type, explanation]) => (
                  <div key={type} className="mb-2">
                    <p className="font-medium">{type}</p>
                    <p>{explanation}</p>
                  </div>
                ))}
                <p className="mt-2 text-green-600">À savoir : les prix ne sont pas fixe, la mise minimale est de 50F donc la personne peut misé la somme qu'elle veut.</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(betTypes).map((type) => (
            <div className="inline-flex items-center" key={type}>
              <button
                onClick={() => {
                  setBetType(type);
                  setSelectedNumbers([]);
                }}
                className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
                  betType === type 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                {type}
              </button>
              <div className="relative ml-1 z-10">
                <FaInfoCircle 
                  className="text-gray-500 cursor-pointer hover:text-green-600 transition-colors"
                  onMouseEnter={() => setHoveredInfoType(type)}
                  onMouseLeave={() => setHoveredInfoType(null)}
                />
                {hoveredInfoType === type && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[calc(100vw-2rem)] md:w-64 p-3 bg-white shadow-lg rounded-md text-xs text-gray-700 z-50">
                    <div className="text-sm font-medium mb-1">{type}</div>
                    <p>{betExplanations[type] || "Aucune explication"}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetTypeSelector;
