import type { Actions, PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';

export const load: PageServerLoad = async ({locals: {getSession}}) => {
  const session = await getSession()
  // if you are already in a session, redirect to the dashboard
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

    const email = validation.data;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('User does not exist in database:', userError?.message);
      // Handle the case where the user is not found, perhaps by returning an error
      return fail(403, { message: 'No account associated with this email.' });
    };

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: false,
          emailRedirectTo: `${url.origin}/dashboard`
        },
    });

    if(error) {
        return fail(500, { message: 'Did not send magic link'})
    }

    return { email };
  }
}