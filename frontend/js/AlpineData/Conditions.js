import { transform, cubicBezier } from "motion";

export default function Conditions() {
  Alpine.data("conditions", () => ({
    mouseX: 0,
    mouseY: 0,
    hoveringIndex: null,
    opacity: 0,
    scale: 1,
    imageOpacity: 0,

    init() {
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);

      window.addEventListener("mousemove", this.handleMouseMove);
    },

    handleMouseMove(event) {
      const { clientX, clientY } = event;
      const mouseX = clientX - this.cursorSize / 2;
      const mouseY = clientY - this.cursorSize / 2;

      this.mouseX = mouseX;
      this.mouseY = mouseY;
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
    hoveringIndex: null,
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

      this.opacity = transform(progress, [0, 0.3, 0.8], [0, 1, 0], {
        ease: cubicBezier(0.4, 0, 0.2, 1),
      });
      this.imageOpacity = transform(progress, [0, 1], [0, 1], {
        ease: cubicBezier(0.4, 0, 0.2, 1),
      });
      this.scale = transform(progress, [0.5, 1], [1, 0], {
        ease: cubicBezier(0.4, 0, 0.2, 1),
      });
    },

    destroy() {
      window.removeEventListener("scroll", this.handleScroll);
    },
  }));
}
