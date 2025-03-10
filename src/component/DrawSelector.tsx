'use client';
import React from 'react';

interface Draw {
  id: number;
  name: string;
  time: string;
  icon: string;
}

interface DrawSelectorProps {
  availableDraws: Draw[];
  selectedDraw: Draw;
  setSelectedDraw: (draw: Draw) => void;
}

const DrawSelector: React.FC<DrawSelectorProps> = ({ 
  availableDraws, 
  selectedDraw, 
  setSelectedDraw 
}) => {
  return (
    <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Prochains tirages</h1>
      <p className="text-gray-600 mb-6">Sélectionne un tirage pour lequel tu veux parier.</p>

      {/* Grille des tirages */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-4">
        {availableDraws.map((draw) => (
          <div 
            key={draw.id} 
            className={`rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-200 ${
              selectedDraw.id === draw.id 
                ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105' 
                : 'bg-white hover:bg-green-50 border border-gray-100'
            }`}
            onClick={() => setSelectedDraw(draw)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">{draw.icon}</span>
              <div>
                <div className={`font-medium ${selectedDraw.id === draw.id ? 'text-white' : 'text-gray-800'}`}>
                  {draw.name}
                </div>
                <div className={`text-sm ${selectedDraw.id === draw.id ? 'text-green-100' : 'text-gray-500'}`}>
                  {draw.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawSelector;
