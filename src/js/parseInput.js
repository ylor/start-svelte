import { config } from "../config.js";

export default function parseInput(rawInput) {
  const { sites } = config;

  const input = rawInput.toLowerCase();
  const keysList = sites.map(site => site.keys).flat();
  const ipPattern = new RegExp(/^((2(?!5?[6-9])|1|(?!0\B))\d\d?\.?\b){4}$/g);
  const urlPattern = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gi
  );

  // begin conditionals for the parser
  // handle match to key in config
  if (keysList.includes(input)) {
    return sites.find(v => v.keys.includes(input)).url;
  }

  // handle urls
  if (
    input.match(urlPattern) ||
    input.match(ipPattern) ||
    input.includes("localhost")
  ) {
    if (
      input.match(ipPattern) ||
      input.includes(".local") ||
      input.includes("localhost")
    ) {
      return input.startsWith("http") ? rawInput : "http://" + rawInput;
    } else {
      return input.startsWith("http") ? rawInput : "https://" + rawInput;
    }
  }

  // handle search with a matched key
  if (input.includes(":") && keysList.includes(input.split(":")[0])) {
    const key = input.split(":")[0];
    const query = rawInput.split(":")[1].trimStart();
    console.log(sites.find(site => site.keys.includes(key)).search);

    if (sites.find(site => site.keys.includes(key)).search) {
      return sites
        .find(site => site.keys.includes(key))
        .search.replace("{}", query);
    }
  }

  // handle paths with a matched key
  if (input.includes("/") && keysList.includes(input.split("/")[0])) {
    const key = input.split("/")[0];
    const path = rawInput.split("/")[1];
    return (
      sites.find(site => site.keys.includes(key)).url.replace(/\/$/, "") +
      "/" +
      path
    );
  }

  // search google
  else
    return sites
      .find(site => site.keys === "*")
      .search.replace("{}", encodeURIComponent(rawInput));
}
