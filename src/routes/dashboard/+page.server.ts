import type { PageServerLoad } from './$types'
 
export const load: PageServerLoad = async () => ({
  meta: {
    title: 'Dashboard',
    description: 'Mockingbird-ums Dashboard'
  },
})