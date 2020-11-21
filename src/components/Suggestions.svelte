<script>
  import parseInput from "../js/parseInput.js";

  export let search;
  export let suggestions;

  const searchInput = document.getElementById("search-input");
</script>

<aside class="tree">
  <ul id="search-suggestions">
    {#each suggestions as suggestion}
      <li class="search-suggestion">
        <a
          href={parseInput(search.includes(':') ? search.split(':')[0] + ':' + suggestion : suggestion)}
          on:focus={search.includes(':') ? (search = search.split(':')[0] + ':' + suggestion) : (search = suggestion)}
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
