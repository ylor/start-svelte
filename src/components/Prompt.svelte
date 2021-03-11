<script>
  import identifyBrowser from "../js/identifyBrowser.js";

  const browser = identifyBrowser();
</script>

<section>
  [
  <span style="color:var(--red);">root</span>
  in
  <span style="color:var(--cyan);">~/start</span>
  via
  <span style="color:var(--{browser === 'firefox' ? 'firefox' : 'safari'});">
    {browser}
  </span>
  ]
  <br />
  <span style="color:var(--green);">➜</span>
  <slot>command</slot>
</section>

<style>
  section {
    padding: 1rem 0 0.3125rem;
  }

  span {
    font-weight: var(--heavy);
  }
</style>
