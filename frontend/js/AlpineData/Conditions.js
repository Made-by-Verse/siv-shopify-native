import { transform } from "motion";

export default async function Conditions() {
  Alpine.data("conditions", () => ({
    mouseX: 0,
    mouseY: 0,
    hoveringIndex: null,
    opacity: 0,
    scale: 1,
    imageOpacity: 0,

    init() {
      // Bind the methods to preserve 'this' context
      this.handleMouseMove = this.handleMouseMove.bind(this);

      window.addEventListener("mousemove", this.handleMouseMove);
    },

    handleMouseMove(event) {
      this.mouseX = event.clientX - this.cursorSize / 2;
      this.mouseY = event.clientY - this.cursorSize / 2;
    },

    handleMouseEnter(index) {
      this.hoveringIndex = index;
    },

    handleMouseLeave() {
      this.hoveringIndex = null;
    },

    get cursorSize() {
      return this.hoveringIndex === null ? 0 : 250;
    },

    destroy() {
      window.removeEventListener("mousemove", this.handleMouseMove);
    },
  }));

  Alpine.data("conditionHeading", () => ({
    opacity: 0,
    scale: 1,
    mouseX: 0,
    mouseY: 0,
    imageOpacity: 0,

    init() {
      this.handleScroll = this.handleScroll.bind(this);
      window.addEventListener("scroll", this.handleScroll);
    },

    handleScroll() {
      const rect = this.$el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = windowHeight - this.$el.offsetHeight;

      // Calculate scroll progress (0 to 1)
      const start = windowHeight - rect.bottom;
      const end = -rect.top;
      const progress = Math.max(0, Math.min(1, start / total));

      this.opacity = transform(progress, [0, 0.3, 0.8], [0, 1, 0]);
      this.imageOpacity = transform(progress, [0, 1], [0, 1]);
      this.scale = transform(progress, [0.5, 1], [1, 0]);
    },

    destroy() {
      window.removeEventListener("scroll", this.handleScroll);
    },
  }));
}
