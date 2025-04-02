-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Ensure public access is restricted
REVOKE ALL ON user_roles FROM anon;
REVOKE ALL ON roles FROM anon;
REVOKE ALL ON user_profiles FROM anon;

-- Grant basic access to authenticated users
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT, UPDATE ON user_profiles TO authenticated;

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

-- Users can read and update their own profile
CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Admin policies based on user_roles
CREATE POLICY "Admins can read all user_roles"
ON user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_id = (SELECT id FROM roles WHERE name = 'admin' LIMIT 1)
  )
);

CREATE POLICY "Admins can read all profiles"
ON user_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_id = (SELECT id FROM roles WHERE name = 'admin' LIMIT 1)
  )
);

CREATE POLICY "Admins can modify profiles"
ON user_profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_id = (SELECT id FROM roles WHERE name = 'admin' LIMIT 1)
  )
);

-- Admin policy for roles - admins can modify roles
CREATE POLICY "Admins can modify roles"
ON roles
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_id = (SELECT id FROM roles WHERE name = 'admin' LIMIT 1)
  )
); 