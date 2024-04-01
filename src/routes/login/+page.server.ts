import type { Actions, PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';

export const load: PageServerLoad = async ({locals: {getSession}}) => {
  const session = await getSession()
  // if you are already in an authenticated session, redirect to the dashboard
  if (session) {
    redirect(303, '/dashboard')
  }
  return {
    meta: {
      title: 'Login',
      description: 'Login to the Mockingbird-ums'
    },
  }
}

// validation
const MagicLoginSchema = z.string().email()

// Supabase prescribes signInWithOtp()
export const actions: Actions = {

  default: async ({request, url, locals: { supabase }}) => {
    const formData = await request.formData();
    const validation = MagicLoginSchema.safeParse(formData.get('email'))
    if (!validation.success) {
        return fail(400, { message: 'invalid email' })
    };
    
    // use email to query db
    const email = validation.data;

    // check if the inputted email exists in the db already
    const { error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)

      // handle errors
      if (userError) {
        console.error('Error querying database:', userError.message);
        return fail(403, { message: 'No account associated with this email.' });
      }

    // if userData exists for the attempted email, then send to Supabase for Auth
    const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: false,
          emailRedirectTo: `${url.origin}/dashboard`
        },
    });

    // handle error of link not sending
    if(signInError) {
        console.error('Error signing in:', signInError.message);
        return fail(500, { message: signInError.message })
    }

    // else, return the email
    return { email };
  }
}