<script>
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
</script>

<h1>Division Management</h1>

<CollapsibleSection headerText="Create Division">
  <form method="POST" action="?/createDivision">
    <label for="name">Division Name (unique):</label>
    <input type="text" id="name" name="name" required />
    <br />

    <label for="description">Description:</label>
    <input type="text" id="description" name="description" />
    <br />

    <label for="groups">Number of Groups</label>
    <input type="number" id="groups" name="groups" required />
    <br />

    <button type="submit">Submit</button>
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
