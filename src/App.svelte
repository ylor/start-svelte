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

<style>
  :root {
    --font: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
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
  }

  :global(body) {
    background: var(--background);
    font-family: var(--font);
    color: var(--foreground);
    display: flex;
    justify-content: center;
  }

  :global(h1) {
    display: inline;
    font-family: var(--font);
    font-size: 1rem;
    font-weight: normal;
    color: var(--red);
  }

  :global(a, a:visited) {
    font-family: var(--font);
    font-size: 1rem;
    color: var(--foreground);
    text-decoration: none;
    outline: none;
  }

  :global(a:hover, a:focus) {
    color: var(--background);
    background: var(--orange);
    text-decoration: none;
  }

  :global(ul) {
    list-style: none;
    padding-left: 2.5rem;
  }

  :global(ul h1) {
    cursor: pointer;
  }

  :global(.tree > ul) {
    margin: 0;
    padding-left: 1rem;
  }

  :global(li) {
    position: relative;
  }

  :global(li.hideChildren > ul) {
    display: none;
  }

  :global(li::before, li::after) {
    content: "";
    position: absolute;
    left: -0.75rem;
  }

  :global(li::before) {
    border-top: var(--branch);
    top: 0.75rem;
    width: 0.5rem;
  }

  :global(li::after) {
    border-left: var(--branch);
    height: 100%;
    top: 0.25rem;
  }

  :global(li:last-child::after) {
    height: 0.5rem;
  }
</style>

<svelte:window on:keydown={keyHandler} />

<main>
  <List />
  <Search />
</main>
