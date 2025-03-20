import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  league: string;
  status: 'scheduled' | 'live' | 'completed';
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