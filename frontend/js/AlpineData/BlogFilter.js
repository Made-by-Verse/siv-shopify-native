export default function BlogFilter() {
  Alpine.data("blogFilter", () => ({
    open: false,

    handleTagChange(event) {
      const tag = event.target.name;
      let currentTags = [];
      const currentPath = window.location.pathname;

      // Extract tags from the URL if they exist after /blogs/handle/tagged/
      const tagMatch = currentPath.match(/\/blogs\/[^/]+\/tagged\/(.*)/);
      if (tagMatch) {
        currentTags = tagMatch[1].split("+");
      }

      if (event.target.checked === true) {
        currentTags.push(tag);
      } else {
        currentTags.splice(currentTags.indexOf(tag), 1);
      }

      // Get the base URL without any trailing slashes or query parameters
      const urlParts = window.location.href.split(/[?#]/)[0]; // Remove query params and hash
      const baseUrl = urlParts.split("/tagged/")[0].replace(/\/+$/, "");

      // Construct the path based on whether there are tags
      const newPath =
        currentTags.length > 0 ? `/tagged/${currentTags.join("+")}` : "";

      // Combine the base URL, tags path, and query params
      const newUrl = `${baseUrl}${newPath}`;

      // Update browser history with the new URL
      window.history.pushState({}, "", newUrl);

      // Fetch blog posts with the selected tags
      fetch(newUrl)
        .then((response) => response.text())
        .then((html) => {
          // Assuming you have a container with id 'blog-posts'
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const new_blog_posts = doc.getElementById("blog-posts");
          const current_blog_posts = document.getElementById("blog-posts");

          current_blog_posts.innerHTML = new_blog_posts.innerHTML;
        })
        .catch((error) => {
          console.error("Error fetching blog posts:", error);
        });
    },
  }));
}
