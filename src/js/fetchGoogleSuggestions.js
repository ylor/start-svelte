import fetchJsonp from "fetch-jsonp";
import { suggestions } from "../stores.js";

export default async function fetchSuggestions(search) {
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
