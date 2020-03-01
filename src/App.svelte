<script>
  import fetchJsonp from "fetch-jsonp";

  import { config } from "./config.js";

  import keyHandler from "./js/keyHandler.js";
  import parseInput from "./js/parseInput.js";

  import Prompt from "./components/Prompt.svelte";

  const { user, sites } = config;
  console.log(user);
  console.log(sites);

  const categoriesRaw = sites.map(command => command.category).filter(Boolean);

  const distinctCategories = [...new Set(categoriesRaw)];
  console.log(distinctCategories);

  const categories = window.location.hostname.includes("work")
    ? distinctCategories.filter(category => category !== "Server")
    : distinctCategories.filter(category => category !== "MDC");
  console.log(categories);

  let search = "";

  let apiURL =
    "https://suggestqueries.google.com/complete/search?client=firefox&q=";
  let suggestions = [];

  async function fetchSuggestions() {
    const query = () => (search.includes(":") ? search.split(":")[1] : search);

    if (search.length < 1) {
      suggestions = [];
    } else if (search.length > 0) {
      const response = await fetchJsonp(apiURL + query());
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
  :root {
    --font: "Roboto Mono", monospace;
    --background: #0f0e17;
    --foreground: #f8f8f2;

    --black: ;
    --red: #ff5555;
    --green: #50fa7b;
    --yellow: #f1fa8c;
    --blue: #6272a4;
    --magenta: #bd93f9;
    --cyan: #8be9fd;
    --white: #f8f8f2;

    --pink: #ff79c6;
    --orange: #ff8906;
    --branch: 1px solid #a7a9be;
  }

  :global(html) {
    font-size: 24px;
    user-select: none;
  }

  :global(body) {
    background: var(--background);
    font-family: var(--font);
    color: var(--foreground);
    display: flex;
    justify-content: center;
  }

  .prompt {
    font-family: var(--font);
    color: var(--foreground);
  }

  .prompt ~ .prompt {
    padding: 1.5rem 0 0.3125rem;
  }

  h1 {
    display: inline;
    font-family: var(--font);
    font-size: 1rem;
    font-weight: normal;
    color: var(--red);
  }

  .tree > ul {
    margin: 0;
    padding-left: 1rem;
  }

  ul {
    list-style: none;
    padding-left: 2.5rem;
  }

  ul h1 {
    cursor: pointer;
  }

  li {
    position: relative;
  }

  li.hideChildren > ul {
    display: none;
  }

  li::before,
  li::after {
    content: "";
    position: absolute;
    left: -0.75rem;
  }

  li::before {
    border-top: var(--branch);
    top: 0.75rem;
    width: 0.5rem;
  }

  li::after {
    border-left: var(--branch);
    height: 100%;
    top: 0.25rem;
  }

  li:last-child::after {
    height: 0.5rem;
  }

  a {
    font-family: var(--font);
    font-size: 1rem;
    color: var(--foreground);
    text-decoration: none;
    outline: none;
  }

  a:hover,
  a:focus {
    color: var(--background);
    background: var(--magenta);
  }

  form {
    display: inline;
  }

  input {
    font-family: var(--font);
    font-size: 1rem;
    color: var(--foreground);
    background-color: var(--background);
    border: none;
    margin-left: -24px;
  }

  /* you can fill the texarea above/below? the Viewport */
  textarea {
    font-family: var(--font);
    font-size: 1rem;
    color: var(--foreground);
    background-color: var(--background);
    border: none;
    outline: none;
    margin-left: -12px;
    position: absolute;
    width: 50vw;
    height: 50vh;
    resize: none;
  }

  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }
</style>

<svelte:window on:keydown={keyHandler} on:keydown={escHandler} />

<main>
  <section>
    <Prompt />
    <span style="color:green;">➜</span>
    tree
    <aside class="tree">
      <h1>.</h1>
      <ul id="list">
        {#each categories as category}
          <li class="hideChildren">
            <h1
              on:click={e => e.target.parentNode.classList.toggle('hideChildren')}>
              {category}
            </h1>
            <ul>
              {#each sites.filter(command => command.category === category && command.hidden !== true) as site}
                <li title={site.keys.toString().replace(',', ', ')}>
                  <a href={site.url}>{site.name}</a>
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    </aside>
  </section>

  <section>
    <Prompt />
    <span style="color:green;">➜</span>
    find&nbsp;
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
                {@html suggestion.replace(search.match(/\b.+\b/), `<b style='text-decoration:underline';>${search.trimEnd()}</b>`)}
              </a>
            </li>
          {/each}
        </ul>
      </aside>
    {/if}
  </section>
</main>
