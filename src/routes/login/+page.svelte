<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";

  let emailSentTo: string | null = null;
  let error: string | null = null;

  const handleSuccess = async ({ result }: { result: ActionResult }) => {
    switch (result.type) {
      case "success":
        if (result.data?.email) {
          emailSentTo = result.data.email;
        }
        break;
      case "failure":
        if (result.data?.email) {
          error = result.data.error;
          break;
        }
    }
    await applyAction(result);
  };

  const handleSubmit = () => handleSuccess;
</script>

<main>
  <h1>Login Page</h1>
  <p>Login with Magic Link!</p>
  <form method="POST" use:enhance={handleSubmit}>
    <label>
      <span>email</span>
      <input type="email" name="email" placeholder="Your Email" required />
    </label>
    <button>Send magic link</button>
    {#if emailSentTo}
      <div>
        We sent an email to {emailSentTo} - Check your Inbox!
      </div>
    {/if}
    {#if error}
      <div>
        {error}
      </div>
    {/if}
  </form>
</main>
