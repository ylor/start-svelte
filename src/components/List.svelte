<script>
  import Prompt from "./Prompt.svelte";

  import { config } from "../config.js";
  let { sites } = config;

  sites = sites.map(p =>
    p.category === undefined ? { ...p, category: "🤷🏽 …" } : p
  );
  //console.log(sites);

  const categoriesRaw = sites.map(p => p.category);
  const distinctCategories = [...new Set(categoriesRaw)];
  const categories = distinctCategories.concat(distinctCategories.shift());
  //console.log(categories);
</script>

<section>
  <Prompt>
    tree
    <aside class="tree">
      <h1>.</h1>
      <ul class="list">
        {#each categories as category}
          <li class="hideChildren">
            <h1
              on:click={e => e.target.parentNode.classList.toggle('hideChildren')}>
              {category}
            </h1>
            <ul>
              {#each sites
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter(
                  site => site.category === category && site.hidden !== true
                ) as site}
                <li title={site.keys.toString().replace(',', ', ')}>
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
