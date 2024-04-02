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

<main
  class="flex flex-col -mt-[60px] pt-[90px] px-10 grow bg-slate-900 min-w-80"
>
  <div class="bg-slate-800 p-8 border border-slate-600 rounded-lg">
    <p class="font-bold text-xl sm:text-2xl md:text-3xl text-slate-400 pb-4">
      Welcome, <span
        class="bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text"
        >{data.userName}</span
      >
    </p>
    {#if data.users && data.users.length > 0}
      <Table striped={true} shadow noborder={true} class="bg-slate-700">
        <TableSearch
          classInput="bg-slate-300 placeholder:text-slate-400 hover:bg-slate-200"
          placeholder="Search by name"
          hoverable={true}
          bind:inputValue={searchTerm}
        >
          <TableHead class="text-xs text-slate-400 uppercase bg-slate-600">
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Created</TableHeadCell>
          </TableHead>
          <TableBody>
            {#each filteredItems as user}
              <TableBodyRow class="bg-slate-700 hover:bg-slate-600">
                <TableBodyCell class="text-slate-400">{user.id}</TableBodyCell>
                <TableBodyCell class="text-slate-400">{user.name}</TableBodyCell
                >
                <TableBodyCell class="text-slate-400"
                  >{user.email}</TableBodyCell
                >
                <TableBodyCell class="text-slate-400"
                  >{user.created_at}</TableBodyCell
                >
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
