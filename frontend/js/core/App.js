import Alpine from "alpinejs";
import intersect from "@alpinejs/intersect";
import Lenis from "lenis";
import { VideoSection } from "../components/VideoSection";
import { HeaderManager } from "../components/HeaderManager";
import { CarouselManager } from "../components/CarouselManager";
import { RecommendationsManager } from "../components/RecommendationsManager";
import { SCROLL_PREVENT } from "./constants";
import { Cart, Process, MegaMenu, CardReveal } from "../AlpineData";

export default class App {
  constructor() {
    this.initializeAlpine();
    this.lenis = null;
    this.initializeLenis();
    this.components = new Map();
  }

  initializeAlpine() {
    Alpine.plugin(intersect);
    window.Alpine = Alpine;

    Process();
    Cart();
    MegaMenu();
    CardReveal();

    Alpine.start();
  }

  initializeLenis() {
    this.lenis = new Lenis({
      prevent: (node) => SCROLL_PREVENT.includes(node.id),
    });

    function raf(time) {
      this.lenis?.raf(time);
      requestAnimationFrame(raf.bind(this));
    }

    requestAnimationFrame(raf.bind(this));
  }

  async init() {
    // Initialize core components
    this.components.set("header", new HeaderManager());
    this.components.set("video", new VideoSection());
    this.components.set("carousels", new CarouselManager());
    this.components.set("recommendations", new RecommendationsManager());

    // Initialize all components
    for (const component of this.components.values()) {
      await component.init();
    }
  }
}
