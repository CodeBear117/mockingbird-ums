// auth confirmation route

import { redirect } from '@sveltejs/kit'
import { type EmailOtpType } from '@supabase/supabase-js'

// obtain auth params from url string
export const GET = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event
  const token_hash = url.searchParams.get('token_hash') as string
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/dashboard'

  // if both token hash and OTP are recieved
  console.log('auth/confirm', {token_hash, type, next})
  if (token_hash && type) {
    // run server auth and obtain result of verification
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
        // if not error, redirect to next i.e. dashboard
      redirect(303, `/${next.slice(1)}`)
    } else {
        // else redirect to login within error notice
      redirect(303, '/login?error=verify_error')
    }
  }

  // return the user to login page
  redirect(303, '/login')
}