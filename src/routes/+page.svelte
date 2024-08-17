<svelte:head>
  <title>Home</title>
</svelte:head>
<section class="flex flex-col w-full h-full p-2">
  <h1 class="font-bold text-3xl mt-4 self-center">Roster Management Portal</h1>
  <p class="italic text-xs self-center w-1/2 m-4">
    Please make sure to direct all compliments (because surely there will be no
    issues or complaints!) to ruuffian!
  </p>

  <form class="justify-self-end" method="POST" action="?/logout">
    <button type="submit" class="rounded-xl bg-primary-500 text-black p-2 m-auto">Logout</button>
  </form>
</section>