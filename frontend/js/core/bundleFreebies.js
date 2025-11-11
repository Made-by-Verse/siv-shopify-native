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
      properties: {
        _bundle_freebie: "Serum Sample",
      },
    },
  ],
  50704901407035: [
    {
      variantId: 50674962399547,
      quantity: 1,
      matchBundleQuantity: true,
      properties: {
        _bundle_freebie: "Serum Sample",
      },
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
 * Returns an array of configured freebie definitions for a bundle variant.
 */
export function getBundleFreebies(variantId) {
  if (!variantId) return [];

  return BUNDLE_FREEBIES?.[variantId] ?? [];
}
