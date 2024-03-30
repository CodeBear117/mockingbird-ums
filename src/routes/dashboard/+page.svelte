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
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  let searchTerm = "";
  $: filteredItems = data.users.filter(
    (user) => user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );
</script>

<!-- <script>
  
  let items = [
    { id: 1, maker: 'Toyota', type: 'ABC', make: 2017 },
    { id: 2, maker: 'Ford', type: 'CDE', make: 2018 },
    { id: 3, maker: 'Volvo', type: 'FGH', make: 2019 },
    { id: 4, maker: 'Saab', type: 'IJK', make: 2020 }
  ];
  $: filteredItems = items.filter((item) => item.maker.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
</script> -->
<main>
  <p>Welcome to the Dashboard</p>
  {#if data.users && data.users.length > 0}
    <h2>User List:</h2>
    <Table striped={true} color="purple">
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
<!-- <main>
  <p>Welcome to the Dashboard</p>
  {#if data.users && data.users.length > 0}
    <h2>User List:</h2>
    <ul>
      {#each data.users as user}
        <li>{user.id}</li>
        <li>{user.name}</li>
        <li>{user.email}</li>
        <li>{user.created_at}</li>
      {/each}
    </ul>
  {:else}
    <p>No users found.</p>
  {/if}
</main> -->
