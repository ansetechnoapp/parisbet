'use client';
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface BetType {
  slots: number;
  description: string;
}

interface NumberSelectorProps {
  betType: string;
  betTypes: Record<string, BetType>;
  betExplanations: Record<string, string>;
  selectedNumbers: number[];
  setSelectedNumbers: (numbers: number[]) => void;
  directEntryMode: boolean;
  setDirectEntryMode: (mode: boolean) => void;
  directInputNumbers: string[];
  setDirectInputNumbers: (inputs: string[]) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  customNumber: string;
  setCustomNumber: (value: string) => void;
  handleNumberClick: (number: number) => void;
  handleCustomNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDirectInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleDirectInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  handleCustomNumberKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  startEditing: (index: number) => void;
  handleFlashClick: () => void;
  clearSelection: () => void;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  betType,
  betTypes,
  betExplanations,
  selectedNumbers,
  setSelectedNumbers,
  directEntryMode,
  setDirectEntryMode,
  directInputNumbers,
  setDirectInputNumbers,
  editingIndex,
  setEditingIndex,
  customNumber,
  setCustomNumber,
  handleNumberClick,
  handleCustomNumberChange,
  handleDirectInputChange,
  handleDirectInputKeyDown,
  handleCustomNumberKeyDown,
  startEditing,
  handleFlashClick,
  clearSelection
}) => {

  
  const getTotalSlots = (type: string) => {
    return type === 'Perm' ? 30 : 5;
  };

  const handleSomeEvent1 = () => {
    setSelectedNumbers([1, 2, 3]);
    setEditingIndex(null);
    setCustomNumber('');
    setDirectInputNumbers(['1', '2', '3']);
  };


  const totalSlots = getTotalSlots(betType);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h2 className="font-medium">ENTRE TES NUMÉROS</h2>
          <div className="ml-2 relative group">
            <FaInfoCircle className="text-gray-500 cursor-pointer hover:text-green-600 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[calc(100vw-2rem)] md:w-64 p-3 bg-white shadow-lg rounded-md text-xs text-gray-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10">
              Saisis {betTypes[betType].slots} numéros entre 1 et 90 pour ton pari de type {betType}.
              {betType in betExplanations && (
                <p className="mt-1">{betExplanations[betType]}</p>
              )}
            </div>
          </div>
        </div>
        <button 
          className={`px-3 py-1.5 rounded-lg border ${
            directEntryMode 
              ? 'bg-green-600 text-white border-green-700 shadow-sm' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } text-sm font-medium transition-all duration-200 flex items-center`}
          onClick={() => setDirectEntryMode(!directEntryMode)}
        >
          <span className="mr-1">{directEntryMode ? '✏️' : '✏️'}</span>
          Saisie directe {directEntryMode ? '✓' : ''}
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Saisis {betTypes[betType].slots} numéros entre 1 et 90
      </p>

      <div className="flex space-x-2 mb-4"> 
        <button 
          onClick={handleFlashClick}
          className="flex items-center bg-white border border-gray-300 rounded px-3 py-1"
        >
          <span className="text-yellow-500 mr-1">⚡</span> Flash
        </button>
        <button 
          onClick={clearSelection}
          className="flex items-center bg-white border border-gray-300 rounded px-3 py-1"
        >
          <span className="mr-1">🗑️</span> Effacer
        </button>
      </div>

      {/* Affichage des numéros sélectionnés ou interface de saisie directe */}
      {directEntryMode ? (
        <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4">
          <p className="text-sm text-gray-600 mb-1">Entrez directement vos numéros:</p>
          <div className="flex flex-wrap gap-6">
            {[...Array(totalSlots)].map((_, index) => {
              const isDisabled = index >= betTypes[betType].slots;
              return (
                <div key={index} className="flex flex-col items-center">
                  <label className={`text-xs mb-0.5 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                    N°{index + 1}
                  </label>
                  <div className="relative w-full">
                    <input
                      id={`direct-input-${index}`}
                      type="number"
                      min="1"
                      max="90"
                      placeholder={isDisabled ? "X" : "1-90"}
                      value={isDisabled ? "X" : (directInputNumbers[index] || '')}
                      onChange={(e) => handleDirectInputChange(e, index)}
                      onKeyDown={(e) => handleDirectInputKeyDown(e, index)}
                      disabled={isDisabled}
                      className={`w-full h-20 p-1 border rounded-full text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium
                        ${isDisabled 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                          : 'border-gray-300'
                        }`}
                    />
                    {selectedNumbers[index] && !isDisabled && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(totalSlots)].map((_, index) => {
            const isDisabled = index >= betTypes[betType].slots;
            return (
              <div 
                key={index} 
                className={`w-12 h-12 rounded flex items-center justify-center border ${
                  isDisabled 
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : selectedNumbers[index] 
                      ? 'border-green-600 bg-white text-green-600' 
                      : 'border-gray-300 bg-gray-200 text-gray-400'
                } ${!isDisabled && directEntryMode ? 'cursor-pointer' : ''}`}
                onClick={() => !isDisabled && startEditing(index)}
              >
                {editingIndex === index && !isDisabled ? (
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={customNumber}
                    onChange={handleCustomNumberChange}
                    onKeyDown={(e) => handleCustomNumberKeyDown(e, index)}
                    className="w-10 h-10 text-center outline-none border-none bg-transparent"
                    autoFocus
                  />
                ) : (
                  isDisabled ? 'X' : (selectedNumbers[index] || 'X')
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grille de numéros complète */}
      {!directEntryMode && (
        <div className="grid grid-cols-6 md:grid-cols-9 gap-2 mb-6">
          {[...Array(90)].map((_, index) => {
            const number = index + 1;
            return (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-medium transition-all ${
                  selectedNumbers.includes(number) 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                    : 'bg-white hover:bg-green-50 border border-gray-200'
                }`}
              >
                {number}
              </button>
            );
          })}
        </div>
      )}

      <button className='hidden' onClick={handleSomeEvent1}>Click me</button>
    </div>
  );
};

export default NumberSelector;
