export default function CardReveal() {
  Alpine.data("cardReveal", () => ({
    isInView: false,
    from: [
      { x: 0, rotate: "3deg" },
      { x: 0, rotate: "6deg" },
      { x: 0, rotate: "9deg" },
      { x: 0, rotate: "12deg" },
    ],
    to: [
      { x: "-20vw", rotate: "-20deg", y: "5%" },
      { x: "20vw", rotate: "-12deg", y: "15%" },
      { x: "5vw", rotate: "9deg", y: "0%" },
      { x: "-5vw", rotate: "-10deg", y: "10%" },
    ],

    getStyle(index, to = false) {
      const { x, rotate, y = "0%" } = to ? this.to[index] : this.from[index]; // Default y to "0%" if not defined
      return `transform: translateX(${x}) rotate(${rotate}); top: ${y};`;
    },
  }));
}
