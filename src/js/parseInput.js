import { config } from "../config.js";

export default function parseInput(rawInput) {
  const { sites } = config;

  const input = rawInput.toLowerCase();
  const aliasList = sites.map((site) => site.aliases).flat();

  const ipPattern = new RegExp(
    /^(.*?:\/\/)?((localhost)|((2(?!5?[6-9])|1|(?!0\d))\d\d?\.?\b){4})(\:\d+)?(\/.*)?$/g
  );
  const urlPattern = new RegExp(
    /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/gi
  );

  // BEGIN PARSER

  // handle match to alias
  if (aliasList.includes(input)) {
    let websiteUrl = sites.find((site) => site.aliases.includes(input)).url;
    return websiteUrl;
  }

  // handle aliased reddit paths, not happy with this
  //ex r/mm/new => r/mechmarket/new
  if (
    //input.match(new RegExp(/^r\/.+/g))
    input.startsWith("r/") &&
    aliasList.includes(input.split("/").splice(0, 2).join("/"))
  ) {
    const alias = input.split("/").splice(0, 2).join("/");
    const path = rawInput.split("/").slice(2).join("/");

    return sites.find((site) => site.aliases.includes(alias)).url + "/" + path;
  }

  // handle match to alias with search
  if (input.includes(":") && aliasList.includes(input.split(":")[0])) {
    const alias = input.split(":")[0];
    const query = rawInput.split(":")[1].trimStart().trimEnd();

    if (sites.find((site) => site.aliases.includes(alias))) {
      return sites
        .find((site) => site.aliases.includes(alias))
        .search.replace("{}", query);
    }
  }

  // handle paths with a matched alias
  if (input.includes("/") && aliasList.includes(input.split("/")[0])) {
    const alias = input.split("/")[0];
    let path = rawInput.split("/").slice(1).join("/");

    let websiteUrl = sites.find((site) => site.aliases.includes(alias)).url;
    websiteUrl = websiteUrl.endsWith("/")
      ? websiteUrl.slice(0, -1)
      : websiteUrl;

    return websiteUrl + "/" + path;
  }

  // handle @
  if (input.startsWith("@") && !input.includes(" ")) {
    return "https://twitter.com/" + input;
  }

  // handle ~
  if (input.startsWith("~") && !input.includes(" ")) {
    return "https://tildes.net/" + input;
  }

  // handle localhost/ip addresses/urls with optional ports and/or paths
  if (input.match(ipPattern) || input.match(urlPattern)) {
    let websiteUrl = input.startsWith("http://")
      ? rawInput
      : "http://" + rawInput;
    return websiteUrl;
  }

  // send query to search engine
  else {
    return sites
      .find((site) => site.aliases.includes("*"))
      .search.replace("{}", encodeURIComponent(rawInput));
  }
}
