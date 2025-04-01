'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Match, getMatches, placeBet, FootballBet } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface League {
  id: string;
  name: string;
  flag: string;
}

interface BetSlip {
  matchId: string;
  type: string;
  odds: number;
  stake?: number;
}

const LEAGUES: League[] = [
  { id: 'fr', name: 'Ligue 1', flag: '🇫🇷' },
  { id: 'en', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'de', name: 'Bundesliga', flag: '🇩🇪' },
  { id: 'it', name: 'Serie A', flag: '🇮🇹' },
  { id: 'sa', name: 'Saudi Pro League', flag: '🇸🇦' },
  { id: 'tr', name: 'Süper Lig', flag: '🇹🇷' },
];

export default function FootballBetting() {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [betSlip, setBetSlip] = useState<BetSlip[]>([]);
  const [stake, setStake] = useState<number>(100);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      setError('Impossible de charger les matchs. Veuillez réessayer plus tard.');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBetClick = (matchId: string, type: string, odds: number) => {
    setBetSlip(prev => {
      const existing = prev.find(bet => bet.matchId === matchId);
      if (existing) {
        return prev.map(bet =>
          bet.matchId === matchId ? { ...bet, type, odds } : bet
        );
      }
      return [...prev, { matchId, type, odds }];
    });
  };

  const removeBet = (matchId: string) => {
    setBetSlip(prev => prev.filter(bet => bet.matchId !== matchId));
  };

  const validateBet = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setError("Numéro de téléphone invalide");
      return false;
    }
    if (stake < 100) {
      setError("Mise minimum: 100 FCFA");
      return false;
    }
    if (stake > 100000) {
      setError("Mise maximum: 100,000 FCFA");
      return false;
    }
    setError(null);
    return true;
  };

  const calculateTotalOdds = () => {
    return betSlip.reduce((acc, bet) => acc * bet.odds, 1);
  };

  const handleSubmit = async () => {
    if (!validateBet()) return;

    try {
      const totalOdds = calculateTotalOdds();
      const bet = {
        matches: betSlip.map(bet => ({
          match_id: bet.matchId,
          bet_type: bet.type,
          odds: bet.odds
        })),
        stake,
        total_odds: totalOdds,
        potential_winnings: totalOdds * stake,
        phone_number: phoneNumber,
        status: 'pending'
      } as Omit<FootballBet, 'id' | 'created_at'>;

      await placeBet(bet);

      // Reset form after successful submission
      setBetSlip([]);
      setStake(100);
      setPhoneNumber('');
      setError(null);

      // Show success message
      alert('Pari placé avec succès! Vous recevrez une confirmation par SMS.');
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('Impossible de placer le pari. Veuillez réessayer.');
    }
  };

  const filteredMatches = selectedLeague === 'all'
    ? matches
    : matches.filter(match => {
      const league = LEAGUES.find(l => l.id === selectedLeague);
      return league && match.league === league.name;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* League Filter - Sticky on scroll */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-4 pt-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Paris Sportifs</h1>
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-3 pb-2">
              <button
                onClick={() => setSelectedLeague('all')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${selectedLeague === 'all'
                  ? 'bg-green-600 text-white font-medium transform scale-105'
                  : 'bg-white hover:bg-green-50'
                  }`}
              >
                Tous les championnats
              </button>
              {LEAGUES.map((league) => (
                <button
                  key={league.id}
                  onClick={() => setSelectedLeague(league.id)}
                  className={`px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 shadow-sm hover:shadow-md ${selectedLeague === league.id
                    ? 'bg-green-600 text-white font-medium transform scale-105'
                    : 'bg-white hover:bg-green-50'
                    }`}
                >
                  <span className="text-xl">{league.flag}</span>
                  <span>{league.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Matches Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 gap-6">
              {filteredMatches.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Aucun match disponible pour le moment.</p>
                </div>
              ) : (
                filteredMatches.map((match) => (
                  <div key={match.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    {/* League and Status Header */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium px-4 py-1 bg-gray-100 rounded-full text-gray-600">
                        {match.league}
                      </span>
                      {match.status === 'live' && (
                        <span className="text-sm font-medium px-4 py-1 bg-red-100 text-red-600 rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>

                    {/* Teams and Time */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex-1 text-center">
                        <div className="text-xl font-semibold">{match.home_team}</div>
                      </div>
                      <div className="px-6">
                        <div className="text-sm font-medium text-gray-500">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-xl font-semibold">{match.away_team}</div>
                      </div>
                    </div>

                    {/* Betting Options */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Match nul', value: match.odds.draw, code: 'X' },
                        { label: 'Victoire/défaite', value: match.odds.eitherTeamWin, code: '1/2' },
                        { label: 'Équipe 1 ou nul', value: match.odds.team1WinOrDraw, code: '1X' },
                        { label: 'Équipe 2 ou nul', value: match.odds.team2WinOrDraw, code: '2X' },
                      ].map((bet) => (
                        <button
                          key={bet.code}
                          onClick={() => handleBetClick(match.id, bet.code, bet.value)}
                          className={`bg-gray-50 hover:bg-green-50 p-4 rounded-xl transition-all duration-200 hover:shadow-sm group ${betSlip.some(b => b.matchId === match.id && b.type === bet.code)
                            ? 'ring-2 ring-green-500 bg-green-50'
                            : ''
                            }`}
                        >
                          <div className="text-xs text-gray-500 group-hover:text-green-600 mb-1">
                            {bet.label}
                          </div>
                          <div className="text-lg font-bold text-gray-800 group-hover:text-green-600">
                            {bet.value.toFixed(2)}
                          </div>
                          <div className="text-xs font-medium text-gray-400 group-hover:text-green-500">
                            {bet.code}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bet Slip */}
          {betSlip.length > 0 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Ticket de paris</h2>

                <div className="space-y-4 mb-6">
                  {betSlip.map((bet) => {
                    const match = matches.find(m => m.id === bet.matchId);
                    return (
                      <div key={bet.matchId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">{match?.home_team} vs {match?.away_team}</div>
                          <div className="text-xs text-gray-500">{bet.type} @ {bet.odds.toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => removeBet(bet.matchId)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant du pari
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        min="100"
                        max="100000"
                        value={stake}
                        onChange={(e) => setStake(Number(e.target.value))}
                        className="flex-1 rounded-l-lg border-gray-300"
                      />
                      <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        FCFA
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone
                    </label>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Pour recevoir vos gains"
                      className="w-full rounded-lg border-gray-300"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Cote totale</span>
                    <span className="font-medium">{calculateTotalOdds().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gains potentiels</span>
                    <span className="font-medium text-green-600">
                      {(calculateTotalOdds() * stake).toFixed(0)} FCFA
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Image src="/mtn.png" alt="MTN Money" width={32} height={32} className="h-8 w-auto" />
                  <Image src="/Moov_Africa_logo.png" alt="Moov Money" width={32} height={32} className="h-8 w-auto" />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Valider le pari
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
