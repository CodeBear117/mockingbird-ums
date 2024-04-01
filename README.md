# Welcome to my project: mockingbird-ums

01-04-2024

## Local Installation

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Challenges

### 1. User registration

Although I managed to get the login page working well, I spent a lot of time working on the registration page. The main issue was the handling of the user's form data. The command provided by Supabase for sign up that was consistent with SSR PKCE flow was:

```bash
supabase.auth.signInWithOtp

shouldCreateUser: true
```

I decided to do it this way because I wanted the form to be simple, passwordless and filled only once. I realised that the user's data does NOT get populated in the 'user' table on Supabase, instead, it is populated in an auth.users table. This means that the row has `ID` and `created_at` column data but no `email` or `name` data. This would result in the user getting logged in, but also not being able to see the protected `/dashboard`, which returned a `500 - internal error`. I tested multiple potential solutions:

- Waiting for the session to change to 'authenticated' before posting the data as an `INSERT` to the users table.

  ```bash
  supabase.auth.onAuthStateChange
  ```

  This failed because I realised later that it was a client-side method and I ws trying to erranously run client side code within my `register/+page.server.ts`. I think this approach would have worked if I was working from the client-side, but it would be much less secure, hence I abandoned it.

- Creating a second table `backup` and related to the `users`, posting to this `backup` table, and then updating the `users` table based on the relation.
