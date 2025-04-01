'use client';
import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';

import DrawSelector from '@/components/DrawSelector';
import BetAmountSelector from '@/components/BetAmountSelector';
import BetTypeSelector from '@/components/BetTypeSelector';
import NumberSelector from '@/components/NumberSelector';
import MultipleBet from '@/components/MultipleBet';
import BetSummary from '@/components/BetSummary';
import { BetTypeKey } from '@/lib/supabase';

// Define bet types in a separate object with proper typing
type BetTypeInfo = {
  slots: number;
  description: string;
};
type BetTypesMap = Record<BetTypeKey, BetTypeInfo>;

export default function LottoPage() {
  // Types de paris disponibles et leurs configurations
  const betTypes: BetTypesMap = useMemo(() => ({
    'Poto': { slots: 1, description: 'Choisissez un numéro et pariez qu\'il sera le premier tiré' },
    'Tout chaud': { slots: 2, description: 'Choisissez deux numéros parmi les cinq tirés' },
    '3 Nape': { slots: 3, description: 'Choisissez trois numéros parmi les cinq tirés' },
    '4 Nape': { slots: 4, description: 'Choisissez quatre numéros parmi les cinq tirés' },
    'Perm': { slots: 5, description: 'Choisissez cinq numéros et pariez sur toutes les combinaisons possibles' },
  }), []);

  const [betType, setBetType] = useState<BetTypeKey>('Poto');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(100);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [directInputNumbers, setDirectInputNumbers] = useState<string[]>([]);
  const [bets, setBets] = useState<Array<{
    betType: BetTypeKey;
    selectedNumbers: number[];
    betAmount: number;
  }>>([]);

  // Ajout d'explications pour chaque type de pari
  const betExplanations: Record<string, string> = {
    "Poto": "Règle : Parmi les 5 numéros gagnants, il faut nécessairement trouver le premier numéro. Mise : 50 F, Gain : 2 500 F",
    "Tout chaud": "Règle : Miser sur 2 numéros parmi les 5 numéros gagnants, quelle que soit leur position. Mise : 50 F, Gain : 3 000 F",
    "3 Nape": "Règle : Miser sur 3 numéros parmi les 5 numéros gagnants, quelle que soit leur position. Mise : 50 F, Gain : 4 000 F",
    "Perm": "Règle : Miser sur 5 numéros parmi les 30 numéros gagnants, quelle que soit leur position. Mise : 50 F, Gain : 4 500 F",
    "Champ Total": "Règle : Bloquer un numéro qui doit obligatoirement apparaître parmi les 5 numéros gagnants. Mise : 700 F, Gain : 10 000 F",
  };

  // Message concernant les prix variables
  const pricingNote = "À savoir : les prix ne sont pas fixe, la mise minimale est de 50F donc la personne peut misé la somme qu'elle veut.";

  // Tirages disponibles
  const availableDraws = [
    { id: 1, name: 'Fortune 14H', time: 'Ferme dans 2 heures', icon: '🟡' },
    { id: 2, name: 'Fortune 18H', time: 'Ferme dans 6 heures', icon: '🟡' },
    // { id: 3, name: 'Digital 21H', time: 'Ferme dans 10 heures', icon: '💰' },
    // { id: 4, name: 'Digital 00H', time: 'Ferme dans 13 heures', icon: '💰' },
    // { id: 5, name: 'Star 11H (Sam.)', time: '1 mars 2025', icon: '⭐' },
    // { id: 6, name: 'Star 14H (Sam.)', time: '1 mars 2025', icon: '⭐' },
    // { id: 7, name: 'Star 18H (Sam.)', time: '1 mars 2025', icon: '⭐' },
  ];

  const [selectedDraw, setSelectedDraw] = useState(availableDraws[0]);


  const handleDirectInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...directInputNumbers];
    newInputs[index] = value;
    setDirectInputNumbers(newInputs);

    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 90 && !selectedNumbers.includes(num)) {
      const newSelectedNumbers = [...selectedNumbers];
      newSelectedNumbers[index] = num;
      setSelectedNumbers(newSelectedNumbers);
    }
  };

  const handleDirectInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const number = parseInt(directInputNumbers[index]);
      if (!isNaN(number) && number >= 1 && number <= 90) {
        const newSelectedNumbers = [...selectedNumbers];
        newSelectedNumbers[index] = number;
        setSelectedNumbers(newSelectedNumbers);

        // Clear input field
        const newInputs = [...directInputNumbers];
        newInputs[index] = '';
        setDirectInputNumbers(newInputs);

        // Move focus to next input if available
        if (index < betTypes[betType].slots - 1) {
          const nextInput = document.getElementById(`direct-input-${index + 1}`);
          if (nextInput) nextInput.focus();
        }
      }
    }
  };


  const clearSelection = () => {
    setSelectedNumbers([]);
    setDirectInputNumbers(Array(betTypes[betType].slots).fill(''));
  };

  const handleAddBet = () => {
    if (selectedNumbers.length === betTypes[betType].slots) {
      // Add current bet to bets array
      setBets([...bets, {
        betType,
        selectedNumbers: [...selectedNumbers],
        betAmount
      }]);

      // Clear the current selection for next bet
      clearSelection();
    }
  };

  const handleRemoveBet = (index: number) => {
    setBets(bets.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Initialize empty inputs when bet type changes
    setDirectInputNumbers(Array(betTypes[betType].slots).fill(''));
  }, [betType, betTypes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Head>
        <title>Jeu de Loterie</title>
        <meta name="description" content="Interface de jeu de loterie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row md:space-x-8">
        <div className="w-full md:w-2/3">
          <DrawSelector
            availableDraws={availableDraws}
            selectedDraw={selectedDraw}
            setSelectedDraw={setSelectedDraw}
          />

          <BetAmountSelector
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            pricingNote={pricingNote}
          />

          <BetTypeSelector
            betType={betType}
            setBetType={setBetType}
            betTypes={betTypes}
            betExplanations={betExplanations}
            setSelectedNumbers={setSelectedNumbers}
          />

          <NumberSelector
            betType={betType}
            betTypes={betTypes}
            betExplanations={betExplanations}
            selectedNumbers={selectedNumbers}
            directInputNumbers={directInputNumbers}
            handleDirectInputChange={handleDirectInputChange}
            handleDirectInputKeyDown={handleDirectInputKeyDown}
            clearSelection={clearSelection}
          />

          <MultipleBet
            onAddBet={handleAddBet}
            bets={bets}
            onRemoveBet={handleRemoveBet}
            currentBetValid={selectedNumbers.length === betTypes[betType].slots}
            maxBetsReached={bets.length >= 10}
          />
        </div>

        <BetSummary
          betAmount={betAmount}
          betType={betType}
          betTypes={betTypes}
          selectedNumbers={selectedNumbers}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          bets={bets}
        />
      </main>

    </div>
  );
}
