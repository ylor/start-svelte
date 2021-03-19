import fetchJsonp from "fetch-jsonp";
import { suggestions } from "./stores.js"

export async function fetchDuckSuggestions(str) {
  const query = str.includes(":") ? str.split(":")[1] : str;

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

export async function fetchGoogleSuggestions(search) {
  const query = search.includes(":")
    ? search.split(":")[1]
    : search;

  if (query.length < 1) {
    suggestions.set([]);
  } else {
    const googleResponse = await fetchJsonp(
      "https://suggestqueries.google.com/complete/search?client=firefox&q=" +
        query
    );
    const googleSuggestions = await googleResponse.json();
    suggestions.set(googleSuggestions[1].slice(0, 6));
  }
}
