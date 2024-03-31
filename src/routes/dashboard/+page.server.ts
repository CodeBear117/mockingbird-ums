import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
 
export const load: PageServerLoad = async ({locals: {getSession, supabase}}) => {
  const session = await getSession()
  // if you are not logged in, redirect to login page
  if (!session) {
    redirect(303, '/login')
  }

  // Fetch all users from the database
  const { data: users, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

  // Also fetch the name of the currently logged in user
  const userEmail = session.user.email;
  const loggedInUser = users.find(user => user.email === userEmail);

  // handle type error on 'name' - developement only - remove block when registration works
  if (!loggedInUser) {
    console.error('Logged-in user not found in the database');
    throw new Error('Logged-in user not found');
  }

  const userName = loggedInUser.name;

  return ({
    meta: {
      title: 'Dashboard',
      description: 'Mockingbird-ums Dashboard'
    },
    users, // Pass the users data to the client-side
    userName, // Pass the logged-in user's name to the client-side
  })
}