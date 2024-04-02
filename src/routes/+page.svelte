<script lang="ts">
  export let data;
</script>

<main class="flex flex-col grow px-10 bg-slate-900 -mt-[60px] pt-[60px]">
  <div class="flex flex-col gap-3 py-10">
    <div
      class="bg-slate-800 p-8 border border-slate-600 rounded-lg text-slate-400 flex justify-between items-center"
    >
      {#if data.user}
        <p class="text-sm md:text-base">
          You are currently logged in as <span class="text-teal-400"
            >{data.user.email}</span
          >
        </p>
        <a
          href="/dashboard"
          class="bg-gradient-to-r from-green-400 to-cyan-400 border-0 rounded-lg hover:from-cyan-400 hover:to-green-400 text-white py-1 px-6 text-sm md:text-base"
          >View Dashboard</a
        >
      {:else}
        <p class="text-sm md:text-base">You are not logged in!</p>
      {/if}
    </div>
    <div
      class="bg-slate-800 p-8 border border-slate-600 rounded-lg text-slate-400"
    >
      <h1 class="text-2xl font-bold pb-3">Welcome to the Mockingbird UMS</h1>
      <h2 class="text-lg font-bold">Introduction</h2>
      <p class="pb-3">
        Hey, thanks for reviewing my application and technical challenge. I look
        forward to hearing back from you all soon!
      </p>
      <h2 class="text-lg font-bold">Features</h2>
      <ul class="pb-3">
        <li>
          - Users can log in with their email. Authentication is implemented
          using Supabase.
        </li>
        <li>- Allows new user registration with fields for name and email.</li>
        <li>
          - Protected area user dashboard that displays a list of users from the
          database.
        </li>
        <li>- Displays a welcome message with the user’s name.</li>
        <li>- Includes a functional logout button.</li>
        <li>- A responsive application that is styled using TailwindCSS.</li>
      </ul>
      <h2 class="text-lg font-bold">Challenges</h2>
      <p class="pb-3">
        Given that I come from a background predominently in front-end
        developement, I found aspects of the authentication flow and handling
        challenging, but as I will hopefully demonstrate here, that was nothing
        I couldn't learn quickly and handle! Read more on GitHub!
      </p>
      <h2 class="text-lg font-bold">Links</h2>
      <p class="pb-3">
        <a
          class="underline hover:text-teal-400"
          href="https://github.com/CodeBear117/mockingbird-ums">Github</a
        >
      </p>
    </div>
  </div>
</main>
