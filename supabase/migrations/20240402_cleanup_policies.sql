-- Drop existing policies for roles table
DROP POLICY IF EXISTS "Authenticated users can read roles" ON roles;
DROP POLICY IF EXISTS "Admins can modify roles" ON roles;
DROP POLICY IF EXISTS "Everyone can read roles" ON roles;
DROP POLICY IF EXISTS "Only admins can modify roles" ON roles;

-- Drop existing policies for user_roles table
DROP POLICY IF EXISTS "Users can read their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can read all user_roles" ON user_roles;

-- Drop existing policies for user_profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can modify profiles" ON user_profiles;

-- Reset RLS
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Reset permissions
REVOKE ALL ON roles FROM anon, authenticated;
REVOKE ALL ON user_roles FROM anon, authenticated;
REVOKE ALL ON user_profiles FROM anon, authenticated; 