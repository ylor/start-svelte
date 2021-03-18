<script>
  export let title = "💩 Example"; // String
  export let sites = [
    { name: "Example Website", aliases: ["Example", "aliases"], url: "http://example.com/" },
  ]; // Array of objects
</script>

<li>
  <details>
    <summary>
      <h1>{title}</h1>
    </summary>
    <ul>
      {#each sites.sort((a, b) => a.name.localeCompare(b.name)) as site}
        <li
          on:mouseover={(e) => e.target.focus()}
          title={site.aliases.toString().replace(",", ", ")}
        >
          <a href={site.url}>{site.name}</a>
        </li>
      {/each}
    </ul>
  </details>
</li>

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
  details > summary::-webkit-details-marker {
    display: none;
  }
</style>
