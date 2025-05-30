'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTicketsByPhoneNumber } from '@/lib/supabase';
import { Input } from '@/components/ui/input';

export default function VerifyPhonePage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const value = e.target.value.replace(/\D/g, '');
        setPhoneNumber(value);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!phoneNumber) {
            setError('Veuillez entrer votre numéro de téléphone'); 
            return;
        }

        if (phoneNumber.length < 8 || phoneNumber.length > 10) {
            setError('Numéro de téléphone invalide');
            return;
        }

        setIsSubmitting(true);

        try {
            // Fetch tickets and store phone number in localStorage for later use
            const tickets = await getTicketsByPhoneNumber(phoneNumber);
            if (tickets
                && tickets.length > 0) {
                // Store in session to use on tickets list page
                localStorage.setItem('userPhoneNumber', phoneNumber);
                
                // Redirect to tickets list page
                router.push('/ticketsList');
            }
            
            // Redirect to tickets list page
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Entrez votre numéro de téléphone
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Cette étape sert à confirmer votre numéro de téléphone pour accéder à vos tickets.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            id="phone"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="Numéro de téléphone"
                            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            maxLength={10}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Format: national, 8 ou 10 chiffres
                        </p>
                        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Vérification...' : 'Confirmer'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <Link href="/find-ticket" className="block text-green-600 hover:text-green-700 transition-colors">
                        Rechercher un ticket par ID
                    </Link>
                    <Link href="/" className="block text-sm text-green-600 hover:text-green-700 transition-colors">
                        ← Retourner à la page d&apos;accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
