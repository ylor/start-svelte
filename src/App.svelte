<script>
  import fetchJsonp from "fetch-jsonp";

  import List from "./components/List.svelte";
  import Search from "./components/Search.svelte";

  import keyHandler from "./js/keyHandler.js";

  // const work = location.href.includes("work" | "localhost") ? true : false;
  // console.log("work", work);

  function escHandler(event) {
    // Listen for esc
    if (event.key === "Escape") {
      // If search-input is focused and has a value, zero it out
      if (search.length > 0) {
        search = "";
      }
    }
  }
</script>

<svelte:window on:keydown={keyHandler} />

<main>
  <List />
  <Search />
</main>
