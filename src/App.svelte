<script>
  import Tree from "./lib/components/Tree.svelte";
  import Search from "./lib/components/Search.svelte";

  import keyHandler from "./lib/js/keyHandler.js";

  import "./assets/global.css";
  import "./assets/font/iosevka-aile.css"

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
