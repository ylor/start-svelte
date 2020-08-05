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
  <span style="color:var(--red);">roly</span>
  on
  <span style="color:var(--{browser === 'firefox' ? 'firefox' : 'blue'});">
    {browser}
  </span>
  in
  <span style="color:var(--cyan);">~/start</span>
  ]
  <br />
  <span style="color:var(--green);">➜</span>
  <slot>command</slot>
</section>
