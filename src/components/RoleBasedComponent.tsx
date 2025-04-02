import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface RoleBasedComponentProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'moderator' | 'user' | 'premium_user'
  requiredPermission?: string
}

export default function RoleBasedComponent({
  children,
  requiredRole,
  requiredPermission
}: RoleBasedComponentProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setHasAccess(false)
        setIsLoading(false)
        return
      }

      if (requiredRole) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('roles (name)')
          .eq('user_id', session.user.id)
          .single()

        const userRole = roles?.roles?.name
        setHasAccess(userRole === 'admin' || userRole === requiredRole)
      }

      if (requiredPermission) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('roles (permissions)')
          .eq('user_id', session.user.id)

        const hasPermission = roles?.some((role: any) => {
          const permissions = role.roles.permissions
          return permissions.includes('all') || permissions.includes(requiredPermission)
        })

        setHasAccess(hasPermission || false)
      }

      setIsLoading(false)
    }

    checkAccess()
  }, [requiredRole, requiredPermission])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}