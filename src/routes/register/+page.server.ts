import type { Actions, PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';

export const load: PageServerLoad = async ({locals: { getUser }}) => { // getSession
  const user = await getUser() // getSession
  // if you are already in an authenticated session, redirect to the dashboard
  if (user) {
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
  name: z.string().min(1, "Name is required").max(255, "surely your name isn't that.."),
  email: z.string().email(),
  password: z.string().min(8, "Password must be more than 8 characters"),
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

    const { name, email, password} = validation.data;
    console.log(`registration form data sent for auth: ${JSON.stringify(validation)}`)

    // query db
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email); // filter results where email in db equals email from form
    console.log(`database check for existing user (should not exist): ${userData}`)

      // handle errors
      if (userError) {
        console.error('SERVER Error querying database:', userError.message);
        return fail(500, { message: 'SERVER Error checking user existence.' });
      };

      // if user already exists (based on email query above)
      if (userData.length > 0) {
        return fail(409, { message: 'SERVER User already exists. Please login.' });
      };
    
    // METHOD 1: SUPABASE.AUTH.SIGNINWITHOTP + SHOULDCREATEUSER=TRUE
    // if no errors (i.e the user does not already exist), send to Supabase for Auth
    // const { data: { user: userAuthData, session: sessionData }, error: signUpError } = await supabase.auth.signInWithOtp({
    //   email,
    //   options: {
    //     // set this to false if you do not want the user to be automatically signed up
    //     shouldCreateUser: true,
    //     // emailRedirectTo: `${url.origin}/dashboard`
    //   },
    // });

    // METHOD 2: SUPABASE.AUTH.SIGNUP
    // if no errors (i.e the user does not already exist), send to Supabase for Auth
    const { data: { user: userAuthData, session: sessionData }, error: AuthError } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            name: name
          }
        }
      }
    )

    console.log(`Data sent to Supabase for sign up: ${userAuthData}, ${sessionData}`)

    // // this is poorly done, but in the absense of time, it had to be implemented,     
    // const { data: tableData, error: postGrestError } = await supabase
    // .from('users')
    // .update({ email: email, name: name })
    // .is('email', null)

    // if (postGrestError) {
    //   console.error('SERVER Error storing temporary user data:', postGrestError.message);
    //   return fail(500, { message: 'SERVER Error processing your registration.' });
    // }

    // If there's an error with signing up, return an appropriate response
    if (AuthError) {
      console.error('SERVER Error signing up:', AuthError.message);
      return fail(500, { message: AuthError.message });
    };

    // else, return confirmation
    return { email, message: 'Registration successful!' };
  }
}