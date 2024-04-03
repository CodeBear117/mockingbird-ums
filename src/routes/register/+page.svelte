<script lang="ts">
  import { browser } from "$app/environment";
  import { applyAction, enhance } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import { Spinner } from "flowbite-svelte";

  // loading
  type State = "idle" | "loading" | { email: string } | Error;
  let state: State = "idle";

  // handle form submit with visual loading indicator
  const handleSubmit = () => {
    state = "loading";

    return async ({ result }: { result: ActionResult }) => {
      if (browser) {
        switch (result.type) {
          case "success":
            // set state with email for UI notification
            if (result.data?.email) {
              state = {
                email: result.data.email,
              };
            } else {
              state = "idle";
            }
            break;

          case "failure":
            if (result.status === 500) {
              state = new Error("500 - Error signing up");
            }
            // return error if email associated with existing account
            if (result.status === 409) {
              state = new Error("409 - User already exists. Please login.");
            } else {
              state = new Error(
                "Something went wrong" // need to target specific errors
              );
            }
            break;

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
  class="flex flex-col justify-center items-center -mt-[60px] pt-[70px] w-full grow bg-slate-900"
>
  <div
    class="bg-slate-800 px-8 py-10 border border-slate-600 rounded-lg w-[90%] sm:w-[40%]"
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
        class="py-1 rounded-lg text-center w-full mb-3 bg-slate-300 placeholder:text-slate-400 hover:bg-slate-200"
        type="name"
        name="name"
        placeholder="Your Name"
        required
      />
      <input
        class="py-1 rounded-lg text-center w-full mb-3 bg-slate-300 placeholder:text-slate-400 hover:bg-slate-200"
        type="email"
        name="email"
        placeholder="Your Email"
        required
      />
      <input
        class="py-1 rounded-lg text-center w-full mb-3 bg-slate-300 placeholder:text-slate-400 hover:bg-slate-200"
        type="password"
        name="password"
        placeholder="Your Password"
        required
      />
      <button
        class="bg-gradient-to-r from-green-400 to-cyan-400 py-2 border-0 rounded-lg hover:from-cyan-400 hover:to-green-400 text-white"
        >Submit</button
      >
      {#if state instanceof Error}
        <div class="text-red-500 pt-2">
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
