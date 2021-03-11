export default function identifyBrowser() {
  const test = function (regexp) {
    return regexp.test(navigator.userAgent);
  };
  switch (true) {
    case test(/edg/i):
      return "edge";
    case test(/firefox|fxios/i):
      return "firefox";
    case test(/chrome|chromium|crios/i):
      return "chrome";
    case test(/safari/i):
      return "safari";
    default:
      return "internet";
  }
}
