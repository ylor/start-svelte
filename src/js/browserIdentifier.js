export default function browserIdentifier() {
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
