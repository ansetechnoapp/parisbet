import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, UserProfile, Transaction } from './supabase';

interface UserState {
  user: { id: string } | null;
  profile: UserProfile | null;
  transactions: Transaction[];
  pendingBet: {
    matches: Array<{
      match_id: string;
      bet_type: string;
      odds: number;
    }>;
    stake: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  loadUser: () => Promise<void>;
  loadProfile: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  setPendingBet: (bet: {
    matches: Array<{
      match_id: string;
      bet_type: string;
      odds: number;
    }>;
    stake: number;
  }) => void;
  clearPendingBet: () => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      transactions: [],
      pendingBet: null,
      isLoading: false,
      error: null,
      initialized: false,

      loadUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await supabase.auth.getSession();
          set({ user: data.session?.user || null, isLoading: false, initialized: true });

          // If there's a user, also load their profile
          if (data.session?.user) {
            get().loadProfile();
            get().loadTransactions();
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load user',
            initialized: true
          });
        }
      },

      loadProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          set({ profile: data, isLoading: false });
        } catch (error) {
          console.error('Error loading profile:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load profile'
          });
        }
      },

      loadTransactions: async () => {
        const { user } = get();
        if (!user) return;

        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          set({ transactions: data, isLoading: false });
        } catch (error) {
          console.error('Error loading transactions:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load transactions'
          });
        }
      },

      setPendingBet: (bet) => {
        set({ pendingBet: bet });
      },

      clearPendingBet: () => {
        set({ pendingBet: null });
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            profile: null,
            transactions: [],
            pendingBet: null
          });
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        pendingBet: state.pendingBet
      }),
    }
  )
);