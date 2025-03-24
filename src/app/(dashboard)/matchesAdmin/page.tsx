// 'use client';

// import { useState, useEffect } from 'react';
// import { Match, addMatch, getMatches, deleteMatch } from '@/lib/supabase';

// const LEAGUES = [
//   { id: 'fr', name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
//   { id: 'en', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁿' },
//   { id: 'de', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
//   { id: 'it', name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
//   { id: 'sa', name: 'Saudi Pro League', country: 'Saudi Arabia', flag: '🇸🇦' },
//   { id: 'tr', name: 'Süper Lig', country: 'Turkey', flag: '🇹🇷' },
// ];

// interface MatchOdds {
//   draw: number;
//   eitherTeamWin: number;
//   team1WinOrDraw: number;
//   team2WinOrDraw: number;
// }

// const DEFAULT_ODDS: MatchOdds = {
//   draw: 1.0,
//   eitherTeamWin: 1.0,
//   team1WinOrDraw: 1.0,
//   team2WinOrDraw: 1.0
// };

// export default function MatchesPage() {
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [newMatch, setNewMatch] = useState<Partial<Match>>({
//     home_team: '',
//     away_team: '',
//     date: '',
//     league: '',
//     status: 'upcoming',
//     odds: DEFAULT_ODDS
//   });
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   const fetchMatches = async () => {
//     try {
//       const data = await getMatches();
//       setMatches(data);
//     } catch (error) {
//       console.error('Error fetching matches:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     const now = new Date();
//     const matchDate = newMatch.date ? new Date(newMatch.date) : null;

//     if (!matchDate || matchDate < now) {
//       errors.date = "Match date cannot be in the past";
//     }

//     if (!newMatch.home_team?.trim()) {
//       errors.home_team = "Home team is required";
//     }

//     if (!newMatch.away_team?.trim()) {
//       errors.away_team = "Away team is required";
//     }

//     if (!newMatch.league?.trim()) {
//       errors.league = "League is required";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const selectedLeague = LEAGUES.find(l => l.id === newMatch.league);
//       const matchToAdd = {
//         ...newMatch,
//         league: selectedLeague?.name || newMatch.league,
//         date: newMatch.date ? new Date(newMatch.date).toISOString() : new Date().toISOString(),
//       } as Omit<Match, 'id' | 'created_at'>;

//       const match = await addMatch(matchToAdd);
//       setMatches([match, ...matches]);
//       setShowAddForm(false);
//       setNewMatch({
//         home_team: '',
//         away_team: '',
//         date: '',
//         league: '',
//         status: 'upcoming',
//         odds: DEFAULT_ODDS
//       });
//     } catch (error) {
//       console.error('Error adding match:', error);
//       setFormErrors({ submit: 'Failed to add match. Please try again.' });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteMatch(id);
//       setMatches(matches.filter(match => match.id !== id));
//     } catch (error) {
//       console.error('Error deleting match:', error);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading...</div>;
//   }

//   return (
//     <div className="max-w-full">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
//         <h1 className="text-xl sm:text-2xl font-bold">Matches Management</h1>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
//         >
//           Add New Match
//         </button>
//       </div>

//       {/* Add Match Form */}
//       {showAddForm && (
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 overflow-hidden">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg sm:text-xl font-semibold">Add New Match</h2>
//             <button
//               onClick={() => setShowAddForm(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//           {formErrors.submit && (
//             <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
//               {formErrors.submit}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Home Team</label>
//                 <input
//                   type="text"
//                   value={newMatch.home_team}
//                   onChange={(e) => {
//                     setNewMatch({ ...newMatch, home_team: e.target.value });
//                     setFormErrors({ ...formErrors, home_team: '' });
//                   }}
//                   className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${formErrors.home_team ? 'border-red-500' : ''}`}
//                   required
//                 />
//                 {formErrors.home_team && (
//                   <p className="mt-1 text-sm text-red-500">{formErrors.home_team}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Away Team</label>
//                 <input
//                   type="text"
//                   value={newMatch.away_team}
//                   onChange={(e) => {
//                     setNewMatch({ ...newMatch, away_team: e.target.value });
//                     setFormErrors({ ...formErrors, away_team: '' });
//                   }}
//                   className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.away_team ? 'border-red-500' : ''}`}
//                   required
//                 />
//                 {formErrors.away_team && (
//                   <p className="mt-1 text-sm text-red-500">{formErrors.away_team}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date</label>
//                 <input
//                   type="datetime-local"
//                   value={newMatch.date}
//                   onChange={(e) => {
//                     setNewMatch({ ...newMatch, date: e.target.value });
//                     setFormErrors({ ...formErrors, date: '' });
//                   }}
//                   className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.date ? 'border-red-500' : ''}`}
//                   required
//                 />
//                 {formErrors.date && (
//                   <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">League</label>
//                 <select
//                   value={newMatch.league}
//                   onChange={(e) => {
//                     setNewMatch({ ...newMatch, league: e.target.value });
//                     setFormErrors({ ...formErrors, league: '' });
//                   }}
//                   className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.league ? 'border-red-500' : ''}`}
//                   required
//                 >
//                   <option value="">Select a league</option>
//                   {LEAGUES.map((league) => (
//                     <option key={league.id} value={league.id}>{league.name}</option>
//                   ))}
//                 </select>
//                 {formErrors.league && (
//                   <p className="mt-1 text-sm text-red-500">{formErrors.league}</p>
//                 )}
//               </div>
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Odds</label>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
//                   <div>
//                     <span className="text-xs text-gray-500 block mb-1">Draw</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="1"
//                       value={newMatch.odds?.draw}
//                       onChange={(e) => setNewMatch({
//                         ...newMatch,
//                         odds: { ...newMatch.odds as MatchOdds, draw: parseFloat(e.target.value) }
//                       })}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500 block mb-1">Either Team Win</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="1"
//                       value={newMatch.odds?.eitherTeamWin}
//                       onChange={(e) => setNewMatch({
//                         ...newMatch,
//                         odds: { ...newMatch.odds as MatchOdds, eitherTeamWin: parseFloat(e.target.value) }
//                       })}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500 block mb-1">Team 1 Win/Draw</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="1"
//                       value={newMatch.odds?.team1WinOrDraw}
//                       onChange={(e) => setNewMatch({
//                         ...newMatch,
//                         odds: { ...newMatch.odds as MatchOdds, team1WinOrDraw: parseFloat(e.target.value) }
//                       })}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500 block mb-1">Team 2 Win/Draw</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="1"
//                       value={newMatch.odds?.team2WinOrDraw}
//                       onChange={(e) => setNewMatch({
//                         ...newMatch,
//                         odds: { ...newMatch.odds as MatchOdds, team2WinOrDraw: parseFloat(e.target.value) }
//                       })}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowAddForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
//               >
//                 Add Match
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Matches Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {matches?.map((match) => (
//               <tr key={match.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{match.home_team}</div>
//                   <div className="text-sm text-gray-500">vs</div>
//                   <div className="text-sm font-medium text-gray-900">{match.away_team}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{new Date(match.date).toLocaleString()}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{match.league}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${match.status === 'live' ? 'bg-green-100 text-green-800' :
//                       match.status === 'finished' ? 'bg-gray-100 text-gray-800' :
//                         'bg-yellow-100 text-yellow-800'
//                     }`}>
//                     {match.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
//                   <button
//                     onClick={() => handleDelete(match.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
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
  draw: 3.25,
  eitherTeamWin: 1.35,
  team1WinOrDraw: 1.65,
  team2WinOrDraw: 1.80
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

  // Calculate potential return for display purposes
  const calculateReturn = (odd: number) => {
    // Assuming a standard $100 stake
    return (100 * odd).toFixed(2);
  };

  // Calculate implied probability percentage
  const calculateProbability = (odd: number) => {
    return ((1 / odd) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Matches Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
        >
          Add New Match
        </button>
      </div>

      {/* Add Match Form */}
      {showAddForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Add New Match</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {formErrors.submit && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
              {formErrors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option key={league.id} value={league.id}>{league.flag} {league.name}</option>
                  ))}
                </select>
                {formErrors.league && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.league}</p>
                )}
              </div>

              {/* Improved Odds Section */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Odds</label>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Draw */}
                    <div className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-600 font-medium text-sm">Draw</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {calculateProbability(newMatch.odds?.draw || 1)}%
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={newMatch.odds?.draw}
                        onChange={(e) => setNewMatch({
                          ...newMatch,
                          odds: { ...newMatch.odds as MatchOdds, draw: parseFloat(e.target.value) }
                        })}
                        className="block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-2"
                      />
                      <div className="text-xs text-gray-500">
                        Potential Return: <span className="text-gray-800 font-medium">${calculateReturn(newMatch.odds?.draw || 1)}</span>
                      </div>
                    </div>

                    {/* Either Team Win */}
                    <div className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-indigo-600 font-medium text-sm">Either Team Win</span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                          {calculateProbability(newMatch.odds?.eitherTeamWin || 1)}%
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={newMatch.odds?.eitherTeamWin}
                        onChange={(e) => setNewMatch({
                          ...newMatch,
                          odds: { ...newMatch.odds as MatchOdds, eitherTeamWin: parseFloat(e.target.value) }
                        })}
                        className="block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-2"
                      />
                      <div className="text-xs text-gray-500">
                        Potential Return: <span className="text-gray-800 font-medium">${calculateReturn(newMatch.odds?.eitherTeamWin || 1)}</span>
                      </div>
                    </div>

                    {/* Team 1 Win/Draw */}
                    <div className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-600 font-medium text-sm">Home Win/Draw</span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {calculateProbability(newMatch.odds?.team1WinOrDraw || 1)}%
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={newMatch.odds?.team1WinOrDraw}
                        onChange={(e) => setNewMatch({
                          ...newMatch,
                          odds: { ...newMatch.odds as MatchOdds, team1WinOrDraw: parseFloat(e.target.value) }
                        })}
                        className="block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-2"
                      />
                      <div className="text-xs text-gray-500">
                        Potential Return: <span className="text-gray-800 font-medium">${calculateReturn(newMatch.odds?.team1WinOrDraw || 1)}</span>
                      </div>
                    </div>

                    {/* Team 2 Win/Draw */}
                    <div className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-600 font-medium text-sm">Away Win/Draw</span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          {calculateProbability(newMatch.odds?.team2WinOrDraw || 1)}%
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={newMatch.odds?.team2WinOrDraw}
                        onChange={(e) => setNewMatch({
                          ...newMatch,
                          odds: { ...newMatch.odds as MatchOdds, team2WinOrDraw: parseFloat(e.target.value) }
                        })}
                        className="block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-2"
                      />
                      <div className="text-xs text-gray-500">
                        Potential Return: <span className="text-gray-800 font-medium">${calculateReturn(newMatch.odds?.team2WinOrDraw || 1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Percentage values represent implied probability. All returns based on a $100 stake.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
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