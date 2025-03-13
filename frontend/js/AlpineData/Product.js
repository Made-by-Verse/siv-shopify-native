export default async function Product() {
  Alpine.data("product", () => ({
    descriptionOpen: false,
    quantity: 1,
    handleVariantChange(variantId) {
      // Update URL with variant ID and reload form
      this.updateProductForm({ variant: variantId });
    },

    handleSellingPlanChange(event) {
      const radio = event.target;
      const params = {};

      if (radio.value === "subscription") {
        // If there's only one selling plan, get it from the data attribute
        if (radio.dataset.sellingPlanId) {
          params.selling_plan = radio.dataset.sellingPlanId;
        }
      } else {
        params.selling_plan = null;
      }

      this.updateProductForm(params);
    },

    handleQuantityChange(event) {
      const quantity = event.target.value;
      this.updateProductForm({ quantity: quantity });
    },

    async updateProductForm(params) {
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

      // Replace product form with new HTML

      const newForm = doc.querySelector("#product-form");
      document.querySelector("#product-form").replaceWith(newForm);

      const priceContainer = doc.querySelector("#product-price-container");
      document
        .querySelector("#product-price-container")
        .replaceWith(priceContainer);
    },
  }));
}
