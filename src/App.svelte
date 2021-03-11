<script>
  import Tree from "./components/Tree.svelte";
  import Search from "./components/Search.svelte";

  import keyHandler from "./js/keyHandler.js";
</script>

<svelte:window on:keydown={keyHandler} />

<main>
  <Tree />
  <Search />
</main>

<style>
  @media (min-width: 768px) {
    /* main {
      margin-top: 3%
    } */
    main {
      padding: 0;
    }
  }
</style>
