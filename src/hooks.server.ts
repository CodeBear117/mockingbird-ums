// this code will run before every req on the backend (Supabase)

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' })
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' })
      },
    },
  })

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getUser = async () => {
    const {
      data: { user }, // session
    } = await event.locals.supabase.auth.getUser() // session
    // check data
    console.log(`hooks.server.ts - getUser check: ${user}`)
    return user // session
  }

  event.locals.getSession = async () => {
    const {
      data: { session }, // session
    } = await event.locals.supabase.auth.getSession() // session
    // check data
    console.log(`hooks.server.ts - getSession check: ${session}`)
    return session // session
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      const allowedHeaders = ['content-range', 'x-supabase-api-version'];
      return allowedHeaders.includes(name);
      //return name === 'content-range'
    },
  })
}