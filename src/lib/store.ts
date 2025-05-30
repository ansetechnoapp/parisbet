import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, UserProfile, Transaction } from './supabase';
import { isAdmin } from './auth';

interface UserState {
  user: { id: string; isAdmin: boolean } | null;
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
          const user = data.session?.user || null;

          if (user) {
            const adminStatus = await isAdmin(user);
            set({ 
              user: { 
                id: user.id, 
                isAdmin: adminStatus 
              }, 
              isLoading: false, 
              initialized: true 
            });

            // Load profile and transactions
            get().loadProfile();
            get().loadTransactions();
          } else {
            set({ 
              user: null, 
              isLoading: false, 
              initialized: true 
            });
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
          // First clear the store state
          set({
            user: null,
            profile: null,
            transactions: [],
            pendingBet: null,
            initialized: false  // Reset initialized state
          });
          
          // Then sign out from Supabase
          await supabase.auth.signOut();
          
          // Clear any persisted storage
          localStorage.removeItem('user-storage');
          
        } catch (error) {
          console.error('Error logging out:', error);
          throw error; // Propagate the error to handle it in the UI
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