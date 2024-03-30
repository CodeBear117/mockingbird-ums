import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
 
export const load: PageServerLoad = async ({locals: {getSession}}) => {
  const session = await getSession()
  // if you are not logged in, redirect to login page
  if (!session) {
    redirect(303, '/login')
  }
  return ({
    meta: {
      title: 'Dashboard',
      description: 'Mockingbird-ums Dashboard'
    },
  })
}