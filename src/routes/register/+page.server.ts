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
  name: z.string().min(1, "Name is required").max(255, "surely your name isn't that..")
});

// Supabase prescribes signUp()
export const actions: Actions = {

  // action: register based on form action
  register: async ({request, url, locals: { supabase }}) => {
    const formData = await request.formData();
    const validation = RegistrationSchema.safeParse(Object.fromEntries(formData));
    if (!validation.success) {
      return fail(400, { fieldErrors: validation.error.flatten().fieldErrors });
    };

    const { email, name} = validation.data;

    // query db
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email) // filter results where email in db equals email from form
    
      // handle errors
      if (userError) {
        console.error('Error querying database:', userError.message);
        return fail(500, { message: 'Error checking user existence.' });
      };

      // if user already exists (based on email query above)
      if (userData.length > 0) {
        return fail(409, { message: 'User already exists. Please login.' });
      };
    
    // if no errors (i.e the user does not already exist), send to Supabase for Auth
    const { error: signUpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
      },
    });

    // this is poorly done, but in the absense of time, it had to be implemented,     
    const { data: tableData, error: postGrestError } = await supabase
    .from('users')
    .update({ email: email, name: name })
    .is('email', null)

    console.log(tableData)

    if (postGrestError) {
      console.error('Error storing temporary user data:', postGrestError.message);
      return fail(500, { message: 'Error processing your registration.' });
    }

    // If there's an error with signing up, return an appropriate response
    if (signUpError) {
      console.error('Error signing up:', signUpError.message);
      return fail(500, { message: signUpError.message });
    };

    // else, return confirmation
    return { message: 'Registration successful!' };
  }
}