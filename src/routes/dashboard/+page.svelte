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

<main class="flex flex-col pt-10 px-10 grow bg-slate-900">
  <div class="bg-white p-8 border border-gray-300 rounded-lg">
    <p class="font-bold text-3xl px-5">
      Welcome, <span
        class="bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text"
        >{data.userName}</span
      >
    </p>
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
  </div>
</main>
