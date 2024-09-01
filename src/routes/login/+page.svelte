<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="flex flex-col w-screen h-screen p-4">
  <section class="text-lg mx-auto bg-surface-100 p-2 rounded">
    <h1 class="font-bold mx-auto text-2xl">Login</h1>
    <form
      method="POST"
      action="?/login"
      use:enhance
      class="flex-col justify-center"
    >
      <div class="justify-center p-2">
        <label for="username">Username</label>
        <input
          type="username"
          name="username"
          id="username"
          required
          class="rounded border-2 text-black border-slate-400 hover:border-black"
        />
      </div>

      <div class="justify-center p-2">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          class="rounded border-2 text-black border-slate-400 hover:border-black"
        />
      </div>

      <div class="flex w-full justify-right">
        <button
          type="submit"
          class="justify-right rounded p-2 bg-primary-400 hover:bg-primary-500 text-black"
          >Login</button
        >
      </div>

      {#if form?.error}
        <div class="notice error">
          {form.error}
        </div>
      {/if}
    </form>
  </section>
</div>
