import { config } from "../config.js";

export default function parseInput(rawInput) {
  const { sites } = config;

  const input = rawInput.toLowerCase();
  const keysList = sites.map((site) => site.keys).flat();

  const ipPattern = new RegExp(
    /^(.*?:\/\/)?((localhost)|((2(?!5?[6-9])|1|(?!0\d))\d\d?\.?\b){4})(\:\d+)?$/g
  );
  const urlPattern = new RegExp(/^.+\.\w\w+(\/.+)?([^\s]+)?$/gi);
  const uriPattern = new RegExp(
    /^(.*?:\/\/)?([^\s\/?\.#-:]+\.[^\s]+)+(\/[^\s]*)?$/gi
  );

  // begin conditionals for the parser
  // handle ip addresses, localhost, local domains, and urls
  if (input.match(ipPattern) || input.match(urlPattern)) {
    let websiteUrl = input.startsWith("http") ? rawInput : "http://" + rawInput;
    //websiteUrl = websiteUrl.endsWith("/") ? websiteUrl : websiteUrl + "/";
    return websiteUrl;
  }

  // handle match to key in config
  if (keysList.includes(input)) {
    let websiteUrl = sites.find((v) => v.keys.includes(input)).url;
    //websiteUrl = websiteUrl.endsWith("/") ? websiteUrl : websiteUrl + "/";
    //console.log(websiteUrl);
    return websiteUrl;
  }

  // handle shortened reddit paths, not happy with this
  //ex r/mm/new => r/mechmarket/new
  if (
    input.match(new RegExp(/^r\/.+/g)) &&
    keysList.includes(input.split("/").splice(0, 2).join("/"))
  ) {
    const key = input.split("/").splice(0, 2).join("/");
    let path = rawInput.split("/").slice(2).join("/");
    //path = path.endsWith("/") ? path : path + "/";

    return sites.find((site) => site.keys.includes(key)).url + "/" + path;
  }

  // handle paths with a matched key
  if (input.includes("/") && keysList.includes(input.split("/")[0])) {
    console.log("here");
    const key = input.split("/")[0];
    let path = rawInput.split("/").slice(1).join("/");
    //path = path.endsWith("/") ? path : path + "/";

    let websiteUrl = sites.find((site) => site.keys.includes(key)).url;
    //websiteUrl = websiteUrl.endsWith("/") ? websiteUrl : websiteUrl + "/";

    return websiteUrl + "/" + path;
  }

  // handle search with a matched key
  if (input.includes(":") && keysList.includes(input.split(":")[0])) {
    const key = input.split(":")[0];
    const query = rawInput.split(":")[1].trimStart().trimEnd();

    if (sites.find((site) => site.keys.includes(key)).search) {
      return sites
        .find((site) => site.keys.includes(key))
        .search.replace("{}", query);
    }
  }

  // send query to search engine
  else {
    return sites
      .find((site) => site.keys.includes("*"))
      .search.replace("{}", encodeURIComponent(rawInput));
  }
}
