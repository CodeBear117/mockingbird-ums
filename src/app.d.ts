// See https://kit.svelte.dev/docs/types#app
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseAuthClient, User } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import type { User } from "@supabase/supabase-js/dist/module/lib/types";

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient // read from CreateServerClient function types in hooks.server.ts
			getSession: () => Promise<Session | null> 
			getUser: () => Promise<User | null>
		};
	};
};

export {};
