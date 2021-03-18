const changeFocus = (element) => document.getElementById(element).focus();

export default function keyHandler(event) {
  //console.log(event.key);
  const activeElement = document.activeElement;
  const previousElement = activeElement.parentElement.previousElementSibling;
  const nextElement = activeElement.parentElement.nextElementSibling;
  const searchInput = document.getElementById("search-input");
  const suggestionClass = document.getElementsByClassName("search-suggestion");
  // Change focus as if ArrowUp === Shitf+Tab & Change focus as if ArrowDown === Tab
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (activeElement === searchInput) {
      suggestionClass[suggestionClass.length - 1].firstElementChild.focus();
    } else {
      previousElement
        ? previousElement.firstElementChild.focus()
        : searchInput.focus();
    }
  } else if (event.key === "ArrowDown") {
    if (activeElement === searchInput) {
      suggestionClass[0].firstElementChild.focus();
    } else {
      nextElement ? nextElement.firstElementChild.focus() : searchInput.focus();
    }
  }

  // Listen for backspace
  else if (event.key === "Backspace") {
    if (activeElement.id !== "search-input") {
      changeFocus("search-input");
    }
  }

  // Listen for esc
  else if (event.key === "Escape") {
    // If search-input is focused then clear the input
    if (activeElement !== searchInput) {
      changeFocus("search-input");
    }
    // If search-input is focused and has a value, zero it out
    else if (searchInput.value.length > 0) {
      searchInput.value = "";
    }
  }

  // Allow tabbing but anything else focuses search
  else if (
    //event.key !== "Escape" &&
    event.key !== "Enter" &&
    event.key !== "Shift" &&
    event.key !== "Tab"
  ) {
    changeFocus("search-input");
  }
}
