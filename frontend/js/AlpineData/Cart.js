export default function Cart() {
  Alpine.store("cart", {
    items: [],
    sub_total: 0,

    init() {
      this.getCart();
    },

    async getCart(openCart = false) {
      try {
        const response = await fetch(`${window.routes.cart_url}.js`);
        const cart = await response.json();

        // Update store
        this.items = cart.items;
        console.log(cart.items);

        this.sub_total = this.formatMoney(cart.total_price);

        // Update local state
        this.items = cart.items;
        this.sub_total = this.formatMoney(cart.total_price);

        if (openCart) {
          window.dispatchEvent(new Event("open-cart-drawer"));
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    },

    async addToCart(variantId, sellingPlanId = null, quantity = 1) {
      try {
        // Dispatch event to show loading state
        window.dispatchEvent(new CustomEvent("cart:adding"));

        console.log(variantId, quantity, sellingPlanId);

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

        console.log(responseBody);

        if (!response.ok) throw new Error(responseBody.message);

        // Immediately update the cart after successful add
        await this.getCart(true);

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

    async removeFromCart(variantId) {
      try {
        const response = await fetch(`${window.routes.cart_change_url}.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: variantId.toString(),
            quantity: 0,
          }),
        });

        if (!response.ok) throw new Error("Remove from cart failed");

        const cart = await response.json();

        // Update store
        this.items = cart.items;
        this.sub_total = this.formatMoney(cart.total_price);

        // Update local state
        this.items = cart.items;
        this.sub_total = this.formatMoney(cart.total_price);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    },

    async updateQuantity(variantId, quantity) {
      try {
        const response = await fetch(`${window.routes.cart_change_url}.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: variantId.toString(),
            quantity: quantity,
          }),
        });

        if (!response.ok) throw new Error("Update quantity failed");

        const cart = await response.json();

        // Update store
        this.items = cart.items;
        this.sub_total = this.formatMoney(cart.total_price);

        // Update local state
        this.items = cart.items;
        this.sub_total = this.formatMoney(cart.total_price);
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

    openCartDrawer() {
      console.log("Opening Cart");

      window.dispatchEvent(new CustomEvent("open-cart-drawer"));
    },

    get cartQuantity() {
      return this.items.reduce((acc, item) => acc + item.quantity, 0);
    },
  });
}
