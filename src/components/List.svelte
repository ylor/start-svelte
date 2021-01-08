<script>
    export let title = "💩 title" // String
    export let sites = [{name: "name", aliases: ["site","aliases"], url: "http://web.site/"}] // Array of objects
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

    details > summary {
      list-style: none;
    }
  </style>

<li>
    <details>
      <summary>
        <h1>{title}</h1>
      </summary>
      <ul>
        {#each sites as site}
            <li
              on:mouseover={(e) => e.target.focus()}
              title={site.aliases.toString().replace(',', ', ')}>
              <a href={site.url}>{site.name}</a>
            </li>
          {/each}
      </ul>
    </details>
  </li>
