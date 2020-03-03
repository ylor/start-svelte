<script>
  import fetchJsonp from "fetch-jsonp";

  import Prompt from "./Prompt.svelte";

  import keyHandler from "../js/keyHandler.js";
  import parseInput from "../js/parseInput.js";

  let search = "";
  let suggestions = [];

  async function fetchSuggestions() {
    const query = search.includes(":") ? search.split(":")[1] : search;

    if (query.length === 0) {
      suggestions = [];
    } else {
      const response = await fetchJsonp(
        "https://suggestqueries.google.com/complete/search?client=firefox&q=" +
          query
      );
      const json = await response.json();
      suggestions = json[1].slice(0, 6);
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
  </Prompt>
  {#if search.length > 0}
    <aside class="tree">
      <ul id="search-suggestions">
        {#each suggestions as suggestion}
          <li class="search-suggestion">
            <a
              href={parseInput(document
                  .getElementById('search-input')
                  .value.includes(
                    ':'
                  ) ? document
                      .getElementById('search-input')
                      .value.split(':')[0] + ':' + suggestion : suggestion)}
              on:focus={document
                .getElementById('search-input')
                .value.includes(
                  ':'
                ) ? (document.getElementById('search-input').value = document
                      .getElementById('search-input')
                      .value.split(
                        ':'
                      )[0] + ':' + suggestion) : (document.getElementById('search-input').value = suggestion)}
              on:mouseover={event => event.target.addEventListener(
                  'mousemove',
                  event => event.target.focus()
                )}>
              {@html suggestion.replace(search
                  .substring(search.indexOf(':') + 1)
                  .match(
                    /\b.+\b/
                  ), `<strong>${search
                  .substring(search.indexOf(':') + 1)
                  .trim()}</strong>`)}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
</section>
