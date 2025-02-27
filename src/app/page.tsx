'use client';
import { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/component/NavBar';

export default function Home() {
  const [gameFormula, setGameFormula] = useState('Simple');
  const [betType, setBetType] = useState<keyof typeof betTypes>('Poto');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(100);
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [showResults, setShowResults] = useState(false);

  // Types de paris disponibles et leurs configurations
  const betTypes = {
    'Poto': { slots: 1, description: 'Choisissez un numéro et pariez qu\'il sera le premier tiré' },
    'Tout chaud': { slots: 2, description: 'Choisissez deux numéros parmi les cinq tirés' },
    '3 Nape': { slots: 3, description: 'Choisissez trois numéros parmi les cinq tirés' },
    '4 Nape': { slots: 4, description: 'Choisissez quatre numéros parmi les cinq tirés' },
    '5 Nape': { slots: 5, description: 'Choisissez exactement les cinq numéros tirés' },
  };

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




  // interface BetType {
  //   slots: number;
  //   description: string;
  // }

  // interface Draw {
  //   id: number;
  //   name: string;
  //   time: string;
  //   icon: string;
  // }

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(num => num !== number));
    } else {
      if (selectedNumbers.length < betTypes[betType].slots) {
        setSelectedNumbers([...selectedNumbers, number]);
      }
    }
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
  };

  const handleFlashClick = () => {
    const maxSlots = betTypes[betType].slots;
    const randomNumbers: number[] = [];
    while (randomNumbers.length < maxSlots) {
      const randomNum = Math.floor(Math.random() * 90) + 1;
      if (!randomNumbers.includes(randomNum)) {
        randomNumbers.push(randomNum);
      }
    }
    setSelectedNumbers(randomNumbers);
  };

  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

  // const handleSubmit = (e: SubmitEvent) => {
  //   e.preventDefault();
  //   setShowResults(true);
  //   // Ici vous pouvez ajouter la logique pour traiter la soumission
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Head>
        <title>Jeu de Loterie</title>
        <meta name="description" content="Interface de jeu de loterie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Bannière d'avertissement */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white text-xs md:text-sm py-2 md:py-3 px-2 md:px-4 flex justify-center items-center">
        <div className="flex-1 text-center font-medium tracking-wide">
          LES JEUX D&apos;ARGENT ET DE HASARD SONT INTERDITS AUX MINEURS
        </div>
        <button className="rounded-full w-5 h-5 md:w-6 md:h-6 bg-green-700 hover:bg-green-600 transition-colors text-white flex items-center justify-center">
          ×
        </button>
      </div>

      <NavBar/>

      <main className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row md:space-x-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Prochains tirages</h1>
          <p className="text-gray-600 mb-6">Sélectionne un tirage pour lequel tu veux parier.</p>

          {/* Grille des tirages */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <div className="flex md:grid md:grid-cols-3 gap-4 min-w-max md:min-w-0">
              {availableDraws.map((draw) => (
                <div 
                  key={draw.id} 
                  className={`rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    selectedDraw.id === draw.id 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105' 
                      : 'bg-white hover:bg-green-50 border border-gray-100'
                  }`}
                  onClick={() => setSelectedDraw(draw)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{draw.icon}</span>
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

          {/* Formule de jeu et type de pari */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center mb-3">
                <h2 className="font-semibold text-gray-800">FORMULE DE JEU</h2>
                <span className="ml-2 text-gray-400 hover:text-green-600 cursor-help transition-colors">ⓘ</span>
              </div>
              <select 
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={gameFormula}
                onChange={(e) => setGameFormula(e.target.value)}
              >
                <option value="Simple">Simple</option>
                <option value="Perm">Perm</option>
              </select>
            </div>
            <div>
              <div className="flex items-center mb-3">
                <h2 className="font-semibold text-gray-800">TYPE DE PARI</h2>
                <span className="ml-2 text-gray-400 hover:text-green-600 cursor-help transition-colors">ⓘ</span>
              </div>
              <select 
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={betType}
                onChange={(e) => {
                  setBetType(e.target.value as keyof typeof betTypes);
                  setSelectedNumbers([]);
                }}
              >
                {Object.keys(betTypes).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sélection des numéros */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h2 className="font-medium">ENTRE TES NUMÉROS</h2>
                <span className="ml-2 text-gray-500 rounded-full border border-gray-300 w-5 h-5 flex items-center justify-center text-xs">i</span>
              </div>
              <button className="text-sm text-gray-600">Mode grille</button>
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

            {/* Affichage des numéros sélectionnés */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[...Array(betTypes[betType].slots)].map((_, index) => (
                <div 
                  key={index} 
                  className={`w-12 h-12 rounded flex items-center justify-center border ${
                    selectedNumbers[index] ? 'border-green-600 bg-white text-green-600' : 'border-gray-300 bg-gray-200 text-gray-400'
                  }`}
                >
                  {selectedNumbers[index] || 'X'}
                </div>
              ))}
            </div>

            {/* Grille de numéros complète - simplifiée pour l'exemple */}
            <div className="grid grid-cols-6 md:grid-cols-9 gap-2 mb-6">
              {[...Array(90)].map((_, index) => {
                const number = index + 1;
                return (
                  <button
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-medium transition-all ${
                      selectedNumbers.includes(number) 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200 transform scale-105' 
                        : 'bg-gray-50 hover:bg-green-50 text-gray-700'
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Montant du pari */}
          <div className="mb-6">
            <h2 className="font-medium mb-2">TON PARI</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {[100, 200, 500, 1000, 2000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
                    betAmount === amount 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  {amount}
                </button>
              ))}
              <button className="px-4 py-2 rounded-full bg-white border border-gray-300">
                Fcfa
              </button>
            </div>

            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-2">
              (Multiple de 10, entre 10 et 100.000 Fcfa)
            </div>
          </div>

          {/* Paris multiples */}
          <div className="mb-8">
            <h2 className="font-medium mb-4">Place un pari multiple</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tu peux créer jusqu&apos;à 10 combinaisons par ticket
            </p>
            <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded">
              <span className="mr-2">+</span> Ajouter un pari
            </button>
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-4 md:p-6 sticky top-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
            <h2 className="text-xl font-bold mb-4">Prix total</h2>
            <div className="flex justify-between mb-4">
              <div className="text-sm text-gray-600">(Min: 100F - Max: 100.000F)</div>
              <div className="text-xl font-bold text-green-600">{betAmount} Fcfa</div>
            </div>

            <div className="flex justify-between mb-4">
              <div className="text-sm text-gray-600">Gains max.</div>
              <div className="text-xl font-bold text-green-600">{betAmount * 70} Fcfa</div>
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
              {/* <img src="/placeholder-orange.png" alt="Orange" className="h-8" /> */}
              <img src="/placeholder-moov.png" alt="Moov" className="h-8" />
            </div>

            <form >
            {/* <form onSubmit={handleSubmit}> */}
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
      </main>

      {/* Footer avec style moderne */}
      <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white py-8 md:py-12 mt-8 md:mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <a href="#" className="text-sm text-center">À propos</a>
            <a href="#" className="text-sm text-center">Mentions légales</a>
            <a href="#" className="text-sm text-center">Conditions générales</a>
            <a href="#" className="text-sm text-center">Jeu responsable</a>
            <a href="#" className="text-sm text-center">Protection des données</a>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white text-green-800 px-4 py-2 rounded flex items-center">
              JOUONS RESPONSABLE ✓
            </div>
            <div className="bg-green-700 text-white px-4 py-2 rounded flex items-center ml-2">
              PARIER<br />18 ANS
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <div className="bg-white p-2 rounded">LNB</div>
            <div className="bg-white p-2 rounded">MTN</div>
            <div className="bg-white p-2 rounded">MOOV</div>
            <div className="bg-white p-2 rounded">CELLUL</div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <a href="#" className="text-xl">Facebook</a>
            <a href="#" className="text-xl">Instagram</a>
          </div>

          <div className="text-center text-sm">
            2025 © LNB - Tous droits réservés. Appartenance des sites de jeu à la LNB.
          </div>
        </div>
      </footer>
    </div>
  );
}