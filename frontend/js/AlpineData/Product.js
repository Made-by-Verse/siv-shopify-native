export default async function Product() {
  Alpine.data("product", () => ({
    descriptionOpen: false,
    quantity: 1,

    handleVariantChange(event) {
      const variantId = event.target.value;
      this.updatePrice({ variant: variantId });
    },

    async updatePrice(params) {
      const url = new URL(window.location.href);

      // Update URL parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        } else {
          url.searchParams.delete(key);
        }
      });

      // Update browser history
      window.history.pushState({}, "", url);

      // Fetch updated form HTML
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Replace product form and price containers with new HTML
      const priceContainer = doc.querySelector("#product-price-container");

      if (priceContainer) {
        document
          .querySelector("#product-price-container")
          .replaceWith(priceContainer);
      }
    },
  }));
}
