import Base from "../core/Base";
import Swiper from "swiper";
import {
  Autoplay,
  Controller,
  EffectFade,
  FreeMode,
  Navigation,
  Thumbs,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import { SWIPER_CONFIG } from "../core/constants";

export class CarouselManager extends Base {
  constructor() {
    super();
    this.swipers = new Map();
    Swiper.use([
      Autoplay,
      EffectFade,
      FreeMode,
      Navigation,
      Controller,
      Thumbs,
    ]);
  }

  init() {
    super.init();
    this.initFeaturedPostsSwiper();
    this.initTextAndImageSwiper();
    this.initProductGallerySwiper();
    
    // Listen for product gallery updates (when variant changes)
    window.addEventListener('product-gallery-updated', () => {
      this.reinitProductGallerySwiper();
    });
  }

  initFeaturedPostsSwiper() {
    const swiper = document.querySelector(".featured-post-swiper");

    if (!swiper) return;

    this.swipers.set(
      "featured-posts-swiper",
      new Swiper(swiper, SWIPER_CONFIG.featuredPosts)
    );
  }

  initTextAndImageSwiper() {
    const swiper = document.querySelector(".text-and-image-swiper");

    if (!swiper) return;

    const swiperButtonPrev = swiper.querySelector(
      ".text-and-image-swiper-button-prev"
    );
    const swiperButtonNext = swiper.querySelector(
      ".text-and-image-swiper-button-next"
    );

    this.swipers.set(
      "text-and-image-swiper",
      new Swiper(swiper, {
        ...SWIPER_CONFIG.textAndImage,
        navigation: {
          prevEl: swiperButtonPrev,
          nextEl: swiperButtonNext,
        },
      })
    );
  }

  initProductGallerySwiper() {
    this.reinitProductGallerySwiper();
  }

  reinitProductGallerySwiper() {
    // Destroy existing swipers if they exist
    if (this.swipers.has("product-gallery")) {
      this.swipers.get("product-gallery").destroy(true, true);
      this.swipers.delete("product-gallery");
    }
    if (this.swipers.has("product-gallery-thumbs")) {
      this.swipers.get("product-gallery-thumbs").destroy(true, true);
      this.swipers.delete("product-gallery-thumbs");
    }

    const swiper = document.querySelector(".product-gallery-swiper");
    const thumbsSwiper = document.querySelector(".product-gallery-thumbs");

    const swiperButtonPrev = document.querySelector(
      ".product-gallery-swiper-button-prev"
    );
    const swiperButtonNext = document.querySelector(
      ".product-gallery-swiper-button-next"
    );

    if (!swiper || !thumbsSwiper) return;

    this.swipers.set(
      "product-gallery",
      new Swiper(swiper, {
        ...SWIPER_CONFIG.productGallery.main,
        thumbs: {
          swiper: thumbsSwiper,
        },
        navigation: {
          prevEl: swiperButtonPrev,
          nextEl: swiperButtonNext,
        },
      })
    );

    this.swipers.set(
      "product-gallery-thumbs",
      new Swiper(thumbsSwiper, {
        ...SWIPER_CONFIG.productGallery.thumbs,
      })
    );
  }

  destroy() {
    this.swipers.forEach((swiper) => swiper.destroy());
    this.swipers.clear();
    super.destroy();
  }
}
