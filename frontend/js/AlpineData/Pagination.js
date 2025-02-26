export default function Pagination() {
  Alpine.data("pagination", () => ({
    handleClick(e, gridId) {
      e.preventDefault();
      const url = e.target.dataset.url;

      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          // Parse the HTML string into a DOM object
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Find the content you want to update
          // Update this selector based on your page structure
          const contentContainer = document.getElementById(gridId);
          const newContent = doc.getElementById(gridId);

          contentContainer.scrollIntoView({ behavior: "smooth" });
          // Update the content
          contentContainer.innerHTML = newContent.innerHTML;

          // Update the URL without reloading the page
          window.history.pushState({}, "", url);
        })
        .catch((error) => console.error("Error:", error));
    },
  }));
}
