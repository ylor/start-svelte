export function identifyBrowser() {
  const testUserAgent = (regexp) => regexp.test(navigator.userAgent)
  switch (true) {
    case testUserAgent(/edg/i):
      return "edge";
    case testUserAgent(/firefox|fxios/i):
      return "firefox";
    case testUserAgent(/chrome|chromium|crios/i):
      return "chrome";
    case testUserAgent(/safari/i):
      return "safari";
    default:
      return "internet";
  }
}
