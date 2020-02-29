const changeFocus = element => document.getElementById(element).focus();

export default function keyHandler(event) {
  //console.log(event.key);
  const searchInput = document.getElementById("search-input");
  const suggestionClass = document.getElementsByClassName("search-suggestion");
  // Change focus as if ArrowUp === Shitf+Tab & Change focus as if ArrowDown === Tab
  if (event.key === "ArrowUp") {
    if (document.activeElement === searchInput) {
      suggestionClass[suggestionClass.length - 1].focus();
    } else {
      document.activeElement.previousElementSibling
        ? document.activeElement.previousElementSibling.focus()
        : searchInput.focus();
    }
  } else if (event.key === "ArrowDown") {
    if (document.activeElement === searchInput) {
      suggestionClass[0].focus();
    } else {
      document.activeElement.nextElementSibling
        ? document.activeElement.nextElementSibling.focus()
        : searchInput.focus();
    }
  }

  // listen for equals key to do some math inline
  //   else if (event.key === "=") {
  //     if (searchInput.value.match(mathPattern)) {
  //       try {
  //         event.preventDefault();
  //         const expression = searchInput.value;
  //         // disabling eslint for line containing `eval` because I'm prevalidating the input with mathPattern
  //         // eslint-disable-next-line
  //         const answer = eval(searchInput.value);
  //         searchInput.value = expression + "=" + answer.toString();
  //       } catch {
  //         // Cases where this fails includes incomplete expressions like `2+=`
  //       }
  //     }
  //   }

  // Listen for space
  // In Safari on macOS there doesn't seem to be an equivalent for event.key === "Spacebar" so I had to use event.code
  else if (event.key === "Spacebar" || event.code === "Space") {
    if (document.activeElement.id !== "search-input") {
      setSearch(document.activeElement.textContent);
      changeFocus("search-input");
    }
  }

  // Listen for backspace
  else if (event.key === "Backspace") {
    if (document.activeElement.id !== "search-input") {
      changeFocus("search-input");
    }
  }

  // Listen for esc
  //   else if (event.key === "Escape") {
  //     // If search-input is focused then clear the input
  //     if (document.activeElement !== searchInput) {
  //       changeFocus("search-input");
  //     }
  //     // If search-input is focused and has a value, zero it out
  //     else if (searchInput.value.length > 0) {
  //       searchInput.value = "";
  //     }
  //   }

  // Allow tabbing but anything else focuses search
  else if (
    event.key !== "Enter" &&
    event.key !== "Shift" &&
    event.key !== "Tab"
  ) {
    changeFocus("search-input");
  }
}
