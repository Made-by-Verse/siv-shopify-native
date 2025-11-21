import Base from "../core/Base";

export class ConditionsSection extends Base {
  constructor() {
    super();

    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.speed = 0.5;

    this.cursor = document.getElementById("cursor");

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    super.init();
    if (!this.cursor) return;

    window.addEventListener("mousemove", this.handleMouseMove);
    this.animate();
  }

  animate() {
    const distX = this.mouseX - this.cursorX;
    const distY = this.mouseY - this.cursorY;

    this.cursorX = this.cursorX + distX * this.speed;
    this.cursorY = this.cursorY + distY * this.speed;

    this.cursor.style.left = this.cursorX + "px";
    this.cursor.style.top = this.cursorY + "px";

    requestAnimationFrame(this.animate);
  }

  handleMouseMove(event) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
  }

  destroy() {
    super.destroy();
    if (this.cursor) {
      window.removeEventListener("mousemove", this.handleMouseMove);
    }
  }
}
