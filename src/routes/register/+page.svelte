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
              console.log(state); // check
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

<main>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center">
    <div class="max-w-md w-full mx-auto">
      <div class="bg-white p-8 border border-gray-300 rounded-lg">
        <h1
          class="font-bold text-3xl bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text mb-3"
        >
          Register
        </h1>
        <p class="mb-4">
          Already a user? Login <a href="/login" class="underline">here</a>
        </p>
        <form
          method="POST"
          use:enhance={handleSubmit}
          class="flex flex-col justify-center"
        >
          <label>
            <input
              class="py-1 border rounded-lg text-center w-full mb-3"
              type="name"
              name="name"
              placeholder="Your Name"
              required
            />
          </label>
          <label>
            <input
              class="py-1 border rounded-lg text-center w-full mb-3"
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
          </label>
          <label>
            <input
              class="py-1 border rounded-lg text-center w-full mb-3"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </label>
          <button
            class="bg-gradient-to-r from-green-400 to-cyan-400 py-2 border rounded-lg hover:from-cyan-400 hover:to-green-400 text-white"
            >Submit</button
          >
          {#if state instanceof Error}
            <div>
              {state.message}
            </div>
          {:else if typeof state === "object" && state.email}
            <div>
              We sent an email to {state.email} - Check your Inbox!
            </div>
          {:else if state === "loading"}
            <Spinner size="8" />
          {/if}
        </form>
      </div>
    </div>
  </div>
</main>
