<script>
  import Prompt from "./Prompt.svelte";

  import { config } from "../config.js";
  let { sites } = config;

  sites = sites
   // .map((s) => (s.category ? s : { ...s, category: "🌌 …" }))
    .filter((s) => s.category !== undefined)
    .filter((s) => s.hidden !== true);

  if (location.hostname.includes("mdc") === false) {
    sites = sites.filter((s) => !s.category.includes("MDC"));
  } else {
    sites = sites.filter((s) => !s.category.includes("Server"));
  }
  console.log(sites);

  const categoriesRaw = sites.map((s) => s.category);
  //console.log(categoriesRaw);
  const uniqueCategories = [...new Set(categoriesRaw)];
  //console.log(uniqueCategories);
  const categories = uniqueCategories//.concat(uniqueCategories.shift());
  //console.log(categories);

  const favorites = sites.filter((s) => s.favorite === true);
  //console.log(favorites);
</script>

<style>
  h1 {
    color: var(--red);
    display: inline;
    font-family: var(--font);
    font-size: 1rem;
    font-weight: var(--heavy);
    user-select: none;
  }

  li h1 {
    cursor: pointer;
  }
</style>

<section>
  <Prompt>
    tree
    <aside class="tree">
      <h1>.</h1>
      <ul class="list">
        <li class="hideChildren">
          <h1
            on:click={(e) => e.target.parentNode.classList.toggle('hideChildren')}>
            ✨ Favorites
          </h1>
          <ul>
            {#each favorites.sort((a, b) =>
              a.name.localeCompare(b.name)
            ) as site}
              <li
                on:mouseover={(e) => e.target.focus()}
                title={site.aliases.toString().replace(',', ', ')}>
                <a href={site.url}>{site.name}</a>
              </li>
            {/each}
          </ul>
        </li>

        {#each categories as category}
          <li class="hideChildren">
            <h1
              on:click={(e) => e.target.parentNode.classList.toggle('hideChildren')}>
              {category}
            </h1>
            <ul>
              {#each sites
                .filter((s) => s.category === category)
                .sort((a, b) => a.name.localeCompare(b.name)) as site}
                <li
                  on:mouseover={(e) => e.target.focus()}
                  title={site.aliases.toString().replace(',', ', ')}>
                  <a href={site.url}>{site.name}</a>
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    </aside>
  </Prompt>
</section>
