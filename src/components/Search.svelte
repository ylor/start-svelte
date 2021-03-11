<script>
  import fetchJsonp from "fetch-jsonp";

  import Prompt from "./Prompt.svelte";
  import Suggestions from "./Suggestions.svelte";

  import parseInput from "../js/parseInput.js";

  // let search = "";
  // let suggestions = [];
  import { search, suggestions } from "../stores.js";

  async function fetchSuggestions() {
    const query = $search.includes(":") ? $search.split(":")[1] : $search;

    if (query.length < 1) {
      suggestions.set([]);
    } else {
      const googleResponse = await fetchJsonp(
        "https://suggestqueries.google.com/complete/search?client=firefox&q=" +
          query
      );
      const googleSuggestions = await googleResponse.json();
      //console.log(googleSuggestions[1]);
      // const duckResponse = await fetchJsonp(
      //   "https://duckduckgo.com/ac/?q=" + query + "&type=list",
      //   { jsonpCallbackFunction: "autocompleteCallback" }
      // );
      // const duckSuggestions = await response.json();
      //console.log(json[1]);
      suggestions.set(googleSuggestions[1].slice(0, 6));
    }
  }

  function escHandler(event) {
    // Listen for esc
    if (event.key === "Escape") {
      // If search-input is focused and has a value, zero it out
      if ($search.length > 0) {
        search.set("");
      } else {
        document.getElementById("search-input").blur();
      }
    }
  }
</script>

<svelte:window on:keydown={escHandler} />

<section>
  <Prompt>
    <form
      id="search-form"
      autocapitalize="none"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      on:submit|preventDefault={() =>
        (window.location.href = parseInput($search))}
    >
      <input
        bind:value={$search}
        on:input={fetchSuggestions}
        type="text"
        id="search-input"
      />
    </form>
    {#if $search.length > 0}
      <Suggestions />
    {/if}
  </Prompt>
</section>

<style>
  form {
    display: inline;
  }

  input {
    background: var(--background);
    border: none;
    color: var(--white);
    font-family: var(--font);
    font-size: 1rem;
    margin-left: -1px;
    font-weight: var(--normal);
  }

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    input {
      margin-left: -10px;
    }
  }
</style>
