<script>
  import { enhance } from "$app/forms";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";

  export let form;
</script>

<svelte:head>
  <title>Team Management</title>
</svelte:head>

<h1>Team Manager</h1>

<CollapsibleSection headerText="Create Team">
  <form use:enhance method="POST" action="?/createTeam">
    <label for="name">Team Name (unique):</label>
    <input type="text" id="name" name="name" required />
    <br />

    <label for="division">Division Name</label>
    <input type="text" id="division" name="division" required />
    <br />

    <label for="group">Group (letter key)</label>
    <input type="text" id="group" name="group" required />
    <br />

    <label for="captain">Captain (not required, can be added later)</label>
    <input type="text" id="captain" name="captain" />
    <br />

    <label for="logo">Logo (imgur direct link, not required)</label>
    <input type="text" id="logo" name="logo" />
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

<CollapsibleSection headerText="Add Player to Team">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque officiis
    quia blanditiis tempora. Nihil voluptate asperiores incidunt eius, esse sit
    sunt, facilis nisi voluptas perspiciatis, fuga unde placeat enim. Totam.
  </p>
</CollapsibleSection>

<CollapsibleSection headerText="Remove Player from Team">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque officiis
    quia blanditiis tempora. Nihil voluptate asperiores incidunt eius, esse sit
    sunt, facilis nisi voluptas perspiciatis, fuga unde placeat enim. Totam.
  </p>
</CollapsibleSection>

<CollapsibleSection headerText="Change Captain">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque officiis
    quia blanditiis tempora. Nihil voluptate asperiores incidunt eius, esse sit
    sunt, facilis nisi voluptas perspiciatis, fuga unde placeat enim. Totam.
  </p>
</CollapsibleSection>
