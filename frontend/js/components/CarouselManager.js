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
    this.initTestimoniesSwiper();
    this.initFeaturedPostsSwiper();
    this.initTextAndImageSwiper();
    this.initProductGallerySwiper();
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

    const swiperButtonPrev = swiper.querySelector(
      ".text-and-image-swiper-button-prev"
    );
    const swiperButtonNext = swiper.querySelector(
      ".text-and-image-swiper-button-next"
    );

    if (!swiper) return;

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

  initTestimoniesSwiper() {
    const testimoniesSwiper = document.querySelector(
      ".testimonies-swiper-text"
    );
    const testimoniesImageAfter = document.querySelector(
      ".testimonies-swiper-image-after"
    );
    const testimoniesImageBefore = document.querySelector(
      ".testimonies-swiper-image-before"
    );
    const testimoniesButtonPrev = document.querySelector(
      ".testimonies-swiper-button-prev"
    );
    const testimoniesButtonNext = document.querySelector(
      ".testimonies-swiper-button-next"
    );
    if (!testimoniesSwiper || !testimoniesImageAfter || !testimoniesImageBefore)
      return;

    // Create text swiper first
    const textSwiper = new Swiper(".testimonies-swiper-text", {
      ...SWIPER_CONFIG.testimonies.text,
      navigation: {
        prevEl: testimoniesButtonPrev,
        nextEl: testimoniesButtonNext,
      },
    });

    // Create before swiper
    const beforeSwiper = new Swiper(".testimonies-swiper-image-before", {
      ...SWIPER_CONFIG.testimonies.image,
      watchSlidesProgress: true,
      navigation: {
        prevEl: testimoniesButtonPrev,
        nextEl: testimoniesButtonNext,
      },
    });

    // Create after swiper with controller
    const afterSwiper = new Swiper(".testimonies-swiper-image-after", {
      ...SWIPER_CONFIG.testimonies.image,
      ...SWIPER_CONFIG.testimonies.after,
      navigation: {
        prevEl: testimoniesButtonPrev,
        nextEl: testimoniesButtonNext,
      },
      controller: {
        control: [beforeSwiper, textSwiper],
      },
    });

    // Store the swipers
    this.swipers.set("testimonies-text", textSwiper);
    this.swipers.set("testimonies-image-before", beforeSwiper);
    this.swipers.set("testimonies-image-after", afterSwiper);
  }

  initProductGallerySwiper() {
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
