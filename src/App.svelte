<script>
  import Tree from "./components/Tree.svelte";
  import Search from "./components/Search.svelte";

  import keyHandler from "./js/keyHandler.js";
</script>

<style> @media (min-width: 768px) {
/* main {
  margin-top: 3%
} */
main {
  padding: 0;
}
}</style>

<svelte:window on:keydown={keyHandler} />

<main>
  <Tree />
  <Search />
</main>
