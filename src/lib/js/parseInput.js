import { config } from "../../config.js";
const { sites } = config;

export default function parseInput(rawInput) {

  const input = rawInput.toLowerCase();
  const aliasList = sites.map((site) => site.aliases).flat();

  const ipPattern = new RegExp(
    /^(.*?:\/\/)?((dev|localhost)|((2(?!5?[6-9])|1|(?!0\d))\d\d?\.?\b){4})(:\d+)?(\/.*)?$/g
  );
  const urlPattern = new RegExp(
    /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/.+)?)$/gi
  );

  // BEGIN PARSER

  // handle match to aliased site defined in config.js
  // Ex - gb => https://www.giantbomb.com/
  if (aliasList.includes(input)) {
    let websiteUrl = sites.find((site) => site.aliases.includes(input)).url;
    return websiteUrl;
  }

  // handle aliased reddit paths, not happy with this
  // Ex - r/mm/new => r/mechmarket/new
  if (
    //input.match(new RegExp(/^r\/.+/g))
    input.startsWith("r/") &&
    !input.includes(" ") &&
    aliasList.includes(input.split("/").splice(0, 2).join("/"))
  ) {
    const alias = input.split("/").splice(0, 2).join("/");
    const path = rawInput.split("/").slice(2).join("/");

    return sites.find((site) => site.aliases.includes(alias)).url + "/" + path;
  }

  // handle match to alias with search
  // Ex - youtube:when you slip on a banana peel
  if (input.includes(":") && aliasList.includes(input.split(":")[0])) {
    const alias = input.split(":")[0];
    const query = rawInput.split(":")[1].trimStart().trimEnd();

    if (sites.find((site) => site.aliases.includes(alias))) {
      return sites
        .find((site) => site.aliases.includes(alias))
        .search.replace("{}", query);
    }
  }

  // handle paths with a matched alias -
  // Ex - gb/api => https://www.giantbomb.com/api
  if (
    input.includes("/") &&
    !input.includes(" ") &&
    aliasList.includes(input.split("/")[0])
  ) {
    const alias = input.split("/")[0];
    let path = rawInput.split("/").slice(1).join("/");

    let websiteUrl = sites.find((site) => site.aliases.includes(alias)).url;
    websiteUrl = websiteUrl.endsWith("/")
      ? websiteUrl.slice(0, -1)
      : websiteUrl;

    return websiteUrl + "/" + path;
  }

  // handle ~ for Tildes
  // Ex - ~tech
  if (input.startsWith("~") && !input.includes(" ")) {
    return "https://tildes.net/" + input;
  }

  // handle @ for Twitter
  // Ex - @SwiftOnSecurity
  if (input.startsWith("@") && !input.includes(" ")) {
    return "https://twitter.com/" + input;
  }

  // handle $ for stocks
  // Ex - $gme
  //if (input.startsWith("$") && !input.includes(" ")) {
  //  return "https://$$$.com/" + input;
  //}

  // handle localhost/ip addresses/urls with optional ports and/or paths
  // Ex: 127.0.1.1/index.html
  // Ex: localhost:5000
  if (input.match(ipPattern) || input.match(urlPattern)) {
    if (rawInput.includes("dev")) {
      let re = /^dev(\/(.+)?|:\d+)?$/g;
      rawInput = rawInput.replace(re, "localhost$1");
    }

    let websiteUrl = input.startsWith("http") ? rawInput : "http://" + rawInput;
    return websiteUrl;
  }

  // send query to search engine
  else {
    return sites
      .find((site) => site.aliases.includes("*"))
      .search.replace("{}", encodeURIComponent(rawInput));
  }
}
