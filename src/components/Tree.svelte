<script>
  import { config } from "../config.js";
  //let { sites } = config;
  import Prompt from "./Prompt.svelte";
  import List from "./List.svelte";

  let sites = config.sites
    // .map((s) => (s.category ? s : { ...s, category: "🌌 …" }))
    .filter((s) => s.category !== undefined && s.hidden !== true);
  //.filter((s) => s.hidden !== true);

  if (location.hostname.includes("mdc")) {
    sites = sites.filter((s) => !s.category.includes("Server"));
  } else {
    sites = sites.filter((s) => !s.category.includes("MDC"));
  }
  //console.log(sites);

  //const categoriesRaw = sites.map((s) => s.category);
  //console.log(categoriesRaw);
  const uniqueCategories = [...new Set(sites.map((s) => s.category))];
  //console.log(uniqueCategories);
  const categories = uniqueCategories; //.concat(uniqueCategories.shift());
  //console.log(categories);
  const favorites = config.sites.filter((s) => s.favorite === true);
  //console.log(favorites);
</script>

<section>
  <Prompt>
    tree
    <aside class="tree">
      <h1>.</h1>
      <ul>
        <List title="✨ Favorites" sites={favorites} />
        {#each categories as category}
          <List
            title={category}
            sites={sites.filter((s) => s.category === category)}
          />
        {/each}
      </ul>
    </aside>
  </Prompt>
</section>

<style>
  h1 {
    color: var(--red);
    display: inline;
    font-family: var(--font);
    font-size: 1rem;
    font-weight: var(--heavy);
    user-select: none;
  }
  /*
  li h1 {
    cursor: pointer;
  }

  details > summary {
    list-style: none;
  } */
</style>
