'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getMatches, Match } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function SoccerPage() {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    type SelectedMatch = {
        match_id: string;
        bet_type: string;
        odds: number;
    };
    const [selectedMatches, setSelectedMatches] = useState<Record<string, SelectedMatch>>({});
    const [stake, setStake] = useState(1);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            setAuthenticated(!!data.session);
        };

        checkAuth();

        const fetchMatches = async () => {
            try {
                const matchesData = await getMatches();
                setMatches(matchesData);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const handleSelectBet = (matchId: string, betType: string, odds: number) => {
        setSelectedMatches(prev => {
            // If the match is already selected, just update the bet type
            if (prev[matchId]) {
                return {
                    ...prev,
                    [matchId]: {
                        match_id: matchId,
                        bet_type: betType,
                        odds,
                    }
                };
            }

            // Otherwise add a new match
            return {
                ...prev,
                [matchId]: {
                    match_id: matchId,
                    bet_type: betType,
                    odds,
                }
            };
        });
    };

    const handleRemoveMatch = (matchId: string) => {
        setSelectedMatches(prev => {
            const updated = { ...prev };
            delete updated[matchId];
            return updated;
        });
    };

    const calculateTotalOdds = () => {
        return Object.values(selectedMatches).reduce((total, bet) => total * bet.odds, 1);
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedMatches).length === 0) {
            toast.error("Aucun match sélectionné", {
                description: "Veuillez sélectionner au moins un match pour placer un pari"
            });
            return;
        }

        // Check if user is authenticated
        if (!authenticated) {
            // Save bet data to localStorage before redirecting
            localStorage.setItem('pendingBet', JSON.stringify({
                matches: Object.values(selectedMatches),
                stake
            }));

            // Redirect to login
            router.push('/auth/login?redirect=/soccer');
            return;
        }

        // Here would be the code to place the bet if user is authenticated
        try {
            // Once bet is placed successfully, clear selection and show success message
            setSelectedMatches({});
            setStake(1);
            toast.success("Pari placé avec succès", {
                description: "Votre pari a été placé. Bonne chance !"
            });
        } catch (error) {
            toast.error("Impossible de placer le pari", {
                description: error instanceof Error ? error.message : "Une erreur s'est produite"
            });
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Chargement des matchs...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Matchs de Football</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Matchs Disponibles</h2>
                    {matches.length === 0 ? (
                        <p>Aucun match disponible pour le moment.</p>
                    ) : (
                        matches.map(match => (
                            <Card key={match.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">
                                            {match.home_team} vs {match.away_team}
                                        </CardTitle>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(match.date)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{match.league}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-2">
                                        <Button
                                            variant={selectedMatches[match.id]?.bet_type === "team1Win" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleSelectBet(match.id, "team1Win", match.odds.team1WinOrDraw)}
                                            className="w-full"
                                        >
                                            {match.home_team} Gagne<br />
                                            <span className="font-bold">{match.odds.team1WinOrDraw.toFixed(2)}</span>
                                        </Button>
                                        <Button
                                            variant={selectedMatches[match.id]?.bet_type === "draw" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleSelectBet(match.id, "draw", match.odds.draw)}
                                            className="w-full"
                                        >
                                            Match Nul<br />
                                            <span className="font-bold">{match.odds.draw.toFixed(2)}</span>
                                        </Button>
                                        <Button
                                            variant={selectedMatches[match.id]?.bet_type === "team2Win" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleSelectBet(match.id, "team2Win", match.odds.team2WinOrDraw)}
                                            className="w-full"
                                        >
                                            {match.away_team} Gagne<br />
                                            <span className="font-bold">{match.odds.team2WinOrDraw.toFixed(2)}</span>
                                        </Button>
                                        <Button
                                            variant={selectedMatches[match.id]?.bet_type === "eitherWin" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleSelectBet(match.id, "eitherWin", match.odds.eitherTeamWin)}
                                            className="w-full"
                                        >
                                            L&apos;un ou l&apos;autre<br />
                                            <span className="font-bold">{match.odds.eitherTeamWin.toFixed(2)}</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Votre Ticket de Paris</h2>
                    <Card>
                        <CardContent className="pt-6">
                            {Object.keys(selectedMatches).length === 0 ? (
                                <p className="text-gray-500">Aucun match sélectionné pour l&apos;instant. Cliquez sur les cotes pour ajouter des matchs à votre ticket.</p>
                            ) : (
                                <div className="space-y-4">
                                    {Object.values(selectedMatches).map((bet) => {
                                        const match = matches.find(m => m.id === bet.match_id);
                                        if (!match) return null;

                                        return (
                                            <div key={bet.match_id} className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <p className="font-medium">{match.home_team} vs {match.away_team}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {bet.bet_type === "team1Win" ? `${match.home_team} Gagne` :
                                                            bet.bet_type === "team2Win" ? `${match.away_team} Gagne` :
                                                                bet.bet_type === "draw" ? "Match Nul" : "L'une des équipes gagne"}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-bold">{bet.odds.toFixed(2)}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveMatch(bet.match_id)}
                                                    >
                                                        X
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Montant de la mise :</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={stake}
                                                onChange={(e) => setStake(Number(e.target.value))}
                                                className="border rounded px-2 py-1 w-24 text-right"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center mb-4">
                                            <span>Cote totale :</span>
                                            <span className="font-bold">{calculateTotalOdds().toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center mb-4">
                                            <span>Gains potentiels :</span>
                                            <span className="font-bold text-green-600">
                                                ${(stake * calculateTotalOdds()).toFixed(2)}
                                            </span>
                                        </div>

                                        <Button
                                            className="w-full"
                                            onClick={handleSubmit}
                                        >
                                            Placer le pari
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}