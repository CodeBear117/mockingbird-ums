<script>
  import "../app.css";
  import Logo from "$lib/logo.svelte";
  import { GradientButton } from "flowbite-svelte";

  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle the error appropriately
    }
  };
</script>

<div class="flex flex-col min-h-screen">
  <header class="bg-slate-800">
    <nav
      class="flex items-center justify-between border-b border-border border-slate-600 h-[60px] px-10 py-2"
    >
      <Logo />
      <div class="flex gap-4 items-center">
        {#if data.session}
          <button
            class="bg-slate-700 hover:bg-slate-600 py-1 px-6 border-0 rounded-lg text-slate-400"
            on:click={handleSignOut}>Logout</button
          >
        {:else}
          <a
            href="/login"
            class="bg-gradient-to-r from-green-400 to-cyan-400 py-1 px-6 border-0 rounded-lg hover:from-cyan-400 hover:to-green-400 text-white"
            >Login</a
          >
          <a href="/register" class="text-slate-400 hover:text-teal-400"
            >Register</a
          >
        {/if}
      </div>
    </nav>
  </header>

  <slot />
</div>
