<script lang="ts">
  export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<a href="/login">Login</a>

{#if data.session}
  <p>You are logged in as {data.session.user.email}</p>
{:else}
  <p>You are not logged in!</p>
{/if}
