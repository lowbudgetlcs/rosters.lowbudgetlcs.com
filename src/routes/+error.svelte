<script lang="ts">
  import { page } from "$app/stores";
</script>

<h1>Error {$page.status}: {$page.error?.message}</h1>
<p>
  Go to <a href="/login">login</a> page to login .
</p>
