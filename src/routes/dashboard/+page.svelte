<script lang="ts">
  //export let data;
  export let data: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      created_at: string;
    }>;
  };
</script>

<main>
  <p>Welcome to the Dashboard</p>
  {#if data.users && data.users.length > 0}
    <h2>User List:</h2>
    <ul>
      {#each data.users as user}
        <li>{user.id}</li>
        <li>{user.name}</li>
        <li>{user.email}</li>
        <li>{user.created_at}</li>
        <!-- Display user email, add more fields as needed -->
      {/each}
    </ul>
  {:else}
    <p>No users found.</p>
  {/if}
</main>
