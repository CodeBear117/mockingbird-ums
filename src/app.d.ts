// See https://kit.svelte.dev/docs/types#app

import type { SupabaseAuthClient, Session } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient // read from CreateServerClient function types in hooks.server.ts
			getSession: () => Promise<Session | null> // need to update to getUser as recommended in Supabase Docs
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
