<script>
  import { keyHandler } from "$lib/js";
  import { Tree, Search } from "$lib";
</script>

<svelte:window on:keydown={keyHandler} />

<main>
  <Tree />
  <Search />
</main>
