<script>
  import Prompt from "./Prompt.svelte";

  import { config } from "../config.js";
  const { sites } = config;
  //console.log(sites);

  const categoriesRaw = sites.map(command => command.category).filter(Boolean);

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
  </Prompt>
</section>
