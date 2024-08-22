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
<div class="flex flex-row text-lg">
  <div class="flex flex-col">
    <CollapsibleSection headerText="Create Team">
      <form
        use:enhance
        method="POST"
        action="?/createTeam"
        class="flex flex-col w-full rounded-xl p-2 bg-surface-300"
      >
        <label for="name">Team Name (unique):</label>
        <input
          type="text"
          id="name"
          name="name"
          class="w-80 text-surface-200 p-1"
          required
        />
        <br />
        <label for="division">Division Name</label>
        <input
          type="text"
          id="division"
          name="division"
          class="w-80 text-surface-200 p-1"
          required
        />
        <br />
        <label for="group">Group (letter key)</label>
        <input
          type="text"
          id="group"
          name="group"
          class="w-80 text-surface-200 p-1"
          required
        />
        <br />
        <label for="captain">Captain (not required, can be added later)</label>
        <input
          type="text"
          id="captain"
          name="captain"
          class="w-80 text-surface-200 p-1"
        />
        <br />
        <label for="logo">Logo (imgur direct link, not required)</label>
        <input
          type="text"
          id="logo"
          name="logo"
          class="w-80 text-surface-200 p-1"
        />
        <br />
        <button
          type="submit"
          class="rounded-xl bg-primary-500 hover:bg-primary-400 text-black"
          >Submit</button
        >
        {#if form?.error}
          <div class="notice error text-red-400 font-bold italic">
            {form.error}
          </div>
        {/if}
        {#if form?.message}
          <p class="font-bold italic text-white">{form.message}</p>
        {/if}
      </form>
    </CollapsibleSection>
    <CollapsibleSection headerText="Add Player to Team">
      <form
        use:enhance
        method="POST"
        action="?/addPlayer"
        class="flex flex-col w-full rounded-xl p-2 bg-surface-300"
      >
        <label for="name">Player Name (name#tag)</label>
        <input
          type="text"
          id="name"
          name="name"
          class="w-80 text-surface-200 p-1"
          required
        />
        <br />
        <label for="team">Team Name</label>
        <input
          type="text"
          id="team"
          name="team"
          class="w-80 text-surface-200 p-1"
          required
        />
        <br />
        <button
          type="submit"
          class="rounded-xl bg-primary-500 hover:bg-primary-400 text-black"
          >Submit</button
        >
        {#if form?.error}
          <p class="text-red-400 font-bold italic">
            {form.error}
          </p>
        {/if}
        {#if form?.message}
          <p class="font-bold italic text-white">
            {form.message}
          </p>
        {/if}
      </form>
    </CollapsibleSection>
    <CollapsibleSection headerText="Remove Player from Team">
      <form
        use:enhance
        method="POST"
        action="?/removePlayer"
        class="flex flex-col w-full rounded-xl p-2 bg-surface-300"
      >
        <label for="name">Player Name (name#tag)</label>
        <input
          type="text"
          id="name"
          name="name"
          class="w-80 text-surface-200 p-1"
          required
        />
        <br />
        <button
          type="submit"
          class="rounded-xl bg-primary-500 hover:bg-primary-400 text-black"
          >Submit</button
        >
        {#if form?.error}
          <p class="text-red-400 font-bold italic">
            {form.error}
          </p>
        {/if}
        {#if form?.message}
          <p class="font-bold italic text-white">
            {form.message}
          </p>
        {/if}
      </form>
    </CollapsibleSection>
    <CollapsibleSection headerText="Change Captain">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        officiis quia blanditiis tempora. Nihil voluptate asperiores incidunt
        eius, esse sit sunt, facilis nisi voluptas perspiciatis, fuga unde
        placeat enim. Totam.
      </p>
    </CollapsibleSection>
  </div>
  <!-- Display team listing -->
  <div class="ml-2 w-full max-h-56 overflow-auto">
    {#if data.error}
      <li>{data.error}</li>
    {:else}
      <ul>
        {#each data.teamListing as team}
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
