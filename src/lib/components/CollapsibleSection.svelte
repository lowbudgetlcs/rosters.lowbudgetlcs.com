<script lang="ts">
  // based on suggestions from:
  // Inclusive Components by Heydon Pickering https://inclusive-components.design/collapsible-sections/
  export let headerText;

  let expanded = false;
</script>

<div class="collapsible">
  <h3>
    <button
      on:click={() => (expanded = !expanded)}
      class="rounded-xl p-2 m-4 bg-primary-500"
    >
      <p class="text-surface-200">{headerText}</p>
      <!-- <svg viewBox="0 0 20 20" fill="none">
        <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
        <path d="M1 10L19 10" stroke="black" stroke-width="2" />
      </svg>-->
    </button>
  </h3>

  <div class="contents {expanded ? '' : 'hidden'}">
    <slot />
  </div>
</div>
