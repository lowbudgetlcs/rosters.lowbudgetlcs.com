<script lang="ts">
  import { page } from "$app/stores";
</script>

<h1>Error {$page.status}: {$page.error?.message}</h1>