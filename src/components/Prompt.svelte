<script>
  import identifyBrowser from "../js/identifyBrowser.js";

  const browser = identifyBrowser();
</script>

<style>
  section {
    padding: 1.5rem 0 0.3125rem;
  }

  span {
    font-weight: var(--heavy);
  }
</style>

<section>
  [
  <span style="color:var(--cyan);">roly</span>
  @
  <span style="color:var(--cyan);">{browser}</span>
  in
  <span style="color:var(--cyan);">~/start</span>
  ]
  <br />
  <span style="color:var(--green);">➜</span>
  <slot>command</slot>
</section>
