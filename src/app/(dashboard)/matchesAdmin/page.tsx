'use client';

import { useState, useEffect } from 'react';
import { Match, addMatch, getMatches, deleteMatch } from '@/lib/supabase';

const LEAGUES = [
  { id: 'fr', name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
  { id: 'en', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁿' },
  { id: 'de', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
  { id: 'it', name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
  { id: 'sa', name: 'Saudi Pro League', country: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'tr', name: 'Süper Lig', country: 'Turkey', flag: '🇹🇷' },
];

interface MatchOdds {
  draw: number;
  eitherTeamWin: number;
  team1WinOrDraw: number;
  team2WinOrDraw: number;
}

const DEFAULT_ODDS: MatchOdds = {
  draw: 1.0,
  eitherTeamWin: 1.0,
  team1WinOrDraw: 1.0,
  team2WinOrDraw: 1.0
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    home_team: '',
    away_team: '',
    date: '',
    league: '',
    status: 'upcoming',
    odds: DEFAULT_ODDS
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const now = new Date();
    const matchDate = newMatch.date ? new Date(newMatch.date) : null;

    if (!matchDate || matchDate < now) {
      errors.date = "Match date cannot be in the past";
    }

    if (!newMatch.home_team?.trim()) {
      errors.home_team = "Home team is required";
    }

    if (!newMatch.away_team?.trim()) {
      errors.away_team = "Away team is required";
    }

    if (!newMatch.league?.trim()) {
      errors.league = "League is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const selectedLeague = LEAGUES.find(l => l.id === newMatch.league);
      const matchToAdd = {
        ...newMatch,
        league: selectedLeague?.name || newMatch.league,
        date: newMatch.date ? new Date(newMatch.date).toISOString() : new Date().toISOString(),
      } as Omit<Match, 'id' | 'created_at'>;

      const match = await addMatch(matchToAdd);
      setMatches([match, ...matches]);
      setShowAddForm(false);
      setNewMatch({
        home_team: '',
        away_team: '',
        date: '',
        league: '',
        status: 'upcoming',
        odds: DEFAULT_ODDS
      });
    } catch (error) {
      console.error('Error adding match:', error);
      setFormErrors({ submit: 'Failed to add match. Please try again.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMatch(id);
      setMatches(matches.filter(match => match.id !== id));
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matches Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Match
        </button>
      </div>

      {/* Add Match Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Match</h2>
          {formErrors.submit && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
              {formErrors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Home Team</label>
                <input
                  type="text"
                  value={newMatch.home_team}
                  onChange={(e) => {
                    setNewMatch({ ...newMatch, home_team: e.target.value });
                    setFormErrors({ ...formErrors, home_team: '' });
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${formErrors.home_team ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.home_team && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.home_team}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Away Team</label>
                <input
                  type="text"
                  value={newMatch.away_team}
                  onChange={(e) => {
                    setNewMatch({ ...newMatch, away_team: e.target.value });
                    setFormErrors({ ...formErrors, away_team: '' });
                  }}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.away_team ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.away_team && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.away_team}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="datetime-local"
                  value={newMatch.date}
                  onChange={(e) => {
                    setNewMatch({ ...newMatch, date: e.target.value });
                    setFormErrors({ ...formErrors, date: '' });
                  }}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.date ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">League</label>
                <select
                  value={newMatch.league}
                  onChange={(e) => {
                    setNewMatch({ ...newMatch, league: e.target.value });
                    setFormErrors({ ...formErrors, league: '' });
                  }}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.league ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select a league</option>
                  {LEAGUES.map((league) => (
                    <option key={league.id} value={league.id}>{league.name}</option>
                  ))}
                </select>
                {formErrors.league && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.league}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Odds</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Draw"
                    value={newMatch.odds?.draw}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      odds: { ...newMatch.odds as MatchOdds, draw: parseFloat(e.target.value) }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Either Team Win"
                    value={newMatch.odds?.eitherTeamWin}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      odds: { ...newMatch.odds as MatchOdds, eitherTeamWin: parseFloat(e.target.value) }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Team 1 Win/Draw"
                    value={newMatch.odds?.team1WinOrDraw}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      odds: { ...newMatch.odds as MatchOdds, team1WinOrDraw: parseFloat(e.target.value) }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Team 2 Win/Draw"
                    value={newMatch.odds?.team2WinOrDraw}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      odds: { ...newMatch.odds as MatchOdds, team2WinOrDraw: parseFloat(e.target.value) }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Match
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Matches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matches?.map((match) => (
              <tr key={match.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{match.home_team}</div>
                  <div className="text-sm text-gray-500">vs</div>
                  <div className="text-sm font-medium text-gray-900">{match.away_team}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(match.date).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{match.league}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${match.status === 'live' ? 'bg-green-100 text-green-800' :
                      match.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {match.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}