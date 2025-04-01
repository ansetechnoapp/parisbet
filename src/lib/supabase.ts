import { createBrowserClient } from '@supabase/ssr';

// Use a fallback mechanism to avoid runtime errors
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Shared types
export type BetTypeKey = 'Poto' | 'Tout chaud' | '3 Nape' | '4 Nape' | 'Perm';

// Database types
export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  league: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    draw: number;
    eitherTeamWin: number;
    team1WinOrDraw: number;
    team2WinOrDraw: number;
  };
  created_at: string;
}

export interface FootballBet {
  id: string;
  matches: Array<{
    match_id: string;
    bet_type: string;
    odds: number;
  }>;
  stake: number;
  total_odds: number;
  potential_winnings: number;
  phone_number: string;
  status: 'pending' | 'won' | 'lost';
  created_at: string;
}

export interface LottoResult {
  id: string;
  draw_time: string;
  draw_date: string;
  numbers: number[];
  type: 'Fortune 14H' | 'Fortune 18H';
  status: 'pending' | 'completed';
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  date: string;
  type: BetTypeKey;
  numbers: number[];
  amount: number;
  status: 'pending' | 'won' | 'lost';
  phone_number: string;
  created_at: string;
}

export interface CreateTicketData {
  ticket_number: string;
  date: string;
  type: BetTypeKey;
  numbers: number[];
  amount: number;
  status: 'pending' | 'won' | 'lost';
  phone_number: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  city: string;
  neighborhood: string;
  country: string;
  phone_number?: string;
  account_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'top_up' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_method?: string;
  payment_proof_url?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileData {
  user_id: string;
  first_name: string;
  last_name: string;
  city: string;
  neighborhood: string;
  country: string;
  phone_number?: string;
}

export interface CreateTransactionData {
  user_id: string;
  type: 'top_up' | 'withdrawal';
  amount: number;
  payment_method?: string;
  payment_proof_url?: string;
}

// Database functions
export async function getMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getLottoResults() {
  const { data, error } = await supabase
    .from('lotto_results')
    .select('*')
    .order('draw_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTicketsByPhoneNumber(phoneNumber: string) {
  const formattedPhone = phoneNumber.toString().trim().replace(/[^\d]/g, '');
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .ilike('phone_number', `%${formattedPhone}%`)
    .order('date', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }
  return data || [];
}

export async function createTicket(ticketData: CreateTicketData): Promise<Ticket> {
  // Normaliser le numéro de téléphone avant de l'insérer
  const normalizedPhone = ticketData.phone_number.toString().trim().replace(/\D/g, '');

  const { data, error } = await supabase
    .from('tickets')
    .insert([{
      ...ticketData,
      phone_number: normalizedPhone
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getTicketById(ticketNumber: string) {
  const formattedTicketNumber = ticketNumber.toString().trim();
  try {
    // Direct approach using properly formatted ticket ID
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', formattedTicketNumber)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors when no results

    if (error) {
      console.error('[Debug] Database error:', error);
      throw error;
    }

    if (!data) {
      console.log('[Debug] No ticket found with ID:', formattedTicketNumber);
      return null;
    }

    // console.log('[Debug] Query result:', data);
    return data;
  } catch (error) {
    console.error('[Debug] Error in getTicketById:', error);
    throw error;
  }
}

export async function addMatch(match: Omit<Match, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('matches')
    .insert([match])
    .select();

  if (error) throw error;
  return data[0];
}

export async function addLottoResult(result: Omit<LottoResult, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('lotto_results')
    .insert([result])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateTicketStatus(ticketId: string, status: Ticket['status']) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteMatch(matchId: string) {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', matchId);

  if (error) throw error;
}

export async function deleteLottoResult(resultId: string) {
  const { error } = await supabase
    .from('lotto_results')
    .delete()
    .eq('id', resultId);

  if (error) throw error;
}

export async function deleteTicket(ticketId: string) {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId);

  if (error) throw error;
}

export async function placeBet(bet: Omit<FootballBet, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('football_bets')
    .insert([bet])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getBets(phoneNumber?: string) {
  const query = supabase
    .from('football_bets')
    .select('*')
    .order('created_at', { ascending: false });

  if (phoneNumber) {
    query.eq('phone_number', phoneNumber);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// User profile functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createUserProfile(profileData: CreateUserProfileData): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profileData])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profileData)
    .eq('user_id', userId)
    .select();

  if (error) throw error;
  return data[0];
}

// Transaction functions
export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:user_id (
        email,
        user_profiles (
          first_name,
          last_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(transactionData: CreateTransactionData): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transactionData,
      status: 'pending'
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateTransactionStatus(
  transactionId: string,
  status: Transaction['status'],
  admin_notes?: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status,
      admin_notes: admin_notes || null
    })
    .eq('id', transactionId)
    .select();

  if (error) throw error;
  return data[0];
}

// Notification functions
export async function getUserNotifications(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select();

  if (error) throw error;
  return data[0];
}

export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .select();

  if (error) throw error;
  return data;
}

export async function createNotification(notification: {
  user_id: string;
  title: string;
  message: string;
  type: Notification['type'];
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select();

  if (error) throw error;
  return data[0];
}

export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
  try {
    // First, get the current user metadata
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('raw_user_meta_data')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Update the user metadata with the new role
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...userData?.raw_user_meta_data,
          role
        }
      }
    );

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user role:', error);
    return {
      data: null,
      error: error instanceof Error
        ? error
        : new Error('Failed to update user role')
    };
  }
};