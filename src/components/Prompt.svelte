<script>
  function browser() {
    if (navigator.userAgent.includes("Edg")) {
      return "edge";
    } else if (navigator.userAgent.includes("Chrome")) {
      return "chrome";
    } else if (navigator.userAgent.includes("Safari")) {
      return "safari";
    } else if (navigator.userAgent.includes("Firefox")) {
      return "firefox";
    } else {
      return "internet";
    }
  }
</script>

<style>
  section {
    padding: 1.5rem 0 0.3125rem;
  }

  span {
    font-weight: 400;
  }
</style>

<section>
  [
  <span style="color:cyan;">roly</span>
  @
  <span style="color:cyan;">{browser()}</span>
  ]
  <br />
  <span style="color:green;">➜</span>
  <slot>command</slot>
</section>
