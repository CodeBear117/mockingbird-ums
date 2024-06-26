// universal load method (server or client)

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends('supabase:auth');

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {

    global: {
      fetch,
    },

    cookies: {
      get(key) {
        if (!isBrowser()) {
          return JSON.stringify(data.user);
        };

        const cookie = parse(document.cookie);
        return cookie[key];
      },
    },
  });

  // Supabase recommends getUser over getSession for security
  const { 
    data: { user }, 
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  //console.log(`Load function for all pages: ${supabase} ${user} ${session} `)
  return { supabase, session, user };
};