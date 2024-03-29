<script lang="ts">
  export let data;
</script>

<main>
  <p>Welcome to the Dashboard</p>
  {#if data.session}
    <p>You are logged in as {data.session.user.email}</p>
  {/if}
</main>
