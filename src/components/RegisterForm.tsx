'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, createUserProfile } from '@/lib/supabase';
import { useUserStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RegisterForm() {
    const router = useRouter();
    const { loadUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        city: '',
        neighborhood: '',
        country: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Register user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // Create user profile
                await createUserProfile({
                    user_id: authData.user.id,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    city: formData.city,
                    neighborhood: formData.neighborhood,
                    country: formData.country
                });

                // Try to load the user state
                if (authData.session) {
                    await loadUser();
                }

                toast.success("Inscription réussie", {
                    description: "Veuillez vérifier votre e-mail pour confirmer votre compte."
                });

                // Redirect to login
                router.push('/auth/login');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error("L'inscription a échoué", {
                description: error instanceof Error ? error.message : "Une erreur s'est produite"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md py-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <Label htmlFor="city">Ville</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="neighborhood">Quartier</Label>
                            <Input
                                id="neighborhood"
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="country">Pays</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary"
                            disabled={loading}
                        >
                            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p>
                        Vous avez déjà un compte ?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}