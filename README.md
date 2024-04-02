# mockingbird-ums

01-04-2024

## Local Installation & development

1. Clone this repo into a local folder. In your terminal:

   ```bash
   git clone {HTTPS string found on code tab of this Repo} {folder-name}
   ```

2. Open your code editor and open the folder you created.
3. Open your terminal, ensuring that you are in the project's dir. Run the following command to install the project's dependencies:

   ```bash
   npm install
   ```

   \*(or `pnpm install` or `yarn`)

4. Start a development server:

   ```bash
   npm run dev
   ```

5. Add an STMP server for Supabase to avoid email rate limiting (optional)

6. Start Supabase CLI (optional)

   - install Docker then run:

     ```bash
     supabase init

     supabase start
     ```

## General Structure

This app is coded in SvelteKit and as such the structure is based on slots and wrappers. SvelteKit employs file-based routing meaning that the app's folder structure is also the general app structure.

### Notable Folders

- `/src`: contains the main sections of code including assets (in /lib), routes, top-level html file, and a hooks file.
- `/routes`: contains all the pages of the app including Welcome, Login, Register, and Dashboard.
  - `/auth`: contains the token hash confirmation logic for the PKCE route.
  - `/dashboard`: contains the frontend and backend code for the dashboard page/route on the app.
  - `/login`: contains the frontend and backend code for the login page/route on the app.
  - `/register`: contains the frontend and backend code for the register page/route on the app.
- `/supabase`: contains a local instance of the database and is not used in production/build.

### Notable Files

- `.env`: contains the enviroment variables that should NOT be exposed anywhere client-side.
- `src/+layout.server.ts`,`src/+layout.ts`: provide the server/client load methods.
- `hooks.server.ts`: contains the code that will run for every request made to the backend using a supabase server client.
- `package.json`: lists the dependencies of the project.
- `tailwind.config.js`: configures TailwindCSS for styling the entire app.

## Challenges

### Initial setup

Given that I have never used SvelteKit before, I found it challenging intially to get orientated with the page and layout structure so much of my initial research was how to set up and navigate the files and folders of the project. I found the documentation provided by Sveltekit very useful, as they provide short interactive tutorial within the docs. I also used YouTube extensively where people were building demo projects with Sveltekit and Supabase.

### PKCE and Server Side Rendering

Given that SvelteKit is a full stack framework, I found it challenging learning and implementing the PKCE authentication flow. The main issue was seeing the result of my code, which is what I am used to given my background in frontend development. `console.log` was a life-saver, as well as the docs provided by Supabase.

### User registration

Although I managed to get the login page working well, I spent a lot of time working on the registration page. The main issue was the handling of the user's form data. The command provided by Supabase for sign up that was consistent with PKCE flow was:

```bash
supabase.auth.signInWithOtp

shouldCreateUser: true
```

as well as

```bash
supabase.auth.signUp
```

I tried both methods.

My reason for trying the `supabase.auth.signInWithOtp` method was that I wanted the form to be simple, passwordless and filled only once. I realised that the user's data did NOT get populated in the `user` table on Supabase, instead, it is populated in an `auth.users` table. This meant that a new row in the users has `ID` and `created_at` column data but no `email` or `name` data. This would result in the user getting logged in, but also not being able to see the protected `/dashboard`, which returned a `500 - internal error`. I tested multiple potential solutions:

- Waiting for the session to change to 'authenticated' before posting the data as an `INSERT` to the users table.

  ```bash
  supabase.auth.onAuthStateChange
  ```

This failed because I realised later that it was a client-side method and I ws trying to erranously run client side code within my `register/+page.server.ts`. I think this approach would have worked if I was working from the client-side, but it would be much less secure, hence I abandoned it.

- Creating a second table `backup` and related to the `users` based on the `ID`, posting the form data to this `backup` table, and then updating the `users` table based on the relation. This method essentially created a duplicate table and I did not deem it useful or productive.

- I then tried the `supabase.auth.signUp` method. This method has a drawback because the user has to provide a password on top of their email and name (which were the original requirements of the registration form/page for this task).

Upon further consideration, I realised that my first approach might have worked if I had used an SQL query to populate the `users` table with any new rows added to the `auth.data` table. I wrote the following query:

```bash
create table
  users (
    id uuid references auth.users not null primary key,
    email text unique not null,
    name text,
    created_at timestamp with time zone default current_timestamp
  );

alter table
  users enable row level security;

create policy
  "Can view all user data" on users for
select
  using (true);

create policy
  "Can update user data" on users for
update
  using (true);

create policy
  "can insert user data" on users for
insert
  with check (true);

create
or replace function public.handle_new_user () returns trigger as $$
begin
  if new.raw_user_meta_data->>'display_name' is null or new.raw_user_meta_data->>'display_name' = '' then
    new.raw_user_meta_data = jsonb_set(new.raw_user_meta_data, '{display_name}', '"pre-generated-name"' ::jsonb);
  end if;

  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
    execute procedure public.handle_new_user();
```

## Final comments

Overall, I found the project challenging, but rewarding. I actually really liked building this full stack application, as it gave me a wholistic picture of the application.
