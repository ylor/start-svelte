<script>
  import Prompt from "$lib/Prompt.svelte";
  import Suggestions from "$lib/Suggestions.svelte";

  import { search } from "$lib/js/stores.js";
  import { fetchGoogleSuggestions as fetchSuggestions } from "$lib/js/fetchSuggestions.js";
  import parseInput from "$lib/js/parseInput.js";
</script>

<section>
  <Prompt>
    <form
      id="search-form"
      autocapitalize="none"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      on:submit|preventDefault={() =>
        (window.location.href = parseInput($search))}
    >
      <input
        bind:value={$search}
        on:input={fetchSuggestions($search)}
        type="text"
        id="search-input"
      />
    </form>
    {#if $search.length > 0}
      <Suggestions />
    {/if}
  </Prompt>
</section>

<style>
  form {
    display: inline;
  }

  input {
    background: var(--background);
    border: none;
    color: var(--white);
    font-family: var(--font);
    font-size: 1rem;
    margin-left: -1px;
    font-weight: var(--normal);
  }

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    input {
      margin-left: -10px;
    }
  }
</style>
