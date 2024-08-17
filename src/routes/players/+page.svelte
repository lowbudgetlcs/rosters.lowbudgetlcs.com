<script>
  import { enhance } from "$app/forms";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";

  export let form;
  export let data;
  console.log(data);
</script>

<svelte:head>
  <title>Player Management</title>
</svelte:head>

<div class="flex flex-col">
  <h1 class="font-bold text-5xl mb-2">Player Manager</h1>
  <p class="italic mb-8">Click each section to reveal the form</p>
</div>

<div class="text-lg">
  <CollapsibleSection headerText="Create Player">
    <div class="flex flex-row">
      <form
        use:enhance
        method="POST"
        action="?/createPlayer"
        class="flex flex-col w-full rounded-xl p-2 bg-surface-300"
      >
        <label for="name" class="">Primary Account (with #NA1 etc)</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          class="w-80 text-surface-200 p-1"
        />
        <br />

        <label for="team">Team Name (not required)</label>
        <input
          type="text"
          id="team"
          name="team"
          class="w-80 text-surface-200 p-1"
        />
        <br />

        <button type="submit" class="rounded-xl bg-primary-500 hover:bg-primary-400 text-black">Submit</button>

        {#if form?.error}
          <div class="notice error text-red-400 font-bold italic">
            {form.error}
          </div>
        {/if}
        {#if form?.message}
          <p class="font-bold italic text-white">{form.message}</p>
        {/if}
      </form>
      <!-- Display player listing -->
      <div class="ml-2 w-full max-h-56 overflow-auto">
        {#if data.error}
          <li>{data.error}</li>
        {:else}
          <ul>
            {#each data.players as player}
              <li class="flex flex-row">
                <p class="mx-2">{player.summonerName}</p>
                <p class="mx-2">{player?.teamName ? player.teamName : "NO_TEAM"}</p>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </CollapsibleSection>

  <CollapsibleSection headerText="Add Account to Player">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
      officiis quia blanditiis tempora. Nihil voluptate asperiores incidunt
      eius, esse sit sunt, facilis nisi voluptas perspiciatis, fuga unde placeat
      enim. Totam.
    </p>
  </CollapsibleSection>
</div>
