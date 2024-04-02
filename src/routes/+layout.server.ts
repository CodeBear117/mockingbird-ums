// load method - server side
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { getUser } }) => { // getSession
  return {
    user: await getUser(), // getSession
  }
};