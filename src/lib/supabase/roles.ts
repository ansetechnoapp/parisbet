import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type Role = 'admin' | 'moderator' | 'user' | 'premium_user'

export interface Permission {
  all?: boolean
  manage_users?: boolean
  manage_bets?: boolean
  manage_transactions?: boolean
  view_analytics?: boolean
  place_bets?: boolean
  view_own_profile?: boolean
  create_transactions?: boolean
  view_matches?: boolean
  approve_bets?: boolean
  view_all_bets?: boolean
  moderate_comments?: boolean
  access_premium_odds?: boolean
  live_betting?: boolean
}

export async function getUserRoles(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: roles, error } = await supabase
    .from('user_roles')
    .select(`
      roles (
        name,
        permissions
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }

  return roles?.map((r: any) => r.roles) || []
}

export async function hasPermission(userId: string, permission: keyof Permission): Promise<boolean> {
  const roles = await getUserRoles(userId)
  
  return roles.some((role: any) => {
    const permissions = role.permissions
    return permissions.includes('all') || permissions.includes(permission)
  })
}

export async function isAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.some((role: any) => role.name === 'admin')
}

export async function isModerator(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.some((role: any) => role.name === 'moderator')
}

export async function isPremiumUser(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.some((role: any) => role.name === 'premium_user')
} 