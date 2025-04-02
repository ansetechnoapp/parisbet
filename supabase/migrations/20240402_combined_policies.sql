-- First, clean up existing policies
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

-- Drop existing policies for transactions table
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;

-- Reset RLS
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Reset permissions
REVOKE ALL ON roles FROM anon, authenticated;
REVOKE ALL ON user_roles FROM anon, authenticated;
REVOKE ALL ON user_profiles FROM anon, authenticated;
REVOKE ALL ON transactions FROM anon, authenticated;

-- Now, create new policies
-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Grant basic access to authenticated users
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT, INSERT ON transactions TO authenticated;

-- Create a function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uid
    AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple policy for roles table - all authenticated users can read
CREATE POLICY "Authenticated users can read roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Basic policy for user_roles - users can read their own roles
CREATE POLICY "Users can read their own roles"
ON user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admin policy for user_roles - admins can read all
CREATE POLICY "Admins can read all user_roles"
ON user_roles
FOR SELECT
USING (is_admin(auth.uid()));

-- Admin policy for roles - admins can modify roles
CREATE POLICY "Admins can modify roles"
ON roles
FOR ALL
USING (is_admin(auth.uid()));

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all profiles"
ON user_profiles
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can modify profiles"
ON user_profiles
FOR ALL
USING (is_admin(auth.uid()));

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
ON transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
ON transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
ON transactions
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update transactions"
ON transactions
FOR UPDATE
USING (is_admin(auth.uid())); 