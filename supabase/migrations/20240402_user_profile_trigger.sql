-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, first_name, last_name, city, neighborhood, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'neighborhood', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for existing users who don't have one
INSERT INTO public.user_profiles (user_id, first_name, last_name, city, neighborhood, country)
SELECT 
  users.id,
  COALESCE(users.raw_user_meta_data->>'first_name', 'Unknown'),
  COALESCE(users.raw_user_meta_data->>'last_name', 'Unknown'),
  COALESCE(users.raw_user_meta_data->>'city', 'Unknown'),
  COALESCE(users.raw_user_meta_data->>'neighborhood', 'Unknown'),
  COALESCE(users.raw_user_meta_data->>'country', 'Unknown')
FROM auth.users
LEFT JOIN public.user_profiles ON users.id = user_profiles.user_id
WHERE user_profiles.user_id IS NULL; 