<script>
  import parseInput from "../js/parseInput.js";

  export let search;
  export let suggestions;
</script>

<style>

</style>

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
