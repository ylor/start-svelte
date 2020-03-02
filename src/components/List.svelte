<script>
  import Prompt from "./Prompt.svelte";

  import { config } from "../config.js";
  const { sites } = config;

  const categoriesRaw = sites.map(site => site.category);

  const distinctCategories = [...new Set(categoriesRaw)];
  //console.log(distinctCategories);

  const categories = distinctCategories;
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
              {#each sites.filter(site => site.category === category && site.hidden !== true) as site}
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
