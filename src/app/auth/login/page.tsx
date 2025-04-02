'use client';

import { useEffect, useState, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store';
import { toast } from 'sonner';

// Wrapper component that uses searchParams
function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectedFrom = searchParams.get('redirectedFrom');
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { loadUser } = useUserStore();

    // We don't need this useEffect anymore as the middleware will handle redirects
    // for authenticated users trying to access the login page

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
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data.session) {
                // Récupérer le rôle de l'utilisateur
                const { data: userRoles, error: rolesError } = await supabase
                    .from('user_roles')
                    .select(`
                        role_id,
                        roles (
                            id,
                            name,
                            permissions
                        )
                    `)
                    .eq('user_id', data.session.user.id)
                    .single();

                console.log('Session User ID:', data.session.user.id);
                console.log('User Roles Query Error:', rolesError);
                console.log('User Roles Data:', userRoles);

                if (rolesError) {
                    console.error('Error fetching user roles:', rolesError);
                    toast.error('Erreur lors de la récupération des rôles');
                    return;
                }

                const userRole = userRoles?.roles?.name;
                console.log('User Role:', userRole);

                // Rediriger en fonction du rôle
                if (redirectedFrom) {
                    console.log('Redirecting to:', redirectedFrom);
                    router.push(redirectedFrom);
                } else {
                    console.log('No redirectedFrom, using role-based redirect');
                    if (!userRole) {
                        console.error('No role found for user');
                        toast.error('Erreur : Aucun rôle trouvé');
                        return;
                    }

                    switch (userRole) {
                        case 'admin':
                            console.log('Admin detected, redirecting to /Overview');
                            router.push('/Overview');
                            break;
                        case 'moderator':
                            router.push('/moderator');
                            break;
                        case 'premium_user':
                            router.push('/premium');
                            break;
                        default:
                            console.log('Default role, redirecting to /user-dashboard');
                            router.push('/user-dashboard');
                    }
                }

                await loadUser();
                toast.success('Connexion réussie');
            }
        } catch (error: any) {
            setError(error.message || 'Une erreur est survenue lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Connexion à votre compte
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
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

// Main component that wraps LoginForm in a Suspense boundary
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}