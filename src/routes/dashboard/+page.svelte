<script lang="ts">
  // receive data from server and assign types
  export let data: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      created_at: string;
    }>;
    userName: string;
  };

  // flowbite-svelte is an opensource provider of frontend assets
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";

  // configure search functionality based on Name
  let searchTerm = "";
  $: filteredItems = data.users.filter(
    (user) => user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );
</script>

<main class="px-10 mt-10">
  <p>Welcome, {data.userName}</p>
  {#if data.users && data.users.length > 0}
    <Table striped={true}>
      <TableSearch
        placeholder="Search"
        hoverable={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Created</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each filteredItems as user}
            <TableBodyRow>
              <TableBodyCell>{user.id}</TableBodyCell>
              <TableBodyCell>{user.name}</TableBodyCell>
              <TableBodyCell>{user.email}</TableBodyCell>
              <TableBodyCell>{user.created_at}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </Table>
  {:else}
    <p>No users found.</p>
  {/if}
</main>
