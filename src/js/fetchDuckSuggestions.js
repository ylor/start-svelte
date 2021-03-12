import fetchJsonp from "fetch-jsonp";
import { suggestions } from "../stores.js";

export default async function fetchSuggestions(search) {
  const query = search.includes(":") ? search.split(":")[1] : search;

  if (query.length < 1) {
    suggestions.set([]);
  } else {
    const duckResponse = await fetchJsonp(
      "https://duckduckgo.com/ac/?q=" + query + "&type=list",
      { jsonpCallbackFunction: "autocompleteCallback" }
    );
    const duckSuggestions = await duckResponse.json();
    suggestions.set(duckSuggestions[1].slice(0, 6));
  }
}
