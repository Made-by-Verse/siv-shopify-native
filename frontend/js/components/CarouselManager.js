import Base from "../core/Base";
import Swiper from "swiper";
import {
  Autoplay,
  Controller,
  EffectFade,
  FreeMode,
  Navigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { SWIPER_CONFIG } from "../core/constants";

export class CarouselManager extends Base {
  constructor() {
    super();
    this.swipers = new Map();
    Swiper.use([Autoplay, EffectFade, FreeMode, Navigation, Controller]);
  }

  init() {
    super.init();
    this.initTestimoniesSwiper();
  }

  initFeaturedPostsSwiper() {
    const swiper = document.querySelector(".featured-post-swiper");

    if (!swiper) return;

    this.swipers.set(
      "featured-posts-swiper",
      new Swiper(swiper, SWIPER_CONFIG.featuredPosts)
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

    this.swipers.set(
      "testimonies-text",
      new Swiper(".testimonies-swiper-text", {
        ...SWIPER_CONFIG.testimonies.text,
        navigation: {
          prevEl: testimoniesButtonPrev,
          nextEl: testimoniesButtonNext,
        },
      })
    );

    this.swipers.set(
      "testimonies-image-after",
      new Swiper(".testimonies-swiper-image-after", {
        ...SWIPER_CONFIG.testimonies.image,
        navigation: {
          prevEl: testimoniesButtonPrev,
          nextEl: testimoniesButtonNext,
        },
      })
    );

    this.swipers.set(
      "testimonies-image-before",
      new Swiper(".testimonies-swiper-image-before", {
        ...SWIPER_CONFIG.testimonies.image,
        navigation: {
          prevEl: testimoniesButtonPrev,
          nextEl: testimoniesButtonNext,
        },
      })
    );
  }

  destroy() {
    this.swipers.forEach((swiper) => swiper.destroy());
    this.swipers.clear();
    super.destroy();
  }
}
