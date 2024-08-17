<script>
  import "../app.css";
  export let data;
</script>

<div class="flex flex-row w-screen h-screen">
  {#if data?.user}
    <nav
      class="flex flex-col rounded-xl mr-2 min-w-56 h-full bg-surface-300 text-center"
    >
      <a
        href="/"
        class="h-12 m-2 rounded-xl bg-primary-500 text-black hover:bg-primary-500"
        >Home</a
      >
      <a
        href="/players"
        class="h-12 m-2 rounded-xl bg-primary-500 text-black hover:bg-primary-500"
        >Players</a
      >
      <a
        href="/teams"
        class="h-12 m-2 rounded-xl bg-primary-500 text-black hover:bg-primary-500"
        >Teams</a
      >
      <a
        href="/divisions"
        class="h-12 m-2 rounded-xl bg-primary-500 text-black hover:bg-primary-500"
        >Divisions</a
      >
      <span
        role="link"
        class="h-12 m-2 rounded-xl bg-primary-500 text-black hover:bg-primary-500"
        >Generate Series</span
      >
      <a
        href="/info"
        class="h-12 m-2 rounded-xl bg-primary-500 text-black hover:bg-primary-500"
        >Help</a
      >
    </nav>
  {/if}

  <div class="text-slate-100">
    <slot />
  </div>
</div>
