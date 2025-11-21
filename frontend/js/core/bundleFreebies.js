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

  // Convert to number for lookup (keys in BUNDLE_DISCOUNT_CODES are numbers)
  const numericVariantId = Number(variantId);
  if (!Number.isFinite(numericVariantId)) return null;

  // Try both numeric and string keys for flexibility
  return (
    BUNDLE_DISCOUNT_CODES?.[numericVariantId] ??
    BUNDLE_DISCOUNT_CODES?.[variantId] ??
    null
  );
}

/**
 * Applies a discount code using multiple methods to ensure it's set.
 * This sets cookies that Shopify will use at checkout.
 *
 * @param {string} discountCode - The discount code to apply
 * @param {boolean} shouldLog - Whether to log debug information
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function applyDiscountCode(discountCode, shouldLog = false) {
  if (!discountCode || typeof discountCode !== "string") {
    if (shouldLog) {
      console.error("[BundleFreebie] Invalid discount code:", discountCode);
    }
    return false;
  }

  try {
    // Method 1: Use Shopify's discount endpoint (sets cookie via redirect)
    try {
      const response = await fetch(
        `/discount/${encodeURIComponent(discountCode)}`,
        {
          method: "GET",
          credentials: "same-origin",
          redirect: "follow",
        }
      );

      if (shouldLog) {
        console.log(
          "[BundleFreebie] Discount endpoint response:",
          response.status,
          response.url
        );
      }

      // Check if the response indicates success (200, 302, 303 are all valid)
      if (response.ok || response.status === 302 || response.status === 303) {
        // Also manually set the cookie as a backup
        setDiscountCookie(discountCode, shouldLog);
        return true;
      }
    } catch (fetchError) {
      if (shouldLog) {
        console.warn(
          "[BundleFreebie] Discount endpoint failed, trying cookie method:",
          fetchError
        );
      }
    }

    // Method 2: Manually set the discount code cookie
    const cookieSet = setDiscountCookie(discountCode, shouldLog);
    return cookieSet;
  } catch (error) {
    console.error("[BundleFreebie] Error applying discount code:", error);
    return false;
  }
}

/**
 * Manually sets the discount code cookie that Shopify uses at checkout.
 * Shopify typically uses 'discount_code' or 'discount' cookie name.
 *
 * @param {string} discountCode - The discount code to set
 * @param {boolean} shouldLog - Whether to log debug information
 * @returns {boolean} - True if cookie was set successfully
 */
function setDiscountCookie(discountCode, shouldLog = false) {
  try {
    // Shopify uses 'discount_code' cookie for discount codes
    // Set cookie with 1 year expiration (or until checkout)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const cookieValue = `${encodeURIComponent(
      discountCode
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    // Try multiple cookie names that Shopify might use
    const cookieNames = ["discount_code", "discount", "shopify_discount"];

    cookieNames.forEach((cookieName) => {
      document.cookie = `${cookieName}=${cookieValue}`;
    });

    if (shouldLog) {
      console.log(
        "[BundleFreebie] Set discount cookies:",
        cookieNames,
        "with value:",
        discountCode
      );
      console.log(
        "[BundleFreebie] Current cookies:",
        document.cookie
          .split(";")
          .filter((c) =>
            cookieNames.some((name) => c.trim().startsWith(name + "="))
          )
      );
    }

    return true;
  } catch (error) {
    if (shouldLog) {
      console.error("[BundleFreebie] Error setting discount cookie:", error);
    }
    return false;
  }
}
