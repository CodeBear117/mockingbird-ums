import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
 
export const load: PageServerLoad = async ({locals: {getUser, supabase}}) => {

  const user = await getUser();

  // if you are not logged in, redirect to login page
  if (!user) {
    redirect(303, '/login');
  };
  //console.log(`Dashboard check for session: ${user}`)

  // Fetch all users from the database
  const { data: users, error } = await supabase
    .from('users')
    .select('*');
  //console.log(`Database users table data received: ${users}`)

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  };

  // Also fetch the name of the currently logged in user
  const userEmail = user.email; // session.user.email
  
  const loggedInUser = users.find(user => user.email === userEmail);

  //console.log(`Dashoard recognises current user email from database: ${userEmail}`)
  //console.log(`Dashoard recognises current user from database: ${loggedInUser}`)

  // handle type error on 'name' - developement only - remove block when registration works
  if (!loggedInUser) {
    console.error('Logged-in user not found in the database');
    throw new Error('Logged-in user not found');
  };

  const userName = loggedInUser.name;

  return ({
    meta: {
      title: 'Dashboard',
      description: 'Mockingbird-ums Dashboard'
    },
    users, // Pass the users data to the client-side
    userName, // Pass the logged-in user's name to the client-side
  });
};