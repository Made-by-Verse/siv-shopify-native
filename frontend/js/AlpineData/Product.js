export default async function Product() {
  Alpine.data("product", () => ({
    descriptionOpen: false,
    quantity: 1,
    test: 0,

    handleVariantChange(event) {
      const variantId = event.target.value;
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

    async handleQuantityChange() {
      // Update product form with new quantity
      await this.updateProductForm({ quantity: this.quantity });
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

      // Replace product form and price containers with new HTML
      const newForm = doc.querySelector("#product-form");
      const priceContainer = doc.querySelector("#product-price-container");
      //const buyButton = doc.querySelector(".buy-button");

      if (newForm) {
        document.querySelector("#product-form").replaceWith(newForm);
      }
      if (priceContainer) {
        document
          .querySelector("#product-price-container")
          .replaceWith(priceContainer);
      }
      // if (buyButton) {
      //   document.querySelector(".buy-button").replaceWith(buyButton);
      // }
    },
  }));
}
