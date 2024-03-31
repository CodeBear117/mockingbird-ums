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
  <h1>Registration Page</h1>
  <form method="POST" use:enhance={handleSubmit}>
    <label>
      <span>name</span>
      <input type="name" name="name" placeholder="Your Name" required />
    </label>
    <label>
      <span>email</span>
      <input type="email" name="email" placeholder="Your Email" required />
    </label>
    <label>
      <span>password</span>
      <input type="password" name="password" placeholder="Password" required />
    </label>
    <button>Submit</button>
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
  <p>Already a user? Login <a href="/login" class="underline">here</a></p>
</main>
