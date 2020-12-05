<script>
  import fetchJsonp from "fetch-jsonp";

  import Prompt from "./Prompt.svelte";
  import Suggestions from "./Suggestions.svelte";

  //import keyHandler from "../js/keyHandler.js";
  import parseInput from "../js/parseInput.js";

  let search = "";
  let suggestions = [];

  async function fetchSuggestions() {
    const query = search.includes(":") ? search.split(":")[1] : search;

    if (query.length === 0) {
      suggestions = [];
    } else {
      const googleResponse = await fetchJsonp("https://suggestqueries.google.com/complete/search?client=firefox&q=" + query);
      const googleSuggestions = await googleResponse.json();
      //console.log(googleSuggestions[1]);
      // const duckResponse = await fetchJsonp(
      //   "https://duckduckgo.com/ac/?q=" + query + "&type=list",
      //   { jsonpCallbackFunction: "autocompleteCallback" }
      // );
      // const duckSuggestions = await response.json();
      //console.log(json[1]);
      suggestions = googleSuggestions[1].slice(0, 6);
    }
  }

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

<style>
  form {
    display: inline;
  }

  input {
    font-family: var(--font);
    font-size: 1rem;
    color: var(--foreground);
    background-color: var(--background);
    border: none;
    /* font-weight: var(--normal); */
  }
</style>

<svelte:window on:keydown={escHandler} />

<section>
  <Prompt>
    <form
      autocapitalize="none"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      on:submit|preventDefault={() => (window.location.href = parseInput(search))}>
      <input
        bind:value={search}
        on:input={fetchSuggestions}
        type="text"
        id="search-input" />
    </form>
    {#if search.length > 0}
      <Suggestions {search} {suggestions} />
    {/if}
  </Prompt>
</section>
