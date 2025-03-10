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
    draw: number;
    eitherTeamWin: number;
    team1WinOrDraw: number;  // Nouvelle option
    team2WinOrDraw: number;  // Nouvelle option
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
        draw: 4.20,
        eitherTeamWin: 1.25,
        team1WinOrDraw: 1.35,  // Nouvelle coten
        team2WinOrDraw: 1.35,  // Nouvelle coten
      },
      status: 'upcoming'
    },
    // Add more matches here
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* League Filter - Sticky on scroll */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-4 pt-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Football Betting</h1>
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-3 pb-2">
              <button
                onClick={() => setSelectedLeague('all')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                  selectedLeague === 'all'
                    ? 'bg-green-600 text-white font-medium transform scale-105'
                    : 'bg-white hover:bg-green-50'
                }`}
              >
                All Leagues
              </button>
              {leagues.map((league) => (
                <button
                  key={league.id}
                  onClick={() => setSelectedLeague(league.id)}
                  className={`px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedLeague === league.id
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

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {matches.map((match) => (
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
                  <div className="text-xl font-semibold">{match.team1}</div>
                </div>
                <div className="px-6">
                  <div className="text-sm font-medium text-gray-500">{match.date}</div>
                  <div className="text-lg font-bold text-gray-800">{match.time}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xl font-semibold">{match.team2}</div>
                </div>
              </div>

              {/* Betting Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Draw', value: match.odds.draw, code: 'X' },
                  { label: 'Either Team', value: match.odds.eitherTeamWin, code: '1/2' },
                  { label: 'Team 1 or Draw', value: match.odds.team1WinOrDraw, code: '1X' },
                  { label: 'Team 2 or Draw', value: match.odds.team2WinOrDraw, code: '2X' },
                ].map((bet, index) => (
                  <button
                    key={index}
                    className="bg-gray-50 hover:bg-green-50 p-4 rounded-xl transition-all duration-200 hover:shadow-sm group"
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
          ))}
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
