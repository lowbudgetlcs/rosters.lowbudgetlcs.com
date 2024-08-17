<script>
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";

  import { enhance } from "$app/forms";
  export let form;
</script>

<svelte:head>
  <title>Division Management</title>
</svelte:head>

<h1>Division Management</h1>

<CollapsibleSection headerText="Create Division">
  <form use:enhance method="POST" action="?/createDivision">
    <label for="name">Division Name (unique):</label>
    <input type="text" id="name" name="name" required />
    <br />

    <label for="description">Description:</label>
    <textarea name="description" rows="2" cols="20" />
    <br />

    <label for="groups">Number of Groups</label>
    <input type="number" id="groups" name="groups" required />
    <br />

    <label for="tid"
      >Tournament ID (if you don't know it, contact ruuffian)</label
    >
    <input type="text" id="tid" name="tid" required />
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

<CollapsibleSection headerText="Add Team to Division">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque officiis
    quia blanditiis tempora. Nihil voluptate asperiores incidunt eius, esse sit
    sunt, facilis nisi voluptas perspiciatis, fuga unde placeat enim. Totam.
  </p>
</CollapsibleSection>

<CollapsibleSection headerText="Remove Team from Division">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque officiis
    quia blanditiis tempora. Nihil voluptate asperiores incidunt eius, esse sit
    sunt, facilis nisi voluptas perspiciatis, fuga unde placeat enim. Totam.
  </p>
</CollapsibleSection>
