'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import NavBar from '@/component/NavBar';
import WarningBanner from '@/component/WarningBanner';
import DrawSelector from '@/component/DrawSelector';
import BetAmountSelector from '@/component/BetAmountSelector';
import BetTypeSelector from '@/component/BetTypeSelector';
import NumberSelector from '@/component/NumberSelector';
import MultipleBet from '@/component/MultipleBet';
import BetSummary from '@/component/BetSummary';
import Footer from '@/component/Footer';

export default function Home() {
  const [betType, setBetType] = useState<keyof typeof betTypes>('Poto');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(100);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customNumber, setCustomNumber] = useState('');
  const [directEntryMode, setDirectEntryMode] = useState(true);
  const [directInputNumbers, setDirectInputNumbers] = useState<string[]>([]);
  const [bets, setBets] = useState<Array<{
    betType: keyof typeof betTypes;
    selectedNumbers: number[];
    betAmount: number;
  }>>([]);

  // Types de paris disponibles et leurs configurations
  const betTypes = {
    'Poto': { slots: 1, description: 'Choisissez un numéro et pariez qu\'il sera le premier tiré' },
    'Tout chaud': { slots: 2, description: 'Choisissez deux numéros parmi les cinq tirés' },
    '3 Nape': { slots: 3, description: 'Choisissez trois numéros parmi les cinq tirés' },
    '4 Nape': { slots: 4, description: 'Choisissez quatre numéros parmi les cinq tirés' },
    'Perm': { slots: 5, description: 'Choisissez cinq numéros et pariez sur toutes les combinaisons possibles' },
  };

  // Ajout d'explications pour chaque type de pari
  const betExplanations: { [key: string]: string } = {
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

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(num => num !== number));
    } else {
      if (selectedNumbers.length < betTypes[betType].slots) {
        const newSelectedNumbers = [...selectedNumbers, number];
        setSelectedNumbers(newSelectedNumbers);

        // If this selection completes the bet, clear the direct input
        if (newSelectedNumbers.length === betTypes[betType].slots) {
          setDirectInputNumbers(Array(betTypes[betType].slots).fill(''));
        }
      }
    }
  };

  const handleCustomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomNumber(e.target.value);
  };

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

  const handleCustomNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const number = parseInt(customNumber);
      if (!isNaN(number) && number >= 1 && number <= 90 && !selectedNumbers.includes(number)) {
        const newSelectedNumbers = [...selectedNumbers];
        newSelectedNumbers[index] = number;
        setSelectedNumbers(newSelectedNumbers);
        setCustomNumber('');
        setEditingIndex(null);
      }
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setCustomNumber('');
    }
  };

  const startEditing = (index: number) => {
    if (directEntryMode) {
      setEditingIndex(index);
      setCustomNumber(selectedNumbers[index] ? selectedNumbers[index].toString() : '');
    }
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setEditingIndex(null);
    setCustomNumber('');
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
  }, [betType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Head>
        <title>Jeu de Loterie</title>
        <meta name="description" content="Interface de jeu de loterie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WarningBanner />
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
            setBetType={setBetType as (type: string) => void}
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

      <Footer />
    </div>
  );
}
