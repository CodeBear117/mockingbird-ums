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
      title: 'Register',
      description: 'Register to the Mockingbird-ums'
    },
  }
}

// validate form inputs
const RegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be greater than 8 characters"),
});


// Supabase prescribes signInWithOtp()
export const actions: Actions = {

  default: async ({request, url, locals: { supabase }}) => {
    const formData = await request.formData();
    const validation = RegistrationSchema.safeParse(Object.fromEntries(formData));
    if (!validation.success) {
      return fail(400, { fieldErrors: validation.error.flatten().fieldErrors });
    };
    
    // use email to query db
    const { email, name, password } = validation.data;
 
    // check if the inputted email exists in the db already
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)

      // check user data
      console.log(`serverside registration check formData: ${formData}`)
      console.log(`serverside registration check userData: ${userData}`)

      // handle errors
      if (userError) {
        console.error('Error querying database:', userError.message);
        return fail(500, { message: 'Error checking user existence.' });
      };

      // if user already exists
      if (userData.length === 0) {
        fail(400, { message: 'User already exists. Please login.' });
      };

    // send to Supabase for Auth
    const { error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: `${url.origin}/login` // redirect back to login so they can login and verify email
        }
      }
    );

    // If there's an error with signing up, return an appropriate response
    if (signUpError) {
      console.error('Error signing up:', signUpError.message);
      return fail(500, { message: signUpError.message });
    };

    // else, return confirmation
    return { message: 'Registration successful. Please check your email to verify your account.' };
  }
}