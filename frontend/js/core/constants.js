export const SWIPER_CONFIG = {
  testimonies: {
    text: {
      loop: true,
      effect: "fade",
      allowTouchMove: false,
      slidesPerView: 1,
      speed: 500,
      allowTouchMove: false,
      speed: 1000,
    },
    image: {
      speed: 1000,
      loop: true,
      allowTouchMove: false,
    },
    after: {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
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
  textAndImage: {
    effect: "fade",
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    speed: 500,
  },
  productGallery: {
    main: {
      effect: "fade",
      speed: 500,
      loop: true,
    },
    thumbs: {
      watchSlidesProgress: true,
      freeMode: true,
      spaceBetween: 10,
      slidesPerView: "auto",
      direction: "horizontal",
      breakpoints: {
        1024: {
          direction: "vertical",
        },
      },
    },
  },
};

export const SCROLL_PREVENT = [
  "cart-items",
  "FacetFiltersForm",
  "drawer-content",
];
