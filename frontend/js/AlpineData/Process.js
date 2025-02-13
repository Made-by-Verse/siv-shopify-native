export default function Process() {
  Alpine.data("process", () => ({
    totalSteps: 0,
    currentScrollProgress: 0,

    init() {
      this.totalSteps = this.$el.querySelectorAll(".process-text").length;
      this.updateHeight();
      window.addEventListener("resize", () => this.updateHeight());
      window.addEventListener("scroll", () => this.updateScrollProgress());
    },

    updateHeight() {
      if (window.innerWidth < 768) {
        this.$refs.contentContainer.style.height = "auto";
      } else {
        const texts = this.$el.querySelectorAll(".process-text");
        let maxHeight = 0;
        texts.forEach((text) => {
          text.style.position = "static";
          text.style.opacity = "1";
          maxHeight = Math.max(maxHeight, text.offsetHeight);
          text.style.position = "";
          text.style.opacity = "";
        });
        this.$refs.contentContainer.style.height = `${maxHeight}px`;
      }
    },
    updateScrollProgress() {
      const containerTop = this.$el.getBoundingClientRect().top;
      this.currentScrollProgress = 0 - containerTop + window.innerHeight / 2;
    },
    showImage(index) {
      const containerHeight = this.$refs.processWrapper.offsetHeight;
      const stepHeight = containerHeight / this.totalSteps;

      if (index === 0) {
        return this.currentScrollProgress < (index + 1) * stepHeight;
      }

      if (index === this.totalSteps - 1) {
        return this.currentScrollProgress > index * stepHeight;
      }

      return (
        this.currentScrollProgress > index * stepHeight &&
        this.currentScrollProgress < (index + 1) * stepHeight
      );
    },
  }));
}
