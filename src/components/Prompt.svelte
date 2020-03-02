<script>
  //export let work;
  // const browser = (function() {
  //   var test = function(regexp) {
  //     return regexp.test(window.navigator.userAgent);
  //   };
  //   switch (true) {
  //     case test(/edg/i):
  //       return "edge";
  //     case test(/chrome/i) && !!window.chrome:
  //       return "chrome";
  //     case test(/firefox/i):
  //       return "firefox";
  //     case test(/safari/i):
  //       return "safari";
  //     default:
  //       return "internet";
  //   }
  // })();
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
</style>

<section>
  [
  <span style="color:cyan;">roly</span>
  @
  <span style="color:cyan;">start</span>
  on
  <span style="color:cyan;">{browser()}</span>
  ]
  <br />
  <span style="color:green;">➜</span>
  <slot>command</slot>
</section>
