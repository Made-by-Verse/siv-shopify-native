import Base from "../core/Base";
import Swiper from "swiper";

export class RecommendationsManager extends Base {
  constructor() {
    super();
    this.section = document.querySelector(".product-recommendations");
  }

  init() {
    super.init();
    if (!this.section) return;

    this.initializeObserver();
  }

  initializeObserver() {
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(this.section);
  }

  handleIntersection(entries) {
    if (!entries[0].isIntersecting) return;

    const url = this.section.dataset.url;
    this.fetchRecommendations(url);
  }

  async fetchRecommendations(url) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      const html = document.createElement("div");
      html.innerHTML = text;

      const recommendations = html.querySelector(".product-recommendations");

      if (recommendations && recommendations.innerHTML.trim().length) {
        this.section.innerHTML = recommendations.innerHTML;
        this.initializeSwiper();
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }

  initializeSwiper() {
    new Swiper(".product-recommendations .swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
      },
    });
  }
}
