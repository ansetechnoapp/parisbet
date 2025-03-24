'use client';
import React from 'react';

interface MultipleBetProps {
  onAddBet: () => void;
  onRemoveBet: (index: number) => void;
  bets: Array<{
    betType: string;
    selectedNumbers: number[];
    betAmount: number;
  }>;
  currentBetValid: boolean;
  maxBetsReached: boolean;
}

const MultipleBet: React.FC<MultipleBetProps> = ({
  onAddBet,
  onRemoveBet,
  bets,
  currentBetValid,
  maxBetsReached
}) => {
  const handleAddBet = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentBetValid && !maxBetsReached) {
      onAddBet();
    }
  };

  return (
    <div className="mb-8">
      <h2 className="font-medium mb-4">Paris multiples</h2>
      <p className="text-sm text-gray-600 mb-4">
        Tu peux créer jusqu&apos;à 10 combinaisons par ticket
      </p>

      {/* List of existing bets */}
      {bets.length > 0 && (
        <div className="mb-4 space-y-3">
          {bets.map((bet, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
              <div>
                <span className="font-medium">{bet.betType}</span>
                <div className="flex gap-2 mt-1">
                  {bet.selectedNumbers.map((num, i) => (
                    <span key={i} className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {num}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Mise: {bet.betAmount} FCFA
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveBet(index);
                }}
                className="text-red-500 hover:text-red-600 p-2"
                aria-label="Supprimer ce pari"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add bet button */}
      <button
        onClick={handleAddBet}
        disabled={!currentBetValid || maxBetsReached}
        className={`flex items-center px-4 py-2 rounded ${currentBetValid && !maxBetsReached
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
      >
        <span className="mr-2">+</span>
        {maxBetsReached
          ? 'Maximum de paris atteint'
          : currentBetValid
            ? 'Ajouter ce pari'
            : 'Complétez votre pari actuel'
        }
      </button>

      {/* Error message for max bets */}
      {maxBetsReached && (
        <p className="text-red-500 text-sm mt-2">
          Vous avez atteint le maximum de 10 paris par ticket
        </p>
      )}
    </div>
  );
};

export default MultipleBet;
