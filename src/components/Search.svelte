<script>
  import fetchJsonp from "fetch-jsonp";

  import Prompt from "./Prompt.svelte";
  import Suggestions from "./Suggestions.svelte";

  import keyHandler from "../js/keyHandler.js";
  import parseInput from "../js/parseInput.js";

  let search = "";

  let apiURL =
    "https://suggestqueries.google.com/complete/search?client=firefox&q=";
  let suggestions = [];

  async function fetchSuggestions() {
    const query = search.includes(":") ? search.split(":")[1] : search;

    if (search.length === 0) {
      suggestions = [];
    } else if (search.length > 0) {
      const response = await fetchJsonp(apiURL + query);
      const json = await response.json();
      suggestions = json[1];
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
  }
</style>

<svelte:window on:keydown={escHandler} />

<section>
  <Prompt>
    <form
      autocomplete="off"
      on:submit|preventDefault={() => (window.location.href = parseInput(document.getElementById('search-input').value))}>
      <input
        on:keyup={fetchSuggestions}
        bind:value={search}
        type="text"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        id="search-input" />
    </form>
  </Prompt>
  {#if suggestions.length > 0}
    <aside class="tree">
      <ul id="list">
        {#each suggestions as suggestion, i}
          <li id={'search-suggestion-' + i} class="search-suggestion">
            <a
              href={parseInput(suggestion)}
              on:focus={() => (search = suggestion)}
              on:mouseover={event => event.target.addEventListener(
                  'mousemove',
                  event => event.target.focus()
                )}>
              {@html suggestion.replace(search.match(/\b.+\b/), `<b>${search.trimEnd()}</b>`)}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
</section>
