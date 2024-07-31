<script>
  import { enhance } from '$app/forms';

  export let form;
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h1>Login</h1>

<section>
  <form method="POST" action="?/login" use:enhance>
    <label for="username">Username</label>
    <input type="username" name="username" id="username" required />

    <label for="password">Password</label>
    <input type="password" name="password" id="password" required />

    <button type="submit">Login</button>

    {#if form?.error}
      <div class="notice error">
        {form.error}
      </div>
    {/if}
  </form>
</section>