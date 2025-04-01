-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Add trigger for updated_at on roles table
CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Roles are viewable by authenticated users"
  ON roles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert roles"
  ON roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can update roles"
  ON roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for user_roles table
CREATE POLICY "User roles are viewable by authenticated users"
  ON user_roles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage user roles"
  ON user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default roles
INSERT INTO roles (name, permissions) VALUES
  ('admin', '["all", "manage_users", "manage_bets", "manage_transactions", "view_analytics"]'),
  ('user', '["place_bets", "view_own_profile", "create_transactions", "view_matches"]'),
  ('moderator', '["approve_bets", "view_all_bets", "moderate_comments"]'),
  ('premium_user', '["place_bets", "view_own_profile", "create_transactions", "view_matches", "access_premium_odds", "live_betting"]')
ON CONFLICT (name) DO NOTHING;

-- Ensuite, attribuer ces rôles à des utilisateurs spécifiques
-- Remplacez les UUID par les vrais ID de vos utilisateurs
INSERT INTO user_roles (user_id, role_id) VALUES
  -- Administrateur principal (a le rôle admin)
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM roles WHERE name = 'admin')),
  
  -- Un modérateur (a le rôle moderator)
  ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM roles WHERE name = 'moderator')),
  
  -- Un utilisateur premium (a deux rôles : user et premium_user)
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM roles WHERE name = 'user')),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM roles WHERE name = 'premium_user')),
  
  -- Un utilisateur standard (a seulement le rôle user)
  ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM roles WHERE name = 'user'));

-- Pour vérifier les rôles d'un utilisateur spécifique
SELECT u.email, r.name as role_name, r.permissions
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.id = '550e8400-e29b-41d4-a716-446655440002';  -- ID de l'utilisateur premium 