<script>
  import { search, suggestions } from "$lib/js/stores.js";
  import parseInput from "$lib/js/parseInput.js";
</script>

<aside class="tree">
  <ul id="search-suggestions">
    {#each $suggestions as suggestion}
      <li class="search-suggestion">
        <a
          href={parseInput(
            $search.includes(":")
              ? $search.split(":")[0] + ":" + suggestion
              : suggestion
          )}
          on:focus={(e) => e.target.text.includes(":")
            ? search.set(e.target.text.split(":")[0] + ":" + suggestion)
            : search.set(suggestion)}
          on:mouseover={(event) =>
            event.target.addEventListener("mousemove", (event) =>
              event.target.focus()
            )}
        >
          {@html suggestion.replace(
            $search.substring($search.indexOf(":") + 1).match(/.*\S/),
            `<strong>${$search
              .substring($search.indexOf(":") + 1)
              .trim()}</strong>`
          )}
        </a>
      </li>
    {/each}
  </ul>
</aside>
