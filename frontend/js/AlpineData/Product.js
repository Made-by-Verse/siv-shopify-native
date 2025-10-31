export default async function Product() {
  if (typeof Alpine === "undefined") {
    console.error("Alpine is not defined");
    return;
  }

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
      const priceContainer = doc.querySelector(".js-price-container");

      if (priceContainer) {
        document
          .querySelector(".js-price-container")
          .replaceWith(priceContainer);
      }
    },
  }));

  // Store the variantPicker component function for use by the helper
  let variantPickerComponentFn = null;

  // Define the component function
  variantPickerComponentFn = (initialData) => {
    // Ensure initialData exists and has required properties
    if (!initialData) {
      console.error("variantPicker: initialData is required");
      return {
        variants: [],
        selectedOptions: {},
        selectedVariantId: null,
        isSelected: () => false,
        isAvailable: () => false,
        selectOption: () => {},
        findVariant: () => null,
        updatePrice: () => {},
      };
    }

    const getInitialOptions = (data) => {
      const options = {};
      if (data && data.selectedVariant) {
        const variant = data.selectedVariant;
        if (variant.option1) {
          options["1"] = variant.option1;
        }
        if (variant.option2) {
          options["2"] = variant.option2;
        }
        if (variant.option3) {
          options["3"] = variant.option3;
        }
      }
      return options;
    };

    return {
      variants: initialData.variants || [],
      selectedOptions: getInitialOptions(initialData),
      selectedVariantId: initialData.selectedVariant?.id || null,

      init() {
        // Update the form's hidden input with the initial variant ID
        const form = this.$el.closest("form");
        if (form && this.selectedVariantId) {
          const formInput = form.querySelector(
            'input[name="id"][data-variant-id]'
          );
          if (formInput) {
            formInput.value = this.selectedVariantId;
          }
        }

        // Listen for variant changes from parent product component
        this.$watch("selectedVariantId", (variantId) => {
          if (variantId) {
            this.updatePrice(variantId);

            // Update the form's hidden input
            const form = this.$el.closest("form");
            if (form) {
              const formInput = form.querySelector(
                'input[name="id"][data-variant-id]'
              );
              if (formInput) {
                formInput.value = variantId;
              }
            }
          }
        });
      },

      isSelected(optionPosition, value) {
        // Convert to string for consistent key lookup
        const position = String(optionPosition);
        return this.selectedOptions[position] === value;
      },

      isAvailable(optionPosition, value) {
        // Convert to string for consistent key lookup
        const position = String(optionPosition);

        // Check if this option value appears in any available variant
        // Try to find a variant with this option value that's available
        // by testing with current selections for other options
        const testOptions = { ...this.selectedOptions };
        testOptions[position] = value;

        // First, try to find a variant with exact match
        let matchingVariant = this.findVariant(testOptions);
        if (matchingVariant && matchingVariant.available) {
          return true;
        }

        // If no exact match, check if this option value exists in any available variant
        // This handles cases where selecting this option might not work with current
        // selections, but the option itself exists in available variants
        return this.variants.some((variant) => {
          if (!variant.available) return false;

          const matchesOption =
            (position === "1" && variant.option1 === value) ||
            (position === "2" && variant.option2 === value) ||
            (position === "3" && variant.option3 === value);

          return matchesOption;
        });
      },

      selectOption(optionPosition, value) {
        // Convert to string for consistent key lookup
        const position = String(optionPosition);
        if (!this.isAvailable(position, value)) {
          console.log("Option not available:", position, value);
          return;
        }

        // Update selected options - create new object to ensure reactivity
        this.selectedOptions = {
          ...this.selectedOptions,
          [position]: value,
        };

        // Try to find matching variant with current selections
        let variant = this.findVariant(this.selectedOptions);

        // If no exact match or variant not available, find best matching variant
        // Prioritize keeping earlier option selections
        if (!variant || !variant.available) {
          // Sort variants to prioritize those that match more current selections
          const candidateVariants = this.variants
            .filter((v) => {
              if (!v.available) return false;
              // Must match the newly selected option
              return (
                (position === "1" && v.option1 === value) ||
                (position === "2" && v.option2 === value) ||
                (position === "3" && v.option3 === value)
              );
            })
            .sort((a, b) => {
              // Count how many options match current selections (excluding the one we just changed)
              const countMatches = (v) => {
                let count = 0;
                if (
                  position !== "1" &&
                  this.selectedOptions["1"] &&
                  v.option1 === this.selectedOptions["1"]
                )
                  count++;
                if (
                  position !== "2" &&
                  this.selectedOptions["2"] &&
                  v.option2 === this.selectedOptions["2"]
                )
                  count++;
                if (
                  position !== "3" &&
                  this.selectedOptions["3"] &&
                  v.option3 === this.selectedOptions["3"]
                )
                  count++;
                return count;
              };
              return countMatches(b) - countMatches(a);
            });

          variant = candidateVariants[0];

          // Update selected options to match the found variant
          if (variant) {
            this.selectedOptions = {
              ...this.selectedOptions,
              ...(variant.option1 && { 1: variant.option1 }),
              ...(variant.option2 && { 2: variant.option2 }),
              ...(variant.option3 && { 3: variant.option3 }),
            };
          }
        }

        if (variant && variant.available) {
          // Update the URL with the new variant FIRST, before triggering the watcher
          const url = new URL(window.location.href);
          url.searchParams.set("variant", variant.id);
          window.history.pushState({}, "", url);

          // Update the form's hidden input for variant ID
          const form = this.$el.closest("form");
          if (form) {
            const formInput = form.querySelector(
              'input[name="id"][data-variant-id]'
            );
            if (formInput) {
              formInput.value = variant.id;
            } else {
              console.log("Form input not found");
            }
          } else {
            console.log("Form not found");
          }

          // Update the selected variant ID - this will trigger the watcher
          // This must happen AFTER URL is updated so updatePrice can use the correct URL
          this.selectedVariantId = variant.id;

          // Dispatch event for other components
          this.$dispatch("variant-change", {
            variant: variant,
            variantId: variant.id,
          });
        } else {
          console.log("Variant not found or not available:", variant);
        }
      },

      findVariant(selectedOptions) {
        return this.variants.find((variant) => {
          const option1Match =
            !selectedOptions["1"] || variant.option1 === selectedOptions["1"];
          const option2Match =
            !selectedOptions["2"] || variant.option2 === selectedOptions["2"];
          const option3Match =
            !selectedOptions["3"] || variant.option3 === selectedOptions["3"];

          return option1Match && option2Match && option3Match;
        });
      },

      async updatePrice(variantId) {
        if (!variantId) return;

        // Build URL with variant parameter
        const url = new URL(window.location.href);
        url.searchParams.set("variant", variantId);

        try {
          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Helper function to find and replace an element
          const findAndReplace = (selector, dataAttribute) => {
            // Find in fetched HTML
            let newElement = null;
            if (dataAttribute) {
              newElement = doc.querySelector(`[${dataAttribute}]`);
            } else if (selector.startsWith(".")) {
              newElement = doc.querySelector(selector);
              // Fallback: search by className includes
              if (!newElement) {
                const className = selector.slice(1);
                const allElements = doc.querySelectorAll("*");
                for (let el of allElements) {
                  if (
                    el.className &&
                    typeof el.className === "string" &&
                    el.className.includes(className)
                  ) {
                    newElement = el;
                    break;
                  }
                }
              }
            } else {
              newElement = doc.querySelector(selector);
            }

            if (!newElement) return false;

            // Find existing element in current DOM
            let existingElement = null;
            if (dataAttribute) {
              existingElement = document.querySelector(`[${dataAttribute}]`);
            } else if (selector.startsWith(".")) {
              existingElement = document.querySelector(selector);
              // Fallback: search by className includes
              if (!existingElement) {
                const className = selector.slice(1);
                const allElements = document.querySelectorAll("*");
                for (let el of allElements) {
                  if (
                    el.className &&
                    typeof el.className === "string" &&
                    el.className.includes(className)
                  ) {
                    existingElement = el;
                    break;
                  } else if (el.classList && el.classList.contains(className)) {
                    existingElement = el;
                    break;
                  }
                }
              }
            } else {
              existingElement = document.querySelector(selector);
            }

            if (existingElement && newElement) {
              const cloned = newElement.cloneNode(true);
              existingElement.replaceWith(cloned);
              return true;
            }
            return false;
          };

          // Update price container
          findAndReplace(".js-price-container");

          // Update gallery container (images)
          const galleryReplaced = findAndReplace(
            null,
            "data-product-gallery-container"
          );

          // Update tag container
          findAndReplace(null, "data-product-tag-container");

          // If gallery was replaced, dispatch event to reinitialize swiper
          if (galleryReplaced) {
            // Use setTimeout to ensure DOM is fully updated before reinitializing
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("product-gallery-updated"));
            }, 100);
          }
        } catch (error) {
          console.error("Error updating variant content:", error);
        }
      },
    };
  };

  // Register the component with Alpine
  Alpine.data("variantPicker", variantPickerComponentFn);

  // Helper function to initialize variant picker from script tag
  // This function is attached to window to be accessible from templates
  window.variantPickerInit = (scriptId) => {
    const scriptElement = document.getElementById(scriptId);
    if (!scriptElement) {
      console.error(
        `variantPickerInit: Script element with id ${scriptId} not found`
      );
      return {
        variants: [],
        selectedOptions: {},
        selectedVariantId: null,
        isSelected: () => false,
        isAvailable: () => false,
        selectOption: () => {},
        findVariant: () => null,
        updatePrice: () => {},
      };
    }
    try {
      const data = JSON.parse(scriptElement.textContent);
      // Try to get the component function - check both the stored variable and Alpine
      let componentFn = variantPickerComponentFn;
      if (!componentFn && typeof window.Alpine !== "undefined") {
        // If stored function not available, try to get it from Alpine
        const alpineComponent = window.Alpine.data("variantPicker");
        if (typeof alpineComponent === "function") {
          componentFn = alpineComponent;
        }
      }

      if (componentFn && typeof componentFn === "function") {
        return componentFn(data);
      } else {
        throw new Error("variantPicker component not registered");
      }
    } catch (error) {
      console.error("variantPickerInit: Error initializing component", error);
      return {
        variants: [],
        selectedOptions: {},
        selectedVariantId: null,
        isSelected: () => false,
        isAvailable: () => false,
        selectOption: () => {},
        findVariant: () => null,
        updatePrice: () => {},
      };
    }
  };
}
