<script>
  import { enhance } from "$app/forms";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";

  export let form;
</script>

<svelte:head>
  <title>Player Management</title>
</svelte:head>

<h1>Player Manager</h1>
<CollapsibleSection headerText="Create Player">
  <form use:enhance method="POST" action="?/createPlayer">
    <label for="name">Primary Account (with #NA1 etc)</label>
    <input type="text" id="name" name="name" required />
    <br />

    <label for="team">Team Name (not required)</label>
    <input type="text" id="team" name="team" />
    <br />

    <button type="submit">Submit</button>

    {#if form?.error}
      <div class="notice error">
        {form.error}
      </div>
    {/if}
    {#if form?.message}
      <!-- this message is ephemeral; it exists because the page was rendered in
            response to a form submission. it will vanish if the user reloads -->
      {form.message}
    {/if}
  </form>
</CollapsibleSection>

<CollapsibleSection headerText="Add Account to Player">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque officiis
    quia blanditiis tempora. Nihil voluptate asperiores incidunt eius, esse sit
    sunt, facilis nisi voluptas perspiciatis, fuga unde placeat enim. Totam.
  </p>
</CollapsibleSection>
