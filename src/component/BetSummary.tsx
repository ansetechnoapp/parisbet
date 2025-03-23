'use client';
import { createTicket } from '@/lib/supabase';
import React, { useState } from 'react';

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
  bets: Array<{
    betType: string;
    selectedNumbers: number[];
    betAmount: number;
  }>;
}

const BetSummary: React.FC<BetSummaryProps> = ({
  betAmount,
  betType,
  betTypes,
  selectedNumbers,
  phoneNumber,
  setPhoneNumber,
  bets
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotalAmount = () => {
    return bets.reduce((total, bet) => total + bet.betAmount, 0) +
      (selectedNumbers.length === betTypes[betType].slots ? betAmount : 0);
  };

  const calculateMaxWin = () => {
    const totalWinnings = bets.reduce((total, bet) => total + (bet.betAmount * 70), 0);
    const currentBetWinnings = selectedNumbers.length === betTypes[betType].slots ? betAmount * 70 : 0;
    return totalWinnings + currentBetWinnings;
  };

  const validatePhoneNumber = (number: string) => {
    return /^[0-9]{8}$|^[0-9]{10}$/.test(number);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setError(null);
  };

  const canSubmit = () => {
    return (bets.length > 0 || selectedNumbers.length === betTypes[betType].slots) &&
      validatePhoneNumber(phoneNumber) &&
      calculateTotalAmount() >= 100 &&
      calculateTotalAmount() <= 100000;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Le numéro de téléphone doit contenir 8 ou 10 chiffres");
      return;
    }
    

    const totalAmount = calculateTotalAmount();
    if (totalAmount < 100 || totalAmount > 100000) {
      setError("Le montant total doit être entre 100 et 100.000 FCFA");
      return;
    }

    if (bets.length === 0 && selectedNumbers.length !== betTypes[betType].slots) {
      setError("Veuillez ajouter au moins un pari");
      return;
    }
    createTicket({
      phone_number: phoneNumber,
      ticket_number: `TKT-${Date.now()}`,
      date: new Date().toISOString(),
      type: betType as 'Poto' | 'Tout chaud' | '3 Nape' | '4 Nape' | 'Perm',
      numbers: bets.flatMap(bet => bet.selectedNumbers),
      amount: calculateTotalAmount(),
      status: 'pending'
    });

    setIsSubmitting(true);
    try {
      // Add submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Clear form or redirect to success page
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Une erreur est survenue. Veuillez réessayer. **${errorMessage}**`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-1/3 mt-6 md:mt-0">
      <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-4 md:p-6 sticky top-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Récapitulatif</h2>

        {selectedNumbers.length === betTypes[betType].slots && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <div className="font-medium text-green-700">Pari en cours - Prêt à ajouter!</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {selectedNumbers.map((num, i) => (
                <span key={i} className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {num}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Type: {betType} - Mise: {betAmount} FCFA
            </div>
          </div>
        )}

        {bets.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Paris ajoutés ({bets.length})</h3>
            <div className="space-y-3">
              {bets.map((bet, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex gap-2 flex-wrap">
                    {bet.selectedNumbers.map((num, i) => (
                      <span key={i} className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {num}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Type: {bet.betType} - Mise: {bet.betAmount} FCFA
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-bold mb-4">Prix total</h2>
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-600">Gains max.</div>
            <div className="text-xl font-bold text-green-600">{calculateMaxWin()} FCFA</div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-600">(Min: 100F - Max: 100.000F)</div>
            <div className="text-xl font-bold text-green-600">{calculateTotalAmount()} FCFA</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              placeholder="8 ou 10 chiffres"
              className={`w-full p-2 border rounded transition-colors ${error ? 'border-red-500' : phoneNumber && !validatePhoneNumber(phoneNumber)
                ? 'border-yellow-500'
                : validatePhoneNumber(phoneNumber)
                  ? 'border-green-500'
                  : 'border-gray-300'
                }`}
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            {!error && phoneNumber && !validatePhoneNumber(phoneNumber) && (
              <p className="text-yellow-600 text-sm mt-1">
                Le numéro doit contenir 8 ou 10 chiffres
              </p>
            )}
          </div>

          <div className="flex justify-between mb-4">
            <img src="/mtn.png" alt="MTN" className="h-8" />
            <img src="/Moov_Africa_logo.png" alt="Moov" className="h-8" />
            <img src="/celtis.jpg" alt="Celtis" className="h-8" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !canSubmit()}
            className={`w-full py-3 rounded text-center transition-colors ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : canSubmit()
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Traitement...
              </span>
            ) : 'Valider'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BetSummary;
