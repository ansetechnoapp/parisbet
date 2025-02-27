'use client'
import React, { useState } from 'react';
import NavBar from '@/component/NavBar';

interface Match {
  id: string;
  league: string;
  team1: string;
  team2: string;
  time: string;
  date: string;
  odds: {
    team1Win: number;
    team2Win: number;
    draw: number;
    eitherTeamWin: number;
  };
  status: 'upcoming' | 'live' | 'finished';
}

export default function FootballBetting() {
  const [selectedLeague, setSelectedLeague] = useState('all');

  const leagues = [
    { id: 'fr', name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
    { id: 'en', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'de', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
    { id: 'it', name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
    { id: 'sa', name: 'Saudi Pro League', country: 'Saudi Arabia', flag: '🇸🇦' },
    { id: 'tr', name: 'Süper Lig', country: 'Turkey', flag: '🇹🇷' },
  ];

  const matches: Match[] = [
    {
      id: '1',
      league: 'Ligue 1',
      team1: 'PSG',
      team2: 'Marseille',
      time: '20:45',
      date: '2024-03-15',
      odds: {
        team1Win: 1.45,
        team2Win: 6.50,
        draw: 4.20,
        eitherTeamWin: 1.25
      },
      status: 'upcoming'
    },
    // Add more matches here
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Leagues Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            <button
              onClick={() => setSelectedLeague('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedLeague === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white hover:bg-green-50'
              }`}
            >
              All Leagues
            </button>
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                  selectedLeague === league.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white hover:bg-green-50'
                }`}
              >
                <span>{league.flag}</span>
                <span>{league.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">{match.league}</span>
                <span className="text-sm font-medium text-green-600">
                  {match.status === 'live' && 'LIVE'}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-medium">{match.team1}</div>
                <div className="text-sm text-gray-600">
                  {match.time}
                </div>
                <div className="text-lg font-medium">{match.team2}</div>
              </div>

              {/* Betting Options */}
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-50 hover:bg-green-50 p-3 rounded-lg transition-colors">
                  <div className="text-sm text-gray-600">1</div>
                  <div className="font-medium">{match.odds.team1Win}</div>
                </button>
                <button className="bg-gray-50 hover:bg-green-50 p-3 rounded-lg transition-colors">
                  <div className="text-sm text-gray-600">2</div>
                  <div className="font-medium">{match.odds.team2Win}</div>
                </button>
                <button className="bg-gray-50 hover:bg-green-50 p-3 rounded-lg transition-colors">
                  <div className="text-sm text-gray-600">X</div>
                  <div className="font-medium">{match.odds.draw}</div>
                </button>
                <button className="bg-gray-50 hover:bg-green-50 p-3 rounded-lg transition-colors">
                  <div className="text-sm text-gray-600">1/2</div>
                  <div className="font-medium">{match.odds.eitherTeamWin}</div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
