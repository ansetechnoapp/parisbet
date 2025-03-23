'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ticket, getTicketById } from '@/lib/supabase';

export default function FindTicketPage() {
    const [ticketId, setTicketId] = useState('');
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setTicket(null);

        if (!ticketId.trim()) {
            setError('Veuillez entrer un ID de ticket');
            return;
        }

        setLoading(true);
        try {
            console.log('[Debug] Searching for ticket:', ticketId);
            const data = await getTicketById(ticketId);
            console.log('[Debug] Response:', data);

            if (!data) {
                console.log('[Debug] No ticket found');
                setError('Ticket non trouvé - Veuillez vérifier le numéro et réessayer');
                return;
            }

            setTicket(data as Ticket);
        } catch (err) {
            console.error('[Debug] Error details:', err);
            setError('Erreur lors de la recherche du ticket. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'won': return 'bg-green-100 text-green-800';
            case 'lost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'won': return 'Gagné';
            case 'lost': return 'Perdu';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Rechercher un ticket</h1>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-1">
                                    ID du ticket
                                </label>
                                <input
                                    type="text"
                                    id="ticketId"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    placeholder="Entrez l'ID du ticket"
                                    className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Recherche...' : 'Rechercher'}
                            </button>
                        </form>

                        {ticket && (
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Détails du ticket</h2>

                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-semibold text-gray-800">{ticket.ticket_number}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                    {getStatusLabel(ticket.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{new Date(ticket.date).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-xl font-bold text-green-600">{ticket.amount} Fcfa</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-3">
                                        <p className="text-sm text-gray-600 mb-2">Type: <span className="font-medium">{ticket.type}</span></p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {ticket.numbers.map((num, index) => (
                                                <div key={index} className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium">
                                                    {num}
                                                </div>
                                            ))}
                                        </div>

                                        {ticket.status === 'won' && (
                                            <div className="text-right mt-2">
                                                <p className="text-sm text-gray-600">Gain:</p>
                                                <p className="text-xl font-bold text-green-600">{ticket.amount * 140} Fcfa</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center space-y-2">
                            <Link href="/ticketsList" className="block text-green-600 hover:text-green-700 transition-colors">
                                Voir tous mes tickets
                            </Link>
                            <Link href="/" className="block text-green-600 hover:text-green-700 transition-colors">
                                ← Retour à l&apos;accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}