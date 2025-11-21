import {
  getBundleFreebies,
  getBundleDiscountCode,
  applyDiscountCode,
} from "../core/bundleFreebies";

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

    async addToCart(event) {
      const formData = new FormData(event.target);
      const formDataObject = {};

      // Convert FormData to object
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

      const bundleVariantId = Number(formDataObject.id);
      const bundleQuantityRaw = Number(formDataObject.quantity ?? 1);
      const bundleQuantity = Number.isFinite(bundleQuantityRaw) && bundleQuantityRaw > 0 ? bundleQuantityRaw : 1;

      if (Number.isFinite(bundleVariantId)) {
        formDataObject.id = bundleVariantId;
      }

      formDataObject.quantity = bundleQuantity;

      const shouldLog =
        typeof window !== "undefined" &&
        Boolean(window?.SIV_BUNDLE_FREEBIE_DEBUG ?? true);

      const payloadItems = [formDataObject];
      const freebies = getBundleFreebies(bundleVariantId);

      if (Array.isArray(freebies) && freebies.length) {
        if (shouldLog) {
          console.group(
            "[BundleFreebie] Preparing freebies for bundle variant",
            bundleVariantId
          );
          console.table(
            freebies.map((freebieDefinition) => ({
              configuredVariantId: freebieDefinition?.variantId,
              baseQuantity: freebieDefinition?.quantity ?? 1,
              matchBundleQuantity:
                freebieDefinition?.matchBundleQuantity !== false,
            }))
          );
        }

        freebies.forEach((freebieDefinition) => {
          const freeVariantId = Number(freebieDefinition?.variantId);

          if (!Number.isFinite(freeVariantId)) return;

          const baseQuantity = Number(freebieDefinition?.quantity ?? 1);
          const freebieQuantitySource =
            freebieDefinition?.matchBundleQuantity === false
              ? baseQuantity
              : baseQuantity * bundleQuantity;
          const freebieQuantity =
            Number.isFinite(freebieQuantitySource) && freebieQuantitySource > 0
              ? Math.floor(freebieQuantitySource)
              : 0;

          if (freebieQuantity < 1) return;

          if (shouldLog) {
            console.log(
              "[BundleFreebie] Adding free item",
              freeVariantId,
              "quantity:",
              freebieQuantity
            );
          }

          payloadItems.push({
            id: freeVariantId,
            quantity: freebieQuantity,
            properties: {
              _bundle_freebie_for: bundleVariantId.toString(),
              ...(freebieDefinition?.properties ?? {}),
            },
          });
        });

        if (shouldLog) {
          console.groupEnd();
        }
      } else if (shouldLog) {
        console.log(
          "[BundleFreebie] No freebies configured for bundle variant",
          bundleVariantId
        );
      }

      try {
        // Dispatch event to show loading state
        window.dispatchEvent(new CustomEvent("cart:adding"));

        const response = await fetch(`${window.routes.cart_add_url}.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: payloadItems,
          }),
        });

        const responseBody = await response.json();

        if (!response.ok) throw new Error(responseBody.message);

        if (shouldLog) {
          console.group("[BundleFreebie] Cart add response");
          console.log("Payload items:", payloadItems);
          console.log("Shopify response:", responseBody);
          console.groupEnd();
        }

        // Apply discount code if configured for this bundle
        // (applies regardless of whether there are freebies)
        const discountCode = getBundleDiscountCode(bundleVariantId);
        if (discountCode) {
          if (shouldLog) {
            console.log(
              "[BundleFreebie] Applying discount code:",
              discountCode
            );
          }
          const discountApplied = await applyDiscountCode(
            discountCode,
            shouldLog
          );
          if (shouldLog) {
            console.log(
              "[BundleFreebie] Discount code application:",
              discountApplied ? "success" : "failed"
            );
          }
        } else if (shouldLog && Number.isFinite(bundleVariantId)) {
          console.log(
            "[BundleFreebie] No discount code configured for bundle variant",
            bundleVariantId
          );
        }

        // Immediately update the cart after successful add
        await this.getCart();

        window.dispatchEvent(new Event("open-cart-drawer"));

        // Dispatch success event
        window.dispatchEvent(new CustomEvent("cart:added"));
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (shouldLog) {
          console.error("[BundleFreebie] Add to cart failed", {
            payloadItems,
            bundleVariantId,
            error,
          });
        }
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
