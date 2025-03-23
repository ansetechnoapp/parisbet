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
  clearSelection
}) => {
  const getTotalSlots = (type: string) => {
    return type === 'Perm' ? 30 : 5;
  };

  const totalSlots = getTotalSlots(betType);
  const remainingSlots = betTypes[betType].slots - selectedNumbers.length;

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
      </div>

      <p className={`text-sm ${remainingSlots > 0 ? 'text-gray-600' : 'text-green-600 font-medium'} mb-4`}>
        {remainingSlots > 0
          ? `Il te reste ${remainingSlots} numéro${remainingSlots > 1 ? 's' : ''} à sélectionner`
          : 'Sélection complète! Tu peux ajouter ce pari ou le valider directement.'
        }
      </p>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={clearSelection}
          className="flex items-center bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
        >
          <span className="mr-1">🗑️</span> Effacer
        </button>
      </div>

      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Entrez vos numéros (entre 1 et 90):</p>
        <div className="flex flex-wrap gap-6">
          {[...Array(totalSlots)].map((_, index) => {
            const isDisabled = index >= betTypes[betType].slots;
            const isFilled = selectedNumbers[index] !== undefined;
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
                    value={directInputNumbers[index] || ''}
                    onChange={(e) => handleDirectInputChange(e, index)}
                    onKeyDown={(e) => handleDirectInputKeyDown(e, index)}
                    disabled={isDisabled}
                    className={`w-full h-20 p-1 border rounded-full text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium
                      ${isDisabled
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : isFilled
                          ? 'border-green-500 bg-green-50'
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
    </div>
  );
};

export default NumberSelector;
