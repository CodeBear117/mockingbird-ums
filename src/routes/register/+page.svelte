<script lang="ts">
  import { browser } from "$app/environment";
  import { applyAction, enhance } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import { Spinner } from "flowbite-svelte";

  // loading
  type State =
    | "idle"
    | "loading"
    | { name: string; email: string; password: string }
    | Error;
  let state: State = "idle";

  // handle form submit with visual loading indicator
  const handleSubmit = () => {
    state = "loading";
    return async ({ result }: { result: ActionResult }) => {
      if (browser) {
        switch (result.type) {
          case "success":
            if (result.data?.email && result.data?.name) {
              state = {
                name: result.data.name,
                email: result.data.email,
                password: result.data.password,
              };
            } else {
              state = "idle";
            }
            break;

          case "failure":
            if (result.data?.email) {
              state = new Error(result.data.error);
              break;
            } else {
              state = new Error("something went wrong sending your magic link");
            }

          default:
            state = "idle";
            break;
        }
      }
      await applyAction(result);
    };
  };
</script>

<main
  class="flex flex-col justify-center items-center w-full grow bg-slate-900"
>
  <div
    class="bg-slate-800 p-8 border border-slate-600 rounded-lg w-[90%] sm:w-[40%]"
  >
    <h1
      class="font-bold text-3xl bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text mb-3"
    >
      Register
    </h1>
    <p class="mb-4 text-slate-400">
      Already a user? Login <a
        href="/login"
        class="underline hover:text-teal-400">here</a
      >
    </p>
    <form
      method="POST"
      action="?/register"
      use:enhance={handleSubmit}
      class="flex flex-col justify-center"
    >
      <input
        class="py-1 border rounded-lg text-center w-full mb-3"
        type="name"
        name="name"
        placeholder="Your Name"
        required
      />
      <input
        class="py-1 border rounded-lg text-center w-full mb-3"
        type="email"
        name="email"
        placeholder="Your Email"
        required
      />
      <button
        class="bg-gradient-to-r from-green-400 to-cyan-400 py-2 border-0 rounded-lg hover:from-cyan-400 hover:to-green-400 text-white"
        >Submit</button
      >
      {#if state instanceof Error}
        <div>
          {state.message}
        </div>
      {:else if typeof state === "object" && state.email}
        <div class="text-teal-400 pt-2">
          We sent an email to {state.email} - Check your Inbox!
        </div>
      {:else if state === "loading"}
        <div class="pt-4">
          <Spinner size="8" color="green" />
        </div>
      {/if}
    </form>
  </div>
</main>
