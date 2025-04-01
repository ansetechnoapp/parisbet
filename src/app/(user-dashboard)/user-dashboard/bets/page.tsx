'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase, FootballBet, Match } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface BetMatch {
  match_id: string;
  bet_type: string;
  odds: number;
}

export default function BetsPage() {
  const { profile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [bets, setBets] = useState<FootballBet[]>([]);
  const [matches, setMatches] = useState<Record<string, Match>>({});
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (profile?.phone_number) {
      setPhoneNumber(profile.phone_number);
      fetchBets(profile.phone_number);
    } else {
      setLoading(false);
    }
  }, [profile]);

  const fetchBets = async (phone: string) => {
    try {
      setLoading(true);
      setError(null);

      const formattedPhone = phone.toString().trim().replace(/[^\d]/g, '');
      const { data, error: betsError } = await supabase
        .from('football_bets')
        .select('*')
        .ilike('phone_number', `%${formattedPhone}%`)
        .order('created_at', { ascending: false });

      if (betsError) throw betsError;
      setBets(data || []);

      // Récupérer les informations des matchs
      if (data && data.length > 0) {
        const matchIds = new Set<string>();
        data.forEach(bet => {
          bet.matches.forEach((match: BetMatch) => {
            matchIds.add(match.match_id);
          });
        });

        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .in('id', Array.from(matchIds));

        if (matchesError) throw matchesError;

        const matchesMap: Record<string, Match> = {};
        matchesData?.forEach(match => {
          matchesMap[match.id] = match;
        });

        setMatches(matchesMap);
      }
    } catch (err) {
      console.error('Error fetching bets:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des paris');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      fetchBets(phoneNumber);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won':
        return 'Gagné';
      case 'lost':
        return 'Perdu';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getBetTypeLabel = (betType: string) => {
    switch (betType) {
      case 'home_win':
        return 'Victoire domicile';
      case 'away_win':
        return 'Victoire extérieur';
      case 'draw':
        return 'Match nul';
      case 'either_team_win':
        return 'Une équipe gagne';
      case 'team1_win_or_draw':
        return 'Domicile ou nul';
      case 'team2_win_or_draw':
        return 'Extérieur ou nul';
      default:
        return betType;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Paris</h1>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher vos paris</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Entrez votre numéro de téléphone"
              className="flex-1"
            />
            <Button type="submit">Rechercher</Button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des paris</CardTitle>
        </CardHeader>
        <CardContent>
          {bets.length > 0 ? (
            <div className="space-y-6">
              {bets.map((bet) => (
                <Card key={bet.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(bet.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="font-medium">
                          {bet.matches.length} match{bet.matches.length > 1 ? 'es' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bet.status)}`}>
                          {getStatusLabel(bet.status)}
                        </span>
                        <p className="mt-1 font-bold text-green-600">{bet.potential_winnings.toFixed(2)} FCFA</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Mise:</span> {bet.stake.toFixed(2)} FCFA
                        </div>
                        <div>
                          <span className="text-gray-500">Cote totale:</span> {bet.total_odds.toFixed(2)}
                        </div>
                        <div>
                          <span className="text-gray-500">Gain potentiel:</span> {bet.potential_winnings.toFixed(2)} FCFA
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Matchs sélectionnés:</h4>
                        <div className="space-y-2">
                          {bet.matches.map((match, index) => {
                            const matchData = matches[match.match_id];
                            return (
                              <div key={index} className="p-2 bg-gray-50 rounded-md">
                                {matchData ? (
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{matchData.home_team} vs {matchData.away_team}</p>
                                      <p className="text-xs text-gray-500">{formatDate(matchData.date)} - {matchData.league}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm">{getBetTypeLabel(match.bet_type)}</p>
                                      <p className="text-xs font-medium">Cote: {match.odds.toFixed(2)}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-gray-500">Informations du match non disponibles</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun pari trouvé pour ce numéro de téléphone.</p>
              <Link href="/soccer">
                <Button>Parier maintenant</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
