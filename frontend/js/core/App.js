import Alpine from "alpinejs";
import intersect from "@alpinejs/intersect";
import Lenis from "lenis";
import { VideoSection } from "../components/VideoSection";
import { HeaderManager } from "../components/HeaderManager";
import { CarouselManager } from "../components/CarouselManager";
import { RecommendationsManager } from "../components/RecommendationsManager";
import { SCROLL_PREVENT } from "./constants";
import AlpineData from "../AlpineData";

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

    AlpineData();

    Alpine.start();
  }

  initializeLenis() {
    this.lenis = new Lenis({
      prevent: (node) => {
        // Check for elements with data-lenis-prevent attribute
        if (node.hasAttribute && node.hasAttribute("data-lenis-prevent")) {
          return true;
        }
        // Check for elements inside data-lenis-prevent containers
        if (node.closest && node.closest("[data-lenis-prevent]")) {
          return true;
        }
        // Check original SCROLL_PREVENT list
        return SCROLL_PREVENT.includes(node.id);
      },
    });

    function raf(time) {
      this.lenis?.raf(time);
      requestAnimationFrame(raf.bind(this));
    }

    requestAnimationFrame(raf.bind(this));

    // Add event listener for toggling Lenis (keep for existing functionality)
    window.addEventListener("toggle-lenis", (event) => {
      if (event.detail.enabled) {
        // Re-initialize Lenis if it was destroyed
        if (!this.lenis) {
          this.initializeLenis();
        }
      } else {
        // Destroy Lenis instance to fully disable
        this.lenis?.destroy();
        this.lenis = null;
      }
    });
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
