<script lang="ts">
  import { browser } from "$app/environment";
  import { applyAction, enhance } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import { Spinner } from "flowbite-svelte";

  // loading
  type State = "idle" | "loading" | { email: string } | Error;
  let state: State = "idle";

  const handleSubmit = () => {
    state = "loading";
    return async ({ result }: { result: ActionResult }) => {
      if (browser) {
        switch (result.type) {
          case "success":
            if (result.data?.email) {
              state = { email: result.data.email };
            } else {
              state = "idle";
            }
            break;

          case "failure":
            // check if reason was because email was not associated with account
            if (
              result.data?.error === "No account associated with this email."
            ) {
              window.location.href = "/register"; // Redirect to the registration page
              return; // Exit early
            } else if (result.data?.email) {
              state = new Error(result.data.error);
              break;
            } else {
              state = new Error("something went wrong sending your magic link");
            }

          default:
            state = "idle";
        }
      }
      await applyAction(result);
    };
  };
</script>

<main>
  <h1>Login Page</h1>
  <p>Login with Magic Link!</p>
  <form method="POST" use:enhance={handleSubmit}>
    <label>
      <span>email</span>
      <input type="email" name="email" placeholder="Your Email" required />
    </label>
    <button>send magic link</button>
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
  <p>Not a user? Register <a href="/register" class="underline">here</a></p>
</main>
