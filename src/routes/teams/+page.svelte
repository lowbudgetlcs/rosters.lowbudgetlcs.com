<script>
  import { enhance } from "$app/forms";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";

  export let form;
  export let data;
</script>

<svelte:head>
  <title>Team Management</title>
</svelte:head>

<div class="flex flex-col">
  <h1 class="font-bold text-5xl mb-2">Team Manager</h1>
  <p class="italic mb-8">Click each section to reveal the form</p>
</div>

<div class="text-lg">
  <CollapsibleSection headerText="Create Team">
    <div class="flex flex-row">
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
      <!-- Display team listing -->
      <div class="ml-2 w-full max-h-56 overflow-auto">
        {#if data.error}
          <li>{data.error}</li>
        {:else}
          <ul>
            {#each data.teams as team}
              <li class="flex flex-row">
                <p class="mx-2">{team.name}</p>
                <p class="mx-2">
                  {team?.divisionName ? team.divisionName : "NO_DIVISION"}
                </p>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </CollapsibleSection>

  <CollapsibleSection headerText="Add Player to Team">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
      officiis quia blanditiis tempora. Nihil voluptate asperiores incidunt
      eius, esse sit sunt, facilis nisi voluptas perspiciatis, fuga unde placeat
      enim. Totam.
    </p>
  </CollapsibleSection>

  <CollapsibleSection headerText="Remove Player from Team">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
      officiis quia blanditiis tempora. Nihil voluptate asperiores incidunt
      eius, esse sit sunt, facilis nisi voluptas perspiciatis, fuga unde placeat
      enim. Totam.
    </p>
  </CollapsibleSection>

  <CollapsibleSection headerText="Change Captain">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
      officiis quia blanditiis tempora. Nihil voluptate asperiores incidunt
      eius, esse sit sunt, facilis nisi voluptas perspiciatis, fuga unde placeat
      enim. Totam.
    </p>
  </CollapsibleSection>
</div>
