/**
 * Map bundle variant IDs to one or more free items that should be
 * automatically added to the cart alongside the bundle.
 *
 * Configuration example:
 *
 * export const BUNDLE_FREEBIES = {
 *   1234567890: [
 *     {
 *       variantId: 9876543210,
 *       quantity: 1,
 *       matchBundleQuantity: true,
 *       properties: {
 *         _bundle_freebie: "Serum Sample",
 *       },
 *     },
 *   ],
 * };
 *
 * Keys should be Shopify variant IDs (numbers) for the bundle product.
 * The free `variantId` should belong to a product that is available
 * for sale (ideally hidden) and priced appropriately (e.g. $0.00).
 *
 * - `quantity` defaults to 1.
 * - When `matchBundleQuantity` is true (default), the free item quantity
 *   is multiplied by the quantity of the bundle added to cart.
 * - `properties` are optional line-item properties applied to the free item.
 */
export const BUNDLE_FREEBIES = {
  50704901374267: [
    {
      variantId: 50674962366779,
      quantity: 1,
      matchBundleQuantity: true,
    },
  ],
  50704901407035: [
    {
      variantId: 50674962399547,
      quantity: 1,
      matchBundleQuantity: true,
    },
  ],
  //     variantId: 9876543210,
  //     quantity: 1,
  //     matchBundleQuantity: true,
  //     properties: {
  //       _bundle_freebie: "Serum Sample",
  //     },
  //   },
  // ],
};

/**
 * Map bundle variant IDs to discount codes that should be automatically
 * applied when the bundle is added to cart.
 *
 * Configuration example:
 *
 * export const BUNDLE_DISCOUNT_CODES = {
 *   1234567890: "BLACKFRIDAYFREESHIPPING",
 *   9876543210: "SUMMER2024",
 * };
 */
export const BUNDLE_DISCOUNT_CODES = {
  50704901374267: "BLACKFRIDAYFREESHIPPING",
  50704901407035: "BLACKFRIDAYFREESHIPPING",
};

/**
 * Returns an array of configured freebie definitions for a bundle variant.
 */
export function getBundleFreebies(variantId) {
  if (!variantId) return [];

  return BUNDLE_FREEBIES?.[variantId] ?? [];
}

/**
 * Returns the discount code configured for a bundle variant, if any.
 */
export function getBundleDiscountCode(variantId) {
  if (!variantId) return null;

  return BUNDLE_DISCOUNT_CODES?.[variantId] ?? null;
}

/**
 * Applies a discount code by calling Shopify's discount endpoint.
 * This sets a cookie that Shopify will use at checkout.
 *
 * @param {string} discountCode - The discount code to apply
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function applyDiscountCode(discountCode) {
  if (!discountCode || typeof discountCode !== "string") {
    return false;
  }

  try {
    // Shopify's discount endpoint sets a cookie that will be used at checkout
    const response = await fetch(
      `/discount/${encodeURIComponent(discountCode)}`,
      {
        method: "GET",
        credentials: "same-origin",
      }
    );

    // The endpoint returns a redirect or HTML, so we just check if it succeeded
    // (status 200 or redirect status codes are both fine)
    return response.ok || response.status === 302 || response.status === 303;
  } catch (error) {
    console.error("[BundleFreebie] Error applying discount code:", error);
    return false;
  }
}
