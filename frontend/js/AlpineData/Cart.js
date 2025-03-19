export default async function Cart() {
  Alpine.store("cart", {
    async getCart() {
      try {
        const response = await fetch(window.location.href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        //update cart items
        const currentCartItems = document.querySelector("#cart-drawer-form");
        const newCartItems = doc.querySelector("#cart-drawer-form");

        if (currentCartItems && newCartItems) {
          currentCartItems.innerHTML = newCartItems.innerHTML;
        }

        //update cart badge
        const cartBadge = document.querySelector("#cart-item-count");
        const newCartBadge = doc.querySelector("#cart-item-count");

        if (cartBadge && newCartBadge) {
          cartBadge.innerHTML = newCartBadge.innerHTML;
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    },

    async addToCart(variantId, sellingPlanId = null, quantity = 1) {
      try {
        // Dispatch event to show loading state
        window.dispatchEvent(new CustomEvent("cart:adding"));

        const response = await fetch(`${window.routes.cart_add_url}.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [{ id: variantId, quantity, selling_plan: sellingPlanId }],
          }),
        });

        const responseBody = await response.json();

        if (!response.ok) throw new Error(responseBody.message);

        // Immediately update the cart after successful add
        await this.getCart();

        window.dispatchEvent(new Event("open-cart-drawer"));

        // Dispatch success event
        window.dispatchEvent(new CustomEvent("cart:added"));
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Dispatch error event
        window.dispatchEvent(
          new CustomEvent("cart:error", {
            detail: { message: error.message },
          })
        );
      }
    },

    async removeFromCart(key) {
      try {
        window.dispatchEvent(new CustomEvent(`cart:removing-${key}`));

        const response = await fetch(`${window.routes.cart_change_url}.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: key.toString(),
            quantity: 0,
          }),
        });

        if (!response.ok) throw new Error("Remove from cart failed");

        await this.getCart();

        window.dispatchEvent(new CustomEvent(`cart:removed-${key}`));
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    },

    async updateQuantity(key, quantity) {
      window.dispatchEvent(new CustomEvent(`cart:updating-quantity-${key}`));

      try {
        const response = await fetch(`${window.routes.cart_change_url}.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: key.toString(),
            quantity: quantity,
          }),
        });

        if (!response.ok) throw new Error("Update quantity failed");

        const cart = await response.json();

        await this.getCart();

        window.dispatchEvent(new CustomEvent(`cart:quantity-updated-${key}`));
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },

    formatMoney(cents) {
      return (cents / 100).toLocaleString("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },

    get cartQuantity() {
      return this.items.reduce((acc, item) => acc + item.quantity, 0);
    },
  });
}
