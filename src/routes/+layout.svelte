<script>
  import "../app.css";
  import Logo from "$lib/logo.svelte";
  import { GradientButton } from "flowbite-svelte";
  import { redirect } from "@sveltejs/kit";

  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // redirect the user to landing
  };
</script>

<header class="bg-slate-800">
  <nav
    class="flex items-center justify-between border-b border-border h-[60px] px-4 py-2"
  >
    <Logo />
    <div class="flex gap-4 items-center">
      {#if data.session}
        <GradientButton on:click={handleSignOut} outline color="greenToBlue"
          >Logout</GradientButton
        >
      {:else}
        <GradientButton color="greenToBlue" href="/login">Login</GradientButton>
      {/if}

      <a href="/register" class="text-white hover:text-green-400">Register</a>
    </div>
  </nav>
</header>

<slot />
