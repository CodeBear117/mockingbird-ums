CREATE TABLE users (
    id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
    name text,
    email text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users only" ON "public"."users"
TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."users"
TO authenticated WITH CHECK (TRUE);

CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, name, email)
    VALUES (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'email');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();