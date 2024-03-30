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
    .from('users') // Replace 'users' with your actual user table name
    .select('*'); // Selects all columns

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

  return ({
    meta: {
      title: 'Dashboard',
      description: 'Mockingbird-ums Dashboard'
    },
    users, // Pass the users data to the client-side
  })
}