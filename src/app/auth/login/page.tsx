'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getRedirectPath } from '@/lib/auth';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';
    const { loadUser, user } = useUserStore();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Check authentication state
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const finalRedirectPath = getRedirectPath(session.user);
                    router.push(finalRedirectPath);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            }
        };
        
        if (!user) {
            checkAuth();
        }
    }, [user, router]);

    useEffect(() => {
        // Check for message parameter to show toast
        const message = searchParams.get('message');
        if (message) {
            toast.info("Notice", {
                description: message
            });
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Successfully logged in, load user data
            await loadUser();

            // Get the appropriate redirect path based on user role
            const finalRedirectPath = data.user ? getRedirectPath(data.user) : redirectPath;

            // Redirect to the appropriate page
            toast.success("Connexion réussie", {
                description: "Vous êtes maintenant connecté"
            });

            router.push(finalRedirectPath);
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error("Échec de connexion", {
                description: error instanceof Error ? error.message : "Identifiants de connexion invalides"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md py-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Connexion à votre compte</h1>

                <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary"
                            disabled={loading}
                        >
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p>
                        Vous n&apos;avez pas de compte ?{' '}
                        <Link href="/auth/register" className="text-primary hover:underline">
                            S&apos;inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Chargement...</div>}>
            <LoginForm />
        </Suspense>
    );
}