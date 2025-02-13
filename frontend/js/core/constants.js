export const SWIPER_CONFIG = {
  testimonies: {
    text: {
      loop: true,
      effect: "fade",
      allowTouchMove: false,
      slidesPerView: 1,
      speed: 500,
      allowTouchMove: false,
    },
    image: {
      speed: 500,
      loop: true,
      allowTouchMove: false,
    },
  },
  featuredPosts: {
    slidesPerView: 1.25,
    spaceBetween: 16,
    breakpoints: {
      768: {
        slidesPerView: 2.5,
        spaceBetween: 32,
      },
      1023: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  },
};

export const SCROLL_PREVENT = [
  "cart-items",
  "FacetFiltersForm",
  "drawer-content",
];
