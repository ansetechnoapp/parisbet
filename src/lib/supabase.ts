import { createBrowserClient } from '@supabase/ssr'

// Use a fallback mechanism to avoid runtime errors
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY) 

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
  type: 'Poto' | 'Tout chaud' | '3 Nape' | '4 Nape' | 'Perm';
  numbers: number[];
  amount: number;
  status: 'pending' | 'won' | 'lost';
  phone_number: string;
  created_at: string;
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

export interface CreateTicketData {
  ticket_number: string;
  date: string;
  type: 'Poto' | 'Tout chaud' | '3 Nape' | '4 Nape' | 'Perm';
  numbers: number[];
  amount: number;
  status: 'pending' | 'won' | 'lost';
  phone_number: string;
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