// See https://kit.svelte.dev/docs/types#app
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseAuthClient, Session } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import type { User } from "@supabase/supabase-js/dist/module/lib/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient // read from CreateServerClient function types in hooks.server.ts
			getSession: () => Promise<Session | null> 
			getUser: () => Promise<User | null> // need to update rest of code to getUser as recommended in Supabase Docs
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
