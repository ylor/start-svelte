<script>
  import fetchJsonp from "fetch-jsonp";

  import List from "./components/List.svelte";
  import Search from "./components/Search.svelte";

  import keyHandler from "./js/keyHandler.js";
</script>

<svelte:window on:keydown={keyHandler} />

<main>
  <List />
  <Search />
</main>
