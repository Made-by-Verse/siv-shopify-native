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
      prevent: (node) => SCROLL_PREVENT.includes(node.id),
    });

    function raf(time) {
      this.lenis?.raf(time);
      requestAnimationFrame(raf.bind(this));
    }

    requestAnimationFrame(raf.bind(this));

    // Add event listener for toggling Lenis
    window.addEventListener("toggle-lenis", (event) => {
      if (event.detail.enabled) {
        this.lenis?.start();
      } else {
        this.lenis?.stop();
      }
    });

    // Check if apps section exists on page load and disable Lenis if needed
    this.checkForAppsOnLoad();
  }

  checkForAppsOnLoad() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.evaluateAppsPresence();
      });
    } else {
      this.evaluateAppsPresence();
    }
  }

  evaluateAppsPresence() {
    // Check if there are any app sections on the page
    const appsSections = document.querySelectorAll(
      '[data-section-type="apps"]'
    );
    const hasApps = Array.from(appsSections).some((section) => {
      // Check if the apps section has any content/blocks
      const blocks = section.querySelectorAll("[data-block-type]");
      return blocks.length > 0;
    });

    if (hasApps) {
      // Disable Lenis if apps are present
      this.lenis?.stop();
    } else {
      // Ensure Lenis is enabled if no apps
      this.lenis?.start();
    }
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
