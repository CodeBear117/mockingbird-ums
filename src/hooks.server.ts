// this code will run before every req on the backend (Supabase)

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

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
  });

  event.locals.getUser = async () => {

    const {
      data: { user },
    } = await event.locals.supabase.auth.getUser();
    // check data
    //console.log(`hooks.server.ts - getUser check: ${user}`)
    return user
  };

  event.locals.getSession = async () => {

    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    // check data
    //console.log(`hooks.server.ts - getSession check: ${session}`)
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      // headers allow getUser to work correctly
      const allowedHeaders = ['content-range', 'x-supabase-api-version'];
      return allowedHeaders.includes(name);
      //return name === 'content-range'
    },
  });
};