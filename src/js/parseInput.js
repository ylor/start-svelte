import { config } from "../config.js";

export default function parseInput(rawInput) {
  const { sites } = config;

  const input = rawInput.toLowerCase();
  const keysList = sites.map((site) => site.keys).flat();
  //const ipPattern = new RegExp(/^(https?:\/\/)?((2(?!5?[6-9])|1|(?!0\d))\d\d?\.?\b){4}(\:\d+)?$/g);
  //const urlPattern = new RegExp(/^.+\.\w\w+(\/.+|\:\d+)?$/gi);
  const uriPattern = new RegExp(
    /^(.*?:\/\/)?([^\s\/?\.#-:]+\.[^\s]+)+(\/[^\s]*)?$/gi
  );

  // begin conditionals for the parser
  // handle match to key in config
  if (keysList.includes(input)) {
    return sites.find((v) => v.keys.includes(input)).url;
  }

  // handle ip addresses, localhost, local domains, and urls
  if (input.match(uriPattern)) {
    return input.startsWith("http") ? rawInput : "http://" + rawInput;
  }

  // handle search with a matched key
  if (input.includes(":") && keysList.includes(input.split(":")[0])) {
    const key = input.split(":")[0];
    const query = rawInput.split(":")[1].trimStart();

    if (sites.find((site) => site.keys.includes(key)).search) {
      return sites
        .find((site) => site.keys.includes(key))
        .search.replace("{}", query);
    }
  }

  // handle paths with a matched key
  if (input.includes("/") && keysList.includes(input.split("/")[0])) {
    const key = input.split("/")[0];
    const path = rawInput.split("/")[1];

    return (
      sites.find((site) => site.keys.includes(key)).url.replace(/\/$/, "") +
      "/" +
      path
    );
  }

  // send query to search engine
  else {
    return sites
      .find((site) => site.keys.includes("*"))
      .search.replace("{}", encodeURIComponent(rawInput));
  }
}
